
from django.db import models
from CategoryAndSubCategory.models import Category, SubCategory
from django.core.exceptions import ValidationError

BANNER_SECTION_TYPE = [
    ('normal', 'normal'),
    ('logo', 'logo'),
    ('service', 'service'),
    ('offer', 'offer')
]

PRODUCT_SECTION_TYPE = [
    ('normal', 'normal'),
    ('multiple', 'multiple'),
    ('other', 'other'),
]

PRODUCT_LIMITATION = [(str(i), str(i)) for i in range(1, 31)]


class NewsPopUp(models.Model):
    active = models.BooleanField(default=True)
    popupSpeech = models.TextField(max_length=1000)
    
class PartialCodMessage(models.Model):
    partial_cod_message_for_checkout = models.TextField(max_length=1000,null=True,blank=True)

class CheckOutPopupMessage(models.Model):
    checkout_popup_message = models.TextField(max_length=1000,null=True,blank=True)    
    


class ProductSection(models.Model):
    title = models.CharField(max_length=250)
    category = models.ManyToManyField(Category, related_name='categories', blank=True)
    sub_category = models.ManyToManyField(SubCategory, related_name='subcategories', blank=True)
    product_section_type = models.CharField(max_length=250, choices=PRODUCT_SECTION_TYPE, null=True, blank=True)
    product_limitation = models.CharField(max_length=2, choices=PRODUCT_LIMITATION, null=True, blank=True)
    section_bg_color = models.CharField(max_length=250, null=True, blank=True)
    card_bg_color = models.CharField(max_length=250, null=True, blank=True)
    section_headingText_subText_color = models.CharField(max_length=250, null=True, blank=True)
    card_productTitle_price_color = models.CharField(max_length=250, null=True, blank=True)
    show_categorywise_product = models.BooleanField(default=False)
    show_subcategorywise_product = models.BooleanField(default=False)

    def __str__(self):
        return self.title


# class BannerImages(models.Model):
#     title = models.CharField(max_length=250)
#     images = models.ImageField(upload_to='homebanner/')

#     def __str__(self):
#         return self.title


# class BannerSection(models.Model):
#     title = models.CharField(max_length=250)
#     banner_images = models.ManyToManyField(BannerImages, related_name='banner_images')
#     banner_type = models.CharField(max_length=250, choices=BANNER_SECTION_TYPE, null=True, blank=True)

#     def __str__(self):
#         return self.title

# Allowed media file extensions
VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi']

def validate_media_file(value):
    if not any(value.name.lower().endswith(ext) for ext in VALID_EXTENSIONS):
        raise ValidationError('Only images, GIFs, and videos are allowed.')

class BannerMedia(models.Model):
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('gif', 'GIF'),
        ('video', 'Video'),
    ]

    title = models.CharField(max_length=250)
    media_file = models.FileField(upload_to='homebanner/', validators=[validate_media_file])
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES)

    def __str__(self):
        return self.title

class BannerSection(models.Model):
    title = models.CharField(max_length=250)
    banner_media = models.ManyToManyField(BannerMedia, related_name='banner_sections')
    banner_type = models.CharField(max_length=250, choices=BANNER_SECTION_TYPE, null=True, blank=True)

    def __str__(self):
        return self.title


class HomePageProductSection(models.Model):
    home_page = models.ForeignKey('HomePage', on_delete=models.CASCADE)
    product_section = models.ForeignKey(ProductSection, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']  # Ensures the items are displayed in the correct order


class HomePage(models.Model):
    product_section = models.ManyToManyField(
        ProductSection, 
        related_name='home_product_sections', 
        through='HomePageProductSection', 
        blank=True
    )
    banner_section = models.ManyToManyField(
        BannerSection, 
        related_name='home_banner_sections', 
        blank=True
    )

    def __str__(self):
        return f"HomePage {self.id}"
