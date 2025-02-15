
let userInfoPl = JSON.parse(localStorage.getItem('userInfo'));

// Función para cargar datos de planificación
async function cargarDatosPlanificacion() {
    try {
        const eventosResponse = await Utils.httpRequest(
            `${Utils.path}/evento/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true);
        setTimeout(() => {
            const hoy = new Date();

            const response = eventosResponse;
            const tablaBody = document.querySelector("#tabla-evento tbody");
            tablaBody.innerHTML = '';

            if (response.cod === Utils.COD_OK && response.data.length > 0) { 
                const eventosEnCurso = response.data.filter(evento => new Date(evento.fechaFin) > hoy);

                if (eventosEnCurso.length > 0) {
                    eventosEnCurso.forEach(evento => {
                        const fila = `
                    <tr>
                        <td>${evento.idevento}</td>
                        <td>${evento.tematica}</td>
                        <td>${evento.dominio}</td>
                        <td>${Utils.formatFecha(evento.fechaInicio)} - ${Utils.formatFecha(evento.fechaFin)}</td>
                        <td>${evento.tmodalidad.nombre}</td>
                        <td>${evento.idGrupo}</td>
                        <td>
                            <i class="bi bi-pencil-fill text-success me-3"
                                   style="cursor: pointer;"
                                   onclick="editarPlanificacion(${evento.idevento})" 
                                   data-bs-toggle="tooltip" 
                                   data-bs-placement="top" 
                                   title="Editar Planificacion"></i>
                            <i class="bi bi-trash-fill text-danger" 
                                style="cursor: pointer;" 
                                onclick="eliminarPlanificacion(${evento.idevento})" 
                                data-bs-toggle="tooltip" 
                                data-bs-placement="top" 
                                title="Eliminar Planificacion"></i>
                        </td>
                    </tr>
                `;
                        tablaBody.insertAdjacentHTML("beforeend", fila);
                    });
                    Utils.showToast('EVENTOS CARGADOS EXITOSAMENTE', 'success');

                    $('#tabla-evento').DataTable({
                        language: {
                            url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
                        }
                    });

                } else {
                    tablaBody.innerHTML = '<tr><td colspan="7" class="text-center">No hay eventos en curso.</td></tr>';
                    Utils.showToast('NO EXISTEN EVENTOS EN CURSO', 'info');
                }
            } else {
                tablaBody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron eventos.</td></tr>';
                Utils.showToast('NO EXISTEN EVENTOS REGISTRADOS', 'info');
            }
        }, 150);

        await cargarGrupos();
        await cargarModalidades();
        await cargarFacilitadores();
        await cargarCiclos();
        await cargarTipoEvento();
        await cargarFacultad();

    } catch (error) {
        console.log(error)
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}


async function cargarTipoEvento() {
    try {
        const tipoResponse = await Utils.httpRequest(
            `${Utils.path}/tipoEvento/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true);
        if (tipoResponse.cod === Utils.COD_OK && tipoResponse.data.length > 0) {
            const selectTipoEvento = document.getElementById("tipo-evento");
            const selectTipoEventoEditar = document.getElementById("tipo-evento-editar");

              
            tipoResponse.data.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.idtipoevento;  
                option.textContent = tipo.nombre;  
                selectTipoEvento.appendChild(option);

                const optionEditar = document.createElement("option");
                optionEditar.value = tipo.idtipoevento;
                optionEditar.textContent = tipo.nombre;
                selectTipoEventoEditar.appendChild(optionEditar);
            });
        } else {  
           Utils.showToast('NO EXISTEN ROLES REGISTRADOS', 'info');
        }
    } catch (error) {
        console.log(error)
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}
async function cargarFacultad() {
    try {
        const decanatoResponse = await Utils.httpRequest(
            `${Utils.path}/decanato/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true);
        if (decanatoResponse.cod === Utils.COD_OK && decanatoResponse.data.length > 0) {
            const selectDecanato = document.getElementById("decanatoAll");
            const selectDecanatoEditar = document.getElementById("decanato-editar");

            decanatoResponse.data.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.idDecanato;
                option.textContent = tipo.nombre;
                selectDecanato.appendChild(option);

                const optionEditar = document.createElement("option");
                optionEditar.value = tipo.idDecanato;
                optionEditar.textContent = tipo.nombre;
                selectDecanatoEditar.appendChild(option);
            });
        } else {
            Utils.showToast('NO EXISTEN ROLES REGISTRADOS', 'info');
        }
    } catch (error) {
        console.log(error)
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}
async function cargarCiclos() {
    try {
        const responseCiclos = await Utils.httpRequest(
            `${Utils.path}/ciclo/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );

            if (responseCiclos.cod === Utils.COD_OK && responseCiclos.data.length > 0) {
                const selectCiclo = document.getElementById("ciclo-evento");
                 
                responseCiclos.data.forEach(ciclo => {
                    const option = document.createElement("option");
                    option.value = ciclo.idCiclo;
                    option.textContent = ciclo.nombre;
                    selectCiclo.appendChild(option);
                });
             
            } else {
                Utils.showToast('NO EXISTEN CICLOS REGISTRADOS', 'info');
            }

    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

async function cargarFacilitadores() {
    try {
        const condition = {
            estado: 'ACT'
        }
        const expositorResponse = await Utils.httpRequest(
            `${Utils.path}/personas/all`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(condition)
            },
            true);

            if (expositorResponse.cod === Utils.COD_OK && expositorResponse.data.length > 0) {
                const selectElement = document.getElementById('facilitadorAll');
                selectElement.innerHTML = '';

                expositorResponse.data.forEach(persona => {
                    if (persona.mDatos.rol.includes('Facilitador')) {
                        const option = document.createElement('option');
                        option.value = persona.cedula;
                        option.textContent = `${persona.cedula} - ${persona.nombres} - ${persona.apellidos}`;
                        selectElement.appendChild(option);
                    }
                   
                });
            } else {
                Utils.showToast("No se encontraron facilitadores.", 'info');
            }
             
    } catch (error) {
        console.log(error);
        Utils.showToast("Error cargando datos iniciales", 'error');
    }

}
async function cargarModalidades() {
    try {
        const responseModalidades = await Utils.httpRequest(
            `${Utils.path}/modalidad/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );
        if (responseModalidades.cod === Utils.COD_OK && responseModalidades.data.length > 0) {
            const selectModalidad = document.getElementById("modalidadAll"); 
            const selectModalidadEditar = document.getElementById("modalidad-editar"); 

            responseModalidades.data.forEach(mod => {
                const option = document.createElement("option");
                option.value = mod.idModalidad;
                option.textContent = mod.nombre;
                selectModalidad.appendChild(option);

                const optionEditar = document.createElement("option");
                optionEditar.value = mod.idModalidad;
                optionEditar.textContent = mod.nombre;
                selectModalidadEditar.appendChild(optionEditar);
            });
        } else {
            Utils.showToast('NO EXISTEN MODALIDADES REGISTRADAS', 'info');
        }
    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

async function cargarGrupos() {
    try {
        const responseGrupos = await Utils.httpRequest(
            `${Utils.path}/grupo/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );

        if (responseGrupos.cod === Utils.COD_OK && responseGrupos.data.length > 0) {
            const selectGrupo = document.getElementById("grupoAll"); 
            const selectGrupoEditar = document.getElementById("grupo-editar"); 

            responseGrupos.data.forEach(grupo => {
                const option = document.createElement("option");
                option.value = grupo.idGrupo;
                option.textContent = grupo.nombre;
                selectGrupo.appendChild(option);

                const optionEditar = document.createElement("option");
                optionEditar.value = grupo.idGrupo;
                optionEditar.textContent = grupo.nombre;
                selectGrupoEditar.appendChild(optionEditar);
            });
        } else {
            Utils.showToast('NO EXISTEN MODALIDADES REGISTRADAS', 'info');
        }
    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}
// Manejador para crear nueva planificación
async function handleAgregarPlanificacion(event) {
    const form = event.target.closest("form");

    // Validación del formulario
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return false;
    }
    event.preventDefault();

    // Construir el cuerpo de la solicitud (JSON) 
    const bodyRequest = {
        "FechaInicio": `${document.getElementById('fecha-inicio').value}T08:30:00`,
        "FechaFin": `${document.getElementById('fecha-fin').value}T12:30:00`,
        "Horas": `${parseInt(document.getElementById('horas').value, 10)}`,
        "Lugar": null,
        "ConCertificado": `${document.getElementById('con-certificado').value}`,
        "Periodo": `${document.getElementById('ciclo-evento').value}`,
        "Tematica": `${document.getElementById('tematica').value}`,
        "Dominio": `${document.getElementById('dominioAll').value}`,
        "IdGrupo": `${parseInt(document.getElementById('grupoAll').value, 10)}`,
        "IdModalidad": `${parseInt(document.getElementById('modalidadAll').value, 10)}`,
        "IdTipoEvento": `${parseInt(document.getElementById('tipo-evento').value, 10)}`,
        "IdDecanato": `${parseInt(document.getElementById('decanatoAll').value, 10)}`,
        "Admin": `${userInfoPl.idUsuario}`
    };


    try { 
        const responseCreate = await Utils.httpRequest(
            `${Utils.path}/evento/crear`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest)
            },
            true
        );
         
        if (responseCreate.cod === Utils.COD_OK) {
            Utils.showToast('PLANIFICACIÓN REGISTRADA EXITOSAMENTE', 'info');

            if ($.fn.DataTable.isDataTable('#tabla-evento')) {
                $('#tabla-evento').DataTable().clear().destroy();
            }

            cargarDatosPlanificacion();
            limpiarFormularioPlanificacion(); 

            const tablaTab = document.querySelector('#listar-planificacion-tab');
            const tab = new bootstrap.Tab(tablaTab);
            tab.show();

        } else {
            const messageClient = responseCreate.message || "Ocurrió un error inesperado.";
            const messageTech = responseCreate.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        console.log(error)
        Utils.showToast("Error al agregar la planificación", 'danger');
    }
}

// Función para limpiar el formulario
function limpiarFormularioPlanificacion() {
    const form = document.getElementById('form-planificacion');
    form.reset(); // Restablecer todos los inputs
    form.classList.remove('was-validated'); // Eliminar clases de validación
}

// Función para editar planificación
async function editarPlanificacion(id) {
    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/evento/id`, 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idEvento: id })
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            const planificacion = response.data;

            document.getElementById('planificacion-id-editar').value = planificacion.idevento;
            document.getElementById('tematica-editar').value = planificacion.tematica;
            document.getElementById('dominio-editar').value = planificacion.dominio;
            document.getElementById('fecha-inicio-editar').value = Utils.formatearFecha(planificacion.fechaInicio);
            document.getElementById('fecha-fin-editar').value = Utils.formatearFecha(planificacion.fechaFin);
            document.getElementById('horas-editar').value = planificacion.horas;

            asignarSelectEditarPlanificacion(planificacion);

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('modal-editar-planificacion'));
            modal.show();
        } else {
            Utils.showToast("Error al cargar datos de la planificación", 'danger');
        }
    } catch (error) {
        Utils.showToast("Error al obtener los datos de la planificación", 'danger');
    }
}

//async function handleEditarPlanificacion(event) {
//    const form = event.target.closest("form");

//    // Validar el formulario
//    if (!form.checkValidity()) {
//        form.classList.add('was-validated');
//        return;
//    }
//    event.preventDefault();

//    // Crear el cuerpo de la solicitud para la actualización
//    const bodyRequest = {
//        idPlanificacion: document.getElementById('planificacion-id-editar').value,
//        tematica: document.getElementById('tematica-editar').value,
//        dominio: document.getElementById('dominio-editar').value,
//        tipoEvento: document.getElementById('tipo-evento-editar').value,
//        ciclo: document.getElementById('ciclo-editar').value,
//        facilitador: document.getElementById('facilitador-editar').value,
//        modalidad: document.getElementById('modalidad-editar').value,
//        conCertificado: document.getElementById('con-certificado-editar').value,
//        grupo: document.getElementById('grupo-editar').value,
//        decanato: document.getElementById('decanato-editar').value,
//        fechaInicio: document.getElementById('fecha-inicio-editar').value,
//        fechaFin: document.getElementById('fecha-fin-editar').value,
//        horas: document.getElementById('horas-editar').value,
//        UserModificacion: userInfo.idUsuario
//    };

//    try {
//        // Enviar la solicitud de actualización
//        const response = await Utils.httpRequest(
//            `${Utils.path}/evento/modificar`, // Asegúrate de que la URL sea correcta
//            {
//                method: "POST",
//                headers: { "Content-Type": "application/json" },
//                body: JSON.stringify(bodyRequest)
//            },
//            true
//        );

//        if (response.cod === Utils.COD_OK) {
//            // Mostrar mensaje de éxito
//            Utils.showToast("Planificación actualizada exitosamente", 'info');

//            // Si estás usando DataTable, puedes actualizar la tabla después de la modificación
//            if ($.fn.DataTable.isDataTable('#tabla-evento')) {
//                $('#tabla-evento').DataTable().clear().destroy();
//            }

//            cargarDatosPlanificacion();
//            // Cerrar el modal
//            const modal = bootstrap.Modal.getInstance(document.getElementById('modal-editar-planificacion'));
//            modal.hide();
//        } else {
//            // Si hay un error, mostrar el mensaje de error
//            const messageClient = response.message || "Ocurrió un error inesperado.";
//            const messageTech = response.data || null;
//            Utils.showErrorModal(messageClient, messageTech);
//        }
//    } catch (error) {
//        // Si ocurre un error en la solicitud
//        Utils.showToast("Error al actualizar la planificación", 'danger');
//    }
//}



// Función para eliminar planificación
async function eliminarPlanificacion(id) {
    if (!confirm('¿Está seguro que desea eliminar esta planificación?')) return;

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/evento/eliminar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idEvento: id })
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast("Planificación eliminada exitosamente", 'success');
            cargarDatosPlanificacion();
        } else {
            const messageClient = response.message || "Error al eliminar la planificación.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al eliminar la planificación", 'danger');
    }
}

function asignarSelectEditarPlanificacion(planificacion) {
    // Asignar valores a los campos del formulario
    document.getElementById('tipo-evento-editar').value = planificacion.ttipoEvento.descripcion || '';
    //document.getElementById('ciclo-editar').value = planificacion.ciclo || '';
    //document.getElementById('facilitador-editar').value = planificacion.facilitador || '';
    document.getElementById('modalidad-editar').value = planificacion.tmodalidad.nombre || '';
    document.getElementById('con-certificado-editar').value = planificacion.conCertificado || '';
    document.getElementById('grupo-editar').value = planificacion.tgrupo.nombre || '';
    document.getElementById('decanato-editar').value = planificacion.tdecanato.nombre || '';

    // Funcion para agregar una opcion a un select si no existe
    const agregarOpcionSiNoExiste = (selectId, value, text) => {
        const select = document.getElementById(selectId);
        const existeOpcion = Array.from(select.options).some(option => option.value === value);
        if (!existeOpcion) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            select.appendChild(option);
        }
    };

    // Agregar opciones a los select si no existen
    agregarOpcionSiNoExiste("tipo-evento-editar", planificacion.ttipoEvento.idtipoevento, planificacion.ttipoEvento.descripcion);
    agregarOpcionSiNoExiste("modalidad-editar", planificacion.tmodalidad.idModalidad, planificacion.tmodalidad.nombre);
    agregarOpcionSiNoExiste("con-certificado-editar", planificacion.conCertificado, "");
    agregarOpcionSiNoExiste("grupo-editar", planificacion.tgrupo.idGrupo, planificacion.tgrupo.nombre);
    agregarOpcionSiNoExiste("decanato-editar", planificacion.tdecanato.idDecanato, planificacion.tdecanato.nombre);
}


// Funcion para habilitar validación
function habilitarValidacionPlanificacion() {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
}
