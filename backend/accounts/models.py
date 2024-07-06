from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import RegexValidator
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
    username = models.CharField(
        max_length=50,
        unique=True,
        validators=[
            RegexValidator(
                "^[a-zA-Z0-9_]{3,}$",
                message="Username must be alphanumeric and contain at least 3 characters",
            )
        ],
    )
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=15, blank=True)
    avatar = models.ImageField(null=True, blank=True, upload_to="avatar")
    bio = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=False)
    user_type = models.CharField(
        choices={"DEV": "Developer", "ORG": "Organizer"},
        max_length=20,
        default="DEV",
    )

    def __str__(self):
        return self.username
