import { login } from '../services/authService.js';
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
        e.preventDefault();
        const perfil = document.getElementById('perfil').value;
        const senha = document.getElementById('senha').value;
        if (login(perfil, senha)) {
            window.location.href = `./${perfil}.html`;
        }
        else {
            alert('Perfil ou senha incorretos!');
        }
    });
});
//# sourceMappingURL=login.js.map