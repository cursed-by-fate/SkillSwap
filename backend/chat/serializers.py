from rest_framework import serializers
from chat.models import Chat, Message
from core.serializers import UserSerializer


class ChatSerializer(serializers.ModelSerializer):
    participant1 = UserSerializer(read_only=True)
    participant2 = UserSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ["id", "participant1", "participant2", "last_message_at"]


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "chat",
            "sender",
            "content",
            "message_type",
            "is_read",
            "metadata",
            "created_at",
        ]
        read_only_fields = ["id", "sender", "created_at"]
