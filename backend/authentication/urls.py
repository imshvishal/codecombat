from django.urls import include, path, re_path

from .views import (
    CustomProviderAuthView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CustomTokenVerifyView,
    LogoutView,
)

urlpatterns = [
    re_path(
        r"^o/(?P<provider>\S+)/$",
        CustomProviderAuthView.as_view(),
        name="provider-auth",
    ),
    path("login/", CustomTokenObtainPairView.as_view()),
    path("refresh/", CustomTokenRefreshView.as_view()),
    path("verify/", CustomTokenVerifyView.as_view()),
    path("logout/", LogoutView.as_view()),
]
