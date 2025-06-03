from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from core.models import User  # Убедись, что используется твоя кастомная модель


class UserSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "bio",
            "location",
            "is_active",
            "date_joined",
        )  # Добавь нужные поля

    def create(self, validated_data):
        user = super().create(validated_data)
        refresh = RefreshToken.for_user(user)
        self.tokens = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return user

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["tokens"] = self.tokens
        return rep
