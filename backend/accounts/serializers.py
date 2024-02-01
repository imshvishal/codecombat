from collections import OrderedDict

from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token

from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user) -> Token:
        token = super().get_token(user)
        token["username"] = user.username
        token["name"] = f"{user.first_name} {user.last_name}".strip()
        token["email"] = user.email
        token["is_superuser"] = user.is_superuser
        token["is_staff"] = user.is_staff
        token["user_type"] = user.user_type
        if user.avatar:
            token["avatar"] = user.avatar.url
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

    def validate(self, attrs: OrderedDict):
        password = attrs.get("password")
        if password:
            attrs["password"] = make_password(password)
        return super().validate(attrs)
