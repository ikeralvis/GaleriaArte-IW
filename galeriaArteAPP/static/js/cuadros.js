document.addEventListener("DOMContentLoaded", function () {
    let page = 1; // Página inicial
    const totalPaginas = document.getElementById('info-pagina').dataset.totalPaginas;
    let hasMoreContent = true; // Controla si hay más contenido disponible
    let isLoading = false; // Bloqueo para evitar solicitudes simultáneas
    const loadingIndicator = document.createElement('div');
    loadingIndicator.innerHTML = 'Cargando...';
    loadingIndicator.style.display = 'none';

    // Insertar el indicador de carga justo antes del footer
    const mainContent = document.querySelector('main');
    const fin_pagina = document.querySelector('final-pagina');
    mainContent.insertBefore(loadingIndicator, fin_pagina);

    const loadContent = () => {
        if (!hasMoreContent || isLoading) return; // No hacer nada si no hay más contenido o ya se está cargando

        if (page < totalPaginas && window.innerHeight + window.scrollY >= document.body.scrollHeight - window.innerHeight) {
            isLoading = true; // Bloquear nuevas solicitudes

            // Mostrar el indicador de carga
            loadingIndicator.style.display = 'block';

            page++; // Incrementar el número de página

            fetch(`/galeriaArteAPP/cuadros/?page=${page}`)
                .then(response => {
                    if (!response.ok) {
                        hasMoreContent = false; // Marcar que no hay más contenido si falla
                        throw new Error("No hay más contenido.");
                    }
                    return response.text();
                })
                .then(html => {
                    // Ocultar el indicador de carga
                    loadingIndicator.style.display = 'none';

                    const newCuadros = document.createElement('div');
                    newCuadros.innerHTML = html;
                    const cuadros = newCuadros.querySelectorAll('.cuadro-item');

                    if (cuadros.length === 0) {
                        hasMoreContent = false; // No hay más contenido
                        return;
                    }

                    cuadros.forEach((cuadro) => {
                        cuadro.classList.add('immediate-show');
                    });

                    const cuadrosList = document.querySelector('.lista_flex');
                    cuadros.forEach(cuadro => cuadrosList.appendChild(cuadro));
                })
                .catch(() => {
                    loadingIndicator.style.display = 'none';
                    console.warn("No hay más contenido. Fin del scroll infinito.");
                })
                .finally(() => {
                    isLoading = false; // Desbloquear nuevas solicitudes
                });
        }
    };

    const loadMoreContent = () => {
        const loadUntilFullViewport = () => {
            // Verificar si la cantidad de contenido cargado es menor que la altura de la ventana
            const currentContentHeight = document.querySelector('.lista_flex').scrollHeight;
            const viewportHeight = window.innerHeight;
    
            // Si el contenido actual es menor que la altura del viewport, cargamos más contenido
            if (currentContentHeight < viewportHeight && hasMoreContent) {
    
                page++; // Incrementar el número de página
    
                // Cargar más contenido
                fetch(`/galeriaArteAPP/cuadros/?page=${page}`)
                    .then(response => {
                        if (!response.ok) {
                            hasMoreContent = false;
                            throw new Error("No hay más contenido.");
                        }
                        return response.text();
                    })
                    .then(html => {
                        // Ocultar el indicador de carga
                        loadingIndicator.style.display = 'none';
    
                        // Crear un contenedor temporal para los nuevos cuadros
                        const newCuadros = document.createElement('div');
                        newCuadros.innerHTML = html;
    
                        // Extraer los cuadros desde el HTML cargado
                        const cuadros = newCuadros.querySelectorAll('.cuadro-item');
    
                        if (cuadros.length === 0) {
                            // Si no hay cuadros en la respuesta, no hay más contenido
                            hasMoreContent = false;
                            return;
                        }

                        cuadros.forEach((cuadro, index) => {
                            setTimeout(() => {
                                cuadro.classList.add("show");
                            }, index * 125); 
                        });

                        // Agregar los nuevos cuadros al final de la lista existente
                        const cuadrosList = document.querySelector('.lista_flex');
                        cuadros.forEach(cuadro => cuadrosList.appendChild(cuadro));
    
                        // Llamar a la función recursiva para seguir cargando más contenido si es necesario
                        loadUntilFullViewport();
                    })
                    .catch(() => {
                        // Ocultar el indicador de carga en caso de error
                        loadingIndicator.style.display = 'none';
                        hasMoreContent = false; // Detener futuras solicitudes en caso de error
                    });
            }
        };
    
        // Inicializar la carga hasta llenar el viewport
        loadUntilFullViewport();
    };
    
    // Event listeners
    window.addEventListener('scroll', loadContent);
    window.addEventListener('resize', loadMoreContent);

    // Animación para los cuadros de la primera página
    const cuadros = document.querySelectorAll(".cuadro-item");
    cuadros.forEach((cuadro, index) => {
        setTimeout(() => {
            cuadro.classList.add("show");
        }, index * 125); 
    });

    // Llamada inicial para cargar más paginas si es necesario
    loadMoreContent();
});
