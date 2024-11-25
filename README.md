# GaleriaArte-IW

## Descripción

El proyecto "Galería de Arte" es un sitio web desarrollado en Django que permite explorar diferentes colecciones de arte, cada una compuesta por varios cuadros y asociados a distintos artistas. Los usuarios pueden ver detalles sobre los cuadros, colecciones y artistas, incluyendo obras relacionadas.

## Funcionalidades

- **Portada**: Muestra un cuadro destacado de cada colección.
- **Lista de Cuadros**: Permite ver todos los cuadros y acceder a los detalles de cada uno.
- **Lista de Colecciones**: Permite ver todas las colecciones y acceder a los detalles de cada colección.
- **Lista de Artistas**: Permite ver todos los artistas y acceder a los detalles de cada artista.
- **Exposiciones**: Información sobre las exposiciones activas, incluyendo fechas y descripciones.

## Modelos

### Cuadro
- **Nombre**: CharField
- **Foto**: ImageField
- **Información técnica**: TextField
- **Fecha de creación**: DateField
- **Descripción**: TextField
- **Estilo**: CharField
- **Artista**: ForeignKey (relación con el modelo Artista)

### Artista
- **Nombre y Apellido**: CharField
- **Nacionalidad**: CharField
- **Fecha de nacimiento**: DateField
- **Fecha de fallecimiento**: DateField (opcional)
- **Biografía**: TextField
- **Foto**: ImageField

### Exposición
- **Nombre**: CharField
- **Fecha de inicio**: DateField
- **Fecha de fin**: DateField
- **Descripción**: TextField
- **Cuadros**: ManyToManyField (relación con el modelo Cuadro)

## Instalación
   1. **Crear un entorno virtual**:
      - Navega hasta la carpeta del proyecto en la terminal y ejecuta:
        ```bash
        python -m venv entornovirtual
        ```
      - Activa el entorno virtual:
        - **Windows**:
          ```bash
          entornovirtual\Scripts\activate
          ```
        - **Mac/Linux**:
          ```bash
          source entornovirtual/bin/activate
          ```

   2. **Instalar las dependencias necesarias**:
      - Asegúrate de instalar las bibliotecas requeridas para el proyecto:
        ```bash
        pip install django django-admin-interface django-colorfield
        ```

   3. **Realizar las migraciones de la base de datos**:
      - Configura la base de datos ejecutando:
        ```bash
        python manage.py migrate
        ```

   4. **Ejecutar el servidor de desarrollo**:
      - Inicia el servidor local con el siguiente comando:
        ```bash
        python manage.py runserver
        ```

### Notas importantes
- Asegúrate de tener **Python 3.10 o superior** instalado.
- Si deseas incluir dependencias adicionales, agrégalas en el entorno virtual antes de iniciar el proyecto.
- Si el proyecto utiliza archivos estáticos, no olvides ejecutar:
  ```bash
  python manage.py collectstatic
