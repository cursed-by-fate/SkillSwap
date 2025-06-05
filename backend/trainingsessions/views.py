from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status as drf_status
from core.models import User
from trainingsessions.models import Session
from trainingsessions.serializers import SessionSerializer, SessionWriteSerializer


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

    def perform_create(self, serializer):
        user = self.request.user

        mentor_id = self.request.data.get("mentor")
        if not mentor_id:
            return Response(
                {"detail": "Поле 'mentor' обязательно."},
                status=drf_status.HTTP_400_BAD_REQUEST,
            )

        try:
            mentor = User.objects.get(id=mentor_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Пользователь с таким ID не найден (mentor)."},
                status=drf_status.HTTP_400_BAD_REQUEST,
            )

        # Текущий пользователь становится student
        serializer.save(student=user, mentor=mentor)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        # Только участники могут изменять
        if user != instance.mentor and user != instance.student:
            return Response(
                {"detail": "Вы не участник этой сессии."},
                status=drf_status.HTTP_403_FORBIDDEN,
            )

        # Разрешены только поля status и meeting_link
        allowed_fields = {"status", "meeting_link"}
        data = {
            field: value
            for field, value in request.data.items()
            if field in allowed_fields
        }

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
