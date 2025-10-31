from django.db import transaction
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from users import models
from . import serializers
import json

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = models.Producto.objects.all().order_by("id")
    serializer_class = serializers.ProductoSerializer
    permission_classes = [permissions.AllowAny] 
    parser_classes = [MultiPartParser, FormParser]

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = models.Categoria.objects.all().order_by("id")
    serializer_class = serializers.CategoriaSerializer
    permission_classes = [permissions.AllowAny] 

class OrdenViewSet(viewsets.ModelViewSet):
    queryset = models.Orden.objects.all().order_by("id")
    serializer_class = serializers.OrdenSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request: Request, *args, **kwargs):
        with transaction.atomic():
            try:
                orden = models.Orden.objects.create(
                    numero = 301,
                    negocio = models.Negocio.objects.first(),
                    nombre_cliente = 'Pendejo Estúpido',
                )
                for container in request.data:
                    wrapper = None
                    wrapper = create_product_wrapper(container)
                    orden.productos.add(wrapper)
                return Response(
                    data=self.get_serializer(orden).data, 
                    status= HTTP_201_CREATED
                )
            except Exception as e:
                print(f'Error: {e}')
            finally:
                transaction.set_rollback(True)
        return Response(status=HTTP_400_BAD_REQUEST)

class ProductoWrapperViewSet(viewsets.ModelViewSet):
    queryset = models.ProductoWrapper.objects.all().order_by("id")
    serializer_class = serializers.ProductoWrapperSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request: Request, *args, **kwargs):
        with transaction.atomic():
            try:
                wrapper = create_product_wrapper(request.data)
                return Response(
                    data=self.get_serializer(wrapper).data, 
                    status= HTTP_201_CREATED
                )
            except Exception as e:
                print(f'Error: {e}')
                transaction.set_rollback(True)
            finally:
                transaction.set_rollback(False)
        return Response(status=HTTP_400_BAD_REQUEST)


def create_product_wrapper(data):
    wraper = models.ProductoWrapper.objects.create(
        producto = models.Producto.objects.get(id = data.get('producto', None)),
        anotacion = data.get('anotacion', None),
    )
    for opt_id in data.get('options', {}):
        option = models.Option.objects.get(id = opt_id.get('id', None))
        wraper.opciones.add(option)
    return wraper


