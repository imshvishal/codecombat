from datetime import timedelta
from os import getenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

import environ

environ.Env.read_env(BASE_DIR / ".env", overwrite=True)

SECRET_KEY = getenv("DJANGO_SECRET_KEY")
DEBUG = getenv("DEBUG", "True") == "True"

ALLOWED_HOSTS = [
    "3.110.210.240",
    "127.0.0.1",
    "localhost",
    "subtle-starling-especially.ngrok-free.app",
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://subtle-starling-especially.ngrok-free.app",
    "http://3.110.210.240:6969",
]
CORS_ALLOW_CREDENTIALS = True

DOMAIN = getenv("FRONTEND_DOMAIN", "localhost:3000")

SITE_NAME = "CodeCombat"

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "djoser",
    "authentication",
    "accounts",
    "contests",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

USE_CLOUDINARY_STORAGE = not DEBUG

if USE_CLOUDINARY_STORAGE:
    STORAGES = {
        "default": {
            "BACKEND": "codecombat.storages.CloudinaryFileStorage",
        },
        "staticfiles": {
            "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
        },
    }

ROOT_URLCONF = "codecombat.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "codecombat.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": (
        {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
        if DEBUG
        else {
            "ENGINE": "django.db.backends.mysql",
            "NAME": getenv("DB_NAME"),
            "USER": getenv("DB_USER"),
            "PASSWORD": getenv("DB_PASSWORD"),
            "HOST": getenv("DB_HOST"),
            "PORT": getenv("DB_PORT"),
        }
    )
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


AUTH_USER_MODEL = "accounts.User"

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "authentication.auth.CustomJWTAuthentication",
    ],
}

DJOSER = {
    "USER_ID_FIELD": "username",
    "USER_CREATE_PASSWORD_RETYPE": True,
    "HIDE_USERS": False,
    "SET_PASSWORD_RETYPE": True,
    "PASSWORD_RESET_CONFIRM_RETYPE": True,
    "PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND": True,
    "PASSWORD_CHANGED_EMAIL_CONFIRMATION": True,
    "SEND_CONFIRMATION_EMAIL": True,
    "SEND_ACTIVATION_EMAIL": True,
    "USERNAME_RESET_SHOW_EMAIL_NOT_FOUND": True,
    "USERNAME_CHANGED_EMAIL_CONFIRMATION": True,
    "ACTIVATION_URL": "auth/user-activation/{uid}/{token}",
    "PASSWORD_RESET_CONFIRM_URL": "auth/password-reset/{uid}/{token}",
    "USERNAME_RESET_CONFIRM_URL": "auth/username-reset/{uid}/{token}",
    "SERIALIZERS": {
        "user_create": "accounts.serializers.UserSerializer",
        "user": "accounts.serializers.UserSerializer",
        "current_user": "accounts.serializers.UserSerializer",
        "user_create_password_retype": "accounts.serializers.UserSerializer",
    },
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "TOKEN_OBTAIN_SERIALIZER": "authentication.serializers.CustomTokenObtainPairSerializer",
    "UPDATE_LAST_LOGIN": True,
}

AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
AUTH_COOKIE_SECURE = getenv("AUTH_COOKIE_SECURE", "True") == "True"
AUTH_COOKIE_HTTP_ONLY = True
AUTH_COOKIE_SAMESITE = getenv("AUTH_COOKIE_SAMESITE", "None")
# AUTH_COOKIE_DOMAIN = getenv("AUTH_COOKIE_DOMAIN")
EMAIL_HOST = getenv("EMAIL_HOST")
EMAIL_PORT = getenv("EMAIL_PORT")
EMAIL_USE_TLS = True
EMAIL_HOST_USER = getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = getenv("EMAIL_HOST_PASSWORD")

STATIC_URL = "static/"
MEDIA_ROOT = "codecombat" if USE_CLOUDINARY_STORAGE else "media"
MEDIA_URL = "media/"
