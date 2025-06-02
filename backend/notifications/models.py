from django.db import models
import uuid
from core.models import User


class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = (
        ("message", "Message"),
        ("session_proposal", "Session Proposal"),
        ("session_reminder", "Session Reminder"),
        ("review_request", "Review Request"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    related_entity_id = models.UUIDField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
