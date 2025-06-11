interface Paciente {
    id: number;
    nome: string;
    cpf: string | null; 
}


declare const todosPacientes: Paciente[];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('paciente_search_input') as HTMLInputElement | null;
    const searchResultsDiv = document.getElementById('searchResults') as HTMLDivElement | null;
    const hiddenPacienteIdInput = document.getElementById('paciente_id_hidden') as HTMLInputElement | null;
    const selectedPatientInfoDiv = document.getElementById('selectedPatientInfo') as HTMLDivElement | null;
    const triagemForm = document.getElementById('triagemForm') as HTMLFormElement | null;

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
        const termoBusca: string = searchInput.value.toLowerCase().trim();
        
        searchResultsDiv.innerHTML = ''; 
        hiddenPacienteIdInput.value = ''; 
        selectedPatientInfoDiv.style.display = 'none';
        selectedPatientInfoDiv.textContent = '';

        if (termoBusca.length < 2) {
            searchResultsDiv.style.display = 'none';
            return;
        }

        const pacientesFiltrados: Paciente[] = todosPacientes.filter((paciente: Paciente) => {
            const nomeMatch = paciente.nome.toLowerCase().includes(termoBusca);
            const cpfMatch = paciente.cpf ? paciente.cpf.toLowerCase().includes(termoBusca) : false;
            return nomeMatch || cpfMatch;
        });

        if (pacientesFiltrados.length > 0) {
            pacientesFiltrados.forEach((paciente: Paciente) => {
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
        } else {
            searchResultsDiv.style.display = 'none';
        }
    });

    document.addEventListener('click', (event: MouseEvent) => {
        const targetNode = event.target as Node;
        if (!searchResultsDiv.contains(targetNode) && targetNode !== searchInput) {
            searchResultsDiv.style.display = 'none';
        }
    });

    triagemForm.addEventListener('submit', (event: SubmitEvent) => {
        if (!hiddenPacienteIdInput.value) {
            alert('Por favor, selecione um paciente da lista de busca.');
            event.preventDefault(); 
            searchInput.focus();
        }
    });
});