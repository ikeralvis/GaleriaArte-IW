document.addEventListener('DOMContentLoaded', () => {
    const carrusel = document.querySelector('.carrusel');
    const prevButton = document.querySelector('#prev');
    const nextButton = document.querySelector('#next');

    function updateButtonStyles() {
        // Verifica si ya no se puede desplazar hacia la izquierda
        if (carrusel.scrollLeft === 0) {
            prevButton.classList.add('desactivado');
        } else {
            prevButton.classList.remove('desactivado');
        }

        // Verifica si ya no se puede desplazar hacia la derecha
        if (carrusel.scrollLeft + carrusel.offsetWidth >= carrusel.scrollWidth) {
            nextButton.classList.add('desactivado');
        } else {
            nextButton.classList.remove('desactivado');
        }
    }

    // Actualiza los estilos al cargar la página
    updateButtonStyles();

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
