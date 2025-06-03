from rest_framework import serializers
from trainingsessions.models import Session
from core.serializers import UserSerializer
from skills.serializers import SkillSerializer


class SessionSerializer(serializers.ModelSerializer):
    mentor = UserSerializer(read_only=True)
    student = UserSerializer(read_only=True)
    skill = SkillSerializer()

    class Meta:
        model = Session
        fields = [
            "id",
            "mentor",
            "student",
            "skill",
            "title",
            "description",
            "scheduled_at",
            "duration",
            "status",
            "meeting_link",
        ]
