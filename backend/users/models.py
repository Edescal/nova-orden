from django.db import models
from django.core.validators import FileExtensionValidator
import datetime

def servicio_image_path(instance, filename):
    return f'products/{instance.id or 'tmp'}/{filename}'

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
    imagen = models.ImageField(
        blank=True,
        null=True,  
        default=None,
        upload_to=servicio_image_path,
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

#---------------------------------------------------

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

    def calcular_precio(self) -> float:
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
        auto_now=True,
        null=False,
        blank=False
    )
    productos = models.ManyToManyField(ProductoWrapper)

    def calcular_total(self) -> float:
        sum = 0
        for p in self.productos.all():
            sum += p.calcular_precio()
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
    
