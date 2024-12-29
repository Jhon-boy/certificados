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

document.addEventListener('DOMContentLoaded', function () {
    const submenuLinks = document.querySelectorAll('.nav-link[data-view]');

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
        console.log()
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
});

