// O .js no final é importante para a compatibilidade com módulos no navegador
import { login } from '../services/authService.js';
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
        // Esta linha é crucial para impedir que a página recarregue
        e.preventDefault();
        const perfil = document.getElementById('perfil').value;
        const senha = document.getElementById('senha').value;
        if (login(perfil, senha)) {
            // Se o login der certo, esta linha faz o redirecionamento
            window.location.href = `./${perfil}.html`;
        }
        else {
            alert('Perfil ou senha incorretos!');
        }
    });
});
//# sourceMappingURL=login.js.map