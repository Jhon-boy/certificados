let userInfoPerfil = JSON.parse(localStorage.getItem('userInfo'));
async function cargarDatosPerfil() {
    try {
        const payloiad = {
            cedula: userInfoPerfil.cedula
        }
        const response = await Utils.httpRequest(
            `${Utils.path}/personas/perfil`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloiad)
            },
            true);

        setTimeout(() => {
            if (response.cod === Utils.COD_OK && response.data != null) {

                const { usuario, persona, rol } = response.data;

                // Llenar campos del Tab Usuario
                document.getElementById("email").innerText = usuario.email;

                // Procesar roles como badges
                const rolesContainer = document.getElementById("roles");
                rolesContainer.innerHTML = ""; // Limpiar el contenido previo
                rol.forEach(role => {
                    const badge = document.createElement("span");
                    badge.className = "badge bg-secondary me-2";
                    badge.innerText = role;
                    rolesContainer.appendChild(badge);
                });

                document.getElementById("password").innerText = usuario.clave;

                // Llenar campos del Tab Persona
                document.getElementById("nombres").innerText = persona.nombres;
                document.getElementById("apellidos").innerText = persona.apellidos;
                document.getElementById("cedula").innerText = persona.cedula;
                document.getElementById("edad").innerText = persona.edad;
                document.getElementById("genero").innerText = persona.genero;
                document.getElementById("usuarioIngreso").innerText = persona.usuarioIngreso;
                document.getElementById("usuarioActualizacion").innerText = persona.usuarioActualizacion || "N/A";
                document.getElementById("fechaCreacion").innerText = new Date(persona.fechaCreacion).toLocaleString();
                document.getElementById("fechaModificacion").innerText = new Date(persona.fechaModificacion).toLocaleString();

            } else {
                Utils.showToast('NO PUDIMOS OBTENER TU INFORMACION', 'info');
            }
        }, 120);
    } catch (error) {
        console.log(error);
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}