const USUARIOS = {
    recepcionista: '123',
    enfermeira: '456',
    medico: '789',
};
export const login = (perfil, senha) => {
    if (USUARIOS[perfil] && USUARIOS[perfil] === senha) {
        sessionStorage.setItem('perfilLogado', perfil);
        return true;
    }
    return false;
};
export const logout = () => {
    sessionStorage.removeItem('perfilLogado');
    window.location.href = './login.html';
};
export const verificarAcesso = (perfilNecessario) => {
    const perfilLogado = sessionStorage.getItem('perfilLogado');
    if (perfilLogado !== perfilNecessario) {
        alert('Acesso negado. Por favor, faça o login com o perfil correto.');
        window.location.href = './login.html';
    }
};
//# sourceMappingURL=authService.js.map