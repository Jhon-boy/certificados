let planificaciones = [];

function agregarPlanificacion() {
    $('#modal-editar').modal('show');
}

$(document).on('click', '.dropdown-item', function () {
    const decanato = $(this).data('decanato');
    $('#formModalLabel').text('Decanato: ' + decanato);
    $('#formModal').modal('show');
    $('#tipoEvento').val('Capacitación laboral o profesional');
    $('#curso').val('Herramientas de gestión para publicaciones');
    $('#dominio').val(decanato);
    $('#lineaInvestigacion').val(decanato);
    $('#ciclo').val('2023-2024 CI');
    $('#facilitador').val('');
    $('#modalidad').val('Virtual');
    $('#horario').val('');
    $('#fechaInicio').val('');
    $('#fechaFin').val('');
    $('#grupo').val('');
    $('#horas').val('');
    $('#tematica').val('');
});

$('#formModal form').on('submit', function (event) {
    event.preventDefault();
    const nuevaPlanificacion = {
        tipoEvento: $('#tipoEvento').val(),
        curso: $('#curso').val(),
        dominio: $('#dominio').val(),
        lineaInvestigacion: $('#lineaInvestigacion').val(),
        ciclo: $('#ciclo').val(),
        facilitador: $('#facilitador').val(),
        modalidad: $('#modalidad').val(),
        horario: $('#horario').val(),
        fechaInicio: $('#fechaInicio').val(),
        fechaFin: $('#fechaFin').val(),
        grupo: $('#grupo').val(),
        horas: $('#horas').val(),
        tematica: $('#tematica').val(),
    };
    planificaciones.push(nuevaPlanificacion);
    agregarFilaTabla(nuevaPlanificacion);
    $('#formModal').modal('hide');
});

function agregarFilaTabla(planificacion) {
    const tabla = $('#tabla-planificacion tbody');
    const fila = `
            <tr>
                <td>${planificacion.tipoEvento}</td>
                <td>${planificacion.facilitador}</td>
                <td>${planificacion.modalidad}</td>
                <td>${planificacion.fechaInicio}</td>
                <td>${planificacion.fechaFin}</td>
                <td>${planificacion.horas}</td>
                <td>${planificacion.grupo}</td>
                <td>${planificacion.tematica}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="editarPlanificacion(${planificaciones.length - 1})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPlanificacion(${planificaciones.length - 1})">Eliminar</button>
                </td>
            </tr>
        `;
    tabla.append(fila);
}

function editarPlanificacion(index) {
    const planificacion = planificaciones[index];
    $('#tipoEvento').val(planificacion.tipoEvento);
    $('#curso').val(planificacion.curso);
    $('#dominio').val(planificacion.dominio);
    $('#lineaInvestigacion').val(planificacion.lineaInvestigacion);
    $('#ciclo').val(planificacion.ciclo);
    $('#facilitador').val(planificacion.facilitador);
    $('#modalidad').val(planificacion.modalidad);
    $('#horario').val(planificacion.horario);
    $('#fechaInicio').val(planificacion.fechaInicio);
    $('#fechaFin').val(planificacion.fechaFin);
    $('#grupo').val(planificacion.grupo);
    $('#horas').val(planificacion.horas);
    $('#tematica').val(planificacion.tematica);
    $('#formModalLabel').text('Editar Planificación');
    $('#formModal').modal('show');

    $('#formModal form').off('submit').on('submit', function (event) {
        event.preventDefault();
        planificaciones[index] = {
            tipoEvento: $('#tipoEvento').val(),
            curso: $('#curso').val(),
            dominio: $('#dominio').val(),
            lineaInvestigacion: $('#lineaInvestigacion').val(),
            ciclo: $('#ciclo').val(),
            facilitador: $('#facilitador').val(),
            modalidad: $('#modalidad').val(),
            horario: $('#horario').val(),
            fechaInicio: $('#fechaInicio').val(),
            fechaFin: $('#fechaFin').val(),
            grupo: $('#grupo').val(),
            horas: $('#horas').val(),
            tematica: $('#tematica').val(),
        };
        actualizarTabla();
        $('#formModal').modal('hide');
    });
}

function eliminarPlanificacion(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta planificación?')) {
        planificaciones.splice(index, 1);
        actualizarTabla();
    }
}

function actualizarTabla() {
    const tabla = $('#tabla-planificacion tbody');
    tabla.empty();
    planificaciones.forEach((planificacion, index) => {
        const fila = `
                <tr>
                    <td>${planificacion.tipoEvento}</td>
                    <td>${planificacion.facilitador}</td>
                    <td>${planificacion.modalidad}</td>
                    <td>${planificacion.fechaInicio}</td>
                    <td>${planificacion.fechaF
