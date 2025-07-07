from django.contrib import admin
from django.utils.html import format_html
from .models import Category, SubCategory

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['subcatname', 'order', 'move_up', 'move_down']
    list_editable = ['order']
    ordering = ['order']

    def move_up(self, obj):
        return format_html('<a href="?move_up={}">⬆️</a>', obj.id)

    def move_down(self, obj):
        return format_html('<a href="?move_down={}">⬇️</a>', obj.id)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if 'move_up' in request.GET:
            obj = qs.get(id=request.GET['move_up'])
            obj.order -= 1
            obj.save()
        if 'move_down' in request.GET:
            obj = qs.get(id=request.GET['move_down'])
            obj.order += 1
            obj.save()
        return qs


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['catname', 'order', 'move_up', 'move_down']
    list_editable = ['order']
    ordering = ['order']

    def move_up(self, obj):
        return format_html('<a href="?move_up={}">⬆️</a>', obj.id)

    def move_down(self, obj):
        return format_html('<a href="?move_down={}">⬇️</a>', obj.id)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if 'move_up' in request.GET:
            obj = qs.get(id=request.GET['move_up'])
            obj.order -= 1
            obj.save()
        if 'move_down' in request.GET:
            obj = qs.get(id=request.GET['move_down'])
            obj.order += 1
            obj.save()
        return qs
