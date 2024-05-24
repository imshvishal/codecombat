from django.contrib.auth.models import AbstractUser, User, UserManager
from django.db import models


class UserAccountManager(UserManager):
    def create_superuser(self, username, email, password=None, **kwargs):
        user = self.create_user(username, email, password=password, **kwargs)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save(using=self._db)
        return user


class User(AbstractUser):
    objects = UserAccountManager()
    mobile = models.CharField(max_length=15, blank=True)
    avatar = models.ImageField(null=True, blank=True, upload_to="avatar")
    bio = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=False)
    user_type = models.CharField(
        choices={"DEV": "Developer", "ORG": "Organization"},
        default="DEV",
        max_length=20,
    )

    def __str__(self):
        return self.username
