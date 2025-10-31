from django.test import TestCase
from django.db import transaction
from . import models
import csv
from pathlib import Path

def generar_servicio() -> models.Producto:
    if models.Producto.objects.count() == 0:
        categoria = models.Categoria.objects.create()
        servicio = models.Producto.objects.create(
            nombre = 'Primer servicio',
            descripcion = 'Descripción de ejemplo',
            categoria = categoria
        )
        group = models.OptionGroup.objects.create(
            descripcion = 'Grupo de ejemplo',
            producto = servicio
        )
        option1 = models.Option.objects.create(
            descripcion = 'Primera opción',
            precio = 10,
            group = group,
        )
        option2 = models.Option.objects.create(
            descripcion = 'Segunda opción',
            precio = 0,
            group = group,
        )
        option3 = models.Option.objects.create(
            descripcion = 'Tercera opción',
            precio = -5,
            group = group,
        )
        return servicio
    else:
        return models.Producto.objects.first()


def parser():
    with transaction.atomic():
        try:
            usuario = models.Usuario.objects.create_superuser(
                email='eduardo1582000@gmail.com',
                password='password',
                nombre = 'Eduardo',
                apellidos = 'Escalante Pacheco'
            )
            negocio = models.Negocio.objects.create(
                nombre = 'The Coffee',
                descripcion = 'Cafetería japonesa.',
                direccion = 'Calle 47 Colonia Centro, Mérida, Yucatán',
                telefono = '9992834323',
                usuario = usuario
            )

            with Path('__extra__/categorias.csv').open(encoding='utf-8') as archivo:
                rows = csv.DictReader(archivo)
                for line in rows:
                    id = line['id']
                    desc = line['nombre']
                    models.Categoria.objects.create(
                        id = id,
                        nombre = desc
                    )

            with Path('__extra__/productos.csv').open(encoding='utf-8') as archivo:
                rows = csv.DictReader(archivo)
                for line in rows:
                    id = line['id']
                    nombre = line['nombre']
                    descripcion = line['descripcion']
                    precio = line['precio']
                    categoria = line['categoria']
                    models.Producto.objects.create(
                        id = id,
                        nombre = nombre,
                        descripcion = descripcion,
                        precio = precio,
                        categoria = models.Categoria.objects.get(id=categoria),
                        negocio = negocio,
                    )
            
            with Path('__extra__/grupos.csv').open(encoding='utf-8') as archivo:
                rows = csv.DictReader(archivo)
                for line in rows:
                    id = line['id']
                    nombre = line['descripcion']
                    producto = line['producto']
                    models.OptionGroup.objects.create(
                        id = id,
                        descripcion = nombre,
                        producto = models.Producto.objects.get(id=producto),
                    )
            
            with Path('__extra__/opciones.csv').open(encoding='utf-8') as archivo:
                rows = csv.DictReader(archivo)
                for line in rows:
                    id = line['id']
                    descripcion = line['descripcion']
                    precio = line['precio']
                    group = line['group']
                    models.Option.objects.create(
                        id = id,
                        descripcion = descripcion,
                        precio = precio,
                        group = models.OptionGroup.objects.get(id=group),
                    )

            print('Parseo realizado con éxito')
            transaction.set_rollback(False)
        except Exception as e:
            transaction.set_rollback(True)
            print(f'Error: {e}')

            
def generar_orden():
    with transaction.atomic():
        try:
            opciones = []
            producto : models.Producto = models.Producto.objects.first()
            if not producto:
                raise Exception('Cagada no hay datos')
            for grupo in producto.grupos.all():
                opcion = grupo.opciones.order_by('?').first()
                opciones.append(opcion)

            wrapper = models.ProductoWrapper.objects.create(
                producto = producto,
                anotacion = 'Con escupitajo por favor',
            )
            for o in opciones:
                wrapper.opciones.add(o)

            orden = models.Orden.objects.create(
                nombre_cliente = 'Pendejo idiota',
            )
            orden.productos.add(wrapper)
            print('Success')
        except Exception as e:
            transaction.set_rollback(True)
            print(f'Error: {e}')




