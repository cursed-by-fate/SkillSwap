from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import UserViewSet, LogoutView

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = [
    # 🔹 Роуты пользователей, включая кастомный /users/me/
    path("", include(router.urls)),
    # 🔹 JWT авторизация (логин, рефреш токена)
    path("auth/", include("djoser.urls.jwt")),
    # 🔹 Кастомный logout (с аннулированием refresh токена)
    path("logout/", LogoutView.as_view(), name="logout"),
]
