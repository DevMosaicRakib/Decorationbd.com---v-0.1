from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    # Specify the fields you want to display, excluding `date_joined`
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('username', 'first_name', 'last_name', 'profile_picture')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),  # `date_joined` removed here
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    ordering = ['email']
    list_display = ['id','email', 'username', 'first_name','last_name','auth_provider','is_staff', 'is_superuser','is_admin', 'is_active']
    search_fields = ['email', 'username']
        
    class Media:
        css = {
            'all': ('custom_admin/admin.css',)
        }
        

admin.site.register(User, UserAdmin)
