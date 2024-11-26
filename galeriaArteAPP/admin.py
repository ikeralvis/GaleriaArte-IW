from django.contrib import admin
from django.contrib.admin import AdminSite, ModelAdmin
from django.contrib.auth.admin import UserAdmin
from .models import Artista, Cuadro, Exposicion
from django.contrib.auth.models import User, Group
from django.utils.html import format_html
from django import forms
# Register your models here.

class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label="Contraseña", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirmar Contraseña", widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('username', 'email', 'groups')  # Los campos que queremos mostrar

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Las contraseñas no coinciden.")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])  # Asegura que la contraseña esté encriptada
        if commit:
            user.is_active = True  # Asegurarse de que el usuario está activo
            user.save()  # Guarda el usuario en la base de datos
        return user


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'groups'),
        }),
    )

    def get_form(self, request, obj=None, **kwargs):
        # Usar el formulario personalizado solo cuando estamos creando un usuario nuevo
        if obj is None:
            return self.add_form
        return super().get_form(request, obj, **kwargs)
    


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
        return request.user.is_active and (request.user.is_superuser or request.user.groups.filter(name='Administrador General').exists() or request.user.groups.filter(name='Administrador de Lectura').exists())

    
# Instancia el sitio de administración personalizado
custom_admin_site = CustomAdminSite(name='custom_admin')

custom_admin_site.register(User, CustomUserAdmin)
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