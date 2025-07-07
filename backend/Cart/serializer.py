# serializers.py
from rest_framework import serializers
from .models import Cart,DeliverCharge
from Products.serializers import ProductSerializer
from Coupon.models import Coupon
from Coupon.serializer import CouponSerializer
from decimal import Decimal


class DeliveryChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliverCharge
        fields = ['id','min_amount','max_amount','delivery_charge']

class CartSerializer(serializers.ModelSerializer):
    products = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    variant = serializers.CharField(source="variant.value", read_only=True)
    variant_id = serializers.IntegerField(write_only=True, required=False)
    sub_total = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    total_cartitems = serializers.SerializerMethodField()
    coupon = CouponSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = [
            'id', 'user', 'products', 'product_id', 'variant', 'variant_id', 'device',
            'quantity', 'coupon', 'coupon_applied', 'sub_total', 'total_price', 'total_cartitems', 'is_checked'
        ]

    def get_sub_total(self, cart):
        return cart.sub_total

    def get_total_price(self, cart):
        user = cart.user
        device = cart.device
        cart_items = Cart.objects.filter(user=user) if user else Cart.objects.filter(device=device)
        total = sum(item.sub_total for item in cart_items if item.is_checked)

        if cart.coupon:
            discount = Decimal(cart.coupon.discount) / Decimal(100)
            total -= total * discount

        return total

    def get_total_cartitems(self, cart):
        user = cart.user
        device = cart.device
        cart_items = Cart.objects.filter(user=user) if user else Cart.objects.filter(device=device)
        return sum(item.quantity for item in cart_items if item.is_checked)


