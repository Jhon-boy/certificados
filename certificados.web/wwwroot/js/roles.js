$(function () {
    inicializarTabla('#tabla-rol');
});

function inicializarTabla(selector) {
    $(selector).DataTable({
        language: {
            sProcessing: 'Procesando...',
            sLengthMenu: 'Mostrar _MENU_ registros',
            sZeroRecords: 'No se encontraron resultados',
            sEmptyTable: 'Ningún dato disponible en esta tabla',
            sInfo: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
            sInfoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
            sInfoFiltered: '(filtrado de un total de _MAX_ registros)',
            sSearch: 'Buscar:',
            sLoadingRecords: 'Cargando...',
            oPaginate: {
                sFirst: 'Primero',
                sPrevious: 'Anterior',
                sNext: 'Siguiente',
                sLast: 'Último',
            },
        },
    });
}

let datosRol = { roles: [] };

// Obtener los datos del formulario
function obtenerDatosFormulario(tipo) {
    const prefijo = tipo.toLowerCase();
    return {
        nombre: $(`#${prefijo}-nombre`).val().trim(),
        observacion: $(`#${prefijo}-observacion`).val().trim(),
        estado: $(`#${prefijo}-estado`).val().trim(),
        usuarioIngreso: $(`#${prefijo}-usuarioingreso`).val().trim(),
    };
}

// Agregar nuevo rol
function agregarRol(tipo) {
    const prefijo = tipo.toLowerCase();
    $(`#${prefijo}-nombre, #${prefijo}-observacion, #${prefijo}-estado, #${prefijo}-usuarioingreso`).val('');
    $('#modal-editar-rol-label').text(`Agregar Nuevo ${tipo}`);
    $('#modal-editar-rol').modal('show');

    $('#btn-guardar-cambios').off('click').on('click', () => guardarCambios(tipo));
}

// Editar rol
function editarElemento(tipo, nombre) {
    const item = obtenerElemento(tipo, nombre);

    if (item) {
        const prefijo = tipo.toLowerCase();
        $(`#${prefijo}-nombre`).val(item.nombre);
        $(`#${prefijo}-observacion`).val(item.observacion);
        $(`#${prefijo}-estado`).val(item.estado);
        $(`#${prefijo}-usuarioingreso`).val(item.usuarioIngreso);
        $('#modal-editar-rol-label').text(`Editar ${tipo}`);
        $('#modal-editar-rol').modal('show');

        $('#btn-guardar-cambios').off('click').on('click', () => guardarCambios(tipo, item));
    }
}

// Obtener un elemento específico
function obtenerElemento(tipo, nombre) {
    return datosRol[tipo.toLowerCase()]?.find(item => item.nombre === nombre);
}

// Guardar cambios (agregar o editar)
function guardarCambios(tipo, itemEditado = null) {
    const { nombre, observacion, estado, usuarioIngreso } = obtenerDatosFormulario(tipo);

    if (!nombre) {
        alert(`El campo 'Nombre' es obligatorio.`);
        return;
    }

    const dataType = tipo.toLowerCase();
    const tableSelector = `#tabla-${dataType}`;
    const table = $(tableSelector).DataTable();

    // Asegurarse de que el array de datos está inicializado
    if (!Array.isArray(datosRol[dataType])) {
        datosRol[dataType] = [];
    }

    if (!itemEditado) {
        agregarNuevoElemento(table, dataType, { nombre, observacion, estado, usuarioIngreso });
    } else {
        editarElementoExistente(table, dataType, itemEditado, { nombre, observacion, estado, usuarioIngreso });
    }

    $('#modal-editar-rol').modal('hide');
}

// Agregar nuevo elemento
function agregarNuevoElemento(table, dataType, { nombre, observacion, estado, usuarioIngreso }) {
    const nuevoElemento = { nombre, observacion, estado, usuarioIngreso };

    // Asegurarse de que el array de datos está inicializado antes de usar `push`
    if (!Array.isArray(datosRol[dataType])) {
        datosRol[dataType] = [];
    }

    datosRol[dataType].push(nuevoElemento);

    table.row.add([nombre, observacion, estado === 'true' ? 'Activo' : 'Inactivo', usuarioIngreso, generarAccionesHtml(dataType, nombre)]).draw();
}

// Editar un elemento existente
function editarElementoExistente(table, dataType, itemEditado, { nombre, observacion, estado, usuarioIngreso }) {
    Object.assign(itemEditado, { nombre, observacion, estado, usuarioIngreso });

    table.rows().every(function () {
        const data = this.data();
        if (data[0] === nombre) {
            this.data([nombre, observacion, estado === 'true' ? 'Activo' : 'Inactivo', usuarioIngreso, generarAccionesHtml(dataType, nombre)]);
        }
    });

    table.draw();
}

// Eliminar un elemento
function eliminarElemento(tipo, nombre) {
    if (confirm(`¿Estás seguro de que deseas eliminar el rol: ${nombre}?`)) {
        const dataType = tipo.toLowerCase();
        const index = datosRol[dataType]?.findIndex(item => item.nombre === nombre);

        if (index !== -1) {
            datosRol[dataType].splice(index, 1);

            const tableSelector = `#tabla-${dataType}`;
            const table = $(tableSelector).DataTable();

            table.rows().every(function () {
                const data = this.data();
                if (data[0] === nombre) {
                    this.remove();
                }
            });

            table.draw();
            alert(`Rol eliminado: ${nombre}`);
        }
    }
}

// Generar HTML para los botones de acciones (editar y eliminar)
function generarAccionesHtml(tipo, nombre) {
    return `
        <div class="text-end">
            <button class="btn btn-primary btn-sm" onclick="editarElemento('${tipo}', '${nombre}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarElemento('${tipo}', '${nombre}')">Eliminar</button>
        </div>`;
}
