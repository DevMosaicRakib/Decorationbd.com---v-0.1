from django.contrib import admin
from django.utils.html import format_html
from datetime import datetime
from .models import OflineOrders  # Import your model
from django.utils import timezone
from django import forms

class VendorFilter(admin.SimpleListFilter):
    title = 'Vendor Username'  # Default title
    parameter_name = 'vendor'

    def lookups(self, request, model_admin):
        # If the logged-in user is a superuser, show all vendor usernames in the dropdown
        if request.user.is_superuser:
            vendors = OflineOrders.objects.values_list('vendor__id', 'vendor__username').distinct()
            return [(vendor[0], vendor[1]) for vendor in vendors]
        # If the logged-in user is a vendor (is_staff but not superuser), show only their name
        elif request.user.is_staff:
            return [(request.user.id, request.user.username)]
        return []

    def queryset(self, request, queryset):
        # Filter the queryset based on the selected vendor ID
        if self.value():
            return queryset.filter(vendor__id=self.value())
        return queryset

    def __init__(self, request, params, model, model_admin):
        super().__init__(request, params, model, model_admin)
        # Customize the filter title based on the user's role
        if request.user.is_superuser:
            self.title = f"Vendor: {request.user.username}"
        elif request.user.is_staff:
            self.title = f"Vendor: {request.user.username}"






@admin.register(OflineOrders)
class OflineOrdersAdmin(admin.ModelAdmin):
    list_display = ('formatted_created_date','Name_Number','Address', 'Model', 'Total_price','adv_amount','due_amount','extra_cost','exact_total','customization','From_Order','status', 'print')
    list_filter = ('Date', 'From_Order','status', VendorFilter)  # You can add any other filters you need
    search_fields = ('Name_Number', 'Model')  # Keep regular search fields
    date_hierarchy = 'Date'
    ordering = ('-Date',)

    
    # Adjust the 'From_Order' field visibility based on user role
    def get_list_display(self, request):
        if request.user.is_staff and not request.user.is_superuser:
            # If the user is a vendor (is_staff), remove 'From_Order'
            return ('formatted_created_date', 'Name_Number', 'Address', 'Model', 'Total_price', 'adv_amount', 'due_amount', 'extra_cost', 'exact_total', 'customization', 'status', 'print')
        return super().get_list_display(request)

    def get_list_filter(self, request):
        if request.user.is_staff and not request.user.is_superuser:
            # If the user is a vendor, remove 'From_Order' from filters
            return ('Date', 'status', VendorFilter)
        return super().get_list_filter(request)
        
    # Hide 'From_Order' field for vendors
    def get_fields(self, request, obj=None):
        fields = super().get_fields(request, obj)
        if request.user.is_staff and not request.user.is_superuser:
            # Remove 'From_Order' for vendors
            fields = [field for field in fields if field != 'From_Order']
        return fields

    # Optional: Customize fieldsets for vendors
    def get_fieldsets(self, request, obj=None):
        if request.user.is_staff and not request.user.is_superuser:
            # Remove 'From_Order' for vendors
            return [(None, {'fields': [field for field in self.get_fields(request, obj) if field != 'From_Order']})]
        return super().get_fieldsets(request, obj) 
        
    def get_form(self, request, obj=None, **kwargs):
        """
        Customize the admin form to set the default vendor value.
        """
        form = super().get_form(request, obj, **kwargs)
        if request.user.is_staff and not request.user.is_superuser:
            # Hide the 'vendor' field using forms.HiddenInput
            form.base_fields['vendor'].widget = forms.HiddenInput()
            # Set the default value of vendor to the logged-in user
            form.base_fields['vendor'].initial = request.user
        return form

    def save_model(self, request, obj, form, change):
        """
        Automatically set the vendor field to the logged-in user for staff users.
        """
        if request.user.is_staff and not request.user.is_superuser:
            obj.vendor = request.user
        super().save_model(request, obj, form, change)    
        

    def formatted_created_date(self, obj):
        return format_html(
            "<div>{}</div><div style='font-size: 0.9em; color: white;'>{}</div>",
            obj.id,
            obj.Date.strftime('%d/%m/%y')
        )
    formatted_created_date.admin_order_field = 'Date'  # Sort by the 'Date' field
    formatted_created_date.short_description = 'ID and Date'  # Column header
    

    def print(self, obj):
        return format_html(
            '<button style="width:60px; font-size:10px; background-color: #6c757d; color: white; border: none; padding: 5px 5px; margin-bottom: 5px;" '
            '>Print Lab</button><br>'
            '<button style="width:60px; font-size:10px;background-color: #6c757d; color: white; border: none; padding: 5px 5px;" '
            '>Print Inv</button>',           
        )

    # Automatically calculate due_amount and exact_total
    def save_model(self, request, obj, form, change):
        # Calculate due amount
        obj.due_amount = obj.Total_price - obj.adv_amount

        # Calculate exact total
        obj.exact_total = obj.Total_price - obj.extra_cost

        # Call the parent method to save the object
        super().save_model(request, obj, form, change)    

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_staff and not request.user.is_superuser:
            qs = qs.filter(vendor=request.user)
        search_value = request.GET.get('q')

        if search_value:
            search_value = search_value.strip()

            try:
                if ' - ' in search_value:
                    # Split the date range
                    start_date_str, end_date_str = search_value.split(' - ')
                    start_date = timezone.datetime.strptime(start_date_str.strip(), '%d/%m/%Y')
                    end_date = timezone.datetime.strptime(end_date_str.strip(), '%d/%m/%Y')

                    # Make both dates timezone aware
                    start_date = timezone.make_aware(start_date)
                    end_date = timezone.make_aware(end_date)

                    # Print debugging info
                    print("Date Range:", start_date, end_date)

                    # Filter queryset by date range (inclusive)
                    return qs.filter(created__range=(start_date, end_date + timezone.timedelta(days=1)))

                # Handle single date search
                search_date = timezone.datetime.strptime(search_value, '%d/%m/%Y')
                search_date = timezone.make_aware(search_date)  # Make timezone aware

                # Print debugging info
                print("Single Date:", search_date)
                
                filtered_qs = qs.filter(created__date=search_date)
                print("Queryset Count:", filtered_qs.count())  # Debug print
                return filtered_qs

            except ValueError as e:
                print("ValueError:", e)  # Debug print
                return qs

        return qs
        
    # def get_queryset(self, request):
    #     return super().get_queryset(request)    

    class Media:
        css = {
            'all': ('custom_admin/admin.css',)
        }
        js = (
            'https://code.jquery.com/jquery-3.6.0.min.js',
            'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
            'custom_admin/admin.js',  # Append a version
        )



































