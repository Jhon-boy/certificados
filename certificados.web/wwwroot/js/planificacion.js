// Función para cargar datos de planificación
async function cargarDatosPlanificacion() {
    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/evento/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );

        setTimeout(() => {
            const tablaBody = document.querySelector("#tabla-planificacion tbody");
            tablaBody.innerHTML = '';

            if (response.cod === Utils.COD_OK && response.data.length > 0) {
                response.data.forEach(planificacion => {
                    const fila = `
                        <tr>
                            <td>${planificacion.idPlanificacion}</td>
                            <td>${planificacion.nombre}</td>
                            <td>${planificacion.descripcion}</td>
                            <td>${planificacion.usuarioIngreso || 'No disponible'}</td>
                            <td>
                                <i class="bi bi-pencil-fill text-success me-3" 
                                   style="cursor: pointer;" 
                                   onclick="editarPlanificacion(${planificacion.idPlanificacion})" 
                                   data-bs-toggle="tooltip" 
                                   data-bs-placement="top" 
                                   title="Editar Planificación"></i>
                                <i class="bi bi-trash-fill text-danger" 
                                   style="cursor: pointer;" 
                                   onclick="eliminarPlanificacion(${planificacion.idPlanificacion})" 
                                   data-bs-toggle="tooltip" 
                                   data-bs-placement="top" 
                                   title="Eliminar Planificación"></i>
                            </td>
                        </tr>
                    `;
                    tablaBody.insertAdjacentHTML("beforeend", fila);
                });
                Utils.showToast('DATOS CARGADOS EXITOSAMENTE', 'success');

                // Establecer usuario actual en el formulario
                document.getElementById("planificacion-usuario").value = userInfo.nombre;

                // Inicializar tooltips
                const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.forEach(function (tooltipTriggerEl) {
                    new bootstrap.Tooltip(tooltipTriggerEl);
                });
            } else {
                tablaBody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron planificaciones.</td></tr>';
                Utils.showToast('NO EXISTEN PLANIFICACIONES REGISTRADAS', 'info');
            }
        }, 150);

    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

// Manejador para crear nueva planificación
async function handleAgregarPlanificacion(event) {
    const form = event.target.closest("form");

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return false;
    }
    event.preventDefault();

    const bodyRequest = {
        Nombre: document.getElementById('planificacion-nombre').value,
        Descripcion: document.getElementById('planificacion-descripcion').value,
        UsuarioIngreso: userInfo.idUsuario
    };

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/evento/crear`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest)
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast('PLANIFICACIÓN REGISTRADA EXITOSAMENTE', 'info');
            cargarDatosPlanificacion();
            limpiarFormulario();
            // Cambiar a la pestaña de la tabla
            const tablaTab = document.querySelector('#tabla-tab');
            const tab = new bootstrap.Tab(tablaTab);
            tab.show();
        } else {
            const messageClient = response.message || "Ocurrió un error inesperado.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al agregar la planificación", 'danger');
    }
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

// Manejador para guardar edición de planificación
async function handleEditarPlanificacion(event) {
    const form = event.target.closest("form");

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    event.preventDefault();

    const bodyRequest = {
        idPlanificacion: document.getElementById('planificacion-id-editar').value,
        Nombre: document.getElementById('planificacion-nombre-editar').value,
        Descripcion: document.getElementById('planificacion-descripcion-editar').value,
        UsuarioActualizacion: userInfo.idUsuario
    };

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/evento/modificar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest)
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast("Planificación actualizada exitosamente", 'info');
            cargarDatosPlanificacion();
            const modal = bootstrap.Modal.getInstance(document.getElementById('modal-editar'));
            modal.hide();
        } else {
            const messageClient = response.message || "Ocurrió un error inesperado.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al actualizar la planificación", 'danger');
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

// Función para limpiar formulario
function limpiarFormulario() {
    document.getElementById('planificacion-nombre').value = '';
    document.getElementById('planificacion-descripcion').value = '';
    document.getElementById('planificacion-usuario').value = userInfo.nombre;

    const form = document.querySelector('.needs-validation');
    if (form) {
        form.classList.remove('was-validated');
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
