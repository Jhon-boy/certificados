$(function () {
    inicializarTabla('#tabla-persona');
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

let datosPersona = { personas: [] };

// Obtener los datos del formulario
function obtenerDatosFormulario(tipo) {
    const prefijo = tipo.toLowerCase();
    return {
        cedula: $(`#${prefijo}-cedula`).val().trim(),
        nombres: $(`#${prefijo}-nombres`).val().trim(),
        apellidos: $(`#${prefijo}-apellidos`).val().trim(),
        edad: $(`#${prefijo}-edad`).val().trim(),
        genero: $(`#${prefijo}-genero`).val().trim(),
        email: $(`#${prefijo}-email`).val().trim(),
        clave: $(`#${prefijo}-clave`).val().trim(),
        rol: $(`#${prefijo}-rol`).val().trim(),
    };
}

// Agregar nueva persona
function agregarPersona(tipo) {
    const prefijo = tipo.toLowerCase();
    $(`#${prefijo}-cedula, #${prefijo}-nombres, #${prefijo}-apellidos, #${prefijo}-edad, #${prefijo}-email, #${prefijo}-clave, #${prefijo}-rol`).val('');
    $('#modal-editar-persona-label').text(`Agregar Nueva ${tipo}`);
    $('#modal-editar-persona').modal('show');

    $('#btn-guardar-cambios').off('click').on('click', () => guardarCambios(tipo));
}

// Editar persona
function editarElemento(tipo, cedula) {
    const item = obtenerElemento(tipo, cedula);

    if (item) {
        const prefijo = tipo.toLowerCase();
        $(`#${prefijo}-cedula`).val(item.cedula);
        $(`#${prefijo}-nombres`).val(item.nombres);
        $(`#${prefijo}-apellidos`).val(item.apellidos);
        $(`#${prefijo}-edad`).val(item.edad);
        $(`#${prefijo}-genero`).val(item.genero);
        $(`#${prefijo}-email`).val(item.email);
        $(`#${prefijo}-rol`).val(item.rol);
        $('#modal-editar-persona-label').text(`Editar ${tipo}`);
        $('#modal-editar-persona').modal('show');

        $('#btn-guardar-cambios').off('click').on('click', () => guardarCambios(tipo, item));
    }
}

// Obtener un elemento específico
function obtenerElemento(tipo, cedula) {
    return datosPersona[tipo.toLowerCase()]?.find(item => item.cedula === cedula);
}

// Guardar cambios (agregar o editar)
function guardarCambios(tipo, itemEditado = null) {
    const { cedula, nombres, apellidos, edad, genero, email, clave, rol } = obtenerDatosFormulario(tipo);

    if (!nombres || !cedula || !email) {
        alert(`Los campos 'Nombres', 'Cédula' y 'Email' son obligatorios.`);
        return;
    }

    const dataType = tipo.toLowerCase();
    const tableSelector = `#tabla-${dataType}`;
    const table = $(tableSelector).DataTable();

    // Asegurarse de que el array de datos está inicializado
    if (!Array.isArray(datosPersona[dataType])) {
        datosPersona[dataType] = [];
    }

    if (!itemEditado) {
        agregarNuevoElemento(table, dataType, { cedula, nombres, apellidos, edad, genero, email, clave, rol });
    } else {
        editarElementoExistente(table, dataType, itemEditado, { cedula, nombres, apellidos, edad, genero, email, clave, rol });
    }

    $('#modal-editar-persona').modal('hide');
}

// Agregar nuevo elemento
function agregarNuevoElemento(table, dataType, { cedula, nombres, apellidos, edad, genero, email, clave, rol }) {
    const nuevoElemento = { cedula, nombres, apellidos, edad, genero, email, clave, rol };

    // Asegurarse de que el array de datos está inicializado antes de usar `push`
    if (!Array.isArray(datosPersona[dataType])) {
        datosPersona[dataType] = [];
    }

    datosPersona[dataType].push(nuevoElemento);

    table.row.add([cedula, nombres, apellidos, edad, genero, email, rol, generarAccionesHtml(dataType, cedula)]).draw();
}

// Editar un elemento existente
function editarElementoExistente(table, dataType, itemEditado, { cedula, nombres, apellidos, edad, genero, email, clave, rol }) {
    Object.assign(itemEditado, { cedula, nombres, apellidos, edad, genero, email, clave, rol });

    table.rows().every(function () {
        const data = this.data();
        if (data[0] === cedula) {
            this.data([cedula, nombres, apellidos, edad, genero, email, rol, generarAccionesHtml(dataType, cedula)]);
        }
    });

    table.draw();
}

// Eliminar un elemento
function eliminarElemento(tipo, cedula) {
    if (confirm(`¿Estás seguro de que deseas eliminar la persona con cédula: ${cedula}?`)) {
        const dataType = tipo.toLowerCase();
        const index = datosPersona[dataType]?.findIndex(item => item.cedula === cedula);

        if (index !== -1) {
            datosPersona[dataType].splice(index, 1);

            const tableSelector = `#tabla-${dataType}`;
            const table = $(tableSelector).DataTable();

            table.rows().every(function () {
                const data = this.data();
                if (data[0] === cedula) {
                    this.remove();
                }
            });

            table.draw();
            alert(`Persona eliminada: Cédula ${cedula}`);
        }
    }
}

// Generar HTML para los botones de acciones (editar y eliminar)
function generarAccionesHtml(tipo, cedula) {
    return `
        <div class="text-end">
            <button class="btn btn-primary btn-sm" onclick="editarElemento('${tipo}', '${cedula}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarElemento('${tipo}', '${cedula}')">Eliminar</button>
        </div>`;
}
