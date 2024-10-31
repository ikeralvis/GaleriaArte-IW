from django.db import models
from django.utils import timezone

# Create your models here.
class Artista(models.Model):
    nombre_ape = models.CharField(max_length=255, default='Desconocido')
    fecha_nacimiento = models.DateField()
    fecha_fallecimiento = models.DateField(null=True, blank=True)
    biografia = models.TextField()
    nacionalidad = models.CharField(max_length=50)
    foto = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.nombre_ape
    
class Cuadro(models.Model):
    nombre = models.CharField(max_length=50)
    fecha_creacion = models.DateField()
    tecnica = models.TextField()
    descripcion = models.TextField()
    estilo = models.CharField(max_length=50)
    dato_curioso = models.TextField(blank=True, null=True)
    dimensiones = models.CharField(max_length=50)
    artista = models.ForeignKey(Artista, on_delete=models.CASCADE, related_name='cuadros')
    foto = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.nombre
    
class Exposicion(models.Model):
    nombre = models.CharField(max_length=50)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    descripcion = models.TextField()
    tipo = models.CharField(max_length=50, default='Temporal')
    cuadros = models.ManyToManyField(Cuadro)
    foto = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.nombre
    def esta_activa(self, fecha=timezone.now().date()):
        return self.fecha_inicio <= fecha <= self.fecha_fin
    def anterior(self, fecha=timezone.now().date()):
        return fecha > self.fecha_fin
    def posterior(self, fecha=timezone.now().date()):
        return fecha < self.fecha_inicio
    def duracion(self):
        return self.fecha_fin - self.fecha_inicio