from django.contrib import admin
from .models import Chat, Message


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ("id", "participant1", "participant2", "last_message_at")
    search_fields = ("participant1__email", "participant2__email")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "chat",
        "sender",
        "content",
        "message_type",
        "is_read",
        "created_at",
    )
    list_filter = ("message_type", "is_read")
    search_fields = ("sender__email", "chat__id")
