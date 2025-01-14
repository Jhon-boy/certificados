let userInfoAS = JSON.parse(localStorage.getItem('userInfo'));
async function inciarDatosActaAsistencia() {
    try { 
        const eventosResponse = await Utils.httpRequest(
            `${Utils.path}/evento/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );
         
        setTimeout(() => {
            const response = eventosResponse;

            if (response.cod === Utils.COD_OK && response.data.length > 0) { 
                const selectEventoActaAsistencia = document.getElementById("eventoActaAsistencia");
                selectEventoActaAsistencia.innerHTML = "";

                const defaultOptionActaAsistencia = document.createElement("option");
                defaultOptionActaAsistencia.value = "";
                defaultOptionActaAsistencia.textContent = "Seleccione un evento";
                defaultOptionActaAsistencia.disabled = true;
                defaultOptionActaAsistencia.selected = true;
                selectEventoActaAsistencia.appendChild(defaultOptionActaAsistencia);

                response.data.forEach(evento => {
                    const option = document.createElement("option");
                    option.value = evento.idevento;
                    option.textContent = evento.dominio;
                    selectEventoActaAsistencia.appendChild(option);
                });
                 
                const selectEventoActaAsistenciaAll = document.getElementById("eventoActaAsistenciaAll");
                selectEventoActaAsistenciaAll.innerHTML = "";

                const defaultOptionActaAsistenciaAll = document.createElement("option");
                defaultOptionActaAsistenciaAll.value = "";
                defaultOptionActaAsistenciaAll.textContent = "Seleccione un evento";
                defaultOptionActaAsistenciaAll.disabled = true;
                defaultOptionActaAsistenciaAll.selected = true;
                selectEventoActaAsistenciaAll.appendChild(defaultOptionActaAsistenciaAll);

                response.data.forEach(evento => {
                    const option = document.createElement("option");
                    option.value = evento.idevento;
                    option.textContent = evento.dominio;
                    selectEventoActaAsistenciaAll.appendChild(option);
                });

                Utils.showToast('DATOS CARGADOS EXITOSAMENTE', 'success');
                 
            } else {
                Utils.showToast('NO EXISTEN EVENTOS REGISTRADOS', 'info');
            }
        }, 150);
         
        document.getElementById("nombreUsuario").value = `${userInfoAS.nombre}`;
        const fechaInput = document.getElementById("fecha");
        const hoy = new Date();
        const fechaHoy = hoy.toISOString().split("T")[0]; 
        fechaInput.value = fechaHoy;

    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}


async function agregarActaAsistencia(event) {
    event.preventDefault();
    const idEvento = document.getElementById('eventoActaAsistencia').value;
    const usuarioIngreso = userInfoAS.idUsuario;
    const usuarioActualizacion = ''; // Por defecto vacío
    const archivoInput = document.getElementById('archivoAsistencia');
    console.log(idEvento);
    // Verificar si el archivo está seleccionado
    if (!archivoInput.files.length) {
        Utils.showToast("Por favor, seleccione un archivo CSV", "warning");
        return;
    }


    try {
        const actaDocumentoBase64 = await Utils.convertirArchivoABase64(archivoInput.files[0]);
        const payload = {
            "IdEvento": `${parseInt(idEvento, 10)}`,
            "UsuarioIngreso": `${usuarioIngreso}`, 
            "UsuarioActualizacion": `${usuarioActualizacion}`, 
            "ActaDocumento": `${actaDocumentoBase64}`, 
        };

        const responseAsistencia = await Utils.httpRequest(
            `${Utils.path}/asistencia/crear`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (responseAsistencia.cod === Utils.COD_OK) {
            Utils.showToast("Acta registrado exitosamente", "success");
            limpiarCampos();
        } else {
            const messageClient = responseAsistencia.message || "Ocurrió un error inesperado.";
            const messageTech = responseAsistencia.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }

    } catch (error) { 

        Utils.showToast("Error al agregar el acta:", 'danger');
    }
}

function limpiarCampos() {
    document.getElementById('fecha').value = ""; // Reinicia la fecha
    document.getElementById('archivoAsistencia').value = "";
}

async function buscarActaAsistencia() {
    const idActaBuscar = document.getElementById('buscar-actaAsistencia').value;

    try {
        const payload = {
            "idActa": parseInt(idActaBuscar, 10)
        }
        const responseActaSearch = await Utils.httpRequest(
            `${Utils.path}/asistencia/id`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (responseActaSearch.cod == Utils.COD_OK) {
            const actaData = responseActaSearch.data;
             
            document.getElementById('dominioA').value = actaData.tevento.dominio || '';
            document.getElementById('tematicaA').value = actaData.tevento.tematica || '';
            document.getElementById('idEvento').value = actaData.idEvento || '';
            document.getElementById('actaId').value = actaData.idAsistencia || '';
            document.getElementById('usuarioIngresoA').value = actaData.usuarioIngreso || '';
            document.getElementById('usuarioActualizacionA').value = actaData.usuarioActualizacion || 'No actualizado';
            document.getElementById('fechaIngresoA').value = Utils.formatFecha(actaData.fCreacion);
            document.getElementById('fechaActualizacionA').value = Utils.formatFecha(actaData.fModificacion);
             
            const downloadButton = document.querySelector('.btn-success');
            downloadButton.onclick = () => {
                const link = document.createElement('a');
                link.href = `data:text/csv;base64,${actaData.actaDocumento}`;
                link.download = 'documento_actual.csv';
                link.click();
            };

        } else {
            const messageClient = responseActaSearch.message || "Ocurrió un error inesperado.";
            const messageTech = responseActaSearch.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }

    } catch (error) {
        console.log(error);
        Utils.showToast("Error al agregar el rol:", 'danger');
    }
} async function cargarActaAsistencia() {
    let hasData = false;  

    try { 
        const idActaReferencia = parseInt(document.getElementById('eventoActaAsistenciaAll').value, 10);
         
        const eventosAllResponse = await Utils.httpRequest(
            `${Utils.path}/asistencia/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        ); 
        const tableBody = document.querySelector("#tabla-actas tbody");
        tableBody.innerHTML = "";
         
        if (eventosAllResponse.cod === Utils.COD_OK && eventosAllResponse.data.length > 0) { 
            eventosAllResponse.data.forEach(event => {

                if (parseInt(event.idEvento, 10) === idActaReferencia) {
                    hasData = true;   
                     
                    const row = document.createElement("tr"); 
                    row.innerHTML = `
                        <td>${event.idAsistencia}</td>
                        <td>${event.idEvento}</td>
                        <td>${event.tevento.dominio}</td>
                        <td>${event.fCreacion}</td>
                        <td>${event.usuarioIngreso}</td>
                        <td>
                            <i class="bi bi-arrow-down-square-fill text-primary me-3" style="cursor: pointer;" onclick="descargarActa('${event.actaDocumento}')" data-bs-toggle="tooltip" data-bs-placement="top" title="Descargar"></i>
                            <i class="bi bi-trash-fill text-danger" style="cursor: pointer;" onclick="eliminarActa(${event.idAsistencia})" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar"></i>
                        </td>
                    `;
                     
                    tableBody.appendChild(row);
                }
            });
             
            if (!hasData) {
                Utils.showToast("El evento no tiene ningún acta registrada", 'info');
            }
        } else { 
            const messageClient = eventosAllResponse.message || "Ocurrió un error inesperado.";
            const messageTech = eventosAllResponse.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) { 
        console.log('Error:', error);
        Utils.showToast("Error al buscar las actas del evento", 'danger');
    }
}

async function eliminarActa(id) {

}
function descargarActa(actaDocumento) {
    console.log('descanando');
    const blob = new Blob([new Uint8Array(atob(actaDocumento).split("").map(char => char.charCodeAt(0)))], { type: "application/pdf" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const nombreDescarga = new Date().getTime();
    link.download = `${nombreDescarga}.csv`
    link.click();
}