from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from CategoryAndSubCategory.models import *
# Create your models here.

STOCK_STATUS = (
    ("In Stock","In Stock"),
    ("Out Of Stock", "Out Of Stock"),
)

class ProductShippingAndDeliveryImage(models.Model):
    image = models.ImageField(upload_to='product_ship_img/')

class Product(models.Model):
    name = models.CharField(max_length=100)
    short_description = models.TextField(max_length=1000,blank=True,null=True)
    description = RichTextUploadingField()
    Category = models.ForeignKey(Category, on_delete=models.CASCADE,blank=True,null=True)
    Sub_category = models.ForeignKey(SubCategory, on_delete=models.CASCADE,blank=True,null=True)
    tags = models.CharField(max_length=100,blank=True,null=True)
    stock = models.CharField(choices=STOCK_STATUS,max_length=100)
    min_quantity = models.CharField(max_length=20,null=True,blank=True)
    total_stock = models.CharField(max_length=20,null=True,blank=True)
    partial_cod_in_percentage = models.CharField(max_length=5,null=True,blank=True)
    partial_cod_in_taka = models.CharField(max_length=5,null=True,blank=True)
    # same_day_delivery = models.BooleanField(default=True)
    def __str__(self):
        return self.name    

class ProductImage(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name='product_imgs')    
    images = models.ImageField(upload_to='products/')
    def __str__(self):
        return self.product.name
    
class Product_VariantType(models.Model):
    typeName = models.CharField(max_length=100,null=True,blank=True)
    def __str__(self):
        return self.typeName    

class ProductVariant(models.Model):
    """Represents the actual variant of a product, e.g., Red, Large"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants',null=True,blank=True)
    variant_type = models.ForeignKey(Product_VariantType,on_delete=models.CASCADE,null=True,blank=True)
    value = models.CharField(max_length=100,default='standard')  # e.g., Red, Large
    price = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    discount_price = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)

    def __str__(self):
        return self.value

class ProductVariantImage(models.Model):
    """Represents the images for a specific product variant"""
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='images')
    images = models.ImageField(upload_to='variant_images/')

    def __str__(self):
        return f"{self.variant.value}"

class FeaturedProduct(models.Model):
    title = models.CharField(max_length=250,null=True,blank=True)
    product = models.ManyToManyField(Product,related_name='featured_product')        