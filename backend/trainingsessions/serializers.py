from rest_framework import serializers
from trainingsessions.models import Session
from core.serializers import UserSerializer
from skills.serializers import SkillSerializer
from skills.models import Skill


class SessionSerializer(serializers.ModelSerializer):
    mentor = UserSerializer(read_only=True)
    student = UserSerializer(read_only=True)
    skill = SkillSerializer(read_only=True)  # для чтения — вложенный объект

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


class SessionWriteSerializer(serializers.ModelSerializer):
    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all())

    class Meta:
        model = Session
        fields = [
            "title",
            "description",
            "scheduled_at",
            "duration",
            "skill",
            "mentor",
            "student",
            "status",
            "meeting_link",
        ]
