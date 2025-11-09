from django.shortcuts import render
from django.http.request import HttpRequest
from django.http.response import HttpResponse
from django.db import transaction
from . import models, tests
import datetime, unicodedata, re

def index(request: HttpRequest):
    bd_creada = models.Negocio.objects.count() > 0
    if not bd_creada:
        tests.poblar_db()
        return HttpResponse('Se creó la base de datos, actualiza la página...')
    else:
        if request.method == 'POST':
            file = request.FILES.get('foto', None)
            producto_id = request.POST.get('id', None)
            if file and producto_id:
                producto = models.Producto.objects.filter(id=producto_id).first()
                if producto:
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

def dashboard(request: HttpRequest):

    return render(request, 'dashboard.html')