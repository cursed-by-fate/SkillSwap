import os
from pathlib import Path
import dj_database_url
from datetime import timedelta


# --- Базовая директория проекта ---
BASE_DIR = Path(__file__).resolve().parent.parent

# --- Безопасность ---
SECRET_KEY = "django-insecure-replace-me-in-prod"
DEBUG = True
ALLOWED_HOSTS = ["*"]

# --- Приложения ---
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # сторонние
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "channels",
    "djoser",
    # локальные
    "core",
    "skills",
    "chat",
    "trainingsessions",
    "reviews",
    "usercalendar",
    "notifications",
]

# --- Middleware ---
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # важно до CommonMiddleware
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# --- URLS ---
ROOT_URLCONF = "backend.urls"

# --- Templates ---
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

# --- WSGI & ASGI ---
WSGI_APPLICATION = "backend.wsgi.application"
ASGI_APPLICATION = "backend.asgi.application"  # для WebSocket

# --- База данных ---
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "skillswap",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "db",  # ← важно!
        "PORT": "5432",
    }
}


# --- Пользовательская модель пользователя ---
AUTH_USER_MODEL = "core.User"

# --- Пароли ---
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

# --- Язык и часовой пояс ---
LANGUAGE_CODE = "ru"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- Статика ---
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# --- Channels ---
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis", 6379)],  # если имя сервиса redis в docker-compose
        },
    },
}
# --- CORS ---
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # 👈 точный адрес фронтенда
]

# НЕ ставь '*' если CORS_ALLOW_CREDENTIALS = True
from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = list(default_headers) + [
    "X-Requested-With",
    "Content-Type",
    "Authorization",
]
CORS_ALLOW_CREDENTIALS = True

# --- DRF настройка ---
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

# --- Djoser настройки ---
DJOSER = {
    "SERIALIZERS": {
        "user_create": "core.serializers.UserCreateSerializer",
        "user": "core.serializers.UserSerializer",
        "current_user": "core.serializers.UserSerializer",
    },
    "LOGIN_FIELD": "email",
    "USER_CREATE_PASSWORD_RETYPE": False,
}

SIMPLE_JWT = {
    "LOGIN_FIELD": "email",
    "USER_CREATE_PASSWORD_RETYPE": False,
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}
