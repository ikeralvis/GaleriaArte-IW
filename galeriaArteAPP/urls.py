from django.urls import path
from . import views

urlpatterns = [
    path('artistas/', views.ListaArtistas.as_view(), name='lista_artistas'),
    path('cuadros/', views.ListaCuadros.as_view(), name='lista_cuadros'),
    path('exposiciones/', views.ListaExposiciones.as_view(), name='lista_exposiciones'),
    path('artistas/<int:pk>/', views.DetalleArtista.as_view(), name='detalle_artista'),
    path('cuadros/<int:pk>/', views.DetalleCuadro.as_view(), name='detalle_cuadro'),
    path('exposiciones/<int:pk>', views.DetalleExposicion.as_view(), name='detalle_exposicion'),
    path('index/', views.index, name='index'),
]
