export interface Paciente {
    id: number;
    nome: string;
    cpf: string;
    data_nascimento: string;
    sexo: string;
}

export interface TriagemItem {
    id: number; 
    prioridade: number;
    data_hora_triagem: string;
    
    nome_paciente?: string; 
    paciente?: Paciente;    
    pressao?: string;
    temperatura?: string;
    frequencia?: string;
    observacoes?: string | null;
}

export type NovaTriagemData = {
    pacienteId: number;
    pressao: string;
    temperatura: string;
    frequencia: string;
    observacoes: string;
    prioridade: number;
};