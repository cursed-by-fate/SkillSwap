from django.urls import path, include

from rest_framework.routers import DefaultRouter
from django.urls import path
from core.views import UserViewSet, LogoutView

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = router.urls + [
    path("logout/", LogoutView.as_view(), name="logout"),
]

urlpatterns = [
    path("", include("djoser.urls")),
    path("", include("djoser.urls.jwt")),
]
