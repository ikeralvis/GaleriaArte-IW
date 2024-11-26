document.addEventListener('DOMContentLoaded', function () {
    // Selecciona los elementos HTML
    const sidebar = document.getElementById('sidebar');
    const contenido = document.getElementById('contenido');
    const toggle_bar = document.getElementById('toggle-bar');
    const toggle_bar_icon = document.getElementById('toggle-bar-icon');

    // Lee la variable de CSS que define el ancho de la barra lateral
    const rootStyles = getComputedStyle(document.documentElement);
    let sidebar_width = rootStyles.getPropertyValue('--sidebar_width').trim();

    // Verifica si `sidebar_width` tiene un valor válido, de lo contrario asume 0
    sidebar_width = sidebar_width ? parseFloat(sidebar_width) : 0;

    // Si sidebar_width es mayor que 0, significa que la página usa barra lateral
    if (sidebar_width > 0) {
        // Muestra el botón 'toggle_bar'
        toggle_bar.style.display = 'block';
        // Añade la funcionalidad para mostar/ocultar la barra lateral con el botón
        add_toggle_functionality(toggle_bar, contenido); 
        // Comprueba el color del botón cada vez que se hace scroll
        window.addEventListener('scroll', function() {
            checkColor(toggle_bar_icon, contenido);
        });
    } else {
        toggle_bar.style.display = 'none';
        sidebar.style.display = 'none';
    }

    // Función para añadir la funcionalidad al botón
    function add_toggle_functionality(toggle_bar, contenido) {
        
        if (!contenido) {
            console.error('El elemento #contenido no existe en el DOM.');
            return; // Salimos si no hay contenido
        }

        // Cuando se hace click en el botón 'toggle-bar', añade (o quita) la clase 
        // 'hidden_sidebar' a #contenido, permitiendo así aplicarle CSS específico.
        // Actualiza también el color.
        toggle_bar.addEventListener('click', function () {
            contenido.classList.toggle('hidden_sidebar');
            checkColor(toggle_bar_icon, contenido)
        });
    }
    
    function checkColor(toggle_bar_icon, contenido) {
        const scrollPosition = window.scrollY;

        // Si #contenido no tiene la clase .hidden_sidebar, el color será siempre negro
        if (!contenido.classList.contains('hidden_sidebar')) {
            toggle_bar_icon.style.color = 'black';
        } else {
            // Si la clase .hidden_sidebar está presente, cambia el color en función del scroll
            if (scrollPosition > 20) {
                toggle_bar_icon.style.color = 'black';
            } else {
                toggle_bar_icon.style.color = 'white';
            }
        }
    }

});
