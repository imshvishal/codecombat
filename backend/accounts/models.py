from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    avatar = models.URLField(null=True, blank=True)
    bio = models.CharField(default="", max_length=100, null=True)
    user_type = models.CharField(
        choices={"DEV": "Developer", "ORG": "Organization"},
        default="DEV",
        max_length=20,
    )
