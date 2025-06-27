var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { verificarAcesso, logout } from '../services/authService.js';
import { getFilaDeTriagem, chamarProximoPaciente } from '../services/dataService.js';
import { MinHeap } from '../components/minHeap.js';
verificarAcesso('medico');
const filaDiv = document.getElementById('fila');
const pacienteDiv = document.getElementById('paciente');
function carregarFila() {
    return __awaiter(this, void 0, void 0, function* () {
        filaDiv.innerHTML = '';
        const fila = yield getFilaDeTriagem();
        if (fila.length === 0) {
            filaDiv.innerHTML = '<p>Fila de pacientes vazia.</p>';
            return;
        }
        const filaHeap = new MinHeap(fila);
        while (!filaHeap.isEmpty()) {
            const p = filaHeap.extractMin();
            const div = document.createElement('div');
            const dataFormatada = new Date(p.data_hora_triagem).toLocaleString('pt-BR');
            div.textContent = `${p.nome_paciente} (Prioridade: ${p.prioridade}, Chegada: ${dataFormatada})`;
            filaDiv.appendChild(div);
        }
    });
}
function chamarProximo() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield chamarProximoPaciente();
        if (!data) {
            pacienteDiv.textContent = "Não há pacientes na fila para chamar.";
        }
        else {
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
            }
            else {
                pacienteDiv.textContent = `Erro: Dados do paciente chamado estão incompletos.`;
            }
        }
        yield carregarFila();
    });
}
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    carregarFila();
    const chamarBtn = document.querySelector('button');
    if (chamarBtn) {
        chamarBtn.addEventListener('click', chamarProximo);
    }
    (_a = document.querySelector('.logout-link')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});
//# sourceMappingURL=medico.js.map