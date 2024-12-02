from django.shortcuts import render
from .models import Artista, Cuadro, Exposicion
from django.utils import timezone
from django.views import View
from django.views.generic import ListView, DetailView
from django.http import JsonResponse
from django.core.cache import cache
from django.core.paginator import Paginator
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class ListaArtistas(ListView):
    model = Artista
    template_name = 'artistas.html'
    context_object_name = 'artistas'

    def get_queryset(self):
        cache_key = 'artistas_lista'  # Clave única para la lista de artistas
        artistas = cache.get(cache_key)  # Intenta obtener los datos desde la caché

        if not artistas:
            # Si no hay datos en la caché, consulta la base de datos
            artistas = Artista.objects.values('id', 'nombre_ape', 'foto', 'biografia')
            cache.set(cache_key, artistas, timeout=60 * 5)  # Guarda en caché por 5 minutos

        return artistas
    
class ListaCuadros(ListView):
    model = Cuadro
    template_name = 'cuadros.html'
    context_object_name = 'cuadros'
    paginate_by = 8 # Paginación con 8 cuadros por página

    def get_queryset(self):
        page = self.request.GET.get('page', 1)  # Página actual
        cache_key = f'cuadros_page_{page}'      # Clave de caché específica para la página
        cuadros = cache.get(cache_key)          # Intenta obtener los datos desde la caché

        if not cuadros:
            # Si no hay datos en la caché, consulta la base de datos
            cuadros = Cuadro.objects.values('id', 'nombre', 'foto').order_by('id')
            cache.set(cache_key, cuadros, timeout=60 * 5)  # Guarda en caché por 5 minutos

        return cuadros
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        cuadros = self.get_queryset()
        paginator = Paginator(cuadros, self.paginate_by)
        context['total_paginas'] = paginator.num_pages  # Añade el número total de páginas al contexto
        return context

class ListaExposiciones(View):

    def get(self, request):
        """Permite al usuario aplicar filtros mediante parámetros GET."""
        inicio_rango = request.GET.get('inicio_rango', None)
        fin_rango = request.GET.get('fin_rango', None)
        cache_key = f'exposiciones_{inicio_rango}_{fin_rango}'  # Clave de caché específica para el rango
        exposiciones = cache.get(cache_key)

        if not exposiciones:
            # Llama al método filtrar si no hay datos en caché
            exposiciones = self.filtrar(inicio_rango, fin_rango)
            # Guarda las exposiciones en caché
            cache.set(cache_key, exposiciones, timeout=60 * 5)  # Guarda por 5 minutos

        # Si es una solicitud AJAX, devuelve JSON
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            data = {
                "exposiciones_activas": list(exposiciones["exposiciones_activas"].values(
                    "id", "nombre", "descripcion", "foto", "fecha_inicio", "fecha_fin")),
                "exposiciones_futuras": list(exposiciones["exposiciones_futuras"].values(
                    "id", "nombre", "descripcion", "foto", "fecha_inicio", "fecha_fin")),
                "exposiciones_acabadas": list(exposiciones["exposiciones_acabadas"].values(
                    "id", "nombre", "descripcion", "foto", "fecha_inicio", "fecha_fin")),
            }
            return JsonResponse(data)

        # Si no, renderiza la página completa
        return render(request, 'exposiciones.html', exposiciones)

    def filtrar(self, inicio_rango=None, fin_rango=None):
        """Devuelve las exposiciones que están disponibles en, al menos, 
        un día dentro de un determinado rango de fechas.
        """
        exposiciones = Exposicion.objects.all()
        
        # Filtra las exposiciones en el rango de fechas seleccionado
        if inicio_rango:
            exposiciones = exposiciones.filter(fecha_fin__gte=inicio_rango)
        if fin_rango:
            exposiciones = exposiciones.filter(fecha_inicio__lte=fin_rango)

        # Divide las exposiciones en activas, futuras o acabadas respecto al día actual
        fecha_actual = timezone.now().date()
        exposiciones_activas = exposiciones.filter(fecha_inicio__lte=fecha_actual,
                                                   fecha_fin__gte=fecha_actual)
        exposiciones_futuras = exposiciones.filter(fecha_inicio__gt=fecha_actual)
        exposiciones_acabadas = exposiciones.filter(fecha_fin__lt=fecha_actual)

        return {
            "exposiciones_activas": exposiciones_activas.order_by("fecha_fin"), 
            "exposiciones_acabadas": exposiciones_acabadas.order_by("fecha_inicio"),
            "exposiciones_futuras": exposiciones_futuras.order_by("fecha_inicio"),
        }

class DetalleExposicion(DetailView):
    model = Exposicion
    template_name = 'detalle_exposicion.html'
    context_object_name = 'exposicion'

class DetalleArtista(DetailView):
    model = Artista
    template_name = 'detalle_artista.html'
    context_object_name = 'artista'

class DetalleCuadro(DetailView):
    model = Cuadro
    template_name = 'detalle_cuadro.html'
    context_object_name = 'cuadro'

def index(request):
    return render(request, 'index.html')

def base(request):
    return render(request, 'base.html')
