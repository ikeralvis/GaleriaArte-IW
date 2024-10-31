# Generated by Django 5.1.2 on 2024-10-31 08:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('galeriaArteAPP', '0003_artista_foto'),
    ]

    operations = [
        migrations.AddField(
            model_name='cuadro',
            name='foto',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='exposicion',
            name='foto',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='exposicion',
            name='tipo',
            field=models.CharField(default='Temporal', max_length=50),
        ),
    ]