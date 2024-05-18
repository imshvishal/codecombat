from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import UserViewSet

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
urlpatterns = router.urls
urlpatterns += [
    path("auth/token/", TokenObtainPairView.as_view()),
    path("auth/token/refresh/", TokenRefreshView.as_view()),
]
