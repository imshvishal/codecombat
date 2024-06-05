from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ContestViewSet, QuestionViewSet, SubmissionViewSet

route = DefaultRouter()
route.register(r"contests", ContestViewSet, "contest")
route.register(r"submissions", SubmissionViewSet, "submission")
route.register(r"questions", QuestionViewSet, "question")
urlpatterns = route.urls
urlpatterns += []
