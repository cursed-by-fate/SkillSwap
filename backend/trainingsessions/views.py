from rest_framework import viewsets
from trainingsessions.models import Session
from trainingsessions.serializers import SessionSerializer


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
