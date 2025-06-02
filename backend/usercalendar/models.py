from django.db import models
import uuid
from core.models import User

from trainingsessions.models import Session


class CalendarEvent(models.Model):
    EVENT_TYPE_CHOICES = (
        ("personal", "Personal"),
        ("session", "Session"),
        ("reminder", "Reminder"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    event_type = models.CharField(
        max_length=20, choices=EVENT_TYPE_CHOICES, default="personal"
    )
    related_session = models.ForeignKey(
        Session, on_delete=models.SET_NULL, blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
