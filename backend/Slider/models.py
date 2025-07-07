from django.db import models
from django.core.exceptions import ValidationError

# Allowed media file extensions
VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi']

def validate_media_file(value):
    if not any(value.name.lower().endswith(ext) for ext in VALID_EXTENSIONS):
        raise ValidationError('Only images, GIFs, and videos are allowed.')
# Create your models here.
class Slider(models.Model):
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('gif', 'GIF'),
        ('video', 'Video'),
    ]
    name = models.CharField(max_length=100)
    media_file = models.FileField(upload_to='sliderImg/', validators=[validate_media_file],default=None)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES,null=True, blank=True)
    def __str__(self):
        return self.name