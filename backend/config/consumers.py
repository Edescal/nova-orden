# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class CrudNotifier(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'grupo'
        await self.channel_layer.group_add(
            self.group_name, 
            self.channel_name 
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': '¡Conexión establecida correctamente!'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
        )

    async def send_event(self, event):
        await self.send(text_data=json.dumps({
            'event': event['message']
        }))


class OrdenNotifier(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'ordenes'
        await self.channel_layer.group_add(
            self.group_name, 
            self.channel_name 
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': '¡Conexión a órdenes establecida correctamente!'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
        )

    async def send_event(self, event):
        await self.send(text_data=json.dumps({
            'event': event['message']
        }))