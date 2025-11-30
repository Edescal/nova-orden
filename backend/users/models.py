from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, MinValueValidator, MaxValueValidator, MaxLengthValidator, MinLengthValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from django.conf import settings
import uuid, boto3

from storages.backends.s3boto3 import S3Boto3Storage

class ProductoImgStorage(S3Boto3Storage):
    location = 'products'

class NegocioImgStorage(S3Boto3Storage):
    location = 'business'


def producto_img_path(instance, filename):
    return f'products/{instance.id or 'tmp'}/{filename}'

def banner_img_path(instance, filename):
    return f'business/banner/{instance.uuid or 'tmp'}/{filename}'

# region Usuarios 
class CustomUsuarioManager(BaseUserManager):
    def create_user(self, email, password = None, **kwargs):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user : Usuario = self.model(email = email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password = None, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)
        if kwargs.get('is_staff') is not True:
            ValueError('El superusuario debe tener is_staff=True')
        if kwargs.get('is_superuser') is not True:
            ValueError('El superusuario debe tener is_superuser=True')
        return self.create_user(email, password, **kwargs)
    
class Usuario(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(
        null=False,
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    username = models.CharField(
        null=False, 
        blank=False,
        max_length=32,
        default='admin',
        unique=True,
    )
    email = models.EmailField(unique=True)
    nombre = models.CharField(
        null=False,
        blank=False,
        max_length=128,
    ) 
    apellidos = models.CharField(
        null=False,
        blank=False,
        max_length=128,
    )
    fecha_registro = models.DateTimeField(
        auto_now_add=True
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USER_ID_FIELD = 'uuid'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects : CustomUsuarioManager = CustomUsuarioManager()

    def __str__(self):
        return f'Usuario: {self.email} | {self.nombre} {self.apellidos} | activo: {self.is_active}'
# endregion

class Negocio(models.Model):
    class Meta:
        db_table_comment = "Instancia del negocio autenticados"
        db_table = "negocio"

    uuid = models.UUIDField(
        null=False,
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    slug = models.SlugField(
        unique=True, 
        blank=True,
    )
    nombre = models.CharField(
        null=False,
        blank=False,
        default='Nuevo negocio',
        max_length=128,
    )
    descripcion = models.CharField(
        null=False,
        blank=False,
        default='Descripción del negocio.',
        max_length=128,
    )
    direccion = models.CharField(
        null=False,
        blank=False,
        default='Direccion',
        max_length=128,
    )
    telefono = models.CharField(
        null=False,
        blank=True,
        max_length=10,
    )
    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
    )
    banner_img = models.ImageField(
        blank=True,
        null=True,  
        default=None,
        upload_to=banner_img_path,
        storage=NegocioImgStorage,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg','jpeg','png','webp'])
        ]  
    )
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        null=False,
        related_name='negocios'
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'{self.nombre}. {self.descripcion}(\n'\
                    f'direccion: {self.direccion}\n' \
                    f'teléfono: {self.telefono}\n' \
                    f')'
   

# region Clases principales
class Categoria(models.Model):
    class Meta:
        db_table_comment = "Categorías de productos"
        db_table = "categoria"
    
    nombre = models.CharField(
        null=False,
        blank=False,
        default='Nueva categoría',
        max_length=48,
    )
    negocio = models.ForeignKey(
        Negocio,
        on_delete=models.CASCADE,
        default='3c02f6c8b916424e9bd00cb1334b3de2',
        related_name='categorias'
    )

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    class Meta:
        db_table_comment = "Productos del negocio"
        db_table = "producto"

    nombre = models.CharField(
        null=False,
        blank=False,
        max_length=64,
        default='Nuevo producto'
    )
    descripcion = models.CharField(
        null=False,
        blank=False,
        max_length=128,
        default='Agrega la descripción aquí...'
    )
    precio = models.DecimalField(
        null=False,
        default=0,
        max_digits=10,
        decimal_places=2,
    )
    visible = models.BooleanField(
        null=False,
        blank=False,
        default=True,
    )
    imagen = models.ImageField(
        blank=True,
        null=True,  
        default=None,
        upload_to=producto_img_path,
        storage=ProductoImgStorage,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg','jpeg','png','webp'])
        ]
    )
    categoria = models.ForeignKey(
        Categoria,
        null=False,
        on_delete=models.CASCADE,
        related_name='productos',
    )
    negocio = models.ForeignKey(
        Negocio,
        on_delete=models.CASCADE,
        default=None,
        related_name='productos'
    )
    
    def clean(self):
        MinLengthValidator(1, message='El nombre del producto no puede estar vacío')(self.nombre)
        MaxLengthValidator(64, message='El nombre del producto es demasiado largo')(self.nombre)
        MinLengthValidator(1, message='La descripción del producto no puede estar vacía')(self.descripcion)
        MaxLengthValidator(128, message='La descripción del producto es demasiado larga')(self.descripcion)
        MinValueValidator(0, message='El precio del producto no puede ser negativo')(self.precio)
        if self.pk:
            instancia_existente = Producto.objects.get(pk=self.pk)
            if instancia_existente.imagen and instancia_existente.imagen != self.imagen:
                self.del_previous_image()    
        return super().clean()
    
    def del_previous_image(self):
        if self.imagen:
            try:
                s3_client = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_S3_REGION_NAME
                )
                s3_client.delete_object(
                    Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                    Key=self.imagen
                )
                print(f'Imagen antigua eliminada de {self.name} [{self.id}]')
            except Exception as e:                
                print(f'Error al eliminar la imagen de S3: {e}')
                raise ValidationError("No se pudo eliminar la imagen antigua de S3.")
    
    def __str__(self):
        return f'{self.nombre}: {self.descripcion}'

class OptionGroup(models.Model):
    class Meta:
        db_table_comment = "Opciones que pueden modificar el precio de un servicio"
        db_table = "grupo_opciones"

    descripcion = models.CharField(
        null=False,
        blank=False,
        max_length=40,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(40)
        ]
    )
    producto = models.ForeignKey(
        Producto,
        null=False,
        on_delete=models.CASCADE,
        related_name='grupos',
    )

    def save(self, *args, **kwargs):
        if not self.producto:
            raise ValidationError('El grupo de opciones debe pertenecer a un producto')
        MinValueValidator(1, message='El grupo de opciones necesita una descripción')(len(self.descripcion))
        MaxValueValidator(20, message='La descripción del grupo de opciones es demasiado larga')(len(self.descripcion))
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.descripcion

class Option(models.Model):
    class Meta:
        db_table_comment = "Opciones que pueden modificar el precio de un servicio"
        db_table = "opcion"

    descripcion = models.CharField(
        null=False,
        blank=False,
        max_length=40,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(40)
        ]
    )
    precio = models.DecimalField(
        default=0,
        decimal_places=2,
        max_digits=6
    )
    group = models.ForeignKey(
        OptionGroup,
        null=False,
        on_delete=models.CASCADE,
        related_name='opciones',
    )

    def save(self, *args, **kwargs):
        if not self.group:
            raise ValidationError('Las opciones deben pertenecer a un grupo de opciones')
        MinValueValidator(1, message='No puede haber descripciones de opción vacías')(len(self.descripcion))
        MaxValueValidator(40, message='La descripción de la opción es demasiado larga')(len(self.descripcion))
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.descripcion} { f'(${self.precio})' if self.precio > 0 else f'(-${abs(self.precio)})' if self.precio < 0 else '' }'
# endregion


class ProductoWrapper(models.Model):
    class Meta:
        db_table_comment = "Encapsulación para saber qué productos (y opciones) eligió una orden"
        db_table = "producto_wrapper"   

    producto = models.ForeignKey(
        to=Producto,
        null=True,
        on_delete=models.SET_NULL,
    )
    cantidad = models.PositiveIntegerField(
        null=False,
        default=1,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(100)
        ]
    )
    anotacion = models.CharField(
        null=False,
        blank=True,
        max_length=255,
        default='',
    )
    opciones = models.ManyToManyField(Option)

    def calcular_subtotal(self) -> float:
        if not self.producto:
            return 0
        
        if not self.pk:
            return self.producto.precio
        
        sum = self.producto.precio
        for o in self.opciones.all():
            sum += o.precio
        return sum

    def clean(self):
        if not self.producto:
            raise ValidationError('Esta orden no tiene producto')
        if self.cantidad < 1:
            raise ValidationError('No se pueden ordenar 0 productos')
        if self.producto.pk:
            if self.opciones.count() == 0:
                raise ValidationError('Hace falta información de las opciones de esta orden')
            if self.producto.grupos.count() != self.opciones.count():
                raise ValidationError('No concuerda el número de opciones elegidas para esta orden')
            #TODO: validar que cada opción pertenezca a un grupo distinto

        
            
        return super().clean()

    def __str__(self):
        return f'ProductoWrapper(\n'\
                f'  {self.producto}\n'\
                f'  cantidad: {self.cantidad}\n'\
                f'  notas: {self.anotacion}\n'\
                ')'

class Status(models.IntegerChoices):
    RECIBIDA = 0, _('Recibido')
    EN_PROCESO = 1, _('En proceso')
    LISTA = 2, _('Lista')
    ENTREGADA = 3, _('Entregada')
    CANCELADA = 4, _('Cancelada')

class Orden(models.Model):
    class Meta:
        db_table_comment = "Órdenes realizadas"
        db_table = "orden"

    numero = models.PositiveSmallIntegerField(
        null=False,
        blank=False,  
        default=0,
    )
    nombre_cliente = models.CharField(
        null=False,
        blank=False,
        max_length=128,
        default='Sin nombre'
    )
    fecha = models.DateTimeField(
        auto_now_add=True,
        null=False,
        blank=False
    )
    negocio = models.ForeignKey(
        Negocio,
        on_delete=models.CASCADE,
        default=None,
        related_name='ordenes'
    )
    total = models.DecimalField(
        null=False,
        decimal_places=2,
        max_digits= 8,
        default=0
    )
    estado = models.IntegerField(
        null=False,
        choices=Status.choices,
        default=Status.RECIBIDA,
    )
    pedidos = models.ManyToManyField(ProductoWrapper)

    def calcular_total(self) -> float:
        sum = 0
        for p in self.pedidos.all():
            sum += p.calcular_subtotal()
        return sum
    
    def save(self, *args, **kwargs):
        if not self.numero:
            hoy = timezone.now().date()
            ordenes_hoy=Orden.objects.filter(
                negocio=self.negocio,
                fecha__date=hoy
            ).count()
            self.numero = ordenes_hoy + 1
        
        super().save(*args, **kwargs)

        self.total = self.calcular_total()
        super().save(update_fields=['total'])

    def __str__(self):
        productos = ''
        for p in self.pedidos.all():
            productos += f'    {p}\n'
        productos = productos.replace('\n', '\n    ')
        productos = productos[0:-4:1]
        return f'Orden(\n'\
                  f'  {self.nombre_cliente}\n'\
                  f'  {self.fecha}\n'\
                  f'  Productos(\n'\
                  f'{productos}'\
                  f'  )\n'\
                  ')'
    
