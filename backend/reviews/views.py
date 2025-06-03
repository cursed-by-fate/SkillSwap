from rest_framework import viewsets
from reviews.models import Review
from reviews.serializers import ReviewSerializer
from rest_framework.permissions import IsAuthenticated


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Review.objects.filter(reviewer=user) | Review.objects.filter(
            reviewee=user
        )

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
