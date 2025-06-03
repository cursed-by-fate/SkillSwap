from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import UserViewSet
from skills.views import SkillViewSet, UserSkillViewSet
from trainingsessions.views import SessionViewSet
from chat.views import ChatViewSet, MessageViewSet
from usercalendar.views import CalendarEventViewSet
from reviews.views import ReviewViewSet
from notifications.views import NotificationViewSet

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

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
