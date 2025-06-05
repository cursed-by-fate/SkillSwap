# reviews/views.py
from rest_framework import viewsets
from reviews.models import Review
from reviews.serializers import ReviewReadSerializer, ReviewWriteSerializer
from rest_framework.permissions import IsAuthenticated


class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Review.objects.filter(reviewer=user) | Review.objects.filter(
            reviewee=user
        )

    def get_serializer_class(self):
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return ReviewWriteSerializer
        return ReviewReadSerializer

    def perform_create(self, serializer):
        serializer.save()
