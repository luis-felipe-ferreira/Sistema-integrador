import { TriagemItem } from '../components/minHeap.js';

const API_URL = 'http://localhost:3001';

// Interface para o Paciente (mantém-se igual)
export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  data_nascimento: string;
  sexo: string;
}

// MUDANÇA AQUI: Criamos um tipo específico para os dados que vêm do formulário de triagem.
export type NovaTriagemData = {
    pacienteId: number;
    pressao: string;
    temperatura: string;
    frequencia: string;
    observacoes: string;
    prioridade: number;
};

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
    return response.json();
};

export const getFilaDeTriagem = async (): Promise<any[]> => {
  const response = await fetch(`${API_URL}/fila`);
  const fila = await response.json();
  return fila.map((item: any) => ({ ...item, nome_paciente: item.paciente.nome }));
};

// MUDANÇA AQUI: A função agora usa o novo tipo 'NovaTriagemData' como parâmetro.
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