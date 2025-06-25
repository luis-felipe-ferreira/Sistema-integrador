import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = 3001;

// Rota de Login
app.post('/login', async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Login bem-sucedido!' });
});

// Rota para cadastrar um novo paciente
app.post('/pacientes', async (req: Request, res: Response) => {
    const { nome, cpf, data_nascimento, sexo } = req.body;
    try {
        const novoPaciente = await prisma.paciente.create({
            data: { nome, cpf, data_nascimento, sexo },
        });
        res.status(201).json(novoPaciente);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao cadastrar paciente, CPF já pode existir.' });
    }
});

// Rota para buscar todos os pacientes
app.get('/pacientes', async (req: Request, res: Response) => {
    const pacientes = await prisma.paciente.findMany();
    res.json(pacientes);
});

// Rota para registrar uma nova triagem
app.post('/triagens', async (req: Request, res: Response) => {
    const { pacienteId, pressao, temperatura, frequencia, observacoes, prioridade } = req.body;
    
    try {
        const novaTriagem = await prisma.triagem.create({
            data: {
                pacienteId: Number(pacienteId),
                pressao,
                temperatura,
                frequencia,
                observacoes,
                prioridade: Number(prioridade),
            },
            include: { paciente: true }
        });

        await prisma.filaAtendimento.create({
            data: {
                triagemId: novaTriagem.id,
                pacienteNome: novaTriagem.paciente.nome,
                prioridade: novaTriagem.prioridade,
                data_hora_chegada: novaTriagem.data_hora_triagem,
            }
        });

        res.status(201).json(novaTriagem);

    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar triagem e adicionar à fila.' });
    }
});

// Rota para buscar a fila de triagem
app.get('/fila', async (req: Request, res: Response) => {
    const fila = await prisma.filaAtendimento.findMany({
        orderBy: [
            { prioridade: 'asc' }, 
            { data_hora_chegada: 'asc' }
        ],
    });
    const filaAdaptada = fila.map(item => ({...item, nome_paciente: item.pacienteNome, data_hora_triagem: item.data_hora_chegada}));
    res.json(filaAdaptada);
});

// Rota para atender o próximo paciente da fila
app.post('/atender-proximo', async (req: Request, res: Response) => {
    const proximoDaFila = await prisma.filaAtendimento.findFirst({
        orderBy: [
            { prioridade: 'asc' }, 
            { data_hora_chegada: 'asc' }
        ],
    });

    if (!proximoDaFila) {
        return res.json({ message: 'Fila vazia' });
    }
    
    await prisma.filaAtendimento.delete({ where: { id: proximoDaFila.id } });

    const detalhesCompletos = await prisma.triagem.findUnique({
        where: { id: proximoDaFila.triagemId },
        include: { paciente: true }
    });

    res.json(detalhesCompletos);
});


app.listen(PORT, () => {
  console.log(`!!! Servidor backend rodando na porta ${PORT}`);
});

// Dentro de backend/server.ts
app.post('/pacientes', async (req, res) => {
    // ...
    try {
        // Tenta criar o paciente
        const novoPaciente = await prisma.paciente.create({ data: { ... } });
        res.status(201).json(novoPaciente);
    } catch (error) {
        // Se o Prisma falhar (ex: por CPF duplicado), ele cai AQUI!
        res.status(400).json({ error: 'Erro ao cadastrar paciente, CPF já pode existir.' });
    }
});