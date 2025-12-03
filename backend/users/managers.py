from django.db import models

class CategoriaManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=False)
    
class ProductoManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=False)