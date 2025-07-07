from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from Users.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer,GoogleSignInSerializer,SetPasswordSerializer
from django.contrib.auth import authenticate
from Users.renderers import UserRenderer
from rest_framework.permissions import IsAuthenticated
from .models import User
from EmailTemplate.SendEmailAllTypesFuction import send_welcome_email,change_password_success_email,send_create_user_message_for_admin

from .utils import get_tokens_for_user



class UserRegistrationView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    userName = request.data.get('username')
    user_email = request.data.get('email')
    # print('username',userName)
    # print('useremail',user_email)
    user_data = {
      'user_name': userName
    }
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token = get_tokens_for_user(user)
    # Retrieve the admin user(s)
    owners = User.objects.filter(is_admin=True)
    if owners.exists():
        owner = owners.first()  # Get the first admin user
        ownername = owner.username
    else:
        return Response({"error": "No admin user found."}, status=status.HTTP_404_NOT_FOUND)
    user_and_owner_data = {
      'user_name':userName,
      'user_email':user_email,
      'owner_name':ownername
    }
    send_welcome_email(user_email,user_data)
    send_create_user_message_for_admin(user_and_owner_data)
    return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.data.get('email')
    password = serializer.data.get('password')
    user = authenticate(email=email, password=password)
    if user is not None:
      token = get_tokens_for_user(user)
      return Response({'token':token, 'msg':'Login Success'}, status=status.HTTP_200_OK)
    else:
      return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
  

class ProfileUpdateView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  parser_classes = [MultiPartParser, FormParser]

  def patch(self, request):
    user = request.user
    serializer = UserProfileSerializer(user, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({'data':serializer.data,'msg':'Profile updated successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

class UserChangePasswordView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    user = request.user
    user_email = user.email
    userName = user.username
    user_data = {
      'user_name':userName
    }
    serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    change_password_success_email(user_email,user_data)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)
  
class SetPasswordView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = SetPasswordSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Set Successfully'}, status=status.HTTP_200_OK)


# Google SignIn View

class GoogleSignInView(GenericAPIView):
  serializer_class = GoogleSignInSerializer

  def post(self,request):
    serializer = self.serializer_class(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = (serializer.validated_data)['access_token']
    return Response(data,status=status.HTTP_200_OK)

