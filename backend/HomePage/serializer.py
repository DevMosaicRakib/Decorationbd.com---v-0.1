

from rest_framework import serializers
from CategoryAndSubCategory.serializers import CategorySerializer,SubCategorySerializer
from .models import (
    CheckOutPopupMessage,
    NewsPopUp,
    PartialCodMessage, 
    ProductSection, 
    BannerMedia, 
    BannerSection, 
    HomePage, 
    HomePageProductSection
)

class NewsPopUpSerializer(serializers.ModelSerializer):
    """Serializer for NewsPopUp model."""
    class Meta:
        model = NewsPopUp
        fields = ['id', 'active', 'popupSpeech']
        
class PartialCodMessageSerializer(serializers.ModelSerializer):
    """Serializer for PartialCodMessage model."""
    class Meta:
        model = PartialCodMessage
        fields = ['id', 'partial_cod_message_for_checkout']

class CheckOutPopupMessageSerializer(serializers.ModelSerializer):
    """Serializer for CheckOutPopupMessage model."""
    class Meta:
        model = CheckOutPopupMessage
        fields = ['id', 'checkout_popup_message']        


class ProductSectionSerializer(serializers.ModelSerializer):
    """Serializer for ProductSection model."""
    category = CategorySerializer(many=True,read_only=True)
    sub_category = SubCategorySerializer(many=True,read_only=True)

    class Meta:
        model = ProductSection
        fields = [
            'id', 'title', 'category', 'sub_category', 'product_section_type', 
            'product_limitation', 'section_bg_color','card_bg_color','section_headingText_subText_color','card_productTitle_price_color','show_categorywise_product', 'show_subcategorywise_product'
        ]


# class BannerImagesSerializer(serializers.ModelSerializer):
#     """Serializer for BannerImages model."""
#     class Meta:
#         model = BannerImages
#         fields = ['id', 'title', 'images']


# class BannerSectionSerializer(serializers.ModelSerializer):
#     """Serializer for BannerSection model."""
#     banner_images = BannerImagesSerializer(many=True)

#     class Meta:
#         model = BannerSection
#         fields = ['id', 'title', 'banner_images', 'banner_type']
class BannerMediaSerializer(serializers.ModelSerializer):
    """Serializer for BannerMedia model."""
    class Meta:
        model = BannerMedia
        fields = ['id', 'title', 'media_file', 'media_type']

class BannerSectionSerializer(serializers.ModelSerializer):
    """Serializer for BannerSection model."""
    banner_media = BannerMediaSerializer(many=True)

    class Meta:
        model = BannerSection
        fields = ['id', 'title', 'banner_media', 'banner_type']


class HomePageProductSectionSerializer(serializers.ModelSerializer):
    """Serializer for HomePageProductSection model."""
    product_section = ProductSectionSerializer()

    class Meta:
        model = HomePageProductSection
        fields = ['id', 'product_section', 'order']


class HomePageSerializer(serializers.ModelSerializer):
    """Serializer for HomePage model."""
    product_section = serializers.SerializerMethodField()
    banner_section = BannerSectionSerializer(many=True)

    class Meta:
        model = HomePage
        fields = ['id', 'product_section', 'banner_section']

    def get_product_section(self, obj):
        """Retrieve ordered product sections for the homepage."""
        ordered_sections = HomePageProductSection.objects.filter(home_page=obj).order_by('order')
        return HomePageProductSectionSerializer(ordered_sections, many=True).data


