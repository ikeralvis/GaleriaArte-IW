# Generated by Django 5.1.2 on 2024-10-31 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('galeriaArteAPP', '0002_remove_artista_apellido_remove_artista_nombre_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='artista',
            name='foto',
            field=models.URLField(blank=True, null=True),
        ),
    ]
