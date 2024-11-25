document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const images = carousel.querySelectorAll('img');
    let currentIndex = 0;
    const totalImages = images.length;

    function showNextImage() {
        images[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % totalImages;
        images[currentIndex].style.display = 'block';
    }

    // Mostrar la primera imagen
    if (totalImages > 0) {
        images[0].style.display = 'block'; // Mostrar la primera imagen
        setInterval(showNextImage, 3000); // Cambiar cada 3 segundos
    }
});
