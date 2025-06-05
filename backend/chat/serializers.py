from rest_framework import serializers
from chat.models import Chat, Message
from core.serializers import UserSerializer


# 🔹 Новый вспомогательный сериализатор для последнего сообщения
class MessagePreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("id", "content", "created_at")


class ChatSerializer(serializers.ModelSerializer):
    participant1 = UserSerializer()
    participant2 = UserSerializer()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = [
            "id",
            "participant1",
            "participant2",
            "last_message_at",
            "last_message",
            "created_at",
        ]

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by("-created_at").first()
        if last_msg:
            return MessagePreviewSerializer(last_msg).data
        return None


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
            "metadata",
            "is_read",
            "created_at",
        ]
