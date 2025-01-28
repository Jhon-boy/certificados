// Función para cargar datos de grupos 
async function cargarDatosCertificadosEmicion() {
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
 
            const selectGrupo = document.getElementById("persona-id-grupo"); 
             
            selectGrupo.innerHTML = '<option value="">Selecciona un grupo</option>'; 

            if (response.cod === Utils.COD_OK && response.data.length > 0) {
                response.data.forEach(grupo => {
                     
                    const option = document.createElement("option");
                    option.value = grupo.idGrupo;
                    option.textContent = grupo.nombre;  
                    selectGrupo.appendChild(option); 
                }); 
                const selectGrupoEvent = document.querySelector("#persona-id-grupo");
                selectGrupoEvent.addEventListener("change", async (event) => {
                    const idGrupoSeleccionado = event.target.value;
                    if (idGrupoSeleccionado) {
                        await listarIntegrantes(idGrupoSeleccionado);
                    }
                });
                 
            } else { 
                
                Utils.showToast('NO EXISTEN GRUPOS REGISTRADOS', 'info');
            }
        }, 150);
         
    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}
 
async function listarIntegrantes(id) {

    try {

        const payload = {
            idGrupo:id
        }
        const requestIntegrantes = await Utils.httpRequest(
            `${Utils.path}/grupoPersona/pendientes`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            },
            true
        );
        const tablaBody = document.querySelector("#tabla-certificado tbody");
        tablaBody.innerHTML = '';

        if (requestIntegrantes.cod == Utils.COD_OK && requestIntegrantes.data.length > 0) {
            requestIntegrantes.data.forEach(persona => { 
                const asistenciaMarcada = true; // Por defecto desmarcado
                const calificacionMarcada = true; // Por defecto desmarcado
                 
                const estado = asistenciaMarcada && calificacionMarcada ? "Aprobado" : "Pendiente";

                const fila = `
                <tr>
                    <td>${persona.tpersona.cedula}</td>
                    <td>${persona.tpersona.nombres} ${persona.tpersona.apellidos}</td>
                     <td>
                        <div class="form-check">
                            <input class="form-check-input asistencia" type="checkbox" checked>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input calificacion" type="checkbox" checked>
                        </div>
                    </td> 
                    <td  class="estado">${estado}</td>
                </tr>
            `;
                tablaBody.insertAdjacentHTML("beforeend", fila);
            });
            reseteoSeleccion();
            const selectCondicion = document.getElementById("condicion");
            selectCondicion.onchange = () => {
                actualizarEstados();
                manejarHabilitacionCheckboxes(selectCondicion.value);
            };
            escucharCambiosCheckboxes();
        } else {
            Utils.showToast('NO EXISTEN INTEGRANTES EN ESTE GRUPO', 'info');
        }

    } catch (error) {
        console.log('ERROR -->', error);
        Utils.showToast("ERROR AL CARGAR DATOS", "error");
    }
}

function reseteoSeleccion() {
    const selectCondicion = document.querySelector("#condicion");
    if (selectCondicion) {
        selectCondicion.value = "1"; 
    }
}

function escucharCambiosCheckboxes() {
    const checkboxes = document.querySelectorAll(".asistencia, .calificacion");

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            actualizarEstados();  // Actualiza los estados inmediatamente
        });
    });
}

// Función para actualizar los estados según la condición seleccionada
function actualizarEstados() {
    const condicion = document.querySelector("#condicion").value;
    const filas = document.querySelectorAll("#tabla-certificado tbody tr");

    filas.forEach(fila => {
        const asistenciaMarcada = fila.querySelector(".asistencia").checked;
        const calificacionMarcada = fila.querySelector(".calificacion").checked;
        let estado;

        // Determinar el estado según la condición seleccionada
        if (condicion === "1") {  // Ambos
            estado = (asistenciaMarcada && calificacionMarcada) ? "Aprobado" : "No Aprobado";
        } else if (condicion === "2") {  // Calificación
            estado = calificacionMarcada ? "Aprobado" : "No Aprobado";
        } else if (condicion === "3") {  // Asistencia
            estado = asistenciaMarcada ? "Aprobado" : "No Aprobado";
        }

        fila.querySelector(".estado").textContent = estado;  
    });
}

function manejarHabilitacionCheckboxes(condicion) {
    const checkboxesAsistencia = document.querySelectorAll(".asistencia");
    const checkboxesCalificacion = document.querySelectorAll(".calificacion");

    if (condicion === "2") {   
        checkboxesAsistencia.forEach(cb => cb.disabled = true);   
        checkboxesCalificacion.forEach(cb => cb.disabled = false);   
    } else if (condicion === "3") {  
        checkboxesAsistencia.forEach(cb => cb.disabled = false);   
        checkboxesCalificacion.forEach(cb => cb.disabled = true);   
    } else {  // AMBOS
        checkboxesAsistencia.forEach(cb => cb.disabled = false);   
        checkboxesCalificacion.forEach(cb => cb.disabled = false);  
    }
}

