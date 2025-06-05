from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import UserViewSet, LogoutView

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls)),  # ✅ твой кастомный UserViewSet
    path("logout/", LogoutView.as_view(), name="logout"),
    path("auth/", include("djoser.urls")),  # ✅ djoser
    path("auth/", include("djoser.urls.jwt")),  # ✅ JWT login/logout
]
