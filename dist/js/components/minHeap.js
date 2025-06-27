export class MinHeap {
    constructor(initialItems = []) {
        this.heap = [];
        this.heap = initialItems;
        if (this.heap.length > 0) {
            for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
                this.heapifyDown(i);
            }
        }
    }
    getLeftChildIndex(parentIndex) {
        return 2 * parentIndex + 1;
    }
    getRightChildIndex(parentIndex) {
        return 2 * parentIndex + 2;
    }
    getParentIndex(childIndex) {
        return Math.floor((childIndex - 1) / 2);
    }
    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.heap.length;
    }
    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.heap.length;
    }
    hasParent(index) {
        return this.getParentIndex(index) >= 0;
    }
    leftChild(index) {
        return this.heap[this.getLeftChildIndex(index)];
    }
    rightChild(index) {
        return this.heap[this.getRightChildIndex(index)];
    }
    parent(index) {
        return this.heap[this.getParentIndex(index)];
    }
    swap(indexOne, indexTwo) {
        [this.heap[indexOne], this.heap[indexTwo]] = [this.heap[indexTwo], this.heap[indexOne]];
    }
    compare(itemA, itemB) {
        if (itemA.prioridade !== itemB.prioridade) {
            return itemA.prioridade < itemB.prioridade;
        }
        return new Date(itemA.data_hora_triagem).getTime() < new Date(itemB.data_hora_triagem).getTime();
    }
    add(item) {
        this.heap.push(item);
        this.heapifyUp();
    }
    extractMin() {
        if (this.heap.length === 0) {
            return undefined;
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        const item = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return item;
    }
    peek() {
        if (this.heap.length === 0) {
            return undefined;
        }
        return this.heap[0];
    }
    size() {
        return this.heap.length;
    }
    isEmpty() {
        return this.heap.length === 0;
    }
    heapifyUp() {
        let index = this.heap.length - 1;
        while (this.hasParent(index) && this.compare(this.heap[index], this.parent(index))) {
            this.swap(index, this.getParentIndex(index));
            index = this.getParentIndex(index);
        }
    }
    heapifyDown(startIndex = 0) {
        let index = startIndex;
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (this.hasRightChild(index) && this.compare(this.rightChild(index), this.leftChild(index))) {
                smallerChildIndex = this.getRightChildIndex(index);
            }
            if (this.compare(this.heap[index], this.heap[smallerChildIndex])) {
                break;
            }
            else {
                this.swap(index, smallerChildIndex);
            }
            index = smallerChildIndex;
        }
    }
}
//# sourceMappingURL=minHeap.js.map