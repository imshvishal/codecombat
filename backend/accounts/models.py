from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    avatar = models.ImageField(null=True, blank=True, upload_to="avatar")
    bio = models.CharField(max_length=100, null=True, blank=True)
    user_type = models.CharField(
        choices={"DEV": "Developer", "ORG": "Organization"},
        default="DEV",
        max_length=20,
    )
