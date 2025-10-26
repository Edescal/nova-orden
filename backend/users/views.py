from django.shortcuts import render
from django.http.request import HttpRequest
from django.db import transaction
from . import models, tests
import datetime, unicodedata, re

def index(request: HttpRequest):
    if request.method == 'POST':
        file = request.FILES.get('foto', None)
        if file:
            producto = models.Producto.objects.first()
            if producto:
                print(file.content_type)

                file.name = f'{producto.nombre.lower().replace(' ', '_')}_img_{datetime.datetime.now().isoformat().replace('.', '_').replace(':', '_')}.webp'
                file.name = unicodedata.normalize('NFD', file.name)
                file.name = re.sub(r'[\u0300-\u036f]', '', file.name)  # <- AQUÍ se borran los acentos
                file.name = unicodedata.normalize('NFC', file.name)
                print(file.name)
                if producto.imagen:
                    producto.imagen.delete()
                producto.imagen = file
                producto.save()
    return render( request,'index.html')
