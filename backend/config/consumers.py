# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class MyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Aceptar la conexión WebSocket
        await self.accept()

        # Enviar un mensaje inmediatamente después de la conexión
        await self.send(text_data=json.dumps({
            'message': '¡Conexión establecida correctamente!'
        }))

    async def disconnect(self, close_code):
        # Esto se llama cuando el WebSocket se cierra
        pass

    # Este método no es necesario si solo vas a enviar un evento sin datos adicionales
    async def receive(self, text_data):
        # Aquí no estamos haciendo nada con los datos recibidos
        pass