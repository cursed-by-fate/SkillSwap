# trainingsessions/serializers.py

from rest_framework import serializers
from trainingsessions.models import Session
from core.serializers import UserSerializer
from skills.serializers import SkillSerializer
from skills.models import Skill
from reviews.serializers import ReviewReadSerializer  # Импорт отзывов


class SessionSerializer(serializers.ModelSerializer):
    mentor = UserSerializer(read_only=True)
    student = UserSerializer(read_only=True)
    skill = SkillSerializer(read_only=True)
    reviews = ReviewReadSerializer(many=True, read_only=True)  # <-- Добавлено

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
            "reviews",  # <-- Добавлено в список
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
            "status",
            "meeting_link",
            "mentor",
            "student",
        ]
        read_only_fields = ["mentor", "student"]
