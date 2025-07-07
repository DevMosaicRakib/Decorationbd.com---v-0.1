from django.utils.html import format_html
from django.contrib import admin
from Orders.models import Order, OrderItem,CustomerShippingAddress,CustomerBillingAddress
from Products.models import ProductImage  # Assuming ProductImage is in Products app




# Customer Addresses Model Admin
class CustomerShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'email', 'address', 'area')


admin.site.register(CustomerShippingAddress, CustomerShippingAddressAdmin)


class CustomerBillingAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'email', 'address', 'area')


admin.site.register(CustomerBillingAddress, CustomerBillingAddressAdmin)


# Order And Order Items Admin
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ('formatted_created_date', 'get_mobile_number_and_name', 'get_order_items', 'get_shipping_address', 'total_price', 'get_adv_amount','get_panding_amount','get_customization','status','print')
    inlines = [OrderItemInline]
    list_filter = ('Date','status')  # You can add any other filters you need
    search_fields = ('get_mobile_number_and_name',)  # Keep regular search fields
    date_hierarchy = 'Date'
    ordering = ('-Date',)
    
    def print(self, obj):
        return format_html(
            '<button style="width:60px; font-size:10px; background-color: #6c757d; color: white; border: none; padding: 5px 5px; margin-bottom: 5px;" '
            '>Print Lab</button><br>'
            '<button style="width:60px; font-size:10px;background-color: #6c757d; color: white; border: none; padding: 5px 5px;" '
            '>Print Inv</button>',           
        )

    # def formatted_created_date(self, obj):
    #     return obj.Date.strftime('%d/%m/%y')  # Day/Month/Year in two digits
    # formatted_created_date.admin_order_field = 'Date'  # Sort by actual 'created' field
    # formatted_created_date.short_description = 'Date'  # This will show "Date" as the column header
    
    def formatted_created_date(self, obj):
        return format_html(
            "<div>{}</div><div style='font-size: 0.9em; color: white;'>{}</div>",
            obj.id,
            obj.Date.strftime('%d/%m/%y')
        )
    formatted_created_date.admin_order_field = 'Date'  # Sort by the 'Date' field
    formatted_created_date.short_description = 'ID and Date'  # Column header


    @admin.display(description='Ship Add')
    def get_shipping_address(self, obj):
        if obj.shipping_address:
            return f"{obj.shipping_address.address}"
        return ''
    
    @admin.display(description='customization')
    def get_customization(self, obj):
        if obj.shipping_address.customization:
            return obj.shipping_address.customization
        return ''

    @admin.display(description='Adv amount')
    def get_adv_amount(self, obj):
        return obj.paid_amount

    @admin.display(description='Name & Number')
    def get_mobile_number_and_name(self, obj):
        if obj.shipping_address:
            name = obj.shipping_address.name
            phone = obj.shipping_address.phone
            return format_html("<strong>{}</strong><br>{}", name, phone)
        return ''
    
    @admin.display(description='Due Amount')
    def get_panding_amount(self,obj):
        return obj.after_partial_cod_remain_total_price

    @admin.display(description='Order Items')
    def get_order_items(self, obj):
        items = obj.order_items.all()  # Fetch all order items
        result = []
        
        for item in items:
            product_images = item.product.product_imgs.all()  # Get product images
            if product_images.exists():
                image_url = product_images.first().images.url  # Use the first image
            else:
                image_url = ''  # Fallback if no image is available
    
            # Arrange the image, name, and model number
            result.append(format_html(
                '<div style="display: flex; align-items: center; margin-bottom: 10px;">'
                '<img src="{}" style="max-height: 40px; max-width: 40px; border-radius: 50%; margin-right: 10px;" />'
                '<span>{}</span>'
                '</div>',
                image_url, item.product.name  # Include product name
            ))
        
        return format_html(''.join(result))


    class Media:
        css = {
            'all': ('custom_admin/admin.css',)
        }
        js = (
            'https://code.jquery.com/jquery-3.6.0.min.js',
            'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
            'custom_admin/admin.js',  # Append a version
        )

admin.site.register(Order, OrderAdmin)


