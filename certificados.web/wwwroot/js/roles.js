
async function cargarDatosRoles() {
    // Simulamos el response de la API
    let response;
    try {
        const rolesResponse = await Utils.httpRequest(
            `${Utils.path}/rol/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
            true);
        setTimeout(() => {
            response = rolesResponse;

            // Accedemos al cuerpo de la tabla
            const tablaBody = document.querySelector("#tabla-rol tbody");

            // Limpiar la tabla antes de agregar nuevos registros
            tablaBody.innerHTML = '';

            // Verificar que los datos estén presentes
            if (response.cod === Utils.COD_OK && response.data.length > 0) {
                // Recorrer los roles y agregarlos a la tabla
                response.data.forEach(rol => {
                    const estadoTexto = rol.estado ? "Activo" : "Inactivo";
                    const usuarioIngreso = rol.usuarioIngreso || "No disponible";

                    const fila = `
                <tr>
                    <td>${rol.nombre}</td>
                    <td>${rol.observacion}</td>
                    <td>${estadoTexto}</td>
                    <td>${usuarioIngreso}</td>
                    <td>
                        <i class="bi bi-pencil-fill text-success me-3" style="cursor: pointer;" onclick="editarRol(${rol.idRol})" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar Rol"></i>
                        <i class="bi bi-trash-fill text-danger"  style="cursor: pointer;"  onclick="eliminarRol(${rol.idRol})" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar Rol"></i>

                    </td>
                </tr>
            `;
                    // Insertamos la fila en el cuerpo de la tabla
                    tablaBody.insertAdjacentHTML("beforeend", fila);
                });
                Utils.showToast('DATOS CARGADOS EXITOSAMENTE', 'success');
                const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.forEach(function (tooltipTriggerEl) {
                    new bootstrap.Tooltip(tooltipTriggerEl);
                });

            } else {
                // Si no hay roles, mostrar mensaje
                tablaBody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron roles.</td></tr>';
                Utils.showToast('NO EXISTEN ROLES REGISTRADOS', 'info');
            }
        }, 150);
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        document.getElementById("usuarioIngreso").value = `${userInfo.nombre}`;
        habilitarValidacio();

    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}
 
 
  

// Agregar nuevo rol
async function agregarRol(event) {
    const form = event.target.closest("form");
 
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return false; // Detener el envío
    }
    event.preventDefault();

    let userInfoR = JSON.parse(localStorage.getItem('userInfo'));
    const bodyRequest = {
        Nombre: document.getElementById('rolNombre').value,
        Estado: document.getElementById('rolEstado').value === 'true',
        UsuarioIngreso: userInfoR.idUsuario,
        Observacion: document.getElementById('rolDescripcion').value,
    };


    try {
        const rolesResponse = await httpRequest(`${Utils.path}/rol/crear`, "POST", bodyRequest);

        if (rolesResponse.cod === Utils.COD_OK) {
            Utils.showToast('ROL REGISTRADO EXITOSAMENTE', 'success');
            limpiarRol();
            cargarDatosRoles();
        } else {
            const messageClient = rolesResponse.message || "Ocurrió un error inesperado.";
            const messageTech = rolesResponse.data || null;
            showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al agregar el rol:", 'danger');
    }
}


 
function limpiarRol() {
    document.getElementById('rolNombre').value = '';
    document.getElementById('rolEstado').value = '';
    document.getElementById('rolDescripcion').value = '';
}
//Validador
function habilitarValidacio() {

    (() => {
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
    })();

}
function generarAccionesHtml(tipo, nombre) {
    return `
        <div class="text-end">
            <button class="btn btn-primary btn-sm" onclick="editarElemento('${tipo}', '${nombre}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarElemento('${tipo}', '${nombre}')">Eliminar</button>
        </div>`;
}

async function httpRequest(url, method, body = null) {
    Utils.showLoader();
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        return await response.json(); 
    } catch (error) {
        const messageClient = "Error en la petición";
        const messageTech = error.message || error;
        Utils.showErrorModal(messageClient, messageTech);
    } finally {
        setTimeout(() => Utils.hideLoader(), 2000);
    }
}
