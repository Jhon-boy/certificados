$(function () {
    $('#tabla-grupos').DataTable({
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
});

let grupos = [];
function agregarGrupo() {
    $('#grupo-nombre').val('');
    $('#modal-editar-label').text('Agregar Nuevo Grupo');
    $('#modal-editar').modal('show');
}
function editarRegistro(grupoNombre) {
    const grupo = grupos.find(g => g.nombre === grupoNombre);

    if (grupo) {
        $('#grupo-nombre').val(grupo.nombre);
        $('#modal-editar-label').text('Editar Grupo');
        $('#modal-editar').modal('show');

        $('#btn-guardar-cambios').off('click').on('click', function () {
            guardarCambios(grupo);
        });
    }
}
function guardarCambios(grupoEditado) {
    const nombreGrupo = $('#grupo-nombre').val();

    if (!nombreGrupo) {
        alert('El nombre del grupo es obligatorio.');
        return;
    }

    if ($('#modal-editar-label').text() === 'Agregar Nuevo Grupo') {
        const nuevoGrupo = { nombre: nombreGrupo };
        grupos.push(nuevoGrupo);

        $('#tabla-grupos')
            .DataTable()
            .row.add([
                nombreGrupo,
                `<div class="text-end">
             <button class="btn btn-primary btn-sm" onclick="editarRegistro('${nombreGrupo}')">Editar</button>
             <button class="btn btn-danger btn-sm" onclick="eliminarRegistro('${nombreGrupo}')">Eliminar</button>
           </div>`,
            ])
            .draw();

        alert(`Nuevo grupo agregado: ${nombreGrupo}`);
    } else {
        grupoEditado.nombre = nombreGrupo;

        const table = $('#tabla-grupos').DataTable();
        table.rows().every(function () {
            const data = this.data();
            if (data[0] === grupoEditado.nombre) {
                data[0] = grupoEditado.nombre;
                data[1] = `<div class="text-end">
                      <button class="btn btn-primary btn-sm" onclick="editarRegistro('${grupoEditado.nombre}')">Editar</button>
                      <button class="btn btn-danger btn-sm" onclick="eliminarRegistro('${grupoEditado.nombre}')">Eliminar</button>
                    </div>`;
                this.data(data);
            }
        });
        table.draw();

        alert(`Cambios guardados para: ${nombreGrupo}`);
    }

    $('#modal-editar').modal('hide');
}
function eliminarRegistro(grupoNombre) {
    if (confirm(`¿Estás seguro de que deseas eliminar el grupo: ${grupoNombre}?`)) {
        const grupoIndex = grupos.findIndex(g => g.nombre === grupoNombre);

        if (grupoIndex !== -1) {
            grupos.splice(grupoIndex, 1);

            var table = $('#tabla-grupos').DataTable();
            table.rows().every(function () {
                var data = this.data();
                if (data[0] === grupoNombre) {
                    this.remove();
                }
            });
            table.draw();

            alert(`Grupo eliminado: ${grupoNombre}`);
        }
    }
}