from rest_framework import serializers
from Users.models import User
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.hashers import check_password
from EmailTemplate.SendEmailAllTypesFuction import send_password_reset_link_email,password_reset_success_email,set_password_success_email
# For Social Authentication
from .utils import Google, register_social_user
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed




class UserRegistrationSerializer(serializers.ModelSerializer):
  # We are writing this becoz we need confirm password field in our Registratin Request
  password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
  username = serializers.CharField(max_length=255)
  class Meta:
    model = User
    fields=['email', 'username', 'password', 'password2']
    extra_kwargs={
      'password':{'write_only':True}
    }

  # Validating Password and Confirm Password while Registration
  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    return attrs

  def create(self, validate_data):
    return User.objects.create_user(**validate_data)

class UserLoginSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    model = User
    fields = ['email', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id', 'email', 'username','first_name','last_name','profile_picture']

  def validate_email(self, value):
      user = self.context['request'].user
      if user.email != value:
        raise serializers.ValidationError("Email is not changeable.")
      return value

  # def validate_username(self, value):
  #     user = self.context['request'].user
  #     if user.username != value:
  #       raise serializers.ValidationError("Username is not changeable.")
  #     return value



class UserChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)

    class Meta:
        fields = ['old_password', 'password', 'password2']

    def validate(self, attrs):
        old_password = attrs.get('old_password')
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')

        # Check if old password is correct
        if not check_password(old_password, user.password):
            raise serializers.ValidationError("Current password is incorrect")

        # Check if password and password2 match
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")

        # Set new password
        user.set_password(password)
        user.save()

        return attrs

class SendPasswordResetEmailSerializer(serializers.Serializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    fields = ['email']

  def validate(self, attrs):
    email = attrs.get('email')
    if User.objects.filter(email=email).exists():
      user = User.objects.get(email = email)
      uid = urlsafe_base64_encode(force_bytes(user.id))
      # print('Encoded UID', uid)
      token = PasswordResetTokenGenerator().make_token(user)
      # print('Password Reset Token', token)
      link = 'https://staypure.decorationbd.com/dbd/api/user/reset/'+uid+'/'+token
      # print('Password Reset Link', link)
      user_email = user.email
      userName = user.username
      resetTimeout = "3 minutes"
      user_data = {
         'user_name':userName,
         'reset_link':link,
         'expiration_time':resetTimeout
      }
      # Send EMail
      # body = 'Click Following Link to Reset Your Password '+link
      # data = {
      #   'subject':'Reset Your Password',
      #   'body':body,
      #   'to_email':user.email
      # }
      # Util.send_email(data)
      send_password_reset_link_email(user_email,user_data)
      return attrs
    else:
      raise serializers.ValidationError('You are not a Registered User')

class UserPasswordResetSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password', 'password2']

  def validate(self, attrs):
    try:
      password = attrs.get('password')
      password2 = attrs.get('password2')
      uid = self.context.get('uid')
      token = self.context.get('token')
      if password != password2:
        raise serializers.ValidationError("Password and Confirm Password doesn't match")
      id = smart_str(urlsafe_base64_decode(uid))
      user = User.objects.get(id=id)
      user_email = user.email
      userName = user.username
      user_data = {
         'user_name':userName
      }
      if not PasswordResetTokenGenerator().check_token(user, token):
        raise serializers.ValidationError('Token is not Valid or Expired')
      user.set_password(password)
      user.save()
      password_reset_success_email(user_email,user_data)
      return attrs
    except DjangoUnicodeDecodeError as identifier:
      PasswordResetTokenGenerator().check_token(user, token)
      raise serializers.ValidationError('Token is not Valid or Expired')
    


class SetPasswordSerializer(serializers.Serializer):
  email = serializers.EmailField(write_only=True) 
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['email', 'password', 'password2']

  def validate(self, attrs):
    try:
      email = attrs.get('email')
      password = attrs.get('password')
      password2 = attrs.get('password2')
      uid = self.context.get('uid')
      token = self.context.get('token')
      if password != password2:
        raise serializers.ValidationError("Password and Confirm Password doesn't match")
      id = smart_str(urlsafe_base64_decode(uid))
      user = User.objects.get(id=id,email=email)
      
      if not PasswordResetTokenGenerator().check_token(user, token):
        raise serializers.ValidationError('Token is not Valid or Expired')
      user.set_password(password)
      user.save()
      user_email = user.email
      userName = user.username
      user_data = {
         'user_name':userName
      }
      set_password_success_email(user_email,user_data)
      return attrs
    except DjangoUnicodeDecodeError as identifier:
      PasswordResetTokenGenerator().check_token(user, token)
      raise serializers.ValidationError('Token is not Valid or Expired')


# Google Singin Serializer

class GoogleSignInSerializer(serializers.Serializer):
  access_token = serializers.CharField(min_length=6)

  def validate_access_token(self,access_token):
    google_user_data = Google.validate(access_token)
    try:
      user_id = google_user_data['sub']
    except:
      raise serializers.ValidationError('this token is invalid or has expired')

    if google_user_data['aud'] != settings.GOOGLE_CLIENT_ID:
      raise AuthenticationFailed(
        detail='could not verify user'
      )
    email = google_user_data['email']       
    first_name = google_user_data['given_name']       
    last_name = google_user_data['family_name']
    username = first_name + last_name
    provider='google'
    return register_social_user(provider,email,username)       