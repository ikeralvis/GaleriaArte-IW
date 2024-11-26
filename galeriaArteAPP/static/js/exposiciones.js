$(document).ready(function () {

    ////////////////////////// CARGAR LA PÁGINA ///////////////////////////////

    // Obtener los parámetros de la URL
    const [inicioRangoParam, finRangoParam] = obtenerParamsDesdeURL()

    // Cargar el título de la página
    actualizarTitulo(inicioRangoParam, finRangoParam)

    // Cargar las listas de exposiciones
    filtrarExposiciones(inicioRangoParam, finRangoParam)

    // Definir la funcionalidad de los botones que hay en la página

    const boton_eliminar_filtros = {
        id: "eliminar-filtros",
        inicioRango: "",
        finRango: ""
    };

    const boton_borrar_inicio = {
        id: "borrar-inicio",
        inicioRango: "",
        finRango: undefined
    };

    const boton_borrar_fin = {
        id: "borrar-fin",
        inicioRango: undefined,
        finRango: ""
    };

    const boton_hoy = {
        id: "hoy",
        inicioRango: obtenerFechaActual(),
        finRango: obtenerFechaActual()
    };

    const botones = [boton_eliminar_filtros, boton_borrar_inicio, boton_borrar_fin, boton_hoy];

    // Cargar los elementos de la barra lateral

    let instancia_calendario;

    // Cargar calendario
    cargarCalendario()
    .then(calendar => {
        actualizarCalendario(calendar, inicioRangoParam, finRangoParam);
        instancia_calendario = calendar

        // Cargar Flatpickr
        let instancia_flatpickr;
        instancia_flatpickr = cargarFlatpickr(inicioRangoParam, finRangoParam)

        // Cargar botones
        for (const boton of botones) {
            cargarBoton(boton, botones, instancia_flatpickr, instancia_calendario);
            // Verifica si debe estar habilitado o no inicialmente
            actualizarEstadoBoton(boton, inicioRangoParam, finRangoParam)
        }

    })
    .catch(error => {
        console.error("Error al cargar el calendario:", error);
    });
    
    ///////////////////////// CARGAR ELEMENTOS ///////////////////////////////

    function cargarFlatpickr(inicioRangoParam, finRangoParam) {

        // Variable para almacenar la instancia de Flatpickr
        let instancia_flatpickr;

        // Inicializa flatpickr para el campo de texto con el modo "range"
        instancia_flatpickr = flatpickr("#rango_fechas", {
            mode: "range", // Selección de un rango de fechas
            dateFormat: "Y-m-d", // Formato de fecha
            defaultDate: convertirParamsAFecha(inicioRangoParam, finRangoParam),
            inline: true, // Muestra el calendario siempre visible
            locale: 'es',
            appendTo: document.querySelector("#contenedor_calendario"),
            onChange: function (selectedDates, dateStr, instance) {

                // Normalizar formato de fechas
                const normalizarFecha = (date) => {
                    if (!date) return '';
                    const anio = date.getFullYear();
                    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
                    const dia = String(date.getDate()).padStart(2, '0');
                    return `${anio}-${mes}-${dia}`; // Formato YYYY-MM-DD
                };

                const inicioRango = selectedDates[0] ? normalizarFecha(new Date(selectedDates[0])) : '';
                const finRango = selectedDates[1] ? normalizarFecha(new Date(selectedDates[1])) : '';

                // Actualizar los elementos necesarios de la página
                actualizarURL(inicioRango, finRango);
                actualizarTitulo(inicioRango, finRango);
                filtrarExposiciones(inicioRango, finRango);
                for (const boton of botones) {
                    actualizarEstadoBoton(boton)
                };
                // Asegúrate de que instancia_calendario esté disponible
                if (instancia_calendario) {
                    actualizarCalendario(instancia_calendario, inicioRango, finRango);
                } else {
                    console.log("Calendario aún no cargado.");
                }

            }
        });

        return instancia_flatpickr
    }

    function cargarCalendario() {

        return new Promise((resolve, reject) => { // Promise indica una operación asíncrona
            $.ajax({
                url: window.location.href,
                type: 'GET',
                /* Carga todas las exposiciones en el calendario, independientemente de la URL */
                data: {
                    inicio_rango: '',
                    fin_rango: ''
                },
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                success: function(data) {

                    const calendarElement = document.getElementById('calendar');
                    const calendar = new FullCalendar.Calendar(calendarElement, {
                        initialView: 'dayGridMonth',
                        locale: 'es',
                        editable: false,
                        selectable: false,
                        events: [],
                        eventClick: function(info) {
                            const urlBase = obtenerURLBase();
                            const eventId = info.event.id;
                            window.location.href = `${urlBase}${eventId}`;
                        }                        
                    });
    
                    calendar.render();
    
                    const exposiciones = data.exposiciones_activas.concat(
                        data.exposiciones_futuras, 
                        data.exposiciones_acabadas
                    );
                    const events = exposiciones.map(exposicion => ({
                        id: exposicion.id,
                        title: exposicion.nombre,
                        start: exposicion.fecha_inicio,
                        end: exposicion.fecha_fin,
                        description: exposicion.descripcion,
                        color: obtenerColor(exposicion.id)
                    }));
    
                    calendar.addEventSource(events);
    
                    // Resuelve la promesa
                    resolve(calendar);
                },

                error: function(xhr, status, error) {
                    console.error("Error al cargar los datos", error);
                    reject(error);
                }
            });
        });
    }
    
    function cargarBoton(boton, botones, instancia_flatpickr, instancia_calendario) {

        // Obtiene el botón a partir de su id
        const botonElemento = document.getElementById(boton.id);

        if (botonElemento) {  // Verifica que el elemento existe
            // Añade la funcionalidad de actualizar las fechas al hacer click
            botonElemento.onclick = function() {
                
                // Actualiza la URL y obtiene los parámetros actualizados
                actualizarURL(boton.inicioRango, boton.finRango);
                const [inicioRangoParam, finRangoParam] = obtenerParamsDesdeURL()

                // Actualiza el resto de elementos
                for (const otro_boton of botones) {
                    actualizarEstadoBoton(otro_boton, inicioRangoParam, finRangoParam);
                }
                actualizarTitulo(inicioRangoParam, finRangoParam);
                filtrarExposiciones(inicioRangoParam, finRangoParam);
                actualizarFlatpickr(instancia_flatpickr, [inicioRangoParam, finRangoParam])
                actualizarCalendario(instancia_calendario, inicioRangoParam, finRangoParam)
            }
        };
    }

    ////////////////////////////// CARGAR/ACTUALIZAR ELEMENTOS ///////////////////////////////////////

    function actualizarListasExposiciones(data) {
        // Actualiza las listas de exposiciones con los datos recibidos en data.
    
        // Función para mostrar las exposiciones en una lista
        function mostrarExposiciones(tipo, exposiciones) {
            const seccionContenedor = $(`#seccion_exposiciones_${tipo}`);
            const listaContenedor = $(`#lista_exposiciones_${tipo}`);
            const urlBase = obtenerURLBase();
    
            // Limpiar la lista antes de agregar nuevas exposiciones
            listaContenedor.empty();
    
            // Si hay exposiciones, procesarlas
            if (exposiciones && exposiciones.length > 0) {
                exposiciones.forEach(exposicion => {
                    // Formatear las fechas de inicio y fin
                    let fechaInicioFormateada = formatearFecha(exposicion.fecha_inicio);
                    let fechaFinFormateada = formatearFecha(exposicion.fecha_fin);
    
                    // Agregar el HTML a la lista
                    listaContenedor.append(`
                        <a class="preview" href="${urlBase}${exposicion.id}">
                            ${exposicion.foto ? `<img src="${exposicion.foto}" alt="Imagen de la exposición">` : ''}
                            <div class="contenedor_info">
                                <div class="mascara">
                                    <h3> ${exposicion.nombre} </h3>
                                    <div class="info_disponibilidad">
                                        <p>${tipo === 'activas' ? 'Hasta el ' + fechaFinFormateada : fechaInicioFormateada + ' - ' + fechaFinFormateada}</p>
                                        <p class="etiqueta">${tipo === 'activas' ? 'Disponible' : tipo === 'futuras' ? 'Próximamente' : 'Finalizada'}</p>
                                    </div>
                                    <div class="info_hover">
                                        <hr>
                                        <p>${exposicion.descripcion}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    `);
                });
    
                // Mostrar la sección si hay exposiciones
                seccionContenedor.show();
                return true;

            } else {
                // Ocultar la sección si no hay exposiciones
                seccionContenedor.hide();
                return false;
            }
        }
    
        // Limpiar las listas antes de actualizar
        $('#lista_exposiciones_activas').empty();
        $('#lista_exposiciones_futuras').empty();
        $('#lista_exposiciones_acabadas').empty();
    
        // Mostrar exposiciones
        hay_exposiciones_activas = mostrarExposiciones('activas', data.exposiciones_activas);
        hay_exposiciones_futuras = mostrarExposiciones('futuras', data.exposiciones_futuras);
        hay_exposiciones_acabadas = mostrarExposiciones('acabadas', data.exposiciones_acabadas);

        // Si no hay exposiciones en ninguna de las secciones, indicarlo con un mensaje
        if (!hay_exposiciones_activas && !hay_exposiciones_futuras && !hay_exposiciones_acabadas) {
            // Mostrar el mensaje solo si no existe ya en el DOM
            if (!$('#sin_resultados').length) {
                $('.contenedor_exposiciones').append('<p id="sin_resultados">No se han encontrado exposiciones.</p>');
            }
        } else {
            // Si hay exposiciones, elimina cualquier mensaje de "sin resultados"
            $('#sin_resultados').remove();
        }

    };

    function filtrarExposiciones(inicioRangoParam, finRangoParam) {
        // Hace una solicitud AJAX para obtener la lista de exposiciones
        // usando los filtros pasados como parámetros, y usa las exposiciones
        // recibidas para actualizar las listas de exposiciones llamando a la
        // función correspondientes.

        $.ajax({
            url: window.location.href,
            type: 'GET',
            data: {
                inicio_rango: inicioRangoParam,
                fin_rango: finRangoParam
            },
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            success: function(data) {
                actualizarListasExposiciones(data);
            },
            error: function(xhr, status, error) {
                console.error("Error al cargar los datos", error);
            }
        });
    }
            
    function actualizarTitulo(inicioRangoParam, finRangoParam) {    
        // Actualiza el título de la página para reflejar los filtros aplicados.

        const fecha_actual = obtenerFechaActual();
        let titulo = '';
        
        const currentURL = window.location.href;
        const myArray = currentURL.split("/");
        let loc = myArray[3];
        
        if (!inicioRangoParam && !finRangoParam) {
            
            if ( loc == 'es' ) titulo = 'EXPOSICIONES';
            else if (loc == 'en') titulo = 'EXHIBITIONS';
            else if (loc == 'fr') titulo = 'EXPOSITIONS';
            else titulo = 'AUSSTELLUNGEN';

        } else if (!finRangoParam) {
            
            if ( loc == 'es' ) titulo = 'EXPOSICIONES POSTERIORES AL ';
            else if (loc == 'en') titulo = 'POST-EXHIBITIONS TO ';
            else if (loc == 'fr') titulo = 'EXPOSITIONS SUIVANTES ';
            else titulo = 'AUSSTELLUNGEN NACH DEM ';
            titulo += `${formatearFecha(inicioRangoParam)}`;
        
        } else if (!inicioRangoParam) {
            
            if ( loc == 'es' ) titulo = `EXPOSICIONES ANTERIORES AL `;
            else if (loc == 'en') titulo = 'PREVIOUS EXHIBITIONS TO ';
            else if (loc == 'fr') titulo = 'EXPOSITIONS AVANT LE ';
            else titulo = 'AUSSTELLUNGEN BIS ZUM ';
            
            titulo += `${formatearFecha(finRangoParam)}`;
            

        } else {
            if (inicioRangoParam === fecha_actual && finRangoParam === fecha_actual) {
                if ( loc == 'es' ) titulo = `EXPOSICIONES HOY `;
                else if (loc == 'en') titulo = 'EXHIBITIONS TODAY ';
                else if (loc == 'fr') titulo = `EXPOSITIONS AUJOURD'HUI `;
                else titulo = 'AUSSTELLUNGEN HEUTE ';
               
        
            } else if (inicioRangoParam === finRangoParam) {
                
                if ( loc == 'es' ) titulo = 'EXPOSICIONES EL ';
                else if (loc == 'en') titulo = 'EXHIBITIONS OF THE ';
                else if (loc == 'fr') titulo = `EXPOSITIONS DE LA `;
                else titulo = 'AUSSTELLUNGEN VOM ';
                titulo += `${formatearFecha(inicioRangoParam)}`;
        
            } else {
                if ( loc == 'es' ) titulo = `EXPOSICIONES DEL ${formatearFecha(inicioRangoParam)} AL ${formatearFecha(finRangoParam)}`;
                else if (loc == 'en') titulo = `EXHIBITIONS FROM THE ${formatearFecha(inicioRangoParam)} TO ${formatearFecha(finRangoParam)}`;
                else if (loc == 'fr') titulo = `EXPOSITIONS DU  ${formatearFecha(inicioRangoParam)} À ${formatearFecha(finRangoParam)}`;
                else titulo = `AUSSTELLUNGEN VON  ${formatearFecha(inicioRangoParam)} BIS ${formatearFecha(finRangoParam)}`;
                
            }
        }

        $('.titulo h1').text(titulo); // Actualiza el título en el DOM

    }

    /////////////////////////// ACTUALIZAR ELEMENTOS ////////////////////////////////

    function actualizarFlatpickr(instancia_flatpickr, rangoFechas) {
        // Actualiza el widget de Flatpickr para reflejar el rango de fechas
        // pasadas como parámetros.
        
        if (rangoFechas.length > 0) {
            // Sincroniza las fechas con la instancia de Flatpickr
            instancia_flatpickr.setDate(rangoFechas);
        }

    }

    function actualizarCalendario(instancia_calendario, inicioRango, finRango) {

        // Función para gestionar la navegación del calendario
        function manejarNavegacion() {
            const fecha_actual = obtenerFechaActual();
    
            if (!inicioRango && !finRango) {
                instancia_calendario.gotoDate(fecha_actual); // Ir a la fecha actual si no hay rango
            } else if (!inicioRango) {
                instancia_calendario.gotoDate(finRango); // Ir a finRango si no hay inicio
            } else if (!finRango) {
                instancia_calendario.gotoDate(inicioRango); // Ir a inicioRango si no hay fin
            } else {
                if (fecha_actual >= inicioRango && fecha_actual <= finRango) {
                    instancia_calendario.gotoDate(fecha_actual); // Si está dentro del rango
                } else {
                    instancia_calendario.gotoDate(inicioRango); // Si no está dentro, ir a inicio
                }
            }
        }
    
        function colorearRangoFechas() {

            // Seleccionar todas las celdas de días en el calendario
            const dayCells = document.querySelectorAll('.fc-day:not(.fc-col-header-cell');
        
            dayCells.forEach(cell => {

                // Obtener la fecha de la celda
                const cellDateString = cell.getAttribute('data-date');
        
                if (cellDateString) {
        
                    if (!inicioRango && !finRango) {
                        // Si no hay fechas definidas, colorear todas las celdas
                        cell.classList.add('rango-resaltado');
                    }
                    if (!inicioRango) {
                        // Si solo hay fecha de fin, colorear hasta esa fecha
                        if (cellDateString <= finRango) {
                            cell.classList.add('rango-resaltado');
                        } else {
                            cell.classList.remove('rango-resaltado');
                        }
                    } else if (!finRango) {
                        // Si solo hay fecha de inicio, colorear desde esa fecha en adelante
                        if (cellDateString >= inicioRango) {
                            cell.classList.add('rango-resaltado');
                        } else {
                            cell.classList.remove('rango-resaltado');
                        }
                    } else {
                        // Si ambas fechas están definidas, colorear solo dentro del rango
                        if (cellDateString >= inicioRango && cellDateString <= finRango) {
                            cell.classList.add('rango-resaltado');
                        } else {
                            cell.classList.remove('rango-resaltado');
                        }
                    }
                } else {
                    console.warn("Celda sin atributo data-date:", cell);
                }
            });
        }
    
        // Ejecutar las dos funcionalidades
        manejarNavegacion();
        colorearRangoFechas();
    
        // Listener para detectar cambios en la vista o la navegación
        instancia_calendario.on('datesSet', () => {
            colorearRangoFechas();
        });
    }
    
    function actualizarURL(inicioRango, finRango) {
        // Actualiza la URL con los parámetros dados sin recargar la página.
        // Un valor "" indica que se quiere borrar el parámetro, mientras que
        // undefined lo mantiene.
    
        const nuevaUrl = new URL(window.location.href);
        
        // Verifica si 'inicioRango' se pasa y si es diferente de 'undefined' o 'null'
        if (inicioRango !== undefined) {
            if (inicioRango === '') {
                // Si 'inicioRango' es una cadena vacía, elimina el parámetro
                nuevaUrl.searchParams.delete('inicio_rango');
            } else {
                // Si 'inicioRango' tiene un valor, actualiza o agrega el parámetro
                nuevaUrl.searchParams.set('inicio_rango', inicioRango);
            }
        }
    
        // Verifica si 'finRango' se pasa y si es diferente de 'undefined' o 'null'
        if (finRango !== undefined) {
            if (finRango === '') {
                // Si 'finRango' es una cadena vacía, elimina el parámetro
                nuevaUrl.searchParams.delete('fin_rango');
            } else {
                // Si 'finRango' tiene un valor, actualiza o agrega el parámetro
                nuevaUrl.searchParams.set('fin_rango', finRango);
            }
        }
    
        // Actualiza la URL sin recargar la página
        window.history.pushState({ path: nuevaUrl.href }, '', nuevaUrl.href);

    }

    function actualizarEstadoBoton(boton, inicioRangoURL, finRangoURL) {
        // Obtiene el botón a partir de su id
        const botonElemento = document.getElementById(boton.id);
    
        // Compara las fechas pasadas como parámetros con las fechas objetivo
        if ((boton.inicioRango === inicioRangoURL || boton.inicioRango === undefined) && 
            (boton.finRango === finRangoURL || boton.finRango === undefined)) {
            // Si ambos parámetros coinciden, deshabilita el botón
            botonElemento.classList.add('boton-desactivado'); // Añadir clase para desactivar
            botonElemento.disabled = true; // Desactiva el botón
        } else {
            // Si al menos uno no coincide, restaura la funcionalidad del botón
            botonElemento.classList.remove('boton-desactivado'); // Quitar clase para activar
            botonElemento.disabled = false; // Habilita el botón
        }
    }    

    ////////////////////////// FUNCIONES AUXILIARES /////////////////////////////////

    function obtenerParamsDesdeURL() {
        const params = new URLSearchParams(window.location.search);
        const inicioRango = params.get('inicio_rango') || "";
        const finRango = params.get('fin_rango') || "";
        return [inicioRango, finRango]
    }

    function convertirParamsAFecha(inicioRangoParam, finRangoParam) {
        const fechas = [inicioRangoParam, finRangoParam];
        return fechas.filter(Boolean).map(fecha => new Date(fecha))
    }

    function obtenerURLBase() {
        // Obtiene la URL actual
        const currentUrl = window.location.href;
        
        // Usa la URL para crear un objeto URL que te permita manipularla fácilmente
        const url = new URL(currentUrl);
        
        // Elimina los parámetros de la URL
        url.search = '';
    
        // Devuelve la URL base sin los parámetros
        return url.toString();
    }

    function formatearFecha(fecha) {
        // Formatea las fechas en formato dd/mm/yy.

        let date = new Date(fecha);
        return date.toLocaleDateString('es-ES', { year: '2-digit', month: '2-digit', day: '2-digit' });
    }

    function obtenerFechaActual() {
        const fechaActual = new Date();
        return fechaActual.toISOString().split('T')[0];
    }

    function obtenerColor(indice) {
        // Devuelve una tonalidad del color base en función del valor dado

        const colorBase = "#d5966c";
        tonalidad = indice % 5; // Alterna entre 5 posibles tonalidades
        return oscurecerColorHex(colorBase, tonalidad)
    }

    function oscurecerColorHex(colorBase, factor) {
        // El factor determina cuánto se oscurece
        const cantidadOscurecer = factor * 10; // A mayor factor, mayor oscurecimiento
    
        // Convertir el color hexadecimal a RGB
        let r = parseInt(colorBase.substring(1, 3), 16);
        let g = parseInt(colorBase.substring(3, 5), 16);
        let b = parseInt(colorBase.substring(5, 7), 16);
    
        // Oscurecer cada componente RGB (restando el valor calculado)
        r = Math.max(0, r - cantidadOscurecer);
        g = Math.max(0, g - cantidadOscurecer);
        b = Math.max(0, b - cantidadOscurecer);
    
        // Convertir de nuevo a hexadecimal
        const colorOscurecido = `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
        return colorOscurecido;
    }

});
