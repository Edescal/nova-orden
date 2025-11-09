from django.db import transaction
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_406_NOT_ACCEPTABLE
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from users import models
from . import serializers
import json

class NegocioViewSet(viewsets.ModelViewSet):
    queryset = models.Negocio.objects.all().order_by("uuid")
    serializer_class = serializers.NegocioSerializer
    permission_classes = [permissions.AllowAny] 
    parser_classes = [MultiPartParser, FormParser]

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
                if not request.data.get('productos'):
                    raise Exception('No hay productos en la orden')
                
                orden_model = models.Orden.objects.create(
                    negocio = models.Negocio.objects.first(),
                    nombre_cliente = request.data['nombre_cliente'],
                )
                for wrapper in request.data['productos']:
                    requestedProduct = wrapper['producto']
                    
                    producto = models.Producto.objects.get(id=requestedProduct['id'])
                    for prop, value in requestedProduct.items():
                        if not getattr(producto, prop) in ['nombre', 'descripcion', 'precio']:
                            continue
                        
                        if getattr(producto, prop):
                            print(f'{prop} = {getattr(producto, prop)} / {value}')

                        if not str(getattr(producto, prop)) == str(value):
                            print(f'{prop} = {value}')
                            raise ValueError('El producto enviado no coincide con la base de datos')
                        

                    wrapper_model = models.ProductoWrapper.objects.create(
                        producto = producto,
                        cantidad = wrapper['cantidad'],
                        anotacion = wrapper['anotacion'],
                    )

                    for opcion in wrapper['opciones']:
                        opcion_model = models.Option.objects.get(id = opcion['id'])
                        wrapper_model.opciones.add(opcion_model)

                    wrapper_model.clean()
                    orden_model.pedidos.add(wrapper_model)

                print(orden_model)
                orden_model.clean()

                return Response(
                    data=self.get_serializer(orden_model).data, 
                    status= HTTP_201_CREATED
                )
            except Exception as e:
                print(f'[API Error]: {e}')
                return Response(status=HTTP_406_NOT_ACCEPTABLE, data={'error': f'{e}'})
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
                opciones = []
                wrapper = models.ProductoWrapper(
                    producto = models.Producto.objects.get(id = request.data.get('producto', None)),
                    cantidad = request.data.get('cantidad', None),
                    anotacion = request.data.get('anotacion', None),
                )
                for opt_id in request.data.get('options', {}):
                    option = models.Option.objects.get(id = opt_id.get('id', None))
                    opciones.append(serializers.OptionSerializer(option).data)
                serialized_wrapper = self.get_serializer(wrapper).data
                serialized_wrapper['opciones'] = opciones
                return Response(
                    data=serialized_wrapper,
                    status= HTTP_201_CREATED
                )
            except Exception as e:
                print(f'Error: {e}')
                transaction.set_rollback(True)
            finally:
                transaction.set_rollback(True)
        return Response(status=HTTP_400_BAD_REQUEST)


def create_product_wrapper(data):
    wrapper = models.ProductoWrapper.objects.create(
        producto = models.Producto.objects.get(id = data.get('producto', None)),
        cantidad = data.get('cantidad', None),
        anotacion = data.get('anotacion', None),
    )
    for opt_id in data.get('options', {}):
        option = models.Option.objects.get(id = opt_id.get('id', None))
        wrapper.opciones.add(option)
    return wrapper


