from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Producto 
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=Producto)
def notify_model_save(sender, instance, created, **kwargs):
    """
    Esta función se ejecuta cada vez que un modelo MiModelo es guardado.
    Enviamos un mensaje a través de WebSocket.
    """
    channel_layer = get_channel_layer()

    # Asegúrate de que el canal es válido, y si lo es, envía el mensaje.
    if created:
        message = f"Nuevo modelo guardado: {instance}"
        async_to_sync(channel_layer.group_send)(
            "chat_test_room",  # Nombre del grupo de WebSocket
            {
                "type": "chat_message",
                "message": message,
            }
        )
