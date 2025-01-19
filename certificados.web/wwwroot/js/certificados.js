// Función para cargar datos de certificados
async function cargarDatosCertificados() {
    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/certificado/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );

        setTimeout(() => {
            const tablaBody = document.querySelector("#tabla-certificados tbody");
            tablaBody.innerHTML = '';

            if (response.cod === Utils.COD_OK && response.data.length > 0) {
                response.data.forEach(certificado => {
                    const fila = `
                        <tr>
                            <td>${certificado.idCertificado}</td>
                            <td>${certificado.titulo}</td>
                            <td>${certificado.idEvento}</td>
                            <td>${certificado.idFormato}</td>
                            <td>${certificado.tipo}</td>
                            <td>${certificado.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                <i class="bi bi-pencil-fill text-success me-3" 
                                   style="cursor: pointer;" 
                                   onclick="editarCertificado(${certificado.idCertificado})" 
                                   data-bs-toggle="tooltip" 
                                   data-bs-placement="top" 
                                   title="Editar Certificado"></i>
                                <i class="bi bi-trash-fill text-danger" 
                                   style="cursor: pointer;" 
                                   onclick="eliminarCertificado(${certificado.idCertificado})" 
                                   data-bs-toggle="tooltip" 
                                   data-bs-placement="top" 
                                   title="Eliminar Certificado"></i>
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
                tablaBody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron certificados.</td></tr>';
                Utils.showToast('NO EXISTEN CERTIFICADOS REGISTRADOS', 'info');
            }
        }, 150);

        await cargarEventos();
        await cargarFormatos();

    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

// Manejador para crear nuevo certificado
async function handleAgregarCertificado(event) {
    const form = event.target.closest("form");

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return false;
    }
    event.preventDefault();
    let userInfoConfig = JSON.parse(localStorage.getItem('userInfo'));
    const fileInput = document.getElementById('certificado-imagen');
    const file = fileInput.files[0];

    try {

    const imagenBase64 = await convertirImagenABase64(file);
        const base64Data = imagenBase64.split(",")[1];


    const bodyRequest = {
        Titulo: document.getElementById('certificado-titulo').value,
        Imagen: base64Data,
        IdEvento: parseInt(document.getElementById('certificado-id-evento').value),
        IdFormato: parseInt(document.getElementById('certificado-id-formato').value),
        Tipo: document.getElementById('certificado-tipo').value,
        Estado: document.getElementById('certificado-estado').value,
        UsuarioIngreso: userInfoConfig.idUsuario
    };

   
        const response = await Utils.httpRequest(
            `${Utils.path}/certificado/crear`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest)
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast('CERTIFICADO REGISTRADO EXITOSAMENTE', 'info');
            cargarDatosCertificados();
            limpiarFormularioCertificado();
            const tablaTab = document.querySelector('#tabla-tab');
            const tab = new bootstrap.Tab(tablaTab);
            tab.show();
        } else {
            const messageClient = response.message || "Ocurrió un error inesperado.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al agregar el certificado", 'danger');
    }
}

// Función para editar certificado
async function editarCertificado(id) {
    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/certificado/id`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idCertificado: id })
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            const certificado = response.data;
            document.getElementById('certificado-id-editar').value = certificado.idCertificado;
            document.getElementById('certificado-titulo-editar').value = certificado.titulo;
            document.getElementById('certificado-id-evento-editar').value = certificado.idEvento;
            document.getElementById('certificado-id-formato-editar').value = certificado.idFormato;
            document.getElementById('certificado-tipo-editar').value = certificado.tipo;
            document.getElementById('certificado-estado-editar').checked = certificado.estado;

            const modal = new bootstrap.Modal(document.getElementById('modal-editar-certificado'));
            modal.show();
        } else {
            Utils.showToast("Error al cargar datos del certificado", 'danger');
        }
    } catch (error) {
        Utils.showToast("Error al obtener los datos del certificado", 'danger');
    }
}

// Manejador para guardar edición
async function handleEditarCertificado(event) {
    const form = event.target.closest("form");

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    event.preventDefault();

    const bodyRequest = {
        idCertificado: document.getElementById('certificado-id-editar').value,
        Titulo: document.getElementById('certificado-titulo-editar').value,
        IdEvento: parseInt(document.getElementById('certificado-id-evento-editar').value),
        IdFormato: parseInt(document.getElementById('certificado-id-formato-editar').value),
        Tipo: document.getElementById('certificado-tipo-editar').value,
        Estado: document.getElementById('certificado-estado-editar').checked,
        UserModificacion: userInfo.idUsuario
    };

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/certificado/modificar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest)
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast("Certificado actualizado exitosamente", 'info');
            cargarDatosCertificados();
            const modal = bootstrap.Modal.getInstance(document.getElementById('modal-editar-certificado'));
            modal.hide();
        } else {
            const messageClient = response.message || "Ocurrió un error inesperado.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al actualizar el certificado", 'danger');
    }
}

// Función para eliminar certificado
async function eliminarCertificado(id) {
    if (!confirm('¿Está seguro que desea eliminar este certificado?')) return;

    try {
        const response = await Utils.httpRequest(
            `${Utils.path}/certificado/eliminar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idCertificado: id })
            },
            true
        );

        if (response.cod === Utils.COD_OK) {
            Utils.showToast("Certificado eliminado exitosamente", 'success');
            cargarDatosCertificados();
        } else {
            const messageClient = response.message || "Error al eliminar el certificado.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al eliminar el certificado", 'danger');
    }
}

// Función para limpiar formulario
function limpiarFormularioCertificado() {
    document.getElementById('certificado-titulo').value = '';
    document.getElementById('certificado-imagen').value = '';
    document.getElementById('certificado-id-evento').value = '';
    document.getElementById('certificado-id-formato').value = '';
    document.getElementById('certificado-tipo').value = '';
    document.getElementById('certificado-estado').checked = false;

    const form = document.querySelector('.needs-validation');
    if (form) {
        form.classList.remove('was-validated');
    }
}

// Habilitar validación de formularios
function habilitarValidacionCertificado() {
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
async function cargarEventos() {
    try {
        const responseEventos = await Utils.httpRequest(
            `${Utils.path}/evento/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );

        if (responseEventos.cod === Utils.COD_OK && responseEventos.data.length > 0) {
            const selectGrupo = document.getElementById("certificado-id-evento");

            responseEventos.data.forEach(evento => {
                const option = document.createElement("option");
                option.value = evento.idevento;
                option.textContent = evento.tematica;
                selectGrupo.appendChild(option);
            });
        } else {
            Utils.showToast('NO EXISTEN EVENTOS REGISTRADOS', 'info');
        }
    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

async function cargarFormatos() {
    try {
        const responseFormatos = await Utils.httpRequest(
            `${Utils.path}/formato/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true
        );

        if (responseFormatos.cod === Utils.COD_OK && responseFormatos.data.length > 0) {
            const selectGrupo = document.getElementById("certificado-id-formato");

            responseFormatos.data.forEach(formato => {
                const option = document.createElement("option");
                option.value = formato.idFormato;
                option.textContent = formato.idFormato;
                selectGrupo.appendChild(option);
            });
        } else {
            Utils.showToast('NO EXISTEN FORMATOS REGISTRADOS', 'info');
        }
    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}

// Metodo para convertir una imagen a base64
function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // Obtener el resultado base64
        reader.onerror = () => reject(new Error("Error al convertir la imagen a base64"));
        reader.readAsDataURL(file); // Leer el archivo como DataURL
    });
}