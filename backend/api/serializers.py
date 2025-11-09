from rest_framework import serializers
from users import models
import datetime, time

def UNIX_timestamp(date : datetime.datetime):
    return int(time.mktime(date.timetuple())) * 1000

class NegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Negocio
        fields = '__all__'
        read_only_fields = ["id"]


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Categoria
        fields = '__all__'
        read_only_fields = ["id"]

    productos = serializers.SerializerMethodField()

    def get_productos(self, categoria: models.Categoria):
        serializer = ProductoSerializer(categoria.productos.all(), many=True, context=self.context)
        return serializer.data

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Producto
        fields = '__all__'
        read_only_fields = ["id"]

    option_groups = serializers.SerializerMethodField()

    def get_option_groups(self, servicio:models.Producto):
        serializer = OptionGroupSerializer(servicio.grupos.all(), many=True, context=self.context)
        return serializer.data

class ProductoDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'categoria', 'imagen']
        read_only_fields = ["id"]


class OptionGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OptionGroup
        fields = '__all__'
        read_only_fields = ["id"]

    options = serializers.SerializerMethodField()

    def get_options(self, optGrp: models.OptionGroup):
        serializer = OptionSerializer(optGrp.opciones.all(), many=True, context=self.context)
        return serializer.data

class GroupDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OptionGroup
        fields = ['id','descripcion']
        read_only_fields = ["id"]


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Option
        fields = '__all__'
        read_only_fields = ["id"]

    display_string = serializers.SerializerMethodField()

    def get_display_string(self, option: models.Option):
        return f"{option.descripcion} { f'(${option.precio:,.2f})' if option.precio > 0 else f'(-${option.precio:,.2f})' if option.precio < 0 else '' }"


class OptionFullSerializer(OptionSerializer):
    class Meta:
        model = models.Option
        fields = '__all__'
        read_only_fields = ["id"]

    group = serializers.SerializerMethodField()

    def get_group(self, obj):
        return GroupDisplaySerializer(obj.group, context=self.context).data 


class ProductoWrapperSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductoWrapper
        fields = '__all__'
        read_only_fields = ["id"]

    subtotal = serializers.SerializerMethodField()
    opciones = serializers.SerializerMethodField()
    producto = serializers.SerializerMethodField()

    def get_producto(self, wrapper: models.ProductoWrapper):
        return ProductoDisplaySerializer(wrapper.producto, context=self.context).data

    def get_subtotal(self, wrapper: models.ProductoWrapper):
        return wrapper.calcular_subtotal()

    def get_opciones(self, wrapper: models.ProductoWrapper):
        if not wrapper.pk:
            return None
        return OptionFullSerializer(wrapper.opciones, many = True, context=self.context).data

class OrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Orden
        fields = '__all__'
        read_only_fields = ["id"]

    total = serializers.SerializerMethodField()
    pedidos = serializers.SerializerMethodField()
    fecha = serializers.SerializerMethodField()
    numero = serializers.SerializerMethodField()

    def get_total(self, orden: models.Orden):
        return orden.calcular_total()

    def get_pedidos(self, orden: models.Orden):
        serializer = ProductoWrapperSerializer(orden.pedidos.all(), many = True, context=self.context)
        return serializer.data
    
    def get_fecha(self, orden: models.Orden):
        return UNIX_timestamp(orden.fecha)
    
    def get_numero(self, orden: models.Orden):
        last_numero = models.Orden.objects.filter(fecha__date = orden.fecha.date()).order_by('-numero').first()
        if last_numero:
            return last_numero.numero + 1
        return 0
