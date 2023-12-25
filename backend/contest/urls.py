from django.urls import path

from .views import ContestAPI

urlpatterns = [
    path("contests", ContestAPI.as_view()),
]
