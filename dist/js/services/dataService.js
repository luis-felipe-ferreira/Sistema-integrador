var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = 'http://localhost:3001';
export const getPacientes = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_URL}/pacientes`);
    return response.json();
});
export const addPaciente = (paciente) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_URL}/pacientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paciente),
    });
    return response.json();
});
export const getFilaDeTriagem = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_URL}/fila`);
    const fila = yield response.json();
    return fila.map((item) => (Object.assign(Object.assign({}, item), { nome_paciente: item.paciente.nome })));
});
// MUDANÇA AQUI: A função agora usa o novo tipo 'NovaTriagemData' como parâmetro.
export const addTriagem = (triagemData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_URL}/triagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(triagemData),
    });
    if (!response.ok) {
        throw new Error('Falha ao adicionar triagem no servidor.');
    }
    return response.json();
});
export const chamarProximoPaciente = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_URL}/atender-proximo`, { method: 'POST' });
    const data = yield response.json();
    if (data.message === 'Fila vazia')
        return null;
    return data;
});
//# sourceMappingURL=dataService.js.map