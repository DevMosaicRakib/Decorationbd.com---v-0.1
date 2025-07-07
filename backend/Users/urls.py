from django.urls import path
from Users.views import SendPasswordResetEmailView, UserChangePasswordView, UserLoginView, UserProfileView, ProfileUpdateView, UserRegistrationView, UserPasswordResetView,GoogleSignInView,SetPasswordView
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('update-profile/', ProfileUpdateView.as_view()),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    # Set password Url for guest User
    path('set-password/<uid>/<token>/', SetPasswordView.as_view(), name='set-password'),

    # Google SignIn 
    path('google/', GoogleSignInView.as_view())

]