from django.db import models
from ckeditor.fields import RichTextField
# Create your models here.

class EmailTemplate(models.Model):
    MESSAGE_TYPE_CHOICES = [
        ('Welcome for registration', 'Welcome Message'),
        ('Create user message for owner', 'Create user message for owner'),
        ('Password change success', 'Password change success'),
        ('Send password reset link', 'Send password reset link'),
        ('password reset success', 'password reset success'),
        ('Payment success and order confirmation', 'Payment success and order confirmation'),
        ('Payment failure and order saved', 'Payment failure and order saved'),
        ('Received new order','Received new order'),
        ('Anonymous user create and set password','Anonymous user create and set password'),
        ('Anonymous user create and set password success','Anonymous user create and set password success'),
    ]

    subject = models.CharField(max_length=255)
    message = RichTextField()
    attachment = models.FileField(upload_to='attachments/', null=True, blank=True)
    message_type = models.CharField(max_length=255, choices=MESSAGE_TYPE_CHOICES)
    is_active = models.BooleanField(default=True)  # Add a flag to mark active templates
    priority = models.IntegerField(default=1)  # Optional: Use to rank templates by priority

    def __str__(self):
        return self.subject
