// Datos de la aplicación
const dashboardData = {
    personas: 40,
    eventos: 5,
    docentes: 5,
    certificados: 5
};

// Configuración del gráfico de barras
const mainChartCtx = document.getElementById('mainChart').getContext('2d');
new Chart(mainChartCtx, {
    type: 'bar',
    data: {
        labels: ['Personas Registradas', 'Eventos', 'Docentes', 'Certificados'],
        datasets: [{
            label: 'Estadísticas Generales',
            data: [
                dashboardData.personas,
                dashboardData.eventos,
                dashboardData.docentes,
                dashboardData.certificados
            ],
            backgroundColor: [
                'rgba(25, 118, 210, 0.7)',
                'rgba(253, 216, 53, 0.7)',
                'rgba(67, 160, 71, 0.7)',
                'rgba(229, 57, 53, 0.7)'
            ],
            borderColor: [
                'rgba(25, 118, 210, 1)',
                'rgba(253, 216, 53, 1)',
                'rgba(67, 160, 71, 1)',
                'rgba(229, 57, 53, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Configuración del gráfico circular
const pieChartCtx = document.getElementById('pieChart').getContext('2d');
new Chart(pieChartCtx, {
    type: 'doughnut',
    data: {
        labels: ['Personas', 'Eventos', 'Docentes', 'Certificados'],
        datasets: [{
            data: [
                dashboardData.personas,
                dashboardData.eventos,
                dashboardData.docentes,
                dashboardData.certificados
            ],
            backgroundColor: [
                'rgba(25, 118, 210, 0.7)',
                'rgba(253, 216, 53, 0.7)',
                'rgba(67, 160, 71, 0.7)',
                'rgba(229, 57, 53, 0.7)'
            ],
            borderColor: [
                'rgba(25, 118, 210, 1)',
                'rgba(253, 216, 53, 1)',
                'rgba(67, 160, 71, 1)',
                'rgba(229, 57, 53, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20
                }
            }
        },
        cutout: '65%'
    }
});