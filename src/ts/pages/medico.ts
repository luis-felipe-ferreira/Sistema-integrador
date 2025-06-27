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
      
      
      div.textContent = `${p.nome_paciente} (Prioridade: ${p.prioridade}, Chegada: ${dataFormatada})`;
      filaDiv.appendChild(div);
  }
}

async function chamarProximo() {
  const data = await chamarProximoPaciente();
  
  if (!data) {
    pacienteDiv.textContent = "Não há pacientes na fila para chamar.";
  } else {
    if (data.paciente) { 
      pacienteDiv.textContent = `
        Paciente Chamado:
        Nome: ${data.paciente.nome}
        CPF: ${data.paciente.cpf}
        Prioridade: ${data.prioridade}
        Pressão: ${data.pressao || 'N/A'}
        Temperatura: ${data.temperatura || 'N/A'}
        Frequência: ${data.frequencia || 'N/A'}
        Observações: ${data.observacoes || 'Nenhuma'}
        Hora da Triagem: ${new Date(data.data_hora_triagem).toLocaleString('pt-BR')}
      `;
    } else {
        pacienteDiv.textContent = `Erro: Dados do paciente chamado estão incompletos.`;
    }
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