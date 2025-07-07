from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

# Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, password2=None):
        """
        Creates and saves a User with the given email, username, and password.
        """
        if not email:
            raise ValueError('User must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username=None, password=None):
        """
        Creates and saves a superuser with the given email, username, and password.
        """
        user = self.create_user(email, username=username, password=password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

# Custom User Model

AUTH_PROVIDERS = {'email': 'email', 'google': 'google', 'facebook': 'facebook'}

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name='Email', max_length=255, unique=True)
    username = models.CharField(max_length=200, null=True, blank=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True, default='profile_pictures/default.png')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Add this to control admin access
    is_admin = models.BooleanField(default=False)  # Deprecated in favor of is_superuser, but can keep for custom logic
    is_superuser = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    auth_provider = models.CharField(max_length=50, default=AUTH_PROVIDERS.get('email'))

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        """
        Does the user have a specific permission?
        """
        if self.is_superuser:
            return True
        return super().has_perm(perm, obj=obj)

    def has_module_perms(self, app_label):
        """
        Does the user have permissions to view the app `app_label`?
        """
        if self.is_superuser:
            return True
        return super().has_module_perms(app_label)


























