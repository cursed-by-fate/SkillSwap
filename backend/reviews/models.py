from django.db import models
import uuid
from core.models import User

from trainingsessions.models import Session


class Review(models.Model):
    class Meta:
        unique_together = (
            "reviewer",
            "session",
        )  # ❗ Один отзыв от одного пользователя на одну сессию

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        Session, on_delete=models.CASCADE, related_name="reviews"
    )
    reviewer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reviews_given"
    )
    reviewee = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reviews_received"
    )
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
