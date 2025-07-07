from django.urls import path
from .views import *
urlpatterns = [
    path('productshipimg/',ProductShipAndDeliveryView.as_view()),
    path('products/',allProductsView.as_view()),
    path('products/<str:name>',SingleProductView.as_view()),
    # Featured Product
    path('featuredproducts/',FeaturedProductView.as_view()),
    # Monitor Stand
    path('singleAndDual/',SingleAndDualProductListView.as_view()),
    path('TripleQuadLapTv/',TripleQuadLapTvProductListView.as_view()),
    path('VesaMountAdapter/',VesaMountAdapterProductListView.as_view()),
    # Home Decor
    path('HomeDecorAll/',HomeDecorAllProductListView.as_view()),
    path('WallShelf/',WallShelfProductListView.as_view()),
    path('FlowerStand/',FlowerStandProductListView.as_view()),
    path('FloorLemp/',FloorLempProductListView.as_view()),
    path('TableLemp/',TableLempProductListView.as_view()),
    # Categories
    path('Kitchenware/',KitchenwareProductListView.as_view()),
    path('Furniture/',FurnitureProductListView.as_view()),
    path('Swings/',SwingsProductListView.as_view()),
    path('Cnc/',CncProductListView.as_view()),
    # QuickView
    path('QuickView/<int:id>',QuickViewProductView.as_view()),
]