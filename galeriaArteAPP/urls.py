from django.urls import path
from . import views

urlpatterns = [
    path('artistas/', views.lista_artistas, name='lista_artistas'),
    path('cuadros/', views.lista_cuadros, name='lista_cuadros'),
    path('exposiciones/', views.lista_exposiciones, name='listaE'),
  
    path('index/', views.index, name='index'),

    path('artistas/<int:artista_id>/', views.detalle_artista, name='detalle_artista'),
    path('cuadros/<int:cuadro_id>/', views.detalle_cuadro, name='detalle_cuadro'),
    path('exposiciones/<int:id>', views.detalle_exposicion, name='detalle_exposicion'),
]