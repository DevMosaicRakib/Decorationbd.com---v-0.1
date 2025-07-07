from rest_framework import serializers
from .models import Product, ProductImage,FeaturedProduct,ProductVariant,ProductVariantImage,Product_VariantType,ProductShippingAndDeliveryImage
from CategoryAndSubCategory.serializers import CategorySerializer, SubCategorySerializer


class ProductShipAndDeliveryImgSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductShippingAndDeliveryImage
        fields = ('id','image')

class Product_VariantTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_VariantType
        fields = ('id','typeName')

class ProductVariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariantImage
        fields = ('id', 'variant','images')


class ProductVariantSerializer(serializers.ModelSerializer):
    images = ProductVariantImageSerializer(many=True, read_only=True)
    variant_type = Product_VariantTypeSerializer(read_only=True)
    class Meta:
        model = ProductVariant
        fields = ('id', 'variant_type', 'value', 'price', 'discount_price','images')

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'images')

class ProductSerializer(serializers.ModelSerializer):
    description = serializers.ReadOnlyField()
    product_imgs = ProductImageSerializer(many=True)
    Category = CategorySerializer(read_only=True)
    Sub_category = SubCategorySerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ('id', 'name', 'short_description','description', 'Category', 'Sub_category', 'tags', 'stock','min_quantity','total_stock','partial_cod_in_percentage','partial_cod_in_taka','product_imgs','variants')

class FeaturedProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer(many=True,read_only=True)
    
    class Meta:
        model = FeaturedProduct
        fields = ('id', 'title','product')