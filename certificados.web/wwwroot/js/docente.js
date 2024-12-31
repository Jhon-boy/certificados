$(function () {
    inicializarTabla('#tabla-docente');
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

let datosDocente = { docentes: [] };

// Obtener los datos del formulario
function obtenerDatosFormulario(tipo) {
    const prefijo = tipo.toLowerCase();
    return {
        codigo: $(`#${prefijo}-codigo`).val().trim(),
        cedula: $(`#${prefijo}-cedula`).val().trim(),
        titulo: $(`#${prefijo}-titulo`).val().trim(),
        facultad: $(`#${prefijo}-facultad`).val().trim(),
        carrera: $(`#${prefijo}-carrera`).val().trim(),
        estado: $(`#${prefijo}-estado`).val().trim(),
        usuarioIngreso: $(`#${prefijo}-usuarioingreso`).val().trim(),
    };
}

// Agregar nuevo docente
function agregarDocente() {
    const prefijo = "docente";
    $(`#${prefijo}-codigo, #${prefijo}-cedula, #${prefijo}-titulo, #${prefijo}-facultad, #${prefijo}-carrera, #${prefijo}-estado, #${prefijo}-usuarioingreso`).val('');
    $('#modal-editar-docente-label').text('Agregar Nuevo Docente');
    $('#modal-editar-docente').modal('show');

    $('#btn-guardar-cambios').off('click').on('click', () => guardarCambios('Docente'));
}

// Editar docente
function editarElemento(tipo, codigo) {
    const item = obtenerElemento(tipo, codigo);

    if (item) {
        const prefijo = tipo.toLowerCase();
        $(`#${prefijo}-codigo`).val(item.codigo);
        $(`#${prefijo}-cedula`).val(item.cedula);
        $(`#${prefijo}-titulo`).val(item.titulo);
        $(`#${prefijo}-facultad`).val(item.facultad);
        $(`#${prefijo}-carrera`).val(item.carrera);
        $(`#${prefijo}-estado`).val(item.estado);
        $(`#${prefijo}-usuarioingreso`).val(item.usuarioIngreso);
        $('#modal-editar-docente-label').text(`Editar Docente`);
        $('#modal-editar-docente').modal('show');

        $('#btn-guardar-cambios').off('click').on('click', () => guardarCambios(tipo, item));
    }
}

// Obtener un elemento específico
function obtenerElemento(tipo, codigo) {
    return datosDocente[tipo.toLowerCase()]?.find(item => item.codigo === codigo);
}

// Guardar cambios (agregar o editar)
function guardarCambios(tipo, itemEditado = null) {
    const { codigo, cedula, titulo, facultad, carrera, estado, usuarioIngreso } = obtenerDatosFormulario(tipo);

    if (!codigo || !cedula || !titulo) {
        alert(`Los campos 'Código Docente', 'Cédula' y 'Título' son obligatorios.`);
        return;
    }

    const dataType = tipo.toLowerCase();
    const tableSelector = `#tabla-${dataType}`;
    const table = $(tableSelector).DataTable();

    // Asegurarse de que el array de datos está inicializado
    if (!Array.isArray(datosDocente[dataType])) {
        datosDocente[dataType] = [];
    }

    if (!itemEditado) {
        agregarNuevoElemento(table, dataType, { codigo, cedula, titulo, facultad, carrera, estado, usuarioIngreso });
    } else {
        editarElementoExistente(table, dataType, itemEditado, { codigo, cedula, titulo, facultad, carrera, estado, usuarioIngreso });
    }

    $('#modal-editar-docente').modal('hide');
}

// Agregar nuevo elemento
function agregarNuevoElemento(table, dataType, { codigo, cedula, titulo, facultad, carrera, estado, usuarioIngreso }) {
    const nuevoElemento = { codigo, cedula, titulo, facultad, carrera, estado, usuarioIngreso };

    // Asegurarse de que el array de datos está inicializado antes de usar `push`
    if (!Array.isArray(datosDocente[dataType])) {
        datosDocente[dataType] = [];
    }

    datosDocente[dataType].push(nuevoElemento);

    table.row.add([codigo, cedula, titulo, facultad, carrera, estado === '1' ? 'Activo' : 'Inactivo', usuarioIngreso, generarAccionesHtml(dataType, codigo)]).draw();
}

// Editar un elemento existente
function editarElementoExistente(table, dataType, itemEditado, { codigo, cedula, titulo, facultad, carrera, estado, usuarioIngreso }) {
    Object.assign(itemEditado, { codigo, cedula, titulo, facultad, carrera, estado, usuarioIngreso });

    table.rows().every(function () {
        const data = this.data();
        if (data[0] === codigo) {
            this.data([codigo, cedula, titulo, facultad, carrera, estado === '1' ? 'Activo' : 'Inactivo', usuarioIngreso, generarAccionesHtml(dataType, codigo)]);
        }
    });

    table.draw();
}

// Eliminar un elemento
function eliminarElemento(tipo, codigo) {
    if (confirm(`¿Estás seguro de que deseas eliminar el docente con código: ${codigo}?`)) {
        const dataType = tipo.toLowerCase();
        const index = datosDocente[dataType]?.findIndex(item => item.codigo === codigo);

        if (index !== -1) {
            datosDocente[dataType].splice(index, 1);

            const tableSelector = `#tabla-${dataType}`;
            const table = $(tableSelector).DataTable();

            table.rows().every(function () {
                const data = this.data();
                if (data[0] === codigo) {
                    this.remove();
                }
            });

            table.draw();
            alert(`Docente eliminado: Código ${codigo}`);
        }
    }
}

// Generar HTML para los botones de acciones (editar y eliminar)
function generarAccionesHtml(tipo, codigo) {
    return `
        <div class="text-end">
            <button class="btn btn-primary btn-sm" onclick="editarElemento('${tipo}', '${codigo}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarElemento('${tipo}', '${codigo}')">Eliminar</button>
        </div>`;
}
