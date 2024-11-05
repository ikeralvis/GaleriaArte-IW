from django.urls import path
from . import views

urlpatterns = [
    path('artistas/', views.lista_artistas, name='lista_artistas'),
    path('cuadros/', views.lista_cuadros, name='listaC'),
    path('exposiciones/', views.lista_exposiciones, name='listaE'),

    path('artistas/<int:artista_id>/', views.detalle_artista, name='detalle_artista'),
    path('cuadros/<int:cuadro_id>/', views.detalle_cuadro, name='detalle_cuadro'),
]