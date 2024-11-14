// Función para obtener el token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function cargarSensores() {
    // Limpia el contenedor 
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = ''; 

    fetch(`../vistaSensor/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contenedorTablas.innerHTML = html;
            const tablaUbicacion = document.getElementById('tbl-sensor');
            
            if (!tablaUbicacion) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            
            // Inicializa DataTables con los ajustes
            $('#tbl-sensor').DataTable({
                language: {
                    search: "Buscar:",
                    emptyTable: "No hay sensores disponibles",
                    zeroRecords: "No se encontraron coincidencias",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ sensores",
                    infoEmpty: "No hay sensores para mostrar",
                    lengthMenu: "Mostrar _MENU_ sensores",
                },
                paging: false,          // Desactiva la paginación
                ordering: false,        // Desactiva las flechas de ordenamiento
                info: false,            // Desactiva el texto de información de la tabla
                scrollX: true,          // Activa el desplazamiento horizontal
                fixedHeader: true,      // Fija el encabezado y el buscador
                autoWidth: false,       // Desactiva el autoajuste de ancho de columna
            });
        })
        .catch(error => {
            console.error('Error al cargar los sensores:', error);
        });
}

function guardarDatosSensores() {
    const formularioElement = document.getElementById('formAgregarSensor');
    const inputs = formularioElement.querySelectorAll('input, textarea,select'); // Seleccionar inputs y textareas
    let allFieldsValid = true; // Variable para verificar si todos los campos son válidos

   // Verifica si todos los campos están llenos
   inputs.forEach(input => {
    if (!input.value) {
        allFieldsValid = false; // Marca como inválido si hay un campo vacío
        input.classList.add('is-invalid'); // Agrega clase para mostrar error
    } else {
        input.classList.remove('is-invalid'); // Remueve la clase de error si el campo es válido
        }
    });

    // Si hay campos vacíos, no envíes el formulario
    if (!allFieldsValid) {
        alert("Todos los campos son obligatorios."); // Mensaje de error
        return; // Detener la ejecución de la función
    }

    const formulario = new FormData(formularioElement); // Crear FormData después de verificar los campos
    fetch('../registrar_sensor/', {  
        method: 'POST',
        body: formulario,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')  
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {  //aqui estan los mensajes de error 
                throw new Error(data.error || 'Error en la red');
            });
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Sensor agregado:', data);
        $('#modalAgregarSensor').modal('hide');
        Swal.fire({
            title: "CONFIRMACIÓN",
            text: "Sensor agregado exitosamente.",
            icon: 'success'
        })
        cargarSensores();
    })
    .catch(error => {
        console.error('Error al agregar el sensor', error);
        alert(error.message);  
    });
}


function abrirModalVerSensores(sensor_id) {
    fetch(`../obtenerSensor/${sensor_id}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el sensor: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('verId').value=data.id;
            document.getElementById('verTipo').value = data.tipo;
            document.getElementById('verDescripcion').value = data.descripcion;
            document.getElementById('verUbicacion').value = data.ubicacion;
            document.getElementById('verFechaInstalacion').value = data.fecha_instalacion;
            
            // Abrir el modal
            $('#modalVerSensor').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function guardarDatosEditadosSensor() {
    const sensor_id = document.getElementById('verId').value; 
    const formularioElement = document.getElementById('formEditarSensor');
    const inputs = formularioElement.querySelectorAll('input, textarea'); // Seleccionar inputs y textareas
    let allFieldsValid = true;
    inputs.forEach(input => {
        if (!input.value &&  input.type !== "file") {
            allFieldsValid = false; // Marca como inválido si hay un campo vacío
            input.classList.add('is-invalid'); // Agrega clase para mostrar error
        } else {
            input.classList.remove('is-invalid'); // Remueve la clase de error si el campo es válido
        }
    });

    // Si hay campos vacíos, no envíes el formulario
    if (!allFieldsValid) {
        alert("Algunos  campos son necesarios "); // Mensaje de error
        return; // Detener la ejecución de la función
    }

    const formulario = new FormData(formularioElement);
    fetch(`../editarSensor/${sensor_id}/`, {  
        method: 'POST',
        body: formulario,
        headers: {
            'X-CSRFToken': getCookie('csrftoken') 
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Error desconocido');
            });
        }
        $('#modalVerSensor').modal('hide'); 
        Swal.fire({
            title: "CONFIRMACIÓN",
            text: "Sensor editado exitosamente.",
            icon: 'success'
        })
        
        cargarSensores();  
    })
    .catch(error => {
        console.error('Error al actualizar el sensor:', error);
        alert(`Error: ${error.message}`); 
    });
}

function eliminarSensor(sensor_id){
    // Confirma si el usuario realmente quiere eliminar el propietario
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este registro?');

    if (confirmacion) {
        fetch(`../eliminarSensor/${sensor_id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken') 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el sensor');
            }
            Swal.fire({
                title: "ELIMINACIÓN",
                text: "Sensor eliminado exitosamente.",
                icon: 'error'
            })
            
            cargarSensores();  
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error: ${error.message}`); 
        });
    }
    }
