from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('dbd/api/user/', include('Users.urls')),
    path('dbd/api/',include('CategoryAndSubCategory.urls')),
    path('dbd/api/',include('Products.urls')),
    path('dbd/api/',include('Slider.urls')),
    path('dbd/api/',include('Cart.urls')),
    path('dbd/api/',include('Orders.urls')),
    path('dbd/api/',include('HomePage.urls')),
    path('ckeditor/',include('ckeditor_uploader.urls'))
]  + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)