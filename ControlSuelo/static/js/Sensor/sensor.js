function cargarSensores() {
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = ''; // Limpiar el contenedor antes de cargar nuevos datos

    fetch('../vistaSensor')  // Cambia esto por la URL correcta a tu vista
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contenedorTablas.innerHTML = html;

            const tablaSensores = document.getElementById('tbl-sensores'); // Asegúrate de tener una tabla con este ID en la respuesta

            if (!tablaSensores) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }

            // Inicializa DataTable en la tabla de sensores
            $('#tbl-sensores').DataTable({
                language: {
                    search: "Buscar:",
                },
                paging: false,          // Desactiva la paginación
                ordering: false,        // Desactiva las flechas de ordenamiento
                info: false,            // Desactiva el texto de información de la tabla
                scrollX: true,         // Activa el desplazamiento horizontal
                fixedHeader: true,     // Fija el encabezado y el buscador
            });
        })
        .catch(error => {
            console.error('Error al cargar los sensores:', error);
        });
}





function registrarSensor() {
    // Obtener los valores del formulario
    const tipo = document.getElementById('tipo').value;
    const descripcion = document.getElementById('descripcion').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const fecha_instalacion = document.getElementById('fecha_instalacion').value;

    // Crear el objeto con los datos a enviar
    const data = new FormData();
    data.append('tipo', tipo);
    data.append('descripcion', descripcion);
    data.append('ubicacion', ubicacion);
    data.append('fecha_instalacion', fecha_instalacion);

    // Enviar los datos usando fetch
    fetch('registrarSensor/', {
        method: 'POST',
        body: data,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value // CSRF token para seguridad
        }
    })
    .then(response => response.json())  // Convertir la respuesta a JSON
    .then(data => {
        if (data.success) {
            alert('Sensor registrado con éxito');
            // Opcional: limpiar el formulario si el registro fue exitoso
            document.getElementById('formulario-sensor').reset();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al registrar el sensor.');
    });
}