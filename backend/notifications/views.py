from rest_framework import viewsets
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
