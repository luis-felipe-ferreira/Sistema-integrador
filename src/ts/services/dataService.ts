import { TriagemItem, Paciente, NovaTriagemData } from '../types.js';

const API_URL = 'http://localhost:3001';

export const getPacientes = async (): Promise<Paciente[]> => {
  const response = await fetch(`${API_URL}/pacientes`);
  return response.json();
};

export const addPaciente = async (paciente: Omit<Paciente, 'id'>): Promise<Paciente> => {
    const response = await fetch(`${API_URL}/pacientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paciente),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Um erro desconhecido ocorreu.');
    }

    return response.json();
};

export const getFilaDeTriagem = async (): Promise<TriagemItem[]> => {
  const response = await fetch(`${API_URL}/fila`);
  if (!response.ok) {
      throw new Error('Falha ao buscar a fila.');
  }
  return response.json();
};

export const addTriagem = async (triagemData: NovaTriagemData): Promise<TriagemItem> => {
    const response = await fetch(`${API_URL}/triagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(triagemData),
    });
    if (!response.ok) {
        throw new Error('Falha ao adicionar triagem no servidor.');
    }
    return response.json();
};

export const chamarProximoPaciente = async (): Promise<TriagemItem | null> => {
    const response = await fetch(`${API_URL}/atender-proximo`, { method: 'POST' });
    const data = await response.json();
    if (data.message === 'Fila vazia') return null;
    return data;
};