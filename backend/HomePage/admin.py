

from django.contrib import admin
from .models import CheckOutPopupMessage, NewsPopUp, PartialCodMessage,ProductSection, BannerSection, HomePage, BannerMedia, HomePageProductSection


class HomePageProductSectionInline(admin.TabularInline):
    model = HomePageProductSection
    extra = 1
    ordering = ['order']  # Ensure the items are displayed in the correct order
    fields = ['product_section', 'order']


@admin.register(HomePage)
class HomePageAdmin(admin.ModelAdmin):
    inlines = [HomePageProductSectionInline]


admin.site.register(ProductSection)
admin.site.register(BannerSection)
admin.site.register(BannerMedia)
admin.site.register(NewsPopUp)
admin.site.register(PartialCodMessage)
admin.site.register(CheckOutPopupMessage)