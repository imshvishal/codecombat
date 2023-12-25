from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Contest
from .serializers import ContestSerializer


# Create your views here.
class ContestAPI(APIView):
    def get(self, request: Request):
        contests = Contest.objects.all()
        serializer = ContestSerializer(contests, many=True)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)
