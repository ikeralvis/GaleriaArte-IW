document.addEventListener("DOMContentLoaded", () => {
    const previews = document.querySelectorAll(".preview");

    // Aplica la animación con un retraso entre elementos
    previews.forEach((preview, index) => {
        setTimeout(() => {
            preview.classList.add("show");
        }, index * 150); // Ajusta el tiempo entre animaciones
    });
});
