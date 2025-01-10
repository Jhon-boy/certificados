
let userInfoDecanato = JSON.parse(localStorage.getItem('userInfo'));
async function cargarDatosDecanatos() {
    let response;

    try {
        const decanatoResponse = await Utils.httpRequest(
            `${Utils.path}/decanato/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );

        setTimeout(() => {
            response = decanatoResponse;
            const tablaBody = document.querySelector("#tabla-decanato tbody");
            tablaBody.innerHTML = '';
            if (response.cod === Utils.COD_OK && response.data.length > 0) {
                response.data.forEach(decanato => {
                    const usuarioActualizacion = decanato.usuarioActualizacion || "No disponible";
                    const fila = `
                        <tr>
                            <td>${decanato.idDecanato}</td>
                            <td>${decanato.nombre}</td>
                            <td>${Utils.formatFecha(decanato.fCreacion)}</td >
                            <td>${Utils.formatFecha(decanato.fModificacion) || 'No disponible'}</td>
                            <td>${decanato.usuarioIngreso}</td>
                            <td>${usuarioActualizacion || 'No Actualizado'}</td>
                            <td>
                                <i class="bi bi-pencil-fill text-success me-3" style="cursor: pointer;" onclick="editarDecanato(${decanato.idDecanato})" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar Decanato"></i>
                                <i class="bi bi-trash-fill text-danger" style="cursor: pointer;" onclick="eliminarDecanato(${decanato.idDecanato})" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar Decanato"></i>
                            </td>
                        </tr>
                    `;
                    tablaBody.insertAdjacentHTML("beforeend", fila);
                });

                Utils.showToast('DATOS CARGADOS EXITOSAMENTE', 'success');
                const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.forEach(function (tooltipTriggerEl) {
                    new bootstrap.Tooltip(tooltipTriggerEl);
                });
            } else {
                tablaBody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron decanatos.</td></tr>';
                Utils.showToast('NO EXISTEN DECANATOS REGISTRADOS', 'info');
            }
        }, 150);
    } catch (error) {
        console.log(error);
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

async function editarDecanato(idDecanato) {

    const decanato = await obtenerDecanatoPorId(idDecanato);

    if (decanato) { 
        document.getElementById("nombre").value = decanato.nombre;
        document.getElementById("fCreacion").value = Utils.formatFecha(decanato.fCreacion);
        document.getElementById("usuarioActualizacion").value = userInfoDecanato.nombres; 
         
        const myModal = new bootstrap.Modal(document.getElementById('editarDecanatoModal'));
        myModal.show();
    }

}
async function guardarCambiosDecanato() {
    const nombre = document.getElementById("nombre").value;
    const usuarioIngreso = document.getElementById("usuarioIngreso").value;  
    const idDecanato = document.getElementById("idDecanato").value; 

    const data = {
        idDecanato: idDecanato,
        nombre: nombre,
        usuarioActualizacion: usuarioIngreso
    };

    try {
        const response = await httpRequest(
            `${Utils.path}/decanato/editar`,
            "POST",
            data
        );

        if (response.cod === "OK") {
            Utils.showToast("Decanato actualizado exitosamente", "success");
            const myModal = bootstrap.Modal.getInstance(document.getElementById('editarDecanatoModal'));
            myModal.hide();
            cargarDatosDecanatos();  
        } else {
            Utils.showToast("Error al actualizar el decanato", "danger");
        }
    } catch (error) {
        Utils.showToast("Error al guardar los cambios", "danger");
    }
}


async function eliminarDecanato(idDecanato) {

   
}
async function BuscarDecanato() {
    const idAbuscar = document.getElementById('buscar-decanato').value;
    if (!idAbuscar) {
        Utils.showToast("Por favor ingresa el ID del Decanato", 'warning');
        return;
    }

    const decanato = await obtenerDecanatoPorId(idAbuscar);
    if (decanato) {
        document.getElementById('nombreDecanato').value = decanato.nombre;
        document.getElementById('fCreacion').value = Utils.formatFecha(decanato.fCreacion);
        document.getElementById('fModificacion').value = Utils.formatFecha(decanato.fModificacion) || 'No disponible';
        document.getElementById('usuarioIngreso').value = decanato.usuarioIngreso;
        document.getElementById('usuarioActualizacion').value = decanato.usuarioActualizacion || 'No disponible';
    } else { 
            Utils.showToast("No se encontró el Decanato con ese ID.", 'info');
    }
}
async function obtenerDecanatoPorId(idDecanato) {

    try {
        const DecanatoResponse = await httpRequest(`${Utils.path}/decanato/id`, "POST", { idDecanato: idDecanato });

        if (DecanatoResponse.cod === Utils.COD_OK) {
            return DecanatoResponse.data;
        } else {
            const messageClient = DecanatoResponse.message || "Ocurrió un error inesperado.";
            const messageTech = DecanatoResponse.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al obtener el Decanato:", 'danger');
    }
}