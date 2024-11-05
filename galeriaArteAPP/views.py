from django.shortcuts import render, get_object_or_404
from .models import Artista, Cuadro, Exposicion
from django.utils import timezone
from datetime import timedelta

# Create your views here.
def lista_artistas(request):
    artistas = Artista.objects.all()
    return render(request, 'artistas.html', {'artistas': artistas})

def lista_cuadros(request):
    cuadros = Cuadro.objects.all()
    return render(request, 'cuadros.html', {'cuadros': cuadros})

def lista_exposiciones(request, 
                       fecha_limite_inicio = timezone.now().date(), 
                       fecha_limite_fin = timezone.now().date()):
    """Devuelve las exposiciones activas en, al menos, un día que esté
    entre un determinado rango de fechas, así como las anteriores y 
    posteriores a ese rango. Para elegir las fechas límite, usa el siguiente
    orden de prioridad:
    
    1. Parámetros GET. Permite al usuario aplicar filtros.
    2. Argumentos de la función. Permite filtrar en un template.
    3. Argumentos por defecto. Exposiciones activas/pasadas/futuras al día actual.
    """

    # Obtener las fechas límite de los parámetros GET, o usar argumentos de la función
    fecha_limite_inicio = request.GET.get('fecha_limite_inicio', fecha_limite_inicio)
    fecha_limite_fin = request.GET.get('fecha_limite_fin', fecha_limite_fin)

    # Asegurarse de que las fechas estén en formato de fecha (por si vienen como strings)
    if isinstance(fecha_limite_inicio, str):
        fecha_limite_inicio = timezone.datetime.strptime(fecha_limite_inicio, "%Y-%m-%d").date()
    if isinstance(fecha_limite_fin, str):
        fecha_limite_fin = timezone.datetime.strptime(fecha_limite_fin, "%Y-%m-%d").date()

    # Filtrar y ordenar exposiciones según los límites de tiempo
    exposiciones_activas = Exposicion.objects.filter(
        fecha_inicio__gte=fecha_limite_inicio,
        fecha_inicio__lte=fecha_limite_fin
    ).order_by('fecha_inicio')

    exposiciones_acabadas = Exposicion.objects.filter(
        fecha_fin__lt=fecha_limite_inicio
    ).order_by('fecha_fin')

    exposiciones_futuras = Exposicion.objects.filter(
        fecha_inicio__gt=fecha_limite_fin
    ).order_by('fecha_inicio')

    # Pasar los conjuntos de exposiciones y las fechas límite al template
    return render(request, 'lista_exposiciones.html', {
        'exposiciones_activas': exposiciones_activas,
        'exposiciones_acabadas': exposiciones_acabadas,
        'exposiciones_futuras': exposiciones_futuras,
        'fecha_limite_inicio': fecha_limite_inicio,
        'fecha_limite_fin': fecha_limite_fin,
    })

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
