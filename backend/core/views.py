from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action

from core.models import User
from core.serializers import UserSerializer
from skills.models import Skill, UserSkill


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # ✅ Теперь возвращаем всех пользователей
        return User.objects.all()

    def get_object(self):
        return self.request.user

    @action(
        detail=False, methods=["get", "patch"], permission_classes=[IsAuthenticated]
    )
    def me(self, request):
        user = request.user

        if request.method == "GET":
            serializer = self.get_serializer(user)
            return Response(serializer.data)

        # PATCH вручную
        data = request.data.copy()
        teach_skills = data.pop("teachSkills", [])
        learn_skills = data.pop("learnSkills", [])

        serializer = self.get_serializer(user, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        self._update_user_skills(user, teach_skills, "teaching")
        self._update_user_skills(user, learn_skills, "learning")

        return Response(self.get_serializer(user).data)

    def _update_user_skills(self, user, skills_data, skill_type):
        UserSkill.objects.filter(user=user, type=skill_type).delete()

        for item in skills_data:
            if not isinstance(item, dict):
                continue

            name = item.get("name")
            level = item.get("level")

            if name:
                skill, _ = Skill.objects.get_or_create(name=name)
                UserSkill.objects.create(
                    user=user,
                    skill=skill,
                    type=skill_type,
                    level=level,
                )


class LogoutView(APIView):
    """
    Выход пользователя: аннулирует refresh-токен.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            raise ValidationError({"detail": "Invalid token"})
