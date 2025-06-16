from django.urls import re_path
from . import consumers

from chat.consumers import ChatConsumer, VideoCallConsumer
from notifications.routing import websocket_urlpatterns as notif_routes

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<chat_id>[^/]+)/$", ChatConsumer.as_asgi()),
    re_path(r"ws/video/(?P<chat_id>[^/]+)/$", VideoCallConsumer.as_asgi()),
] + notif_routes
