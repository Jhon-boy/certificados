// Función para cargar datos de formatos
async function cargarDatosFormatos() {
    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/formato/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );

        setTimeout(() => {
            const tablaBody = document.querySelector("#tabla-formatos tbody");
            tablaBody.innerHTML = '';

            if (response.cod === Utils.COD_OK && response.data.length > 0) {
                response.data.forEach(formato => {
                    const fila = `
                        <tr>
                            <td>${formato.idFormato}</td>
                            <td><img src="data:image/png;base64,${formato.logoUniversidad}" alt="Logo Universidad" class="img-thumbnail" style="width: 50px; height: 50px;"></td>
                            <td><img src="data:image/png;base64,${formato.logoSecundario}" alt="Logo Secundario" class="img-thumbnail" style="width: 50px; height: 50px;"></td>
                            <td><img src="data:image/png;base64,${formato.marcarAgua}" alt="Marca de Agua" class="img-thumbnail" style="width: 50px; height: 50px;"></td>
                            <td>${formato.qr ? `<img src="data:image/png;base64,${formato.qr}" alt="QR" class="img-thumbnail" style="width: 50px; height: 50px;">` : "No disponible"}</td>
                            <td>${formato.usuarioIngreso || 'No disponible'}</td>
                            <td>
                                <i class="bi bi-pencil-fill text-success me-3" 
                                   style="cursor: pointer;" 
                                   onclick="editarFormato(${formato.idFormato})" 
                                   data-bs-toggle="tooltip" 
                                   data-bs-placement="top" 
                                   title="Editar Formato"></i>
                                <i class="bi bi-trash-fill text-danger" 
                                   style="cursor: pointer;" 
                                   onclick="eliminarFormato(${formato.idFormato})" 
                                   data-bs-toggle="tooltip" 
                                   data-bs-placement="top" 
                                   title="Eliminar Formato"></i>
                            </td>
                        </tr>
                    `;
                    tablaBody.insertAdjacentHTML("beforeend", fila);
                });
                Utils.showToast('DATOS CARGADOS EXITOSAMENTE', 'success');
                document.getElementById("usuario-ingreso-formato").value = userInfo.nombre;

                // Inicializar tooltips
                const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.forEach(function (tooltipTriggerEl) {
                    new bootstrap.Tooltip(tooltipTriggerEl);
                });
            } else {
                tablaBody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron formatos.</td></tr>';
                Utils.showToast('NO EXISTEN FORMATOS REGISTRADOS', 'info');
            }
        }, 150);
    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

// Función para agregar formato
async function handleAgregarFormato(event) {
    const form = event.target.closest("form");

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return false;
    }
    event.preventDefault();

    try {
        // Convertir imágenes a Base64
        const logoUniversidad = document.getElementById('logo-universidad').files[0]
            ? await convertirABase64(document.getElementById('logo-universidad').files[0])
            : null;
        const logoSecundario = document.getElementById('logo-secundario').files[0]
            ? await convertirABase64(document.getElementById('logo-secundario').files[0])
            : null;
        const marcarAgua = document.getElementById('marca-agua').files[0]
            ? await convertirABase64(document.getElementById('marca-agua').files[0])
            : null;
        const qr = document.getElementById('qr').files[0]
            ? await convertirABase64(document.getElementById('qr').files[0])
            : null;

        // Validar usuario ingreso
        const userInfoConfig = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfoConfig || !userInfoConfig.idUsuario) {
            Utils.showToast('Usuario no encontrado. Inicie sesión nuevamente.', 'danger');
            return;
        }

        const bodyRequest = {
            formatoData: {
                LogoUniversidad: logoUniversidad,
                LogoSecundario: logoSecundario,
                MarcarAgua: marcarAgua,
                Qr: qr,
            },
            UsuarioIngreso: userInfoConfig.idUsuario.toString(), // Asegurarse de que sea string
        };

        const response = await Utils.httpRequest(
            `${Utils.path}/formato/crear`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest),
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast('FORMATO REGISTRADO EXITOSAMENTE', 'success');
            cargarDatosFormatos();
            limpiarFormularioFormato();

            // Cambiar a la pestaña de tabla
            const tablaTab = document.querySelector('#tabla-tab');
            const tab = new bootstrap.Tab(tablaTab);
            tab.show();
        } else {
            const messageClient = response.message || "Ocurrió un error inesperado.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al agregar el formato", 'danger');
    }
}
// Función para editar formato
async function editarFormato(id) {
    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/formato/id`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idFormato: id })
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            const formato = response.data;
            document.getElementById('formato-id-editar').value = formato.idFormato;
            document.getElementById('logo-universidad-editar').value = formato.logoUniversidad;
            document.getElementById('logo-secundario-editar').value = formato.logoSecundario;
            document.getElementById('marca-agua-editar').value = formato.marcarAgua;
            document.getElementById('qr-editar').value = formato.qr;

            const modal = new bootstrap.Modal(document.getElementById('modal-editar'));
            modal.show();
        } else {
            Utils.showToast("Error al cargar datos del formato", 'danger');
        }
    } catch (error) {
        Utils.showToast("Error al obtener los datos del formato", 'danger');
    }
}

// Función para guardar edición
async function handleEditarFormato(event) {
    const form = event.target.closest("form");

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    event.preventDefault();

    // Obtener datos del formulario
    const idFormato = document.getElementById('formato-id-editar').value;
    const logoUniversidad = await convertirABase64(document.getElementById('logo-universidad-editar').files[0]);
    const logoSecundario = await convertirABase64(document.getElementById('logo-secundario-editar').files[0]);
    const marcarAgua = await convertirABase64(document.getElementById('marca-agua-editar').files[0]);
    const qr = await convertirABase64(document.getElementById('qr-editar').files[0]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const bodyRequest = {
        idFormato: idFormato,
        LogoUniversidad: logoUniversidad,
        LogoSecundario: logoSecundario,
        MarcarAgua: marcarAgua,
        Qr: qr,
        UserModificacion: userInfo.idUsuario
    };

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/formato/modificar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest)
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast("Formato actualizado exitosamente", 'info');
            cargarDatosFormatos();
            const modal = bootstrap.Modal.getInstance(document.getElementById('modal-editar'));
            modal.hide();
        } else {
            const messageClient = response.message || "Ocurrió un error inesperado.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al actualizar el formato", 'danger');
    }
}

// Función para eliminar formato
async function eliminarFormato(id) {
    if (!confirm('¿Está seguro que desea eliminar este formato?')) return;

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/formato/eliminar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idFormato: id })
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast("Formato eliminado exitosamente", 'success');
            cargarDatosFormatos();
        } else {
            const messageClient = response.message || "Error al eliminar el formato.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al eliminar el formato", 'danger');
    }
}

// Función para convertir archivo a Base64
function convertirABase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) resolve('');
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Obtener solo la parte Base64
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Función para limpiar formulario
function limpiarFormularioFormato() {
    document.getElementById('logo-universidad').value = '';
    document.getElementById('logo-secundario').value = '';
    document.getElementById('marca-agua').value = '';
    document.getElementById('qr').value = '';

    const form = document.querySelector('.needs-validation');
    if (form) {
        form.classList.remove('was-validated');
    }
}

// Inicializar validación
function habilitarValidacionFormato() {
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
