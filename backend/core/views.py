from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError

from core.models import User
from core.serializers import UserSerializer


class UserViewSet(ReadOnlyModelViewSet):
    """
    Просмотр списка пользователей и деталей пользователя.
    Доступно только авторизованным.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class LogoutView(APIView):
    """
    Выход пользователя: отзыв refresh-токена.
    Требуется передать refresh-token в теле запроса.
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
