from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from core.views import UserViewSet, LogoutView
from skills.views import SkillViewSet, UserSkillViewSet
from trainingsessions.views import SessionViewSet
from chat.views import ChatViewSet, MessageViewSet
from usercalendar.views import CalendarEventViewSet
from reviews.views import ReviewViewSet
from notifications.views import NotificationViewSet

# 📌 Все viewsets
router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
router.register(r"skills", SkillViewSet, basename="skill")
router.register(r"user-skills", UserSkillViewSet, basename="user-skill")
router.register(r"sessions", SessionViewSet, basename="session")
router.register(r"chats", ChatViewSet, basename="chat")
router.register(r"messages", MessageViewSet, basename="message")
router.register(r"calendar-events", CalendarEventViewSet, basename="calendar-event")
router.register(r"reviews", ReviewViewSet, basename="review")
router.register(r"notifications", NotificationViewSet, basename="notification")

# 📌 Основные маршруты API
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.jwt")),
    path("api/auth/jwt/logout/", LogoutView.as_view(), name="jwt-logout"),
    path("api/", include(router.urls)),
]

# 📌 Для отдачи медиафайлов (например, аватаров)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
