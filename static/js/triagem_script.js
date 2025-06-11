"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('paciente_search_input');
    const searchResultsDiv = document.getElementById('searchResults');
    const hiddenPacienteIdInput = document.getElementById('paciente_id_hidden');
    const selectedPatientInfoDiv = document.getElementById('selectedPatientInfo');
    const triagemForm = document.getElementById('triagemForm');
    if (!searchInput || !searchResultsDiv || !hiddenPacienteIdInput || !selectedPatientInfoDiv || !triagemForm) {
        console.error('Erro TS: Um ou mais elementos do formulário de triagem não foram encontrados no DOM.');
        return;
    }
    if (typeof todosPacientes === 'undefined') {
        console.error('Erro TS: A lista de pacientes (todosPacientes) não foi definida globalmente.');
        searchInput.disabled = true;
        searchInput.placeholder = 'Erro ao carregar lista de pacientes.';
        return;
    }
    searchInput.addEventListener('input', () => {
        const termoBusca = searchInput.value.toLowerCase().trim();
        searchResultsDiv.innerHTML = '';
        hiddenPacienteIdInput.value = '';
        selectedPatientInfoDiv.style.display = 'none';
        selectedPatientInfoDiv.textContent = '';
        if (termoBusca.length < 2) {
            searchResultsDiv.style.display = 'none';
            return;
        }
        const pacientesFiltrados = todosPacientes.filter((paciente) => {
            const nomeMatch = paciente.nome.toLowerCase().includes(termoBusca);
            const cpfMatch = paciente.cpf ? paciente.cpf.toLowerCase().includes(termoBusca) : false;
            return nomeMatch || cpfMatch;
        });
        if (pacientesFiltrados.length > 0) {
            pacientesFiltrados.forEach((paciente) => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('result-item');
                itemDiv.innerHTML = `<span class="patient-name">${paciente.nome}</span>
                                     <span class="patient-cpf">CPF: ${paciente.cpf || 'Não informado'}</span>`;
                itemDiv.addEventListener('click', () => {
                    searchInput.value = paciente.nome;
                    hiddenPacienteIdInput.value = paciente.id.toString();
                    searchResultsDiv.style.display = 'none';
                    searchResultsDiv.innerHTML = '';
                    selectedPatientInfoDiv.textContent = `Paciente Selecionado: ${paciente.nome} (CPF: ${paciente.cpf || 'Não informado'})`;
                    selectedPatientInfoDiv.style.display = 'block';
                });
                searchResultsDiv.appendChild(itemDiv);
            });
            searchResultsDiv.style.display = 'block';
        }
        else {
            searchResultsDiv.style.display = 'none';
        }
    });
    document.addEventListener('click', (event) => {
        const targetNode = event.target;
        if (!searchResultsDiv.contains(targetNode) && targetNode !== searchInput) {
            searchResultsDiv.style.display = 'none';
        }
    });
    triagemForm.addEventListener('submit', (event) => {
        if (!hiddenPacienteIdInput.value) {
            alert('Por favor, selecione um paciente da lista de busca.');
            event.preventDefault();
            searchInput.focus();
        }
    });
});
//# sourceMappingURL=triagem_script.js.map