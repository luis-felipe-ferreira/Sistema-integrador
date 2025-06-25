import { verificarAcesso, logout } from '../services/authService.js';
import { getPacientes, addTriagem, Paciente } from '../services/dataService.js';

// Protege a página, permitindo acesso apenas à enfermeira
verificarAcesso('enfermeira');

let todosPacientes: Paciente[] = [];

// Função principal que executa quando a página carrega
document.addEventListener('DOMContentLoaded', async () => {
    // Carrega a lista de pacientes do backend
    try {
        todosPacientes = await getPacientes();
    } catch (error) {
        console.error('Falha ao carregar pacientes:', error);
        alert('Não foi possível carregar a lista de pacientes do servidor.');
        return; // Interrompe a execução se não conseguir carregar
    }

    // Pega os elementos do HTML
    const searchInput = document.getElementById('paciente_search_input') as HTMLInputElement;
    const searchResultsDiv = document.getElementById('searchResults') as HTMLDivElement;
    const hiddenPacienteIdInput = document.getElementById('paciente_id_hidden') as HTMLInputElement;
    const selectedPatientInfoDiv = document.getElementById('selectedPatientInfo') as HTMLDivElement;
    const triagemForm = document.getElementById('triagemForm') as HTMLFormElement;

    // "Ouve" o que o usuário digita no campo de busca
    searchInput.addEventListener('input', () => {
        const termoBusca = searchInput.value.toLowerCase().trim();
        searchResultsDiv.innerHTML = ''; // Limpa resultados anteriores
        searchResultsDiv.style.display = 'none';

        if (termoBusca.length < 2) {
            return; // Só busca com 2 ou mais caracteres
        }

        const pacientesFiltrados = todosPacientes.filter(paciente =>
            paciente.nome.toLowerCase().includes(termoBusca) ||
            paciente.cpf.includes(termoBusca)
        );

        if (pacientesFiltrados.length > 0) {
            searchResultsDiv.style.display = 'block'; // Mostra a caixa de resultados
            pacientesFiltrados.forEach(paciente => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('result-item');
                // Cria o HTML para cada item da lista com nome e CPF
                itemDiv.innerHTML = `
                    <span class="patient-name">${paciente.nome}</span>
                    <span class="patient-cpf">CPF: ${paciente.cpf}</span>
                `;

                // Adiciona um evento de clique para cada item
                itemDiv.addEventListener('click', () => {
                    // Preenche os campos ao selecionar um paciente
                    searchInput.value = paciente.nome;
                    hiddenPacienteIdInput.value = paciente.id.toString();
                    
                    // Mostra a confirmação do paciente selecionado
                    selectedPatientInfoDiv.textContent = `Paciente Selecionado: ${paciente.nome}`;
                    selectedPatientInfoDiv.style.display = 'block';
                    
                    // Esconde a lista de resultados
                    searchResultsDiv.innerHTML = '';
                    searchResultsDiv.style.display = 'none';
                });

                searchResultsDiv.appendChild(itemDiv);
            });
        }
    });

    // Esconde a lista se o usuário clicar fora dela
    document.addEventListener('click', (e) => {
        if (!searchResultsDiv.contains(e.target as Node) && e.target !== searchInput) {
            searchResultsDiv.style.display = 'none';
        }
    });

    // Lógica para enviar o formulário
    triagemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!hiddenPacienteIdInput.value) {
            alert('Por favor, busque e selecione um paciente da lista.');
            return;
        }

        const triagemData = {
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
            window.location.href = './enfermeira.html'; // Volta para o painel
        } catch (error) {
            alert('Erro ao salvar a triagem. Tente novamente.');
            console.error('Erro ao salvar triagem:', error);
        }
    });
    
    // Funcionalidade do botão de logout
    document.querySelector('.logout-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});