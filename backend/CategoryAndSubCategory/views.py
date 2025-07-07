from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .serializers import CategorySerializer, SubCategorySerializer
from .models import Category, SubCategory

# ✅ Get all categories
class allCategoryView(APIView):
    def get(self, request, format=None):
        categories = Category.objects.all().order_by('order')  # Ordered by `order`
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

# ✅ Get a single category by `catname`
class singleCategoryView(APIView):
    def get(self, request, catname, format=None):
        category = get_object_or_404(Category, catname=catname)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

# ✅ Get all subcategories
class allSubCategoryView(APIView):
    def get(self, request, format=None):
        subcategories = SubCategory.objects.all().order_by('order')  # Ordered by `order`
        serializer = SubCategorySerializer(subcategories, many=True)
        return Response(serializer.data)

# ✅ Get a single subcategory by `subcatname`
class singleSubCategoryView(APIView):
    def get(self, request, subcatname, format=None):
        subcategory = get_object_or_404(SubCategory, subcatname=subcatname)
        serializer = SubCategorySerializer(subcategory)
        return Response(serializer.data)
