from django.db import models

class SubCategory(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    subcatname = models.CharField(max_length=100)
    image = models.ImageField(upload_to='subCategoryImage', null=True, blank=True)
    bgColor = models.CharField(max_length=100, null=True, blank=True)
    order = models.PositiveIntegerField(default=0)  # Ordering field

    class Meta:
        ordering = ['order']  # Default ordering in ascending order

    def __str__(self):
        return self.subcatname


class Category(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    catname = models.CharField(max_length=100)
    sub_categories = models.ManyToManyField(SubCategory, related_name='categories')
    order = models.PositiveIntegerField(default=0)  # Ordering field

    class Meta:
        ordering = ['order']  # Default ordering in ascending order

    def __str__(self):
        return self.catname
 