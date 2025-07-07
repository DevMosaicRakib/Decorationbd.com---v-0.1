from django.contrib import admin
from .models import *
# Register your models here.

# class ProductImageInline(admin.TabularInline):
#     model = ProductImage
#     extra = 1

# class ProductAdmin(admin.ModelAdmin):
#     inlines = [ProductImageInline]
#     list_display = ('id','name', 'discount_price', 'Category', 'Sub_category', 'stock')
#     list_filter = ('Category', 'Sub_category')
#     search_fields = ('name','tags')



class ProductVariantImageInline(admin.TabularInline):
    model = ProductVariantImage
    extra = 1  # Allows the admin to add multiple images


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1  # Allows the admin to add multiple variants


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline, ProductVariantInline]
    list_display = ('id', 'name', 'Category', 'Sub_category', 'stock')
    list_filter = ('Category', 'Sub_category')
    search_fields = ('name', 'tags')


class ProductVariantAdmin(admin.ModelAdmin):
    inlines = [ProductVariantImageInline]  # Allows adding images directly while adding/editing variants
    list_display = ('id', 'product', 'variant_type', 'value', 'discount_price')
    search_fields = ('value',)




class FeaturedProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
    # search_fields = ('product__name',)

    # def product_name(self, obj):
    #     return obj.product.name
    # product_name.short_description = 'Product Name'

    # def product_price(self, obj):
    #     return obj.product.Category.catname
    # product_price.short_description = 'Product Category'

    # def product_discount_price(self, obj):
    #     return obj.product.discount_price
    # product_discount_price.short_description = 'Discount Price'    

# admin.site.register(Product, ProductAdmin)
# admin.site.register(ProductImage)


admin.site.register(Product, ProductAdmin)
admin.site.register(ProductVariant, ProductVariantAdmin)
admin.site.register(Product_VariantType)
admin.site.register(FeaturedProduct, FeaturedProductAdmin)
admin.site.register(ProductShippingAndDeliveryImage)

