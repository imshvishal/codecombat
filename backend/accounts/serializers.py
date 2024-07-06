from collections import OrderedDict
from dataclasses import fields
from os import getenv

from django.conf import settings
from django.contrib.auth.hashers import make_password
from djoser.serializers import UserCreatePasswordRetypeSerializer
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        extra_kwargs = {
            "password": {"write_only": True},
            "is_staff": {"read_only": True},
            "is_superuser": {"read_only": True},
            "is_active": {"read_only": True},
            "mobile": {"write_only": True},
        }
        exclude = (
            "groups",
            "user_permissions",
        )

    def get_avatar(self, obj):
        if obj and obj.is_authenticated and obj.avatar:
            url = obj.avatar.url
            return (
                getenv("BACKEND_DOMAIN") + url
                if url.startswith("/")
                else obj.avatar.url
            )
        return None

    def validate(self, attrs: OrderedDict):
        password = attrs.get("password")
        if password:
            attrs["password"] = make_password(password)
        return super().validate(attrs)
