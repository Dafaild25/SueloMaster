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