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
