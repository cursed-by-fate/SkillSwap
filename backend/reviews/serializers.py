from rest_framework import serializers
from reviews.models import Review
from core.serializers import UserSerializer
from trainingsessions.models import Session


class ReviewSerializer(serializers.ModelSerializer):
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
