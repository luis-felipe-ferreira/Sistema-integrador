export type Perfil = 'recepcionista' | 'enfermeira' | 'medico';

// Verifique se as senhas estão corretas aqui!
const USUARIOS = {
  recepcionista: '123',
  enfermeira: '456',
  medico: '789',
};

/**
 * Tenta fazer o login. Se for bem-sucedido, armazena o perfil na sessão do navegador.
 */
export const login = (perfil: Perfil, senha: string): boolean => {
  if (USUARIOS[perfil] && USUARIOS[perfil] === senha) {
    sessionStorage.setItem('perfilLogado', perfil);
    return true;
  }
  return false;
};

/**
 * Desloga o usuário e o redireciona para a página de login.
 */
export const logout = (): void => {
  sessionStorage.removeItem('perfilLogado');
  // O caminho deve ser relativo à pasta /html/
  window.location.href = './login.html';
};

/**
 * Verifica se o perfil necessário está logado. Se não, redireciona para a página de login.
 */
export const verificarAcesso = (perfilNecessario: Perfil): void => {
  const perfilLogado = sessionStorage.getItem('perfilLogado');
  if (perfilLogado !== perfilNecessario) {
    alert('Acesso negado. Por favor, faça o login com o perfil correto.');
    window.location.href = './login.html';
  }
};