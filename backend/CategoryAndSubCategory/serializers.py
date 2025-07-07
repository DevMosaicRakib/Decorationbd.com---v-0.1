from rest_framework import serializers
from .models import Category, SubCategory

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'subcatname', 'image', 'bgColor', 'order']


class CategorySerializer(serializers.ModelSerializer):
    sub_categories = SubCategorySerializer(many=True, read_only=True)  # Nested serializer

    class Meta:
        model = Category
        fields = ['id', 'catname', 'sub_categories', 'order']
