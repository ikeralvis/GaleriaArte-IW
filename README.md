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

Para instalar el proyecto en tu máquina local, sigue estos pasos:

1. **Copia la URI del repositorio**:
   - Ve a la página principal de tu repositorio en GitHub.
   - Haz clic en el botón verde "Code".
   - En el menú desplegable, asegúrate de seleccionar la opción "HTTPS".
   - Copia la URI que aparece, que debería verse algo así: `https://github.com/tu_usuario/GaleriaArte-IW.git`.

2. **Clona el repositorio en Visual Studio Code**:
   - Abre Visual Studio Code.
   - Abre la paleta de comandos presionando `Ctrl + Shift + P` (Windows) o `Cmd + Shift + P` (Mac).
   - Escribe `Git: Clone` y selecciona la opción cuando aparezca.
   - Pega la URI que copiaste y presiona `Enter`.
   - Elige la ubicación en tu sistema donde deseas clonar el repositorio.

3. **Abre la carpeta del proyecto**:
   - Una vez que el repositorio se haya clonado, Visual Studio Code te preguntará si deseas abrir el proyecto. Haz clic en "Abrir" para cargar la carpeta del proyecto.

4. **Configura el entorno**:
   - Asegúrate de tener instalado Python y las dependencias necesarias. Consulta la sección correspondiente en este README para más detalles.

