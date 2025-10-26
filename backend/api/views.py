from django.http.request import HttpRequest
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from users import models
from . import serializers

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

