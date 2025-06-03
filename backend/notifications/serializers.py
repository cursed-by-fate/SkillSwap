from rest_framework import serializers
from notifications.models import Notification
from core.serializers import UserSerializer


class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "title",
            "body",
            "is_read",
            "notification_type",
            "created_at",
        ]
