from rest_framework import serializers
from .models import Order,OrderItem,CustomerShippingAddress,CustomerBillingAddress
from Cart.serializer import CartSerializer
from Products.serializers import ProductSerializer
from Coupon.serializer import CouponSerializer



# Customer Addresses Model Serializer Start
class CustomerShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerShippingAddress
        fields = ['id','name','phone','email','address','area','customization','country']

class CustomerBillingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerBillingAddress
        fields = ['id','name','phone','email','address','area','customization','country']


# Order Items Model Serializer Start

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity','ordered_product_variant']

class OrderSerializer(serializers.ModelSerializer):
    formatted_created_date = serializers.CharField(read_only=True)
    order_items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = CustomerShippingAddressSerializer()
    coupon = CouponSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_items', 'formatted_created_date', 'shipping_address', 
                  'payment_method', 'status', 'total_price', 
                  'after_partial_cod_remain_total_price', 'partial_cod', 
                  'for_order_confirmation', 'coupon', 'coupon_applied', 
                  'payment_status', 'paid_amount']
        read_only_fields = ['id', 'formatted_created_date']


