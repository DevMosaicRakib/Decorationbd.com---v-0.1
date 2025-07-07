# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cart,DeliverCharge
from .serializer import CartSerializer,DeliveryChargeSerializer
from Products.models import Product, ProductVariant
from Coupon.models import Coupon
from decimal import Decimal
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
class DeliveryChargeViewset(viewsets.ModelViewSet):
    queryset = DeliverCharge.objects.all()
    serializer_class = DeliveryChargeSerializer

    @action(detail=False, methods=['GET'])
    def delivery_charge_list(self, request):
        chargeList = DeliverCharge.objects.all()
        serializer = DeliveryChargeSerializer(chargeList, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



def _cart_session_id(request):
    session_id = request.session.session_key
    if not session_id:
        session_id = request.session.create()
    return session_id 

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

   

    def get_permissions(self):
        """
        Allow any user (authenticated or not) to perform cart actions.
        You can restrict some specific actions if needed.
        """
        if self.action in ['add_item', 'cartitem_delete', 'allcart_delete', 'update_item', 'update_is_checked', 'cartlist', 'add_coupon']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['POST'])
    @permission_classes([AllowAny])
    def add_item(self, request, *args, **kwargs):
        user = request.user if request.user.is_authenticated else None
        product_id = request.data.get('products_id')
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))
        device = request.data.get('device')

        if not product_id:
            return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
            variant = ProductVariant.objects.get(id=variant_id) if variant_id else None
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Variant not found"}, status=status.HTTP_404_NOT_FOUND)

        # Ensure totalStock is an integer
        totalStock = int(product.total_stock) if hasattr(product, 'total_stock') and product.total_stock is not None else None

        if user:
            cart_item, created = Cart.objects.get_or_create(user=user, products=product, variant=variant)
        else:
            if not device:
                return Response({"error": "Device ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            cart_item, created = Cart.objects.get_or_create(device=device, products=product, variant=variant)

        if not created:
            new_quantity = cart_item.quantity + quantity
            if totalStock is not None and new_quantity > totalStock:
                return Response({"error": "Sorry! This Product Out of Stock now.."}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = new_quantity
        else:
            if totalStock is not None and quantity > totalStock:
                return Response({"error": "Sorry! This Product Out of Stock now.."}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = quantity
        
        cart_item.save()
        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)




    @action(detail=True, methods=['DELETE'])
    @permission_classes([AllowAny])
    def cartitem_delete(self, request, *args, **kwargs):
        deviceCookie = request.headers.get('device')
        try:
            user = request.user if request.user.is_authenticated else None
            cart_item_id = kwargs.get('pk')

            if user:
                cart_item = Cart.objects.filter(id=cart_item_id, user=user)
            else:
                # session_key = _cart_session_id(request)
                # cus_device = request.COOKIES['device']
                # print(f"Session Key: {session_key}")  # Log the session key

                # Check if a cart item for the product and session already exists
                cart_item = Cart.objects.filter(id=cart_item_id,device=deviceCookie)

            cart_item.delete()
            return Response({"message": "Cart item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({'message': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['DELETE'])
    @permission_classes([AllowAny])
    def allcart_delete(self, request, *args, **kwargs):
        user = request.user if request.user.is_authenticated else None
        deviceCookie = request.headers.get('device')

        if user:
            cart_items = Cart.objects.filter(user=user)
        else:
            # session_id = request.session.session_key or request.session.save()
            # cus_device = request.COOKIES['device']
            cart_items = Cart.objects.filter(device=deviceCookie)

        for cart_item in cart_items:
            cart_item.delete()

        return Response({"message": "All cart items deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['PATCH'])
    @permission_classes([AllowAny])
    def update_item(self, request, *args, **kwargs):
        deviceCookie = request.headers.get('device')
        try:
            user = request.user if request.user.is_authenticated else None
            cart_item_id = kwargs.get('pk')
            quantity = int(request.data.get('quantity'))

            if user:
                cart_item = Cart.objects.get(id=cart_item_id, user=user)
            else:
                # session_id = request.session.session_key or request.session.save()
                # cus_device = request.COOKIES['device']
                cart_item = Cart.objects.get(id=cart_item_id, device=deviceCookie)

            if quantity >= 1:
                cart_item.quantity = quantity
                cart_item.save()
                serializer = self.get_serializer(cart_item)
                return Response({"data": serializer.data, "message": "Cart item updated successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Sorry! Cart item quantity cannot be zero.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['PATCH'])
    @permission_classes([AllowAny])
    def update_is_checked(self, request, *args, **kwargs):
        deviceCookie = request.headers.get('device')
        try:
            user = request.user if request.user.is_authenticated else None
            cart_item_id = kwargs.get('pk')
            is_checked = request.data.get('is_checked')

            if user:
                cart_item = Cart.objects.get(id=cart_item_id, user=user)
            else:
                # session_id = request.session.session_key or request.session.save()
                # cus_device = request.COOKIES['device']
                cart_item = Cart.objects.get(id=cart_item_id, device=deviceCookie)

            cart_item.is_checked = is_checked
            cart_item.save()

            serializer = self.get_serializer(cart_item)
            return Response({"data": serializer.data, "message": "Cart item checked state updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    @permission_classes([AllowAny])
    def cartlist(self, request, *args, **kwargs):
        user = request.user if request.user.is_authenticated else None

        if user:
            # Fetch cart items for authenticated users
            cart_items = Cart.objects.filter(user=user)
        else:
            # session_key = _cart_session_id(request)
            cus_device = request.headers.get('device')
            # print(f"Session Key: {session_key}")  # Log the session key

            # Check if a cart item for the product and session already exists
            cart_items = Cart.objects.filter(device=cus_device)

        # Serialize the cart items
        serializer = CartSerializer(cart_items, many=True)
        
        # Return serialized data with HTTP 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    @permission_classes([AllowAny])
    def add_coupon(self, request):
        user = request.user if request.user.is_authenticated else None
        coupon_code = request.data.get('coupon')
        deviceCookie = request.headers.get('device')

        if not coupon_code:
            return Response({'msg': 'Coupon code is required'}, status=status.HTTP_400_BAD_REQUEST)

        coupon = Coupon.objects.filter(code=coupon_code, active=True).first()
        if not coupon:
            return Response({'msg': 'Invalid Coupon code'}, status=status.HTTP_400_BAD_REQUEST)

        if user:
            cart_items = Cart.objects.filter(user=user, is_checked=True)
        else:
            # session_id = request.session.session_key or request.session.save()
            # cus_device = request.COOKIES['device']
            cart_items = Cart.objects.filter(device=deviceCookie, is_checked=True)

        if not cart_items.exists():
            return Response({'msg': 'No items in cart'}, status=status.HTTP_400_BAD_REQUEST)

        for item in cart_items:
            item.coupon = coupon
            item.coupon_applied = True
            item.save()

        cart_serializer = CartSerializer(cart_items, many=True)
        total_price = Decimal(cart_serializer.data[0]['total_price'])

        return Response({
            'total_price': total_price,
            'cart_items': cart_serializer.data
        }, status=status.HTTP_200_OK)




         

