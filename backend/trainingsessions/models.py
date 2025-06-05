from django.db import models
import uuid
from core.models import User
from skills.models import Skill


class Session(models.Model):
    STATUS_CHOICES = (
        ("proposed", "Предложена"),
        ("waiting", "Ожидание"),  # ← добавить это
        ("confirmed", "Подтверждена"),
        ("completed", "Завершена"),
        ("cancelled", "Отменена"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mentor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sessions_as_mentor"
    )
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sessions_as_student"
    )
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    scheduled_at = models.DateTimeField(blank=True, null=True)
    duration = models.PositiveIntegerField(blank=True, null=True)  # in minutes
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="proposed")
    meeting_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
