from google.auth.transport import requests
from google.oauth2 import id_token
from .models import User
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from EmailTemplate.SendEmailAllTypesFuction import send_welcome_email,send_create_user_message_for_admin

# Generate Token Manually
def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

class Google():
    @staticmethod
    def validate(access_token):
        try:
            id_info = id_token.verify_oauth2_token(access_token, requests.Request())
            if "accounts.google.com" in id_info['iss']:
                return id_info
        except Exception as e:
            return "token is invalid or has expired"


def login_social_user(email,password):
    user=authenticate(email=email,password=password)
    user_tokens=get_tokens_for_user(user)
    return {
        'email':user.email,
        'token':user_tokens
    }

def register_social_user(provider,email,username):
    user=User.objects.filter(email=email)
    if user.exists():
        if provider == user[0].auth_provider:
            result=login_social_user(email,settings.SOCIAL_AUTH_PASSWORD)  
            return result
        else:
            raise AuthenticationFailed(
                detail=f"please continue your login with {user[0].auth_provider}"
            )
    else:
        new_user={
            'username':username,
            'email':email,
            'password':settings.SOCIAL_AUTH_PASSWORD,
            'password2':settings.SOCIAL_AUTH_PASSWORD,
        }
        register_user = User.objects.create_user(**new_user)
        register_user.auth_provider=provider
        register_user.is_verified=True
        register_user.save()
        user_email = email
        user_data = {
            'user_name':username
        }
        owner = User.objects.filter(is_admin=True).first()  # Returns the first matching user or None
        if owner:
            ownername = owner.username
        else:
            raise ValueError("No admin user found.")
        print(ownername)
        user_and_owner_data = {
        'user_name':username,
        'user_email':user_email,
        'owner_name':ownername
        }
        send_welcome_email(user_email,user_data)
        send_create_user_message_for_admin(user_and_owner_data)
        result=login_social_user(email=register_user.email,password=settings.SOCIAL_AUTH_PASSWORD)    
        return result                            