import { verificarAcesso, logout } from '../services/authService.js';
import { getPacientes, addTriagem } from '../services/dataService.js';
import { Paciente, NovaTriagemData } from '../types.js';

verificarAcesso('enfermeira');

let todosPacientes: Paciente[] = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        todosPacientes = await getPacientes();
    } catch (error) {
        console.error('Falha ao carregar pacientes:', error);
        alert('Não foi possível carregar a lista de pacientes do servidor.');
        return;
    }

    const searchInput = document.getElementById('paciente_search_input') as HTMLInputElement;
    const searchResultsDiv = document.getElementById('searchResults') as HTMLDivElement;
    const hiddenPacienteIdInput = document.getElementById('paciente_id_hidden') as HTMLInputElement;
    const selectedPatientInfoDiv = document.getElementById('selectedPatientInfo') as HTMLDivElement;
    const triagemForm = document.getElementById('triagemForm') as HTMLFormElement;

    searchInput.addEventListener('input', () => {
        const termoBusca = searchInput.value.toLowerCase().trim();
        searchResultsDiv.innerHTML = '';
        searchResultsDiv.style.display = 'none';

        if (termoBusca.length < 2) {
            return;
        }

        const pacientesFiltrados = todosPacientes.filter(paciente =>
            paciente.nome.toLowerCase().includes(termoBusca) ||
            paciente.cpf.includes(termoBusca)
        );

        if (pacientesFiltrados.length > 0) {
            searchResultsDiv.style.display = 'block';
            pacientesFiltrados.forEach(paciente => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('result-item');
                itemDiv.innerHTML = `
                    <span class="patient-name">${paciente.nome}</span>
                    <span class="patient-cpf">CPF: ${paciente.cpf}</span>
                `;

                itemDiv.addEventListener('click', () => {
                    searchInput.value = paciente.nome;
                    hiddenPacienteIdInput.value = paciente.id.toString();
                    selectedPatientInfoDiv.textContent = `Paciente Selecionado: ${paciente.nome}`;
                    selectedPatientInfoDiv.style.display = 'block';
                    searchResultsDiv.innerHTML = '';
                    searchResultsDiv.style.display = 'none';
                });

                searchResultsDiv.appendChild(itemDiv);
            });
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchResultsDiv.contains(e.target as Node) && e.target !== searchInput) {
            searchResultsDiv.style.display = 'none';
        }
    });

    triagemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!hiddenPacienteIdInput.value) {
            alert('Por favor, busque e selecione um paciente da lista.');
            return;
        }

        const triagemData: NovaTriagemData = {
            pacienteId: Number(hiddenPacienteIdInput.value),
            pressao: (document.getElementById('pressao') as HTMLInputElement).value,
            temperatura: (document.getElementById('temperatura') as HTMLInputElement).value,
            frequencia: (document.getElementById('frequencia') as HTMLInputElement).value,
            observacoes: (document.getElementById('observacoes') as HTMLTextAreaElement).value,
            prioridade: Number((document.getElementById('prioridade') as HTMLInputElement).value),
        };

        try {
            await addTriagem(triagemData);
            alert('Triagem salva com sucesso!');
            window.location.href = './enfermeira.html';
        } catch (error) {
            alert('Erro ao salvar a triagem. Tente novamente.');
            console.error('Erro ao salvar triagem:', error);
        }
    });
    
    document.querySelector('.logout-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});