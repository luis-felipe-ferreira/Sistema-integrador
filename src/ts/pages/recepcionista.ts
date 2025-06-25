import { verificarAcesso, logout } from '../services/authService.js';

verificarAcesso('recepcionista');

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.logout-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});