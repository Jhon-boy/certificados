document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        // Datos simulados que vendrían del backend
        const dashboardData = {
            userData: {
                username: "JHON CUVI",
                lastLogin: "Hoy 7:AM AM",
                stats: {
                    registeredPeople: 50,
                    events: 8,
                    teachers: 6,
                    certificates: 7
                }
            },
            progressData: {
                registeredPeople: {
                    progress: 75,
                    status: { icon: "arrow-up", text: "+15% este mes", class: "text-success" }
                },
                events: {
                    progress: 45,
                    status: { icon: "clock", text: "3 eventos próximos", class: "text-warning" }
                },
                teachers: {
                    progress: 60,
                    status: { icon: "check", text: "Todos activos", class: "text-success" }
                },
                certificates: {
                    progress: 30,
                    status: { icon: "clock", text: "4 pendientes", class: "text-danger" }
                }
            },
            chartData: {
                monthly: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    users: [30, 35, 25, 40, 32, 50],
                    events: [3, 4, 2, 5, 3, 8],
                    certificates: [2, 3, 4, 3, 5, 7]
                },
                distribution: {
                    labels: ['Estudiantes', 'Docentes', 'Administrativos'],
                    data: [70, 20, 10]
                }
            }
        };
         
        document.querySelector(".username-dashboard").textContent = dashboardData.userData.username;
        document.querySelector(".last-login").textContent = `Último acceso: ${dashboardData.userData.lastLogin}`;
         
        document.querySelector(".registered-people").textContent = dashboardData.userData.stats.registeredPeople;
        document.querySelector(".events-count").textContent = dashboardData.userData.stats.events;
        document.querySelector(".teachers-count").textContent = dashboardData.userData.stats.teachers;
        document.querySelector(".certificates-count").textContent = dashboardData.userData.stats.certificates;
         
        const updateProgressAndStatus = (type, data) => {
            document.querySelector(`.progress-${type}`).style.width = `${data.progress}%`;
            document.querySelector(`.status-${type}`).innerHTML =
                `<i class="fas fa-${data.status.icon}"></i> ${data.status.text}`;
            document.querySelector(`.status-${type}`).className =
                `status-${type} mt-2 d-block ${data.status.class}`;
        };

        updateProgressAndStatus('registered', dashboardData.progressData.registeredPeople);
        updateProgressAndStatus('events', dashboardData.progressData.events);
        updateProgressAndStatus('teachers', dashboardData.progressData.teachers);
        updateProgressAndStatus('certificates', dashboardData.progressData.certificates);
         
        const mainChartCtx = document.getElementById('mainChart').getContext('2d');
        new Chart(mainChartCtx, {
            type: 'line',
            data: {
                labels: dashboardData.chartData.monthly.labels,
                datasets: [
                    {
                        label: 'Usuarios',
                        data: dashboardData.chartData.monthly.users,
                        borderColor: '#0d6efd',
                        tension: 0.4
                    },
                    {
                        label: 'Eventos',
                        data: dashboardData.chartData.monthly.events,
                        borderColor: '#ffc107',
                        tension: 0.4
                    },
                    {
                        label: 'Certificados',
                        data: dashboardData.chartData.monthly.certificates,
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
                labels: dashboardData.chartData.distribution.labels,
                datasets: [{
                    data: dashboardData.chartData.distribution.data,
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
    }, 150);
});