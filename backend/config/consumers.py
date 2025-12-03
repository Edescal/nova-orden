# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class MyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'grupo'
        
        await self.channel_layer.group_add(
            self.group_name,  # El nombre del grupo
            self.channel_name  # El canal de esta conexión WebSocket
        )

        # Aceptar la conexión WebSocket
        await self.accept()

        # Enviar un mensaje inmediatamente después de la conexión
        await self.send(text_data=json.dumps({
            'message': '¡Conexión establecida correctamente!'
        }))

    async def disconnect(self, close_code):
        # Esto se llama cuando el WebSocket se cierra
        await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
        )

    # Este método no es necesario si solo vas a enviar un evento sin datos adicionales
    async def receive(self, text_data):
        # Aquí no estamos haciendo nada con los datos recibidos
        pass

    async def send_event(self, event):
        # Enviamos el mensaje al WebSocket
        await self.send(text_data=json.dumps({
            'event': event['message']
        }))