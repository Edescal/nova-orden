"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from .consumers import CrudNotifier, OrdenNotifier
from django.urls import re_path 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter({
            # Ruta para WebSocket
            re_path(r'ws/tablero/', CrudNotifier.as_asgi()),  # Esta es la forma correcta
            re_path(r'ws/ordenes/', OrdenNotifier.as_asgi()),  # Esta es la forma correcta
        })
    ),
})