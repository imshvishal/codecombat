from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token

from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user) -> Token:
        token = super().get_token(user)
        token["username"] = user.username
        token["name"] = f"{user.first_name} {user.last_name}"
        token["email"] = user.email
        token["avatar"] = user.avatar
        token["user_type"] = user.user_type
        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        extra_kwargs = {
            "password": {"write_only": True},
            "is_staff": {"read_only": True},
            "is_superuser": {"read_only": True},
            "is_active": {"read_only": True},
        }
        exclude = (
            "groups",
            "user_permissions",
        )
