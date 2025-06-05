# reviews/serializers.py
from rest_framework import serializers
from reviews.models import Review
from core.serializers import UserSerializer
from trainingsessions.models import Session


class ReviewReadSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer()
    reviewee = UserSerializer()

    class Meta:
        model = Review
        fields = [
            "id",
            "session",
            "reviewer",
            "reviewee",
            "rating",
            "comment",
            "created_at",
        ]


class ReviewWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["session", "rating", "comment"]

    def validate(self, data):
        user = self.context["request"].user
        session = data["session"]

        if session.status != "completed":
            raise serializers.ValidationError(
                "Сессия ещё не завершена — отзыв недоступен."
            )

        if Review.objects.filter(reviewer=user, session=session).exists():
            raise serializers.ValidationError("Вы уже оставили отзыв для этой сессии.")

        # Запретить отзыв, если пользователь не участник сессии
        if user != session.mentor and user != session.student:
            raise serializers.ValidationError("Вы не участник этой сессии.")

        return data

    def create(self, validated_data):
        user = self.context["request"].user
        session = validated_data["session"]
        reviewee = session.student if session.mentor == user else session.mentor

        return Review.objects.create(reviewer=user, reviewee=reviewee, **validated_data)
