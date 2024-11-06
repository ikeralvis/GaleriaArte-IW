from django.shortcuts import render, get_object_or_404
from .models import Artista, Cuadro, Exposicion
from django.utils import timezone
from datetime import timedelta
from django.views import View

# Create your views here.
def lista_artistas(request):
    artistas = Artista.objects.all()
    return render(request, 'artistas.html', {'artistas': artistas})

def lista_cuadros(request):
    cuadros = Cuadro.objects.all()
    return render(request, 'cuadros.html', {'cuadros': cuadros})

class ListaExposiciones(View):

    def get(self, request):
        """Permite al usuario aplicar filtros mediante parámetros GET.
        """
        inicio_rango = request.GET.get('inicio_rango', None)
        fin_rango = request.GET.get('fin_rango', None)

        # Llama al método filtrar()
        exposiciones = self.filtrar(inicio_rango, fin_rango)

        # Pasa los conjuntos de exposiciones y el rango de fechas al template
        exposiciones["inicio_rango"] = inicio_rango
        exposiciones["fin_rango"] = fin_rango
        return render(request, 'lista_exposiciones.html', exposiciones)

    def filtrar(self, inicio_rango = None, fin_rango = None):
        """Devuelve las exposiciones que están disponibles en, al menos, 
        un día dentro de un determinado rango de fechas.
        """
        exposiciones = Exposicion.objects.all()
        
        # Filtra las exposiciones en el rango de fechas seleccionado
        if inicio_rango:
            exposiciones = exposiciones.filter(fecha_fin__gte = inicio_rango)
        if fin_rango:
            exposiciones = exposiciones.filter(fecha_inicio__lte = fin_rango)

        # Divide las exposiciones en disponibles, por empezar o finalizadas respecto al día actual
        fecha_actual = timezone.now().date()
        exposiciones_activas = exposiciones.filter(fecha_inicio__lte = fecha_actual,
                                                   fecha_fin__gte = fecha_actual)
        exposiciones_futuras = exposiciones.filter(fecha_inicio__gt = fecha_actual)
        exposiciones_acabadas = exposiciones.filter(fecha_fin__lt = fecha_actual)

        return {"exposiciones_activas": exposiciones_activas.order_by("fecha_inicio"), 
                "exposiciones_acabadas": exposiciones_acabadas.order_by("fecha_inicio"),
                "exposiciones_futuras": exposiciones_futuras.order_by("fecha_inicio")}

def detalle_exposicion(request, id):
    exposicion = get_object_or_404(Exposicion, pk = id)
    return render(request, "detalle_exposicion.html", {"exposicion": exposicion})

def detalle_artista(request, artista_id):
    artista = get_object_or_404(Artista, pk=artista_id)
    return render(request, 'detalle_artista.html', {'artista': artista})
                  
def index(request):
    exposiciones = Exposicion.objects.all()
    return render(request, 'index.html', {'exposiciones': exposiciones})

def detalle_cuadro(request, cuadro_id):
    cuadro = get_object_or_404(Cuadro, pk=cuadro_id)
    return render(request, 'detalle_cuadro.html', {'cuadro': cuadro})
