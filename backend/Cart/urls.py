# urls.py
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("cartitems",views.CartViewSet)
router.register("deliverycharge", views.DeliveryChargeViewset, basename="deliverycharge")
urlpatterns = [
    path('', include(router.urls)),
]