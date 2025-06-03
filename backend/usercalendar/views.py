from rest_framework import viewsets
from usercalendar.models import CalendarEvent
from usercalendar.serializers import CalendarEventSerializer
from rest_framework.permissions import IsAuthenticated


class CalendarEventViewSet(viewsets.ModelViewSet):
    serializer_class = CalendarEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CalendarEvent.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
