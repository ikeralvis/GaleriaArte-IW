from django.urls import path
from . import views

urlpatterns = [
    path('artistas/', views.lista_artistas, name='listaA'),
    path('cuadros/', views.lista_cuadros, name='listaC'),
    path('exposiciones/', views.lista_exposiciones, name='listaE'),
]