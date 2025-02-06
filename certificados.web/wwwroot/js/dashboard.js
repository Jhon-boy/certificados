let usuarioLogeado = '';
let userInfo;
function toggleCollapse(submenuId) {
    const submenu = document.getElementById(submenuId);
    const arrow = submenu.previousElementSibling.querySelector('.arrow');

    if (submenu.style.display === "block") {
        submenu.style.display = "none";
        arrow.classList.remove("rotate");
    } else {
        submenu.style.display = "block";
        arrow.classList.add("rotate");
    }
}

function logOut() {
    Utils.backToIndex();

}
function RolesByUsuarios() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const rolesUsuario = userInfo?.roles || [];
    const permisosUsuario = new Set();
     

    // Roles con permisos asociados (en minúsculas)
    const rolesByUsuarios = {
        "admin": ["inicio", "mantenimiento", "planificacion", "facilitador", "actas", "certificacion", "consultas"],
        "facilitador": ["inicio", "facilitador", "actas"],
        "decano": ["inicio", "mantenimiento", "planificacion", "certificacion", "consultas"],
        "vicerrector": ["inicio", "consultas"],
    };

    // Normalizar roles y recolectar permisos
    rolesUsuario.forEach(rol => {
        const rolNormalizado = rol.trim().toLowerCase();
        if (rolesByUsuarios[rolNormalizado]) {
            rolesByUsuarios[rolNormalizado].forEach(modulo => {
                permisosUsuario.add(modulo.toLowerCase());
            });
        }
    });
     
     
    document.querySelectorAll(".nav-item").forEach(item => { 
        if (item.closest("header.main-header")) {
            return;
        }

        let tienePermiso = false;

        // Verificar clases en el <li> (ej: Home tiene modulo-inicio en el li)
        const clasesItem = [...item.classList];
        const moduloEnItem = clasesItem.find(clase =>
            clase.startsWith("modulo-")
        );
        if (moduloEnItem) {
            const nombreModulo = moduloEnItem.replace("modulo-", "").toLowerCase();
            if (permisosUsuario.has(nombreModulo)) {
                tienePermiso = true;
            }
        }
         
        if (!tienePermiso) {
            const iconos = item.querySelectorAll("i[class*='modulo-']");
            iconos.forEach(icono => {
                const clasesIcono = [...icono.classList];
                const moduloEnIcono = clasesIcono.find(clase =>
                    clase.startsWith("modulo-")
                );
                if (moduloEnIcono) {
                    const nombreModulo = moduloEnIcono.replace("modulo-", "").toLowerCase();
                    if (permisosUsuario.has(nombreModulo)) {
                        tienePermiso = true;
                    }
                }
            });
        }

        item.style.display = tienePermiso ? "" : "none"; 
    });
}

document.addEventListener('DOMContentLoaded', function () {
    Utils.cleanRoute();
    const submenuLinks = document.querySelectorAll('.nav-link[data-view]');
    usuarioLogeado = document.getElementById("userLog");
    userInfo = JSON.parse(localStorage.getItem('userInfo'));
    //No hay Información
    if (!userInfo) {
        Utils.backToIndex();
    }
    usuarioLogeado.innerHTML = `${userInfo.nombre}`;
    const defaultView = "Inicio";
    cargarVista(defaultView);

    const defaultLink = document.getElementById('link-inicio');
    if (defaultLink) {
        defaultLink.classList.add('active');
    }

    submenuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const viewName = link.getAttribute('data-view');

            submenuLinks.forEach(link => link.classList.remove('active'));
            link.classList.add('active');

            cargarVista(viewName);
        });
    });

    function cargarVista(viewName) { 
        fetch(`/Dashboard/${viewName}`)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('No se pudo cargar la vista');
                }
            })
            .then(html => {
                document.getElementById('dynamic-content').innerHTML = html;
            })
            .catch(error => {
                console.error('Error al cargar la vista:', error);
            });
    } 
    RolesByUsuarios();
    const dropdownButton = document.getElementById('dropdownUser');
    const dropdownMenu = document.getElementById('submenu9');

    dropdownButton.addEventListener('click', function () {
        const isVisible = dropdownMenu.classList.contains('show');
        if (isVisible) {
            dropdownMenu.classList.remove('show');
        } else {
            dropdownMenu.classList.add('show');
        }
    });
     
    document.addEventListener('click', function (event) {
        if (!dropdownMenu.contains(event.target) && event.target !== dropdownButton) {
            dropdownMenu.classList.remove('show');
        }
    });

});

