from django.contrib import admin
from django.contrib.admin import AdminSite, ModelAdmin
from .models import Artista, Cuadro, Exposicion
from django.contrib.auth.models import User, Group
from django.utils.html import format_html
# Register your models here.

class CustomAdminSite(AdminSite):
    class Media:  
        css = {
            'all': ('/static/css/admin.css',)
        }

    site_header = "Panel de Administración de Galeria de Arte"
    site_title = "Administración del Proyecto"
    index_title = "Bienvenido a la Administración"

    def has_permission(self, request):
        # Aquí personalizar quién puede ver el panel de administración
        # 1. Solo usuarios en el grupo 'Administrador General'
        return request.user.is_active and (request.user.is_superuser or request.user.groups.filter(name='Administrador General').exists())

    
# Instancia el sitio de administración personalizado
custom_admin_site = CustomAdminSite(name='custom_admin')

custom_admin_site.register(User)
custom_admin_site.register(Group)

class ExposicionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'fecha_inicio', 'fecha_fin')
    list_filter = ('fecha_inicio', 'fecha_fin')
    search_fields = ('nombre',)

custom_admin_site.register(Exposicion, ExposicionAdmin)


class CuadroAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'artista', 'fecha_creacion', 'tecnica')
    list_filter = ('fecha_creacion', 'estilo')
    search_fields = ('nombre', 'artista__nombre')  # búsqueda también por nombre del artista

custom_admin_site.register(Cuadro, CuadroAdmin)


class ArtistaAdmin(admin.ModelAdmin):
    list_display = ('nombre_ape', 'fecha_nacimiento')
    list_filter = ('nacionalidad',)
    search_fields = ('nombre_ape', 'nacionalidad')

custom_admin_site.register(Artista, ArtistaAdmin)
