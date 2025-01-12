
let userInfoEv = JSON.parse(localStorage.getItem('userInfo'));

async function cargarDatosEventos() {
     
    try {
        const eventosResponse = await Utils.httpRequest(
            `${Utils.path}/evento/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true);
        setTimeout(() => {
            const response = eventosResponse;
            const tablaBody = document.querySelector("#tabla-evento tbody");
            tablaBody.innerHTML = '';

            if (response.cod === Utils.COD_OK && response.data.length > 0) {
                response.data.forEach(evento => {
                    const fila = `
                <tr>
                    <td>${evento.idevento}</td>
                    <td>${evento.tematica}</td>
                    <td>${evento.dominio}</td>
                    <td>${Utils.formatFecha(evento.fechaInicio)} -${Utils.formatFecha(evento.fechaFin)}  </td>
                    <td>${evento.tmodalidad.nombre}</td>  
                    <td>${evento.lugar}</td>  
                    <td>
                        <i class="bi bi-pencil-fill text-success me-3" style="cursor: pointer;" onclick="editarevento(${evento.idevento})" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar evento"></i>
                        <i class="bi bi-trash-fill text-danger me-3" style="cursor: pointer;" onclick="eliminarEvento(${evento.idevento})" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar evento"></i>
                    </td>
                </tr>
            `; 
                    tablaBody.insertAdjacentHTML("beforeend", fila);
                });
                 cargarDatosTipoEvento();
                Utils.showToast('DATOS CARGADOS EXITOSAMENTE', 'success');
            } else {
                tablaBody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron eventos.</td></tr>';
                Utils.showToast('NO EXISTEN ROLES REGISTRADOS', 'info');
            }
        }, 150);

    } catch (error) {
        console.log(error)
        Utils.showToast("Error cargando datos iniciales", 'error');
    }

}
async function cargarDatosTipoEvento() {
    try {
        const tipoResponse = await Utils.httpRequest(
            `${Utils.path}/tipoEvento/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true);
        setTimeout(() => {
            const response = tipoResponse;
            const tablaBody = document.querySelector("#tabla-tipoevento tbody");
            tablaBody.innerHTML = '';

            if (response.cod === Utils.COD_OK && response.data.length > 0) {
                response.data.forEach(tipo => {
                    const fila = `  
                <tr>
                    <td>${tipo.idtipoevento}</td>
                    <td>${tipo.nombre}</td>
                    <td>${tipo.descripcion}</td>
                    <td>${Utils.formatFecha(tipo.fCreacion)} </td>
                    <td>${Utils.formatFecha(tipo.fModificacion)} </td>
                    <td>${tipo.usuarioIngreso}</td>  
                    <td>
                        <i class="bi bi-pencil-fill text-success me-3" style="cursor: pointer;" onclick="editarTipoEvento(${tipo.idtipoevento})" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar evento"></i>
                        <i class="bi bi-trash-fill text-danger me-3" style="cursor: pointer;" onclick="eliminarTipoEvento(${tipo.idtipoevento})" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar evento"></i>
                    </td>
                </tr>
            `;
                    tablaBody.insertAdjacentHTML("beforeend", fila);
                });
            } else {
                tablaBody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron eventos.</td></tr>';
                Utils.showToast('NO EXISTEN ROLES REGISTRADOS', 'info');
            }
        }, 150);

    } catch (error) {
        console.log(error)
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

async function editarevento(id) {
    try {

        const requestEdit = await getEventoById(id);
        const ModalEdit = document.getElementById('modalEditarEvento');
        const modalBootstrap = new bootstrap.Modal(ModalEdit);
        if (requestEdit && requestEdit.data) {
            const data = requestEdit.data;
            document.getElementById('idEventoE').value = data.idevento;
            document.getElementById('modalidadE').value = data.idModalidad;
            document.getElementById('ttipoEvento').value = data.idTipoEvento;
            document.getElementById('idDecanatoE').value = data.idDecanato;
            document.getElementById('idGrupoE').value = data.idGrupo;


            document.getElementById('tematicaEvento').value = data.tematica;
            document.getElementById('dominioE').value = data.dominio;
            document.getElementById('FechaInicio').value = new Date(data.fechaInicio).toISOString().split('T')[0];
            document.getElementById('FechaFin').value = new Date(data.fechaFin).toISOString().split('T')[0];
            document.getElementById('Horas').value = data.horas;
            document.getElementById('lugarE').value = data.lugar;
            document.getElementById('grupoParticipante').value = data.tgrupo.nombre;
            document.getElementById('periodoEvento').value = data.periodo;
            document.getElementById('conCertificado').value = data.conCertificado ? 'true' : 'false';
            document.getElementById('uActualizacion').value = userInfoEv.nombre;

            modalBootstrap.show();
        } else {
            Utils.showToast("No se encontraron datos para el evento seleccionado", "warning");
        }
    } catch (error) {
        console.error(error);
        Utils.showToast("Error al cargar el evento", "error");
    }

}

async function confirmarEditarEvento(event) {
    event.preventDefault();

    if (!validarFormulario('formEditarEvento')) {
        Utils.showToast("Corrige los errores en el formulario", "warning");
        return;
    } 
    Utils.showToast("Formulario válido. Procesando datos...", "success");

}
async function editarTipoEvento(idTipo) {
    try {
        const modalElement = document.getElementById('modalEditarEventoTipo');
        const modalBootstrap = new bootstrap.Modal(modalElement);

        const payloadEdit = {
            idtipoevento: idTipo
        }
        const EditResponse = await Utils.httpRequest(
            `${Utils.path}/tipoEvento/id`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadEdit)
            },
            true);
        if (EditResponse.cod == Utils.COD_OK) {
            const data = EditResponse.data;
            document.getElementById('idTipoEventoE').value = data.idtipoevento;
            document.getElementById('nombreTipoEvento').value = data.nombre;
            document.getElementById('descripcionTipoEvento').value = data.descripcion;
            document.getElementById('usuarioActualizacion').value = userInfoEv.nombre;

            modalBootstrap.show();
        } else {
            const messageClient = rolesResponse.message || "Ocurrió un error inesperado.";
            const messageTech = rolesResponse.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }

    } catch (error) {

        console.log(error);
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

async function confirmarEditarTipoEvento() {
    if (!validarFormulario('formEditarTipoEvento')) {
        Utils.showToast("Corrige los errores en el formulario", "warning");
        return;
    } 
    Utils.showToast("Formulario válido. Procesando datos...", "success");

}

async function getEventoById(idEvento) {
    try {
        const payloadEdit = {
            idEvento: idEvento
        }
        const EditResponse = await Utils.httpRequest(
            `${Utils.path}/evento/id`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadEdit)
            },
            true);
        if (EditResponse.cod == Utils.COD_OK) {
            return EditResponse;
        } else {
            const messageClient = rolesResponse.message || "Ocurrió un error inesperado.";
            const messageTech = rolesResponse.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }

    } catch (error) {

        console.log(error);
        Utils.showToast("Error cargando datos iniciales", 'error');
    }

}
function eliminarEvento(id) {
    document.getElementById('modalEliminarEvento').dataset.idEvento = id;
    new bootstrap.Modal(document.getElementById('modalEliminarEvento')).show();
}
function editarTipoEvento(id) {
}
function eliminarTipoEvento(id) {
    document.getElementById('modalEliminarTipoEvento').dataset.idTipoEvento = id;
    new bootstrap.Modal(document.getElementById('modalEliminarTipoEvento')).show();
}
async function confirmareliminarTipoEvento() {
}


