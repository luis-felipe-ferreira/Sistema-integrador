
import { login, Perfil } from '../services/authService.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form?.addEventListener('submit', (e) => {

    e.preventDefault(); 

    const perfil = (document.getElementById('perfil') as HTMLSelectElement).value as Perfil;
    const senha = (document.getElementById('senha') as HTMLInputElement).value;

    if (login(perfil, senha)) {

      window.location.href = `./${perfil}.html`;
    } else {
      alert('Perfil ou senha incorretos!');
    }
  });
});