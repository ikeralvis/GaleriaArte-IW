# Generated by Django 5.1.2 on 2024-10-30 20:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Artista',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
                ('apellido', models.CharField(max_length=50)),
                ('fecha_nacimiento', models.DateField()),
                ('fecha_fallecimiento', models.DateField(blank=True, null=True)),
                ('biografia', models.TextField()),
                ('nacionalidad', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Cuadro',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
                ('fecha_creacion', models.DateField()),
                ('tecnica', models.TextField()),
                ('descripcion', models.TextField()),
                ('estilo', models.CharField(max_length=50)),
                ('dato_curioso', models.TextField(blank=True, null=True)),
                ('dimensiones', models.CharField(max_length=50)),
                ('artista', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cuadros', to='galeriaArteAPP.artista')),
            ],
        ),
        migrations.CreateModel(
            name='Exposicion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
                ('fecha_inicio', models.DateField()),
                ('fecha_fin', models.DateField()),
                ('descripcion', models.TextField()),
                ('cuadros', models.ManyToManyField(to='galeriaArteAPP.cuadro')),
            ],
        ),
    ]