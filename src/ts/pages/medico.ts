import { verificarAcesso, logout } from '../services/authService.js';
import { getFilaDeTriagem, chamarProximoPaciente } from '../services/dataService.js';
import { MinHeap } from '../components/minHeap.js';

verificarAcesso('medico');

const filaDiv = document.getElementById('fila')!;
const pacienteDiv = document.getElementById('paciente')!;

async function carregarFila() {
  filaDiv.innerHTML = '';
  const fila = await getFilaDeTriagem();
  
  if (fila.length === 0) {
    filaDiv.innerHTML = '<p>Fila de pacientes vazia.</p>';
    return;
  }
  
  const filaHeap = new MinHeap(fila);
  
  while(!filaHeap.isEmpty()) {
      const p = filaHeap.extractMin()!;
      const div = document.createElement('div');
      const dataFormatada = new Date(p.data_hora_triagem).toLocaleString('pt-BR');
      
      // Usa p.nome_paciente, que é o campo correto vindo da API /fila
      div.textContent = `${p.nome_paciente} (Prioridade: ${p.prioridade}, Chegada: ${dataFormatada})`;
      filaDiv.appendChild(div);
  }
}

async function chamarProximo() {
  const data = await chamarProximoPaciente();
  
  if (!data) {
    pacienteDiv.textContent = "Não há pacientes na fila para chamar.";
  } else {
    // Usa a propriedade aninhada 'paciente' que vem da API /atender-proximo
    pacienteDiv.textContent = `
      Paciente Chamado:
      Nome: ${data.paciente.nome}
      CPF: ${data.paciente.cpf}
      Prioridade: ${data.prioridade}
      Pressão: ${data.pressao}
      Temperatura: ${data.temperatura}
      Frequência: ${data.frequencia}
      Observações: ${data.observacoes}
      Hora da Triagem: ${new Date(data.data_hora_triagem).toLocaleString('pt-BR')}
    `;
  }
  await carregarFila();
}

document.addEventListener('DOMContentLoaded', () => {
    carregarFila();
    const chamarBtn = document.querySelector('button');
    if (chamarBtn) {
        chamarBtn.addEventListener('click', chamarProximo);
    }
    
    document.querySelector('.logout-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});