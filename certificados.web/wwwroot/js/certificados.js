$(function () {
    inicializarTabla('#tabla-certificado');
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

let datosCertificado = { certificados: [] };

// Obtener los datos del formulario
function obtenerDatosFormulario(tipo) {
    const prefijo = tipo.toLowerCase();
    return new Promise((resolve, reject) => {
        const imagenInput = $(`#${prefijo}-imagen`)[0];
        let imagenBase64 = null;

        if (imagenInput.files.length > 0) {
            const file = imagenInput.files[0];
            const reader = new FileReader();

            reader.onloadend = function () {
                imagenBase64 = reader.result;
                resolve({
                    titulo: $(`#${prefijo}-titulo`).val().trim(),
                    evento: $(`#${prefijo}-evento`).val().trim(),
                    formato: $(`#${prefijo}-formato`).val().trim(),
                    tipo: $(`#${prefijo}-tipo`).val().trim(),
                    estado: $(`#${prefijo}-estado`).val().trim(),
                    usuarioIngreso: $(`#${prefijo}-usuarioingreso`).val().trim(),
                    imagen: imagenBase64
                });
            };

            reader.onerror = function () {
                reject("Error al leer el archivo.");
            };

            reader.readAsDataURL(file); // Convertir la imagen a Base64
        } else {
            resolve({
                titulo: $(`#${prefijo}-titulo`).val().trim(),
                evento: $(`#${prefijo}-evento`).val().trim(),
                formato: $(`#${prefijo}-formato`).val().trim(),
                tipo: $(`#${prefijo}-tipo`).val().trim(),
                estado: $(`#${prefijo}-estado`).val().trim(),
                usuarioIngreso: $(`#${prefijo}-usuarioingreso`).val().trim(),
                imagen: null // No hay imagen seleccionada
            });
        }
    });
}

// Agregar nuevo certificado
function agregarCertificado() {
    const prefijo = "certificado";
    $(`#${prefijo}-titulo, #${prefijo}-evento, #${prefijo}-formato, #${prefijo}-estado, #${prefijo}-usuarioingreso, #${prefijo}-imagen`).val('');
    $('#modal-editar-certificado-label').text('Agregar Nuevo Certificado');
    $('#modal-editar-certificado').modal('show');

    $('#btn-guardar-cambios').off('click').on('click', () => guardarCambios('Certificado'));
}

// Guardar cambios (agregar o editar)
function guardarCambios(tipo, itemEditado = null) {
    obtenerDatosFormulario(tipo).then(({ titulo, evento, formato, tipoCertificado, estado, usuarioIngreso, imagen }) => {
        if (!titulo || !evento || !formato) {
            alert(`Los campos 'Título', 'Evento' y 'Formato' son obligatorios.`);
            return;
        }

        const dataType = tipo.toLowerCase();
        const tableSelector = `#tabla-${dataType}`;
        const table = $(tableSelector).DataTable();

        // Asegurarse de que el array de datos está inicializado
        if (!Array.isArray(datosCertificado[dataType])) {
            datosCertificado[dataType] = [];
        }

        if (!itemEditado) {
            agregarNuevoElemento(table, dataType, { titulo, evento, formato, tipo: tipoCertificado, estado, usuarioIngreso, imagen });
        } else {
            editarElementoExistente(table, dataType, itemEditado, { titulo, evento, formato, tipo: tipoCertificado, estado, usuarioIngreso, imagen });
        }

        $('#modal-editar-certificado').modal('hide');
    }).catch((error) => {
        alert(error);
    });
}

// Agregar nuevo certificado
function agregarNuevoElemento(table, dataType, { titulo, evento, formato, tipo, estado, usuarioIngreso, imagen }) {
    const nuevoElemento = { titulo, evento, formato, tipo, estado, usuarioIngreso, imagen };

    // Asegurarse de que el array de datos está inicializado
    if (!Array.isArray(datosCertificado[dataType])) {
        datosCertificado[dataType] = [];
    }

    datosCertificado[dataType].push(nuevoElemento);

    table.row.add([titulo, evento, formato, tipo, estado === 'true' ? 'Activo' : 'Inactivo', usuarioIngreso, generarAccionesHtml(dataType, evento)]).draw();
}

// Editar un certificado existente
function editarElementoExistente(table, dataType, itemEditado, { titulo, evento, formato, tipo, estado, usuarioIngreso, imagen }) {
    Object.assign(itemEditado, { titulo, evento, formato, tipo, estado, usuarioIngreso, imagen });

    table.rows().every(function () {
        const data = this.data();
        if (data[1] === evento) {
            this.data([titulo, evento, formato, tipo, estado === 'true' ? 'Activo' : 'Inactivo', usuarioIngreso, generarAccionesHtml(dataType, evento)]);
        }
    });

    table.draw();
}

// Generar HTML para los botones de acciones (editar y eliminar)
function generarAccionesHtml(tipo, evento) {
    return `
        <div class="text-end">
            <button class="btn btn-primary btn-sm" onclick="editarElemento('${tipo}', '${evento}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarElemento('${tipo}', '${evento}')">Eliminar</button>
        </div>`;
}
