from django.db import models
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid

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
    uuid = models.UUIDField(
        null=False,
        primary_key=True,
        default=uuid.uuid4,
        editable=False
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
    is_staff = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
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
        max_length=64,
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
    )
    producto = models.ForeignKey(
        Producto,
        null=False,
        on_delete=models.CASCADE,
        related_name='grupos',
    )
    
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
        sum = self.producto.precio
        for o in self.opciones.all():
            sum += o.precio
        return sum

    def __str__(self):
        opciones = ''
        for o in self.opciones.all():
            opciones += f'    {o}\n'
        return f'ProductoWrapper(\n'\
                f'  {self.producto}\n'\
                f'  Opciones(\n'\
                f'{opciones}'\
                f'  )\n'\
                f'  notas: {self.anotacion}\n'\
                ')'

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
    productos = models.ManyToManyField(ProductoWrapper)

    def calcular_total(self) -> float:
        sum = 0
        for p in self.productos.all():
            sum += p.calcular_subtotal()
        return sum

    def __str__(self):
        productos = ''
        for p in self.productos.all():
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
    
