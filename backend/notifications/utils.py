from notifications.models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def create_notification(user, message, type="message", metadata=None):
    notification = Notification.objects.create(
        user=user,
        title=message,
        type=type,
        content=metadata.get("content") if metadata else "",
        related_entity_id=metadata.get("chat_id") if metadata else None,
    )

    # WebSocket-уведомление
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notifications_user_{user.id}",
        {
            "type": "send_notification",
            "notification": {
                "id": str(notification.id),
                "title": notification.title,
                "type": notification.type,
                "created_at": notification.created_at.isoformat(),
            },
        },
    )
