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

function cargarUbicaciones() {
    // Limpia el contenedor 
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = ''; 

    fetch(`../vistaUbicacion/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contenedorTablas.innerHTML = html;
            const tablaUbicacion = document.getElementById('tbl-ubicacion');
            
            if (!tablaUbicacion) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            
            // Inicializa DataTables con los ajustes
            $('#tbl-ubicacion').DataTable({
                language: {
                    search: "Buscar:",
                    emptyTable: "No hay ubicaciones disponibles",
                    zeroRecords: "No se encontraron coincidencias",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ ubicaciones",
                    infoEmpty: "No hay ubicaciones para mostrar",
                    lengthMenu: "Mostrar _MENU_ ubicaciones",
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
            console.error('Error al cargar las ubicaciones:', error);
        });
}

function guardarDatosUbicacion() {
    const formularioElement = document.getElementById('formAgregarUbicacion');
    const inputs = formularioElement.querySelectorAll('input, textarea'); // Seleccionar inputs y textareas
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
    fetch('../registrar_ubicacion/', {  
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
        console.log('Ubicacion agregada:', data);
        $('#modalAgregarUbicacion').modal('hide');
        Swal.fire({
            title: "CONFIRMACIÓN",
            text: "Ubicacion agregada exitosamente.",
            icon: 'success'
        })
        cargarUbicaciones();
    })
    .catch(error => {
        console.error('Error al agregar la ubicacion', error);
        alert(error.message);  
    });
}


function abrirModalVerUbicacion(ubicacion_id) {
    fetch(`../obtenerUbicacion/${ubicacion_id}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la ubicacion: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('verId').value=data.id;
            document.getElementById('verNombre').value = data.nombre;
            document.getElementById('verDireccion').value = data.direccion;
            document.getElementById('verDescripcion').value = data.descripcion;
            document.getElementById('verFechaCreacion').value = data.fecha_creacion;
            
            // Abrir el modal
            $('#modalVerUbicacion').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function guardarDatosEditadosUbicacion() {
    const ubicacion_id = document.getElementById('verId').value; 
    const formularioElement = document.getElementById('formEditarUbicacion');
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
    fetch(`../editarUbicacion/${ubicacion_id}/`, {  
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
        $('#modalVerUbicacion').modal('hide'); 
        Swal.fire({
            title: "CONFIRMACIÓN",
            text: "Ubicacion editada exitosamente.",
            icon: 'success'
        })
        
        cargarUbicaciones();  
    })
    .catch(error => {
        console.error('Error al actualizar la ubicacion:', error);
        alert(`Error: ${error.message}`); 
    });
}

function eliminarUbicacion(ubicacion_id){
    // Confirma si el usuario realmente quiere eliminar el propietario
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este registro?');

    if (confirmacion) {
        fetch(`../eliminarUbicacion/${ubicacion_id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken') 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la ubicacion');
            }
            Swal.fire({
                title: "ELIMINACIÓN",
                text: "Ubicacion eliminada exitosamente.",
                icon: 'error'
            })
            
            cargarUbicaciones();  
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error: ${error.message}`); 
        });
    }
    }
