import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import sync_to_async
from chat.models import Chat, Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if not user or isinstance(user, AnonymousUser):
            await self.close()
            return

        self.user = user
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.room_group_name = f"chat_{self.chat_id}"

        # Проверка существования чата
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
        message = data.get("message")

        if message:
            # Сохраняем сообщение в базу
            await self.save_message(self.chat_id, self.user, message)

            # Отправляем в комнату
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender": self.user.email,
                },
            )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "sender": event["sender"],
                }
            )
        )

    @sync_to_async
    def save_message(self, chat_id, sender, content):
        chat = Chat.objects.get(id=chat_id)
        Message.objects.create(chat=chat, sender=sender, content=content)

    @sync_to_async
    def chat_exists(self, chat_id):
        return Chat.objects.filter(id=chat_id).exists()
