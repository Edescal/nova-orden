# myapp/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import socketio

# Crea la instancia de Socket.IO
sio = socketio.AsyncServer(async_mode="asgi")
sio_app = socketio.ASGIApp(sio)

class MyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Código para manejar la conexión de WebSocket
        self.room_name = "test_room"
        self.room_group_name = f"chat_{self.room_name}"

        # Aceptamos la conexión
        await self.accept()

    async def disconnect(self, close_code):
        # Código para manejar la desconexión de WebSocket
        pass

    async def receive(self, text_data):
        # Código para recibir un mensaje del WebSocket
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Emitir el mensaje a todos los usuarios conectados en el room
        await self.send(text_data=json.dumps({
            "message": message
        }))

# Se puede hacer más lógico, como la interacción con los eventos de Socket.IO si es necesario.
