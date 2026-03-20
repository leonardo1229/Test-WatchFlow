/**
 * util_28.js — Metrics / counters
 */

class Counter {
  constructor() {
    this._counts = {};
  }

  increment(key, by = 1) {
    this._counts[key] = (this._counts[key] || 0) + by;
  }

  decrement(key, by = 1) {
    this._counts[key] = (this._counts[key] || 0) - by;
  }

  get(key) {
    return this._counts[key] || 0;
  }

  reset(key) {
    delete this._counts[key];
  }

  resetAll() {
    this._counts = {};
  }

  snapshot() {
    return { ...this._counts };
  }

  topN(n) {
    return Object.entries(this._counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, n);
  }
}

module.exports = { Counter };
