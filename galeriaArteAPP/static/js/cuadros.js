document.addEventListener("DOMContentLoaded", () => {
    const cuadros = document.querySelectorAll(".cuadro-item");
    cuadros.forEach((cuadro, index) => {
        setTimeout(() => {
            cuadro.classList.add("show");
        }, index * 175); 
    });
});