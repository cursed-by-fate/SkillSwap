# usercalendar/serializers.py

from rest_framework import serializers
from usercalendar.models import CalendarEvent
from trainingsessions.models import Session  # ✅ Импортируем модель


class CalendarEventSerializer(serializers.ModelSerializer):
    related_session = serializers.PrimaryKeyRelatedField(
        queryset=Session.objects.all(), required=False, allow_null=True
    )

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
        read_only_fields = ["user"]
