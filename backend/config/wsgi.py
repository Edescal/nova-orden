"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os, socketio

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()

# Crear una instancia de Socket.IO
sio = socketio.Server()

# Conectar Socket.IO al WSGI
application = socketio.WSGIApp(sio, application)

# Eventos de WebSocket
@sio.event
def connect(sid, environ):
    print(f"Conexión de cliente {sid}")

@sio.event
def message(sid, data):
    print(f"Mensaje recibido de {sid}: {data}")
    sio.send(sid, "Mensaje recibido")

@sio.event
def disconnect(sid):
    print(f"Cliente {sid} desconectado")