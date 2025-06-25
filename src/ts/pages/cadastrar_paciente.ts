import { verificarAcesso, logout } from '../services/authService.js';
import { addPaciente } from '../services/dataService.js';

verificarAcesso('recepcionista');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form?.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const novoPaciente = {
            nome: (document.getElementById('nome') as HTMLInputElement).value,
            cpf: (document.getElementById('cpf') as HTMLInputElement).value,
            data_nascimento: (document.getElementById('data_nascimento') as HTMLInputElement).value,
            sexo: (document.getElementById('sexo') as HTMLSelectElement).value,
        };

        addPaciente(novoPaciente);

        alert(`Paciente "${novoPaciente.nome}" cadastrado com sucesso!`);

        window.location.href = './recepcionista.html';
    });

     document.querySelector('.logout-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});