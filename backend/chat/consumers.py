# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import sync_to_async
from chat.models import Chat, Message
from notifications.utils import create_notification


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if not user or isinstance(user, AnonymousUser):
            await self.close()
            return

        self.user = user
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.room_group_name = f"chat_{self.chat_id}"

        chat_exists = await self.chat_exists(self.chat_id)
        if not chat_exists:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        # Обработка обычного сообщения
        message = data.get("message")
        if message:
            await self.save_message(self.chat_id, self.user, message)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender": self.user.email,
                },
            )
            return

        # Обработка начала видеозвонка
        if data.get("call") == "start":
            chat = await self.get_chat(self.chat_id)
            receiver = (
                chat.participant2
                if self.user == chat.participant1
                else chat.participant1
            )

            # WebSocket уведомление
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "incoming_call",
                    "from_user_id": self.user.id,
                    "from_user_name": f"{self.user.first_name} {self.user.last_name}",
                },
            )

            # Уведомление в базу
            await self.create_call_notification(receiver, chat.id)

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "chat_message",
                    "message": event["message"],
                    "sender": event["sender"],
                }
            )
        )

    async def incoming_call(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "incoming_call",
                    "from_user_id": event["from_user_id"],
                    "from_user_name": event["from_user_name"],
                }
            )
        )

    @sync_to_async
    def save_message(self, chat_id, sender, content):
        chat = Chat.objects.get(id=chat_id)
        Message.objects.create(chat=chat, sender=sender, content=content)

        recipient = (
            chat.participant2 if sender == chat.participant1 else chat.participant1
        )
        create_notification(
            recipient,
            message=f"{sender.first_name} отправил вам сообщение",
            type="new_message",
            metadata={"chat_id": chat.id},
        )

    @sync_to_async
    def create_call_notification(self, recipient, chat_id):
        create_notification(
            recipient,
            message=f"Входящий видеозвонок от {self.user.first_name}",
            type="incoming_call",
            metadata={"chat_id": chat_id},
        )

    @sync_to_async
    def get_chat(self, chat_id):
        return Chat.objects.get(id=chat_id)

    @sync_to_async
    def chat_exists(self, chat_id):
        return Chat.objects.filter(id=chat_id).exists()


class VideoCallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if not user or isinstance(user, AnonymousUser):
            await self.close()
            return

        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.room_group_name = f"video_{self.chat_id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "signal_message",
                "message": data,
                "sender_channel": self.channel_name,
            },
        )

    async def signal_message(self, event):
        if self.channel_name != event["sender_channel"]:
            await self.send(text_data=json.dumps(event["message"]))
