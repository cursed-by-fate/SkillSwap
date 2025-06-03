from django.db import models
import uuid
from core.models import User


class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participant1 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="chats_as_user1"
    )
    participant2 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="chats_as_user2"
    )
    last_message_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat between {self.participant1.email} and {self.participant2.email}"


class Message(models.Model):
    MESSAGE_TYPE_CHOICES = (
        ("text", "Text"),
        ("file", "File"),
        ("session_proposal", "Session Proposal"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )
    content = models.TextField()
    message_type = models.CharField(
        max_length=30, choices=MESSAGE_TYPE_CHOICES, default="text"
    )
    metadata = models.JSONField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.email}: {self.content[:30]}..."
