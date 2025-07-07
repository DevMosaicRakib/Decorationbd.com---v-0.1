import requests
from django.conf import settings
from django.http import HttpResponseRedirect
from Users.models import User
from urllib.parse import urlencode
from django.shortcuts import get_object_or_404
from Products.models import Product
from .models import Order,OrderItem
from EmailTemplate.SendEmailAllTypesFuction import payment_success_and_order_confirm_email,payment_failure_and_order_saved_email,send_set_password_link_email
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


class BkashPaymentService:
    def __init__(self):
        self.username = settings.BKASH_USERNAME
        self.password = settings.BKASH_PASSWORD
        self.app_key = settings.BKASH_APP_KEY
        self.app_secret = settings.BKASH_APP_SECRET
        self.base_url = settings.BKASH_BASE_URL
        self.token = None

    def get_token(self):
        url = f"{self.base_url}/tokenized/checkout/token/grant"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "username": self.username,
            "password": self.password,
        }
        data = {
            "app_key": self.app_key,
            "app_secret": self.app_secret,
        }
        response = requests.post(url, json=data, headers=headers)
        response_data = response.json()
        self.token = response_data.get('id_token')
        return self.token

    def create_payment(self, amount):
        if not self.token:
            self.get_token()
        amount_str = f"{float(amount):.2f}"
        url = f"{self.base_url}/tokenized/checkout/create"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": self.token,
            "X-APP-Key": self.app_key,
        }
        data = {
            "mode": "0011",
            "payerReference": " ",
            # "callbackURL": env('callbackURL'),
            "callbackURL": f"{settings.BKASH_PAYMENT_CALLBACK_URL}/api/bkash/payment/callback/",
            "amount": amount_str,
            "currency": "BDT",
            "intent": "sale",
            "merchantInvoiceNumber": 'Inv-1234'
        }

        response = requests.post(url, json=data, headers=headers)

        if response.status_code != 200:
            return {"paymentID": None, "bkashURL": None}

        response_data = response.json()
        return {
            "paymentID": response_data.get("paymentID"),
            "bkashURL": response_data.get("bkashURL"),
        }

    def execute_payment(self, payment_id):
        if not self.token:
            self.get_token()
        url = f"{self.base_url}/tokenized/checkout/execute"
        headers = {
            "Accept": "application/json",
            "Authorization": self.token,
            "X-APP-Key": self.app_key,
        }
        data = {
            "paymentID": payment_id
        }
        response = requests.post(url, json=data, headers=headers)
        return response.json()
    
    def generate_username_password_link(self, user):
        """Generate a link for the user to set their username and password"""
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Create the URL for the frontend where the user can set their username and password
        set_credentials_url = f"{settings.PAYMENT_SUCCESS_OR_FAILURE_BASE_URL}/set-password/{uid}/{token}/"
        
        return set_credentials_url
        
    def call_back(self, status, payment_id):
        try:
            # Fetch the order associated with the payment_id
            order = Order.objects.get(payment_id=payment_id)
        except Order.DoesNotExist:
            # If the order doesn't exist, redirect to failure page
            failure_url = f"{settings.PAYMENT_SUCCESS_OR_FAILURE_BASE_URL}/failure"
            return HttpResponseRedirect(failure_url)
    
        user = order.user
        set_credentials_link = self.generate_username_password_link(user)
        set_credentials_link_with_email = f"{set_credentials_link}?email={user.email}"
    
        if status in ['cancel', 'failure', 'insufficient_balance', 'phone_off']:
            # Update the order status to 'Unpaid' if payment failed or was canceled for any reason
            order.payment_status = 'Unpaid'
            order.status = 'Failed'
            order.save()
    
            # Prepare data for redirection or other purposes
            data = {
                'paymentID': payment_id,
                'status': status,
            }
            order_items = OrderItem.objects.filter(order=order)

            order_item_names = ', '.join([item.product.name for item in order_items])
           
            
    
            total_order_amount = order.total_price
            payment_status = status
            order_status = order.payment_status
            user_email = user.email
            username = user.username
            user_data = {
                'user_name': username,
                'order_items': order_item_names,
                'order_total': total_order_amount,
                'payment_status': payment_status,
                'order_status': order_status
            }
            user_data_and_link = {
                'user_name': username,
                'set_pass_link': set_credentials_link_with_email
            }
            payment_failure_and_order_saved_email(user_email, user_data)
            send_set_password_link_email(user_email, user_data_and_link)
    
            # Redirect to the failure page with the data as query parameters
            query_params = urlencode({'paymentID': payment_id, 'status': status, 'set_credentials_link': set_credentials_link, 'email': user_email})
            failure_url = f"{settings.PAYMENT_SUCCESS_OR_FAILURE_BASE_URL}/failure?{query_params}"
            return HttpResponseRedirect(failure_url)
    
        elif status == 'success':
            # Execute payment and get payment details
            data = self.execute_payment(payment_id)
            print('Success data:', data)
    
            if data.get('statusCode') == '0000':
                # Update order payment status to 'Paid' if successful
                order.payment_status = 'Paid'
                order.paid_amount = data.get('amount')
                order.save()
    
                # Fetch related order items
                order_items = OrderItem.objects.filter(order=order)
                # Update stock levels for each product in the order
                for item in order_items:
                    product = get_object_or_404(Product, name=item.product.name)

                    # Convert total_stock to integer before subtraction
                    product.total_stock = int(product.total_stock or 0) - item.quantity

                    if product.total_stock <= 0:
                        product.total_stock = 0  # Ensure stock doesn't go negative
                        product.stock = "Out Of Stock"  # Mark product as out of stock
                    
                    product.save()  # Save updated product stock
                order_item_names = ', '.join([item.product.name for item in order_items])
    
                # Owner data
                owner = User.objects.filter(is_admin=True).first()  # Returns the first matching user or None
                if owner:
                    ownername = owner.username
                else:
                    raise ValueError("No admin user found.")
    
                # Prepare user data for the email
                total_order_amount = order.total_price
                paid_amount = order.paid_amount
                remain_amount = order.after_partial_cod_remain_total_price
                print(remain_amount)
                payment_method = order.payment_method
                delivery_date = order.delivery_date
                print(delivery_date)
                user = order.user
                user_email = user.email
                username = user.username
                shipping_address = order.shipping_address
                print(shipping_address)
                payment_type = "Partial" if order.payment_method == "Cash on Delivery" else "Full"
                print(payment_type)
    
                # Create a dictionary to pass user and order data to the email function
                user_and_owner_data = {
                    'owner_name': ownername,
                    'user_name': username,
                    'order_items': order_item_names,
                    'order_total': total_order_amount,
                    'payment_method': payment_method,
                    'paid_amount': paid_amount,
                    'remain_amount': remain_amount or 'N/A',
                    'shipping_address': shipping_address or 'N/A'
                }
    
                user_data = {
                    'user_name': username,
                    'order_items': order_item_names,
                    'order_total': total_order_amount,
                    'paid_amount': paid_amount,
                    'payment_method': payment_method,
                    'delivery_date': delivery_date or 'N/A'
                }
    
                user_data_and_link = {
                    'user_name': username,
                    'set_pass_link': set_credentials_link_with_email
                }
                # Send payment success and order confirmation email
                payment_success_and_order_confirm_email(user_email, user_data, user_and_owner_data)
                send_set_password_link_email(user_email, user_data_and_link)
    
                # Redirect to the success page with payment details as query parameters
                query_params = urlencode(data) + f"&set_credentials_link={set_credentials_link}&email={user_email}"
                success_url = f"{settings.PAYMENT_SUCCESS_OR_FAILURE_BASE_URL}/success?{query_params}"
                return HttpResponseRedirect(success_url)
            else:
                # In case payment execution fails, redirect to failure page
                failure_url = f"{settings.PAYMENT_SUCCESS_OR_FAILURE_BASE_URL}/failure"
                return HttpResponseRedirect(failure_url)    

