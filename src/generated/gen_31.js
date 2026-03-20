/**
 * gen_31.js — Generated: Leaky bucket
 */

class LeakyBucket {
  constructor(capacity, leakRatePerMs) {
    this._capacity    = capacity;
    this._leakRate    = leakRatePerMs;
    this._level       = 0;
    this._lastLeakAt  = Date.now();
  }

  _leak() {
    const now    = Date.now();
    const leaked = (now - this._lastLeakAt) * this._leakRate;
    this._level  = Math.max(0, this._level - leaked);
    this._lastLeakAt = now;
  }

  tryAdd(amount = 1) {
    this._leak();
    if (this._level + amount > this._capacity) return false;
    this._level += amount;
    return true;
  }

  add(amount = 1) {
    if (!this.tryAdd(amount)) throw new Error('Leaky bucket overflow');
  }

  currentLevel() { this._leak(); return this._level; }

  fillPercent() { return (this.currentLevel() / this._capacity) * 100; }

  reset() { this._level = 0; this._lastLeakAt = Date.now(); }

  stats() {
    return { capacity: this._capacity, level: this.currentLevel(), leakRate: this._leakRate };
  }
}

module.exports = { LeakyBucket };
