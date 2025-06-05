from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from core.models import User


# ✅ Для регистрации пользователя
class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = (
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "profile_image_url",
            "bio",
            "location",
            "time_zone",
        )

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
        rep["tokens"] = getattr(self, "tokens", None)
        return rep


# ✅ Для получения информации о текущем пользователе
class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "profile_image_url",
            "bio",
            "location",
            "time_zone",
            "is_active",
            "is_staff",
            "created_at",
            "updated_at",
        )
