/**
 * gen_30.js — Generated: Priority queue (min-heap)
 */

class PriorityQueue {
  constructor(compareFn = (a, b) => a - b) {
    this._heap = [];
    this._cmp  = compareFn;
  }

  push(item) {
    this._heap.push(item);
    this._bubbleUp(this._heap.length - 1);
    return this;
  }

  pop() {
    if (!this._heap.length) return undefined;
    const top = this._heap[0];
    const last = this._heap.pop();
    if (this._heap.length) { this._heap[0] = last; this._sinkDown(0); }
    return top;
  }

  peek() { return this._heap[0]; }

  get size() { return this._heap.length; }

  isEmpty() { return !this._heap.length; }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this._cmp(this._heap[i], this._heap[parent]) < 0) {
        [this._heap[i], this._heap[parent]] = [this._heap[parent], this._heap[i]];
        i = parent;
      } else break;
    }
  }

  _sinkDown(i) {
    const n = this._heap.length;
    while (true) {
      let min = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this._cmp(this._heap[l], this._heap[min]) < 0) min = l;
      if (r < n && this._cmp(this._heap[r], this._heap[min]) < 0) min = r;
      if (min === i) break;
      [this._heap[i], this._heap[min]] = [this._heap[min], this._heap[i]];
      i = min;
    }
  }
}

module.exports = { PriorityQueue };
