from django.urls import path
from .views import CheckOutPopupMessageView, HomePageView, NewsPopUpView,PartialCodMessageView
urlpatterns = [
    path('home/', HomePageView.as_view()),
    path('newspopup/', NewsPopUpView.as_view()),
    path('partialmessage/', PartialCodMessageView.as_view()),
    path('checkoutpopupmessage/', CheckOutPopupMessageView.as_view()),
]