document.addEventListener('DOMContentLoaded', () => {
    const carrusel = document.querySelector('.carrusel');
    const prevButton = document.querySelector('#prev');
    const nextButton = document.querySelector('#next');

    function updateButtonStyles() {
        updatePrevButton();
        updateNextButton();
    };

    function updatePrevButton() {
        // Verifica si ya no se puede desplazar hacia la izquierda
        if (carrusel.scrollLeft === 0) {
            prevButton.classList.add('desactivado');
        } else {
            prevButton.classList.remove('desactivado');
        }
    };

    function updateNextButton() {
        // Verifica si ya no se puede desplazar hacia la derecha
        if (carrusel.scrollLeft + carrusel.offsetWidth >= carrusel.scrollWidth - 1) {
            nextButton.classList.add('desactivado');
        } else {
            nextButton.classList.remove('desactivado');
        }
    };

    // Función que asegura que las imágenes estén completamente cargadas
    // antes de actualizar el estilo del botón de avance
    function waitForImages() {
        const images = carrusel.querySelectorAll('img');
        let imagesLoaded = 0;

        images.forEach(image => {
            image.onload = () => {
                imagesLoaded++;
                // Si todas las imágenes han sido cargadas, actualiza los botones
                if (imagesLoaded === images.length) {
                    updateNextButton();
                }
            };
        });

        // Si no hay imágenes, simplemente actualiza los botones
        if (images.length === 0) {
            updateNextButton();
        }
    }

    // Actualiza los estilos al cargar la página
    updatePrevButton()
    waitForImages()

    // Actualiza los estilos al desplazarse
    carrusel.addEventListener('scroll', updateButtonStyles);

    // Hace scroll al hacer click en los botones
    prevButton.addEventListener('click', () => {
        carrusel.scrollBy({ left: -300, behavior: 'smooth' });
    });

    nextButton.addEventListener('click', () => {
        carrusel.scrollBy({ left: 300, behavior: 'smooth' });
    });
});
