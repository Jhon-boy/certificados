
document.addEventListener("DOMContentLoaded", function () {
    const  userDash = JSON.parse(localStorage.getItem('userInfo'));
    if (userDash && userDash.nombre && userDash.nombre.trim().length > 0) {
        setTimeout(() => {
            cargarDatosDashboard();
        }, 100);
    }
 
});
async function cargarDatosDashboard() {
    let userDashboardd = JSON.parse(localStorage.getItem('userInfo'));
    try {
        const requestData = await Utils.httpRequest(`${Utils.path}/dashboard/all`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }, true);

        if (requestData.cod === Utils.COD_OK && requestData.data.length > 1) {
            const data = requestData.data;
             
            const usuariosRegistrados = data.find(item => item.USUARIOS_REGISTRADOS)?.USUARIOS_REGISTRADOS || 0;
            const distribucionRoles = data.filter(item => item.ROL).map(item => ({
                rol: item.ROL,
                total: item.TOTAL_USUARIOS
            }));
            const eventos = data.filter(item => item.IDEVENTO);
             
            const now = new Date();
            const lastLogin = `Último acceso: Hoy ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
             
            document.querySelector(".username-dashboard").textContent = userDashboardd.nombre;  
            document.querySelector(".last-login").textContent = lastLogin;

            document.querySelector(".registered-people").textContent = usuariosRegistrados;
            document.querySelector(".events-count").textContent = eventos.length;
             
            const totalDocentes = distribucionRoles.reduce((acc, item) => {
                if (item.rol === "FACILITADOR" || item.rol === "TECNICO") {
                    return acc + item.total;
                }
                return acc;
            }, 0);
            document.querySelector(".teachers-count").textContent = totalDocentes;
             
            const totalCertificados = eventos.filter(evento => evento.CONCERTIFICADO === 1).length;
            document.querySelector(".certificates-count").textContent = totalCertificados;
             
            const updateProgressAndStatus = (type, progress, status) => {
                document.querySelector(`.progress-${type}`).style.width = `${progress}%`;
                document.querySelector(`.status-${type}`).className =
                    `status-${type} mt-2 d-block ${status.class}`;
            };

            updateProgressAndStatus('registered', 75, { icon: "arrow-up", class: "text-success" });
            updateProgressAndStatus('events', 45, { icon: "clock",  class: "text-warning" });
            updateProgressAndStatus('teachers', 60, { icon: "check", class: "text-success" });
            updateProgressAndStatus('certificates', 30, { icon: "clock", class: "text-danger" });

            // Configurar gráficos
            const mainChartCtx = document.getElementById('mainChart').getContext('2d');
            new Chart(mainChartCtx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], // Puedes ajustar estos labels según tus datos
                    datasets: [
                        {
                            label: 'Usuarios',
                            data: [30, 35, 25, 40, 32, 50], // Datos simulados
                            borderColor: '#0d6efd',
                            tension: 0.4
                        },
                        {
                            label: 'Eventos',
                            data: [3, 4, 2, 5, 3, 8], // Datos simulados
                            borderColor: '#ffc107',
                            tension: 0.4
                        },
                        {
                            label: 'Certificados',
                            data: [2, 3, 4, 3, 5, 7], // Datos simulados
                            borderColor: '#dc3545',
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const pieChartCtx = document.getElementById('pieChart').getContext('2d');
            new Chart(pieChartCtx, {
                type: 'doughnut',
                data: {
                    labels: distribucionRoles.map(item => item.rol),
                    datasets: [{
                        data: distribucionRoles.map(item => item.total),
                        backgroundColor: ['#0d6efd', '#198754', '#ffc107']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        } else {
            Utils.showToast('ERROR AL OBTENER DATOS DEL DASHBOARD', 'info');
        }
    } catch (error) {
        Utils.showToast("Error cargando datos iniciales", 'error');
    }
}
 