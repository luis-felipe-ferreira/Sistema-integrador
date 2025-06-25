import { verificarAcesso, logout } from '../services/authService.js';
verificarAcesso('recepcionista');
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    (_a = document.querySelector('.logout-link')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});
//# sourceMappingURL=recepcionista.js.map