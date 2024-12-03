document.addEventListener('DOMContentLoaded', () => {

    try {
        // Obtén el JSON desde el script
        const exposicionesDataElement = document.getElementById('exposiciones-data');
        const exposiciones = JSON.parse(exposicionesDataElement.textContent);

        const portadaImagen = document.getElementById('portada-imagen');
        const portadaEnlace1 = document.getElementById('portada-enlace1');
        const portadaEnlace2 = document.getElementById('portada-enlace2');

        let primeraCarga = true;
        let currentIndex = 0;

        function updatePortada() {
            const exposicion = exposiciones[currentIndex];

            // Si es la primera carga, actualiza directamente sin animación
            if (primeraCarga) {
                portadaImagen.src = exposicion.foto;
                portadaImagen.alt = exposicion.nombre;
                portadaEnlace1.href = exposicion.url;
                portadaEnlace2.href = exposicion.url;

                primeraCarga = false;
            } else {
                // Aplica la animación de desvanecimiento antes de cambiar la imagen
                portadaImagen.classList.add('fade-out');

                // Espera a que termine la animación antes de cambiar la imagen
                setTimeout(() => {
                    portadaImagen.src = exposicion.foto;
                    portadaImagen.alt = exposicion.nombre;
                    portadaEnlace1.href = exposicion.url;
                    portadaEnlace2.href = exposicion.url;

                    // Quita la clase fade-out después de que la imagen haya cambiado
                    portadaImagen.classList.remove('fade-out');
                }, 1000); // Coincide con la duración de la animación
            }

            // Incrementa el índice y cicla entre las exposiciones
            currentIndex = (currentIndex + 1) % exposiciones.length;
        }

        setInterval(updatePortada, 5000);
        updatePortada(); // Inicializa la primera exposición al cargar

    } catch (error) {
        console.error('Error procesando el carrusel:', error);
    }
});
