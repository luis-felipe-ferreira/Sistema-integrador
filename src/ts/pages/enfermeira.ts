import { verificarAcesso, logout } from '../services/authService.js';
verificarAcesso('enfermeira');

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.logout-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});