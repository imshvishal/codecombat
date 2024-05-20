from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CustomTokenObtainPairView, CustomTokenRefreshView, UserViewSet

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
urlpatterns = router.urls
urlpatterns += [
    path("auth/token/", CustomTokenObtainPairView.as_view()),
    path("auth/token/refresh/", CustomTokenRefreshView.as_view()),
]
