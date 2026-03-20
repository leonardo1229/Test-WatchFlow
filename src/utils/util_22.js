/**
 * util_22.js — Stack data structure
 */

class Stack {
  constructor() {
    this._items = [];
  }

  push(item) {
    this._items.push(item);
  }

  pop() {
    return this._items.pop();
  }

  peek() {
    return this._items[this._items.length - 1];
  }

  get size() {
    return this._items.length;
  }

  isEmpty() {
    return this._items.length === 0;
  }

  toArray() {
    return [...this._items].reverse();
  }

  clear() {
    this._items = [];
  }
}

module.exports = { Stack };
