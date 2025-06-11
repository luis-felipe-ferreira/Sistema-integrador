type PacienteDaFilaDB = {
    triagem_id: number;
    nome_paciente: string;
    prioridade: number;
    data_hora_triagem: string;
};

function carregarFila() {
  fetch('/medico/fila')
    .then(res => {
        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }
        return res.json();
    })
    .then((fila: PacienteDaFilaDB[] | {error: string}) => {
      const filaDiv = document.getElementById('fila');
      if (!filaDiv) {
        console.error("Elemento 'fila' não encontrado no DOM.");
        return;
      }
      filaDiv.innerHTML = '';

      if (Array.isArray(fila) && fila.length > 0) {
        fila.forEach(p => {
          const div = document.createElement('div');
          let dataFormatada = p.data_hora_triagem;
          try {
            dataFormatada = new Date(p.data_hora_triagem).toLocaleString('pt-BR');
          } catch (e) {}

          div.textContent = `${p.nome_paciente} (Prioridade: ${p.prioridade}, Chegada: ${dataFormatada})`;
          filaDiv.appendChild(div);
        });
      } else if ('error' in fila) {
        filaDiv.innerHTML = `<p>Erro ao carregar fila: ${fila.error}</p>`;
      } 
      else {
        filaDiv.innerHTML = '<p>Fila de pacientes vazia.</p>';
      }
    })
    .catch(error => {
        console.error('Erro ao carregar a fila:', error);
        const filaDiv = document.getElementById('fila');
        if (filaDiv) {
            filaDiv.innerHTML = `<p>Erro de conexão ao carregar a fila de pacientes: ${error.message}</p>`;
        }
    });
}

(window as any).chamarProximo = function () {
  fetch('/medico/chamar')
    .then(res => {
        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
      const pacienteDiv = document.getElementById('paciente');
      if (!pacienteDiv) return;

      if (data.message && data.message === "Fila vazia") {
        pacienteDiv.textContent = "Não há pacientes na fila para chamar.";
      } else if (data.error) {
        pacienteDiv.textContent = `Erro ao chamar paciente: ${data.error}`;
      } else {
        let infoPaciente = `Paciente Chamado:\n`;
        infoPaciente += `  Nome: ${data.nome_paciente}\n`;
        infoPaciente += `  Prioridade: ${data.prioridade}\n`;
        infoPaciente += `  Pressão: ${data.pressao}\n`;
        infoPaciente += `  Temperatura: ${data.temperatura}\n`;
        infoPaciente += `  Frequência: ${data.frequencia}\n`;
        infoPaciente += `  Observações: ${data.observacoes}\n`;
        try {
            infoPaciente += `  Hora da Triagem: ${new Date(data.data_hora_triagem).toLocaleString('pt-BR')}\n`;
        } catch(e) {
            infoPaciente += `  Hora da Triagem: ${data.data_hora_triagem}\n`;
        }
        pacienteDiv.textContent = infoPaciente;
      }
      carregarFila();
    })
    .catch(error => {
        console.error('Erro ao chamar o próximo paciente:', error);
        const pacienteDiv = document.getElementById('paciente');
        if (pacienteDiv) {
            pacienteDiv.textContent = `Erro de conexão ao chamar paciente: ${error.message}`;
        }
        carregarFila();
    });
};

window.onload = carregarFila;