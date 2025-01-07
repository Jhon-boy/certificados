// Función para cargar datos de grupos
async function cargarDatosGrupos() {
    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/grupo/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );

        setTimeout(() => {
            const tablaBody = document.querySelector("#tabla-grupo tbody");
            tablaBody.innerHTML = '';

            if (response.cod === Utils.COD_OK && response.data.length > 0) {
                response.data.forEach(grupo => {
                    const fila = `
                        <tr>
                            <td>${grupo.idGrupo}</td>
                            <td>${grupo.nombre}</td>
                            <td>${grupo.cantidad}</td>
                            <td>${grupo.usuarioIngreso || 'No disponible'}</td>
                            <td>
                                <i class="bi bi-pencil-fill text-success me-3" 
                                   style="cursor: pointer;" 
                                   onclick="editarGrupo(${grupo.idGrupo})" 
                                   data-bs-toggle="tooltip" 
                                   data-bs-placement="top" 
                                   title="Editar Grupo"></i>
                                <i class="bi bi-trash-fill text-danger" 
                                   style="cursor: pointer;" 
                                   onclick="eliminarGrupo(${grupo.idGrupo})" 
                                   data-bs-toggle="tooltip" 
                                   data-bs-placement="top" 
                                   title="Eliminar Grupo"></i>
                            </td>
                        </tr>
                    `;
                    tablaBody.insertAdjacentHTML("beforeend", fila);
                });
                Utils.showToast('DATOS CARGADOS EXITOSAMENTE', 'success');

                // Inicializar tooltips
                const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.forEach(function (tooltipTriggerEl) {
                    new bootstrap.Tooltip(tooltipTriggerEl);
                });
            } else {
                tablaBody.innerHTML = '<tr><td colspan="4" class="text-center">No se encontraron grupos.</td></tr>';
                Utils.showToast('NO EXISTEN GRUPOS REGISTRADOS', 'info');
            }
        }, 150);

        // Establecer usuario actual en el formulario
        document.getElementById("grupo-usuario").value = userInfo.nombre;

    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

// Manejador para crear nuevo grupo
async function handleAgregarGrupo(event) {
    const form = event.target.closest("form");

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return false;
    }
    event.preventDefault();

    const bodyRequest = {
        Nombre: document.getElementById('grupo-nombre').value,
        Cantidad: parseInt(document.getElementById('grupo-cantidad').value),
        UsuarioIngreso: userInfo.idUsuario
    };

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/grupo/crear`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest)
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast('GRUPO REGISTRADO EXITOSAMENTE', 'info');
            cargarDatosGrupos();
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
        Utils.showToast("Error al agregar el grupo", 'danger');
    }
}

// Función para editar grupo
async function editarGrupo(id) {
    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/grupo/id`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idGrupo: id })
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            const grupo = response.data;
            document.getElementById('grupo-id-editar').value = grupo.idGrupo;
            document.getElementById('grupo-nombre-editar').value = grupo.nombre;
            document.getElementById('grupo-cantidad-editar').value = grupo.cantidad;
            document.getElementById('grupo-usuario-editar').value = grupo.usuarioIngreso;

            const modal = new bootstrap.Modal(document.getElementById('modal-editar'));
            modal.show();
        } else {
            Utils.showToast("Error al cargar datos del grupo", 'danger');
        }
    } catch (error) {
        Utils.showToast("Error al obtener los datos del grupo", 'danger');
    }
}

// Manejador para guardar edición
async function handleEditarGrupo(event) {
    const form = event.target.closest("form");

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    event.preventDefault();

    const bodyRequest = {
        idGrupo: document.getElementById('grupo-id-editar').value,
        Nombre: document.getElementById('grupo-nombre-editar').value,
        Cantidad: parseInt(document.getElementById('grupo-cantidad-editar').value),
        UsuarioActualizacion: userInfo.idUsuario
    };

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/grupo/modificar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest)
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast("Grupo actualizado exitosamente", 'info');
            cargarDatosGrupos();
            const modal = bootstrap.Modal.getInstance(document.getElementById('modal-editar'));
            modal.hide();
        } else {
            const messageClient = response.message || "Ocurrió un error inesperado.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al actualizar el grupo", 'danger');
    }
}

// Función para eliminar grupo
async function eliminarGrupo(id) {
    if (!confirm('¿Está seguro que desea eliminar este grupo?')) return;

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/grupo/eliminar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idGrupo: id })
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast("Grupo eliminado exitosamente", 'success');
            cargarDatosGrupos();
        } else {
            const messageClient = response.message || "Error al eliminar el grupo.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al eliminar el grupo", 'danger');
    }
}

// Función para limpiar formulario
function limpiarFormulario() {
    document.getElementById('grupo-nombre').value = '';
    document.getElementById('grupo-cantidad').value = '';
    document.getElementById('grupo-usuario').value = userInfo.nombre;

    const form = document.querySelector('.needs-validation');
    if (form) {
        form.classList.remove('was-validated');
    }
}

// Función para habilitar validación
function habilitarValidacion() {
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
