
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
                        <td>${evento.lugar}</td>
                        <td>${evento.idGrupo}</td>
                    </tr>
                `;
                        tablaBody.insertAdjacentHTML("beforeend", fila);
                    });
                    Utils.showToast('EVENTOS CARGADOS EXITOSAMENTE', 'success');
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
              
            tipoResponse.data.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.idtipoevento;  
                option.textContent = tipo.nombre;  
                selectTipoEvento.appendChild(option);
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

            decanatoResponse.data.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.idDecanato;
                option.textContent = tipo.nombre;
                selectDecanato.appendChild(option);
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

            responseModalidades.data.forEach(mod => {
                const option = document.createElement("option");
                option.value = mod.idModalidad;
                option.textContent = mod.nombre;
                selectModalidad.appendChild(option);
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

            responseGrupos.data.forEach(grupo => {
                const option = document.createElement("option");
                option.value = grupo.idGrupo;
                option.textContent = grupo.nombre;
                selectGrupo.appendChild(option);
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
        "Lugar": `${document.getElementById('lugarDesarrollo').value}`,
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
            cargarDatosPlanificacion();
            limpiarFormulario(); 
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
function limpiarFormulario() {
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
                body: JSON.stringify({ idPlanificacion: id })
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            const planificacion = response.data;
            document.getElementById('planificacion-id-editar').value = planificacion.idPlanificacion;
            document.getElementById('planificacion-nombre-editar').value = planificacion.nombre;
            document.getElementById('planificacion-descripcion-editar').value = planificacion.descripcion;
            document.getElementById('planificacion-usuario-editar').value = planificacion.usuarioIngreso;

            const modal = new bootstrap.Modal(document.getElementById('modal-editar'));
            modal.show();
        } else {
            Utils.showToast("Error al cargar datos de la planificación", 'danger');
        }
    } catch (error) {
        Utils.showToast("Error al obtener los datos de la planificación", 'danger');
    }
}


// Función para eliminar planificación
async function eliminarPlanificacion(id) {
    if (!confirm('¿Está seguro que desea eliminar esta planificación?')) return;

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/evento/eliminar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idPlanificacion: id })
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


// Función para habilitar validación
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
