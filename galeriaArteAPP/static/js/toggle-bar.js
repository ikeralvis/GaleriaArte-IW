document.addEventListener('DOMContentLoaded', function () {

    // Selecciona los elementos HTML
    const sidebar = document.getElementById('sidebar');
    const contenido = document.getElementById('contenido');
    const toggle_bar = document.getElementById('toggle-bar');
    const toggle_bar_icon = document.getElementById('toggle-bar-icon');

    // Añade la funcionalidad para mostar/ocultar la barra lateral con el botón
    add_toggle_functionality(toggle_bar, contenido);
    checkColor(toggle_bar_icon) // Comprueba el color inicialmente

    // Comprueba el color del botón cada vez que se hace scroll
    window.addEventListener('scroll', function() {
        checkColor(toggle_bar_icon);
    });

    function add_toggle_functionality(toggle_bar, contenido) {
        
        if (!contenido) {
            console.error('El elemento #contenido no existe en el DOM.');
            return; // Salimos si no hay contenido
        }

        // Cuando se hace click en el botón 'toggle-bar', añade (o quita) la clase 
        // 'hidden_sidebar' a #contenido, permitiendo así aplicarle CSS específico.
        toggle_bar.addEventListener('click', function () {
            contenido.classList.toggle('hidden-sidebar');
            sidebar.classList.toggle('hidden-sidebar');
            refreshLayout()
        });
    }
    
    function checkColor(toggle_bar_icon) {

        const scrollPosition = window.scrollY;

        // Cambia el color en función del scroll
        if (scrollPosition < 20) {
            toggle_bar_icon.classList.add('on_header');
        } else {
            toggle_bar_icon.classList.remove('on_header');
        }
    }
    
});
