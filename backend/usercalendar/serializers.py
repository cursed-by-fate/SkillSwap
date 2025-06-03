from rest_framework import serializers
from usercalendar.models import CalendarEvent
from trainingsessions.serializers import SessionSerializer


class CalendarEventSerializer(serializers.ModelSerializer):
    related_session = SessionSerializer()

    class Meta:
        model = CalendarEvent
        fields = [
            "id",
            "user",
            "title",
            "description",
            "start_time",
            "end_time",
            "event_type",
            "related_session",
        ]
