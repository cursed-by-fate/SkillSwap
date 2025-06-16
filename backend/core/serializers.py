from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from core.models import User
from skills.models import UserSkill
from skills.serializers import SkillSerializer
from reviews.models import Review


# 🔐 Для регистрации пользователя
class UserCreateSerializer(BaseUserCreateSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = (
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "profile_image",  # 👈 file upload
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


class UserSkillNestedSerializer(serializers.ModelSerializer):
    skill = SkillSerializer()

    class Meta:
        model = UserSkill
        fields = ["id", "skill", "level"]


class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()

    class Meta:
        model = Review
        fields = ["id", "text", "author"]


class UserSerializer(serializers.ModelSerializer):
    teachSkills = serializers.SerializerMethodField()
    learnSkills = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "teachSkills",
            "learnSkills",
            "reviews",
            "profile_image_url",
        ]

    def get_teachSkills(self, obj):
        return UserSkillNestedSerializer(
            obj.user_skills.filter(type="teaching"), many=True
        ).data

    def get_learnSkills(self, obj):
        return UserSkillNestedSerializer(
            obj.user_skills.filter(type="learning"), many=True
        ).data

    def get_reviews(self, obj):
        return ReviewSerializer(obj.reviews_received.all(), many=True).data

    def get_profile_image_url(self, obj):
        request = self.context.get("request")
        if request and obj.profile_image and hasattr(obj.profile_image, "url"):
            return request.build_absolute_uri(obj.profile_image.url)
        return None
