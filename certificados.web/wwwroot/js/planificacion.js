$(document).ready(function () {
    $('#planificacion-form').on('submit', function (e) {
        e.preventDefault();
        alert('Formulario guardado exitosamente.');
        // Puedes agregar logica para enviar los datos al servidor aqui.
    });
});


/* JS para realizar consultas de planificaciones */

$(document).ready(function () {
    // Inicializar DataTables
    $('#tablaEventos').DataTable({
        language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "No se encontraron registros",
            info: "Mostrando página _PAGE_ de _PAGES_",
            infoEmpty: "No hay registros disponibles",
            infoFiltered: "(filtrado de _MAX_ registros totales)",
            paginate: {
                previous: "Anterior",
                next: "Siguiente"
            }
        }
    });

    // Boton agregar planificacion
    $('#btnAgregar').on('click', function () {
        alert('Abrir formulario para agregar un nuevo evento.');
        // Aquí puedes redirigir a otro formulario o mostrar un modal.
    });

    // Eventos para editar y eliminar
    $('#tablaEventos').on('click', '.btnEditar', function () {
        alert('Editar registro.');
        // Implementar logica de edicion
    });

    $('#tablaEventos').on('click', '.btnEliminar', function () {
        if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
            // Implementar logica de eliminacion
            alert('Registro eliminado.');
        }
    });
});