document.addEventListener("DOMContentLoaded", () => {
    const listasFlex = document.querySelectorAll(".lista_flex");

    // Función para aplicar la animación con retrasos
    const aplicarAnimacion = (elementos) => {
        elementos.forEach((elemento) => {
            setTimeout(() => {
                elemento.classList.add("show");
            });
        });
    };

    // Observador para detectar cambios
    const observer = new MutationObserver((mutationsList, observerInstance) => {
        let elementosNuevos = [];
        mutationsList.forEach((mutation) => {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains("preview")) {
                        elementosNuevos.push(node); // Almacena los nuevos nodos
                    }
                });
            }
        });

        if (elementosNuevos.length > 0) {
            aplicarAnimacion(elementosNuevos); // Aplica animaciones a los nuevos elementos
        }
    });

    // Inicia la observación en cada lista
    listasFlex.forEach((lista) => {
        observer.observe(lista, { childList: true }); // Observa cambios en los hijos directos
    });
});
