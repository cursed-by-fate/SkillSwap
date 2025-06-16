import json
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.models import User
from core.serializers import UserSerializer
from skills.models import Skill, UserSkill


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return User.objects.all()

    @action(
        detail=False, methods=["get", "patch"], permission_classes=[IsAuthenticated]
    )
    def me(self, request):
        user = request.user

        if request.method == "GET":
            serializer = self.get_serializer(user, context={"request": request})
            return Response(serializer.data)

        # 🎯 PATCH-запрос (обновление профиля)
        teach_skills = request.data.get("teachSkills", [])
        learn_skills = request.data.get("learnSkills", [])

        # 🔍 Поддержка строки JSON (на случай, если frontend отправляет строку)
        if isinstance(teach_skills, str):
            try:
                teach_skills = json.loads(teach_skills)
            except json.JSONDecodeError:
                teach_skills = []
        if isinstance(learn_skills, str):
            try:
                learn_skills = json.loads(learn_skills)
            except json.JSONDecodeError:
                learn_skills = []

        # 🔧 Обновляем пользователя
        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # 🔄 Обновляем навыки
        self._update_user_skills(user, teach_skills, "teaching")
        self._update_user_skills(user, learn_skills, "learning")

        return Response(self.get_serializer(user, context={"request": request}).data)

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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            raise ValidationError({"detail": "Invalid token"})
