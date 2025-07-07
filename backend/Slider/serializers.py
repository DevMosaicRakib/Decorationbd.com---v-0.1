from rest_framework import serializers
from .models import Slider

class SliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slider
        fields = ('id', 'name', 'media_file', 'media_type')