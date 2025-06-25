import { verificarAcesso, logout } from '../services/authService.js';
import { addPaciente } from '../services/dataService.js';
verificarAcesso('recepcionista');
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    const form = document.querySelector('form');
    form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
        e.preventDefault();
        const novoPaciente = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            data_nascimento: document.getElementById('data_nascimento').value,
            sexo: document.getElementById('sexo').value,
        };
        addPaciente(novoPaciente);
        alert(`Paciente "${novoPaciente.nome}" cadastrado com sucesso!`);
        window.location.href = './recepcionista.html';
    });
    (_a = document.querySelector('.logout-link')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});
//# sourceMappingURL=cadastrar_paciente.js.map