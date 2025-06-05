from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from django.utils import timezone
from django.db.models import Q

from chat.models import Chat, Message
from chat.serializers import ChatSerializer, MessageSerializer
from core.models import User


class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(participant1=user) | Chat.objects.filter(
            participant2=user
        )

    def create(self, request, *args, **kwargs):
        user = request.user
        partner_id = request.data.get("partner_id")

        if not partner_id:
            return Response({"detail": "partner_id обязателен"}, status=400)

        if str(user.id) == str(partner_id):
            return Response({"detail": "Нельзя создать чат с самим собой"}, status=400)

        try:
            partner = User.objects.get(id=partner_id)
        except User.DoesNotExist:
            return Response({"detail": "Пользователь не найден"}, status=404)

        chat = Chat.objects.filter(
            Q(participant1=user, participant2=partner)
            | Q(participant1=partner, participant2=user)
        ).first()

        if chat:
            serializer = self.get_serializer(chat)
            return Response(serializer.data)

        chat = Chat.objects.create(participant1=user, participant2=partner)
        serializer = self.get_serializer(chat)
        return Response(serializer.data, status=201)

    @action(detail=True, methods=["get"])
    def messages(self, request, pk=None):
        chat = self.get_object()
        messages = Message.objects.filter(chat=chat).order_by("created_at")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            chat__participant1=self.request.user
        ) | Message.objects.filter(chat__participant2=self.request.user)

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        Chat.objects.filter(id=message.chat.id).update(last_message_at=timezone.now())
