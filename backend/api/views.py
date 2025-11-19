from django.db import transaction
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_406_NOT_ACCEPTABLE, HTTP_205_RESET_CONTENT
from rest_framework import viewsets, permissions, authentication
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
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
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            try:
                producto = models.Producto.objects.create(
                    nombre= request.data.get('nombre', ''),
                    descripcion= request.data.get('descripcion', ''),
                    precio= request.data.get('precio', 0),
                    categoria_id= request.data.get('categoria', None),
                    negocio_id= request.data.get('negocio', None),
                    visible= bool(request.data.get('visible', True)),
                    imagen= request.FILES.get('imagen', None),
                )

                option_groups_data = request.POST.get('option_groups', [])                
                if option_groups_data:
                    for group_data in json.loads(option_groups_data):
                        # crear el grupo
                        descripcion = group_data.get('descripcion', '')
                        option_group = models.OptionGroup.objects.create(
                            producto= producto,
                            descripcion= descripcion,
                        )

                        for option_data in group_data.get('options', []):
                            # crear las opciones
                            option = models.Option.objects.create(
                                descripcion = option_data.get('descripcion', ''),
                                precio = option_data.get('precio', 0),
                                group = option_group,
                            )
                            option_group.opciones.add(option)

                        producto.grupos.add(option_group)

                serialized_product = self.get_serializer(producto).data
                return Response(
                    data=serialized_product,
                    status= HTTP_201_CREATED
                )
            except Exception as e:
                transaction.set_rollback(True)
                print(f'[API Error]: {e}')
        return Response('No se creó el producto')

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            try:
                producto = self.get_object() #este es el real
                updated_product, _ = models.Producto.objects.update_or_create(
                    id=producto.id,
                    defaults={
                        'nombre': request.data.get('nombre', producto.nombre),
                        'descripcion': request.data.get('descripcion', producto.descripcion),
                        'precio': float(request.data.get('precio', producto.precio)),
                        'categoria_id': int(request.data.get('categoria', producto.categoria.id)),
                        'negocio_id': request.data.get('negocio', producto.negocio.uuid),
                        'visible': request.data.get('visible', producto.visible) in [True, 'true', 'True', '1', 1],
                        'imagen': request.FILES.get('imagen', producto.imagen),
                    }
                )

                # ir guardando los ids de grupos actualizados para borrar los eliminados
                retrieved_ids = []
                option_groups_data = json.loads(request.data.get('option_groups', []))
                for grupo in option_groups_data:
                    option_group, _ = models.OptionGroup.objects.update_or_create(
                        id=grupo.get('id', None),
                        defaults={
                            'descripcion': grupo.get('descripcion', ''),
                            'producto': updated_product,
                        }
                    )
                    retrieved_ids.append(option_group.id)

                    # guardar los ids de opciones para borrar las eliminadas
                    opciones_ids = []
                    for opcion in grupo.get('opciones', []):
                        id = opcion.get('id', None)
                        descripcion = opcion.get('descripcion', '')
                        precio = float(opcion.get('precio', 0))
                        opcion, _ = models.Option.objects.update_or_create(
                            id=int(id) if id else None,
                            defaults={
                                'descripcion': descripcion,
                                'precio': precio,
                                'group': option_group,
                            }
                        )
                        opciones_ids.append(opcion.id)

                    opciones_eliminadas = option_group.opciones.exclude(id__in=opciones_ids)
                    for opcion in opciones_eliminadas:
                        opcion.delete()

                updated_product.clean()
                
                grupos_eliminados = producto.grupos.exclude(id__in=retrieved_ids)
                for grupo in grupos_eliminados:
                    grupo.delete()

                data = self.get_serializer(updated_product).data
                transaction.set_rollback(False)
                return Response(
                    data=data,
                    status= HTTP_201_CREATED
                )
            except Exception as e:
                transaction.set_rollback(True)
                print(f'[API Error]: {e}')

        return Response('No se pudo actualizar el producto')
        

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
            # finally:
            #     transaction.set_rollback(True)

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


@csrf_exempt
def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


@csrf_exempt
@ensure_csrf_cookie
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    if username is None or password is None:
        return JsonResponse({'message': 'Please provide username and password.'}, status=400)

    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({'message': 'Invalid credentials.'}, status=400)

    login(request, user)
    return JsonResponse({'message': 'Successfully logged in.'}, status=200)


@api_view(['POST'])
def register_view(request):
    data = json.loads(request.body)
    email = data.get('email', None)
    nombre = data.get('nombre', None)
    apellidos = data.get('apellidos', None)
    username = data.get('username', None)
    password = data.get('password', None)
    confirm_password = data.get('confirmPassword', '')

    if username is None or password is None:
        return Response({'message': 'Please provide username and password.'}, status=400)
    elif password != confirm_password:
        return Response({'message': 'Las contraseñas no coinciden.'}, status=400)
    elif not nombre or not apellidos:
        return Response({'message': 'Por favor ingresa tu nombre y apellidos.'}, status=400)    
    elif not email:
        return Response({'message': 'Por favor ingresa tu correo electrónico.'}, status=400)
    elif models.Usuario.objects.filter(username=username).exists():
        return JsonResponse({'errors': {'username': 'El nombre de usuario ya existe.'}}, status=400)
    elif models.Usuario.objects.filter(email=email).exists():
        return JsonResponse({'errors': {'email': 'El correo ya está registrado.'}}, status=400)
    
    with transaction.atomic():
        user = models.Usuario.objects.create_user(
            username=username,
            password=password,
            email=email,
            nombre=nombre,
            apellidos=apellidos
        )
        serialized = serializers.UsuarioSerializer(user).data
        transaction.set_rollback(True)
        return Response({'message': 'User registered successfully.', 'user': serialized}, status=201)
    
    return Response({'message': 'User registered successfully.'}, status=201)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@authentication_classes([])
def jwt_logout(request):
    try:
        refresh_token = request.data.get('refresh', None)
        if not refresh_token:
            return Response({'detail': 'Refresh token requerido.'}, status=HTTP_400_BAD_REQUEST)        
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(HTTP_205_RESET_CONTENT)
    except Exception as e:
        return JsonResponse({'detail': 'Token inválido o en la lista negra'})


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
@authentication_classes([authentication.TokenAuthentication])
def create_post(request):
    data = None
    if request.user.is_authenticated:
        print(request.user)
        data = serializers.UsuarioSerializer(request.user).data
    return Response({
        'user': data,
        'message': 'success' if request.user.is_authenticated else 'No haz iniciado sesión'
    })

