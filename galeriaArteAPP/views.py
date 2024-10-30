from django.shortcuts import render, get_object_or_404
from .models import Artista, Cuadro, Exposicion
from django.http import JsonResponse

# Create your views here.
def lista_artistas(request):
    artistas = Artista.objects.values()  
    return JsonResponse(list(artistas), safe=False)

def lista_cuadros(request):
    cuadros = Cuadro.objects.values()
    return JsonResponse(list(cuadros), safe=False)

def lista_exposiciones(request):
    exposiciones = Exposicion.objects.values()
    return JsonResponse(list(exposiciones), safe=False)

