from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs
from django.db import close_old_connections
from asgiref.sync import sync_to_async
import logging

logger = logging.getLogger("django")


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            query_string = scope["query_string"].decode()
            token = parse_qs(query_string).get("token", [None])[0]

            if not token:
                scope["user"] = AnonymousUser()
                return await super().__call__(scope, receive, send)

            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token)
            user = await sync_to_async(jwt_auth.get_user)(validated_token)

            close_old_connections()
            scope["user"] = user
        except Exception as e:
            logger.warning(f"WebSocket JWT auth failed: {e}")
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
