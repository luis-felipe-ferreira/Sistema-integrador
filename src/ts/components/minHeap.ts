// Definimos como é um objeto Paciente para ser usado em outras partes
export interface Paciente {
    id: number;
    nome: string;
    cpf: string;
}

// A interface TriagemItem agora inclui o objeto Paciente aninhado
export interface TriagemItem {
    id: number; // ID da Triagem
    prioridade: number;
    data_hora_triagem: string;
    pressao: string;
    temperatura: string;
    frequencia: string;
    observacoes: string | null;
    
    // Propriedade para a lista da fila, vinda da API /fila
    nome_paciente: string; 
    
    // Propriedade para os detalhes do paciente chamado, vinda da API /atender-proximo
    paciente: Paciente; 
}

// A classe MinHeap continua a mesma, usando a interface TriagemItem
export class MinHeap {
    private heap: TriagemItem[] = [];

    constructor(initialItems: TriagemItem[] = []) {
        this.heap = initialItems;
        if (this.heap.length > 0) {
            for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
                this.heapifyDown(i);
            }
        }
    }

    private getLeftChildIndex(parentIndex: number): number {
        return 2 * parentIndex + 1;
    }

    private getRightChildIndex(parentIndex: number): number {
        return 2 * parentIndex + 2;
    }

    private getParentIndex(childIndex: number): number {
        return Math.floor((childIndex - 1) / 2);
    }

    private hasLeftChild(index: number): boolean {
        return this.getLeftChildIndex(index) < this.heap.length;
    }

    private hasRightChild(index: number): boolean {
        return this.getRightChildIndex(index) < this.heap.length;
    }

    private hasParent(index: number): boolean {
        return this.getParentIndex(index) >= 0;
    }

    private leftChild(index: number): TriagemItem {
        return this.heap[this.getLeftChildIndex(index)];
    }

    private rightChild(index: number): TriagemItem {
        return this.heap[this.getRightChildIndex(index)];
    }

    private parent(index: number): TriagemItem {
        return this.heap[this.getParentIndex(index)];
    }

    private swap(indexOne: number, indexTwo: number): void {
        [this.heap[indexOne], this.heap[indexTwo]] = [this.heap[indexTwo], this.heap[indexOne]];
    }

    private compare(itemA: TriagemItem, itemB: TriagemItem): boolean {
        if (itemA.prioridade !== itemB.prioridade) {
            return itemA.prioridade < itemB.prioridade; 
        }
        return new Date(itemA.data_hora_triagem).getTime() < new Date(itemB.data_hora_triagem).getTime();
    }

    add(item: TriagemItem): void {
        this.heap.push(item);
        this.heapifyUp();
    }

    extractMin(): TriagemItem | undefined {
        if (this.heap.length === 0) {
            return undefined;
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const item = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.heapifyDown();
        return item;
    }

    peek(): TriagemItem | undefined {
        if (this.heap.length === 0) {
            return undefined;
        }
        return this.heap[0];
    }

    size(): number {
        return this.heap.length;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    private heapifyUp(): void {
        let index = this.heap.length - 1;
        while (this.hasParent(index) && this.compare(this.heap[index], this.parent(index))) {
            this.swap(index, this.getParentIndex(index));
            index = this.getParentIndex(index);
        }
    }

    private heapifyDown(startIndex: number = 0): void {
        let index = startIndex;
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (this.hasRightChild(index) && this.compare(this.rightChild(index), this.leftChild(index))) {
                smallerChildIndex = this.getRightChildIndex(index);
            }

            if (this.compare(this.heap[index], this.heap[smallerChildIndex])) {
                break; 
            } else {
                this.swap(index, smallerChildIndex);
            }
            index = smallerChildIndex;
        }
    }
}