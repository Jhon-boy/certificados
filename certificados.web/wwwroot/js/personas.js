//VARIABLES
let idPersonaAEliminarP = null;
let userInfoPersona = JSON.parse(localStorage.getItem('userInfo'));
let modalEliminarPersona;
let roles;
 
async function cargarDatospersonas() {
    let response;
    try {
        const condition = {
            estado: 'ACT'
        }
        const personaResponse = await Utils.httpRequest(
            `${Utils.path}/personas/all`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(condition)
            },
            true);

        setTimeout(() => {
            response = personaResponse;

            const tablaBody = document.querySelector("#tabla-persona tbody");

            tablaBody.innerHTML = '';

            if (response.cod === Utils.COD_OK && response.data.length > 0) {

                response.data.forEach(persona => {
                    const genero = persona.genero == 'M'
                        ? '<i class="bi bi-person-standing text-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Masculino"></i>'
                        : '<i class="bi bi-person-standing-dress text-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Femenino"></i>';


                    const roles = Array.isArray(persona.mDatos?.rol) ? persona.mDatos.rol.join(', ') : 'Sin rol';
                  
                    const fila = `
                <tr>
                    <td>${persona.cedula.toString() }</td>
                    <td>${persona.nombres} ${persona.apellidos} </td>
                    <td>${persona.edad}</td>
                    <td>${genero}</td>
                    <td>${persona.mDatos.email}</td>
                    <td>${roles}</td>
                    <td>
                        <i class="bi bi-pencil-fill text-success me-3" style="cursor: pointer;" onclick="editarpersona('${persona.cedula}')" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar persona"></i>
                        <i class="bi bi-trash-fill text-danger " style="cursor: pointer;" onclick="eliminarPersona('${persona.cedula}')" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar persona"></i>

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
                //Cargamos los Roles;
                modalEliminarPersona = new bootstrap.Modal(document.getElementById('confirmarEliminacionModal'));

            } else {
                tablaBody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron personas.</td></tr>';
                Utils.showToast('NO EXISTEN personaES REGISTRADOS', 'info');
            }
        }, 120);
        userInfoPersona = JSON.parse(localStorage.getItem('userInfo'));
        document.getElementById("usuarioIngreso").value = `${userInfoPersona.nombre}`;
        document.getElementById("nombres").addEventListener("input", generarClave);
        document.getElementById("apellidos").addEventListener("input", generarClave);
        await cargarRoles();
        habilitarValidacioPersonas();

    } catch (error) {
        console.log(error);
        Utils.showToast("Error cargando datos iniciales", 'error');
    }

}
async function cargarRoles() {
    const rolesResponse = await Utils.httpRequest(
        `${Utils.path}/rol/all`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        },
        false);
    if (rolesResponse.cod === Utils.COD_OK && Array.isArray(rolesResponse.data)) {
        roles = rolesResponse.data.filter((rol) => rol.estado);
        const rolesSelect = document.getElementById("idRol");
        roles.forEach((rol) => {
            const option = document.createElement("option");
            option.value = rol.idRol;
            option.textContent = rol.nombre;
            rolesSelect.appendChild(option);
        });
    } else {
        Utils.showToast("No se pudieron obtener los roles", "error");
    }
}
function eliminarPersona(cedula) {
    console.log(cedula);
    esAdmin = userInfoPersona.cedula;
    if (String(esAdmin) == String(cedula)) {
        Utils.showToast('No puede eliminar al Administrador', 'warning');
    }
    modalEliminarPersona.show();
    idPersonaAEliminarP = String( cedula);
}
function editarpersona(cedula) {

}
async function confirmarEliminacionPersona() {
    if (!idPersonaAEliminarP) {
        Utils.showToast("ID de rol no válido", "danger");
        return;
    }
    const cedulaEliminar = idPersonaAEliminarP.toString();
    try {
        const response = await httpRequest(`${Utils.path}/personas/eliminar`, "POST", { cedula: cedulaEliminar });

        if (response && response.cod === Utils.COD_OK) {
            Utils.showToast("Usuario eliminado exitosamente", "success");
            cargarDatospersonas();
        } else {
            const messageClient = response.message || "Error al eliminar el Persona.";
            const messageTech = response.data || null;
            Utils.showErrorModal(messageClient, messageTech);
        }
    } catch (error) {
        Utils.showToast("Error al realizar la eliminación", "danger");
    } finally {
        idPersonaAEliminarP = null; 
        modalEliminarPersona.hide();
    }

}


async function savePersona(event) {
    const form = event.target.closest("form");
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return false; 
    }
    event.preventDefault();
    const cedula = document.getElementById("cedula").value;
    const nombres = document.getElementById("nombres").value;
    const apellidos = document.getElementById("apellidos").value;
    const edad = parseInt(document.getElementById("edad").value, 10);
    const genero = document.getElementById("genero").value;
    const email = document.getElementById("email").value;
    const clave = document.getElementById("clave").value;
    const rolSelect = document.getElementById("idRol");
    const idRol = parseInt(rolSelect.value, 10);

    if (!idRol) {
        Utils.showToast("Debe seleccionar un rol", "warning");
        return;
    }
    if (!validarEntrada({ cedula, nombres, apellidos, edad, genero, email, clave })) {
        return;
    }

    const persona = {
        "cedula": `${cedula}`,
        "nombres": `${nombres}`,
        "apellidos": `${apellidos}`,
        "edad": `${edad}`,
        "genero": `${genero}`,
        "email": `${email}`,
        "clave": `${clave}`,
        "idRol": `${idRol}`,
        "usuarioIngreso": `${userInfoPersona.idUsuario}`,
        "usuarioActualizacion": `${userInfoPersona.idUsuario}`,
    };

    try {
        const responseRequest = await Utils.httpRequest(
            `${Utils.path}/personas/crear`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(persona),
            },
            true
        );

        if (responseRequest.cod === Utils.COD_OK) {
            Utils.showToast("Persona guardada con éxito", "success");
            resetPersonaForm();
            cargarDatospersonas();
        } else {
            Utils.showToast(responseRequest.message || "Error al guardar la persona", "danger");
        }
    } catch (error) {
        console.log(error)
        Utils.showToast("Error al guardar la persona", "danger");
    }
}
//Valdidaciones
function validarEntrada({ cedula, nombres, apellidos, edad, genero, email, clave }) {
    if (!/^\d{10}$/.test(cedula)) {
        Utils.showToast("La cédula debe contener exactamente 10 dígitos", "warning");
        return false;
    }

    if (!nombres || nombres.length > 35) {
        Utils.showToast("Los nombres no deben estar vacíos ni superar los 35 caracteres", "warning");
        return false;
    }

    if (!apellidos || apellidos.length > 35) {
        Utils.showToast("Los apellidos no deben estar vacíos ni superar los 35 caracteres", "warning");
        return false;
    }

    if (isNaN(edad) || edad < 0 || edad > 120) {
        Utils.showToast("La edad debe ser un número entre 0 y 120", "warning");
        return false;
    }

    if (!genero || (genero !== "M" && genero !== "F")) {
        Utils.showToast("Debe seleccionar un género válido", "warning");
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Utils.showToast("El email no tiene un formato válido", "warning");
        return false;
    }

    if (!clave || clave.length < 6) {
        Utils.showToast("La contraseña debe tener al menos 6 caracteres", "warning");
        return false;
    }

    return true; // Todas las validaciones pasaron
}
//Genera contraseña automaticamente:
function generarClave() {
    const nombres = document.getElementById("nombres").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const claveField = document.getElementById("clave");

    if (nombres.length >= 3 && apellidos.length >= 3) {
        const fecha = new Date();
        const hora = String(fecha.getHours()).padStart(2, "0"); 

        const claveGenerada =
            nombres.substring(0, 3).toUpperCase() +
            apellidos.substring(0, 3).toUpperCase() +
            'CER'+
            hora;

        claveField.value = claveGenerada;
    } else {
        claveField.value = "PORDEFECTO2025";  
    }
}

function habilitarValidacioPersonas() {

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
//Validar entrada
function resetPersonaForm() {
    const form = document.getElementById("personaForm");
    if (!form) {
        console.error("Formulario 'personaForm' no encontrado.");
        return;
    }

    // Limpiar manualmente todos los campos del formulario
    form.querySelectorAll("input, select").forEach(element => {
        if (element.type === "checkbox" || element.type === "radio") {
            element.checked = false;
        } else {
            element.value = ""; 
        }
    });
     
    form.querySelectorAll(".is-invalid").forEach(element => {
        element.classList.remove("is-invalid");
    });
    form.querySelectorAll(".is-valid").forEach(element => {
        element.classList.remove("is-valid");
    });
}


// Generar HTML para los botones de acciones (editar y eliminar)
function generarAccionesHtml(tipo, cedula) {
    return `
        <div class="text-end">
            <button class="btn btn-primary btn-sm" onclick="editarElemento('${tipo}', '${cedula}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarElemento('${tipo}', '${cedula}')">Eliminar</button>
        </div>`;
}
