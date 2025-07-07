from django.shortcuts import render
from .models import CheckOutPopupMessage, HomePage, NewsPopUp,PartialCodMessage
from .serializer import CheckOutPopupMessageSerializer, HomePageSerializer, NewsPopUpSerializer,PartialCodMessageSerializer
from rest_framework.views import APIView 
from rest_framework.response import Response
# Create your views here.

class HomePageView(APIView):
    def get(self,request):
        homepagedata = HomePage.objects.all()
        serializer = HomePageSerializer(homepagedata,many=True)
        return Response(serializer.data)

class NewsPopUpView(APIView):
    def get(self,request):
        newsdata = NewsPopUp.objects.all()
        serializer = NewsPopUpSerializer(newsdata,many=True)
        return Response(serializer.data)
        
class PartialCodMessageView(APIView):
    def get(self,request):
        partialmessagedata = PartialCodMessage.objects.all()
        serializer = PartialCodMessageSerializer(partialmessagedata,many=True)
        return Response(serializer.data)
    
class CheckOutPopupMessageView(APIView):
    def get(self,request):
        partialmessagedata = CheckOutPopupMessage.objects.all()
        serializer = CheckOutPopupMessageSerializer(partialmessagedata,many=True)
        return Response(serializer.data)        