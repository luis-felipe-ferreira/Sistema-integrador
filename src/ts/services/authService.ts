export type Perfil = 'recepcionista' | 'enfermeira' | 'medico';


const USUARIOS = {
  recepcionista: '123',
  enfermeira: '456',
  medico: '789',
};


export const login = (perfil: Perfil, senha: string): boolean => {
  if (USUARIOS[perfil] && USUARIOS[perfil] === senha) {
    sessionStorage.setItem('perfilLogado', perfil);
    return true;
  }
  return false;
};


export const logout = (): void => {
  sessionStorage.removeItem('perfilLogado');

  window.location.href = './login.html';
};


export const verificarAcesso = (perfilNecessario: Perfil): void => {
  const perfilLogado = sessionStorage.getItem('perfilLogado');
  if (perfilLogado !== perfilNecessario) {
    alert('Acesso negado. Por favor, faça o login com o perfil correto.');
    window.location.href = './login.html';
  }
};