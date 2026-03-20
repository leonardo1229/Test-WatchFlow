/**
 * gen_34.js — Generated: Strategy pattern
 */

class Sorter {
  constructor(strategy) {
    this.setStrategy(strategy);
  }

  setStrategy(strategy) {
    if (typeof strategy.sort !== 'function') throw new TypeError('strategy must have sort()');
    this._strategy = strategy;
  }

  sort(arr) { return this._strategy.sort([...arr]); }
}

const bubbleSort = {
  name: 'bubble',
  sort(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    return arr;
  },
};

const insertionSort = {
  name: 'insertion',
  sort(arr) {
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
      arr[j + 1] = key;
    }
    return arr;
  },
};

const nativeSort = {
  name: 'native',
  sort(arr) { return arr.sort((a, b) => a - b); },
};

module.exports = { Sorter, bubbleSort, insertionSort, nativeSort };
