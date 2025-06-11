export class MinHeap {
    constructor() {
        this.heap = [];
    }
    insert(item, priority) {
        this.heap.push({ item, priority });
        this.bubbleUp();
    }
    extractMin() {
        if (this.heap.length === 0)
            return null;
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0 && end) {
            this.heap[0] = end;
            this.sinkDown();
        }
        return min.item;
    }
    bubbleUp() {
        let idx = this.heap.length - 1;
        const element = this.heap[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.heap[parentIdx];
            if (element.priority >= parent.priority)
                break;
            this.heap[parentIdx] = element;
            this.heap[idx] = parent;
            idx = parentIdx;
        }
    }
    sinkDown() {
        let idx = 0;
        const length = this.heap.length;
        const element = this.heap[0];
        while (true) {
            let leftIdx = 2 * idx + 1;
            let rightIdx = 2 * idx + 2;
            let left, right;
            let swap = null;
            if (leftIdx < length) {
                left = this.heap[leftIdx];
                if (left.priority < element.priority)
                    swap = leftIdx;
            }
            if (rightIdx < length) {
                right = this.heap[rightIdx];
                if ((swap === null && right.priority < element.priority) ||
                    (swap !== null && right.priority < left.priority)) {
                    swap = rightIdx;
                }
            }
            if (swap === null)
                break;
            this.heap[idx] = this.heap[swap];
            this.heap[swap] = element;
            idx = swap;
        }
    }
    toSortedArray() {
        return this.heap
            .slice()
            .sort((a, b) => a.priority - b.priority)
            .map(node => node.item);
    }
}
//# sourceMappingURL=MinHeap.js.map