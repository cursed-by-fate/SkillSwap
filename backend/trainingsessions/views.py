from rest_framework import viewsets
from trainingsessions.models import Session
from trainingsessions.serializers import SessionSerializer, SessionWriteSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q


class SessionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Session.objects.filter(Q(mentor=user) | Q(student=user)).order_by(
            "-scheduled_at"
        )

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return SessionWriteSerializer
        return SessionSerializer
