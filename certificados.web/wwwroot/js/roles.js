
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
            if (response.cod === "OK" && response.data.length > 0) {
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
        let  userInfo = JSON.parse(localStorage.getItem('userInfo'));
        document.getElementById("usuarioIngreso").value = `${userInfo.nombre}`;
        habilitarValidacio();

    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}
 
 
  

// Agregar nuevo rol
function agregarRol() {
 
}
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
