from rest_framework.viewsets import ReadOnlyModelViewSet
from core.models import User
from core.serializers import UserSerializer


class UserViewSet(ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
