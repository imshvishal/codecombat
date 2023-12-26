from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ContestViewSet

route = DefaultRouter()
route.register(r"contests", ContestViewSet, "contest")
urlpatterns = route.urls
urlpatterns += []
