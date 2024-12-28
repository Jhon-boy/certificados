async function fetchData() {
    try {
        const response = await fetch('URL_DE_TU_API');
        const data = await response.json();
        const { tipoEvento, dominio, lineaInvestigacion, ciclo, facilitador, modalidad, grupo } = data;
        populateSelect('tipoEvento', tipoEvento);
        populateSelect('dominio', dominio);
        populateSelect('lineaInvestigacion', lineaInvestigacion);
        populateSelect('ciclo', ciclo);
        populateSelect('facilitador', facilitador);
        populateSelect('modalidad', modalidad);
        populateSelect('grupo', grupo);
        document.getElementById('curso').value = '';
        document.getElementById('horario').value = '';
        document.getElementById('fechaInicio').value = '';
        document.getElementById('fechaFin').value = '';
        document.getElementById('horas').value = '';
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function populateSelect(selectId, values) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '';
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

window.onload = fetchData;