from django.db import models
from Cart.models import Cart
from Products.models import Product
from Users.models import User
from django.utils import timezone
from django.utils.dateformat import format
# from customerSection.models import CustomerShippingAddress
from Coupon.models import Coupon
# Create your models here.


# Customer Addresses Model Start Here
class CustomerShippingAddress(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=255)
    address = models.CharField(max_length=255)
    area = models.CharField(max_length=255,blank=True,null=True)
    customization = models.CharField(max_length=100,blank=True,null=True)
    country = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.address}, {self.area}"
    

class CustomerBillingAddress(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=255)
    address = models.CharField(max_length=255)
    area = models.CharField(max_length=255,blank=True,null=True)
    customization = models.CharField(max_length=100,blank=True,null=True)
    country = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.address}, {self.area}"


# Orders Model Start

class Order(models.Model):
    PAYMENT_METHOD = (
        ('Cash on Delivery','Cash on Delivery'),
        ('Full Payment','Full Payment'),
    )
    STATUS = (
        ('Ordered','Ordered'),
        ('Delivered','Delivered'),
        ('Cancelled','Cancelled'),
        ('Returned','Returned'),
        ('Failed' , 'Failed')
    )
    PAYMENT_STATUS = (
        ('Paid','Paid'),
        ('Unpaid','Unpaid')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True,blank=True)
    Date = models.DateTimeField(auto_now_add=True)
    shipping_address = models.ForeignKey(CustomerShippingAddress, on_delete=models.CASCADE, blank=True, null=True)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD, default='Full Payment')
    delivery_charge = models.CharField(max_length=50,null=True,blank=True)
    status = models.CharField(max_length=50, choices=STATUS, default='Ordered')
    total_price = models.DecimalField(decimal_places=2, max_digits=10)
    after_partial_cod_remain_total_price = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    partial_cod = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    for_order_confirmation = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    coupon = models.ForeignKey(Coupon, null=True, blank=True, on_delete=models.SET_NULL)
    coupon_applied = models.BooleanField(default=False)
    payment_id = models.CharField(max_length=250, null=True)
    payment_status = models.CharField(max_length=50, choices=PAYMENT_STATUS, null=True)
    paid_amount = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    ordered = models.BooleanField(default=False)
    order_platform = models.CharField(max_length=50, null=True, blank=True, default='')
    order_type = models.CharField(max_length=50, null=True, blank=True, default='')
    # delivery_date = models.CharField(max_length=100,null=True,blank=True)

    @property
    def formatted_created_date(self):
        return format(self.Date, 'j F, Y, g:i A') 



class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    ordered_product_variant = models.CharField(max_length=100,null=True, blank=True)

    def __str__(self):
        return f"{self.product} - {self.quantity}"


    
 
