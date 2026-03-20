/**
 * gen_29.js — Generated: LRU cache
 */

class LRUCache {
  constructor(capacity) {
    if (capacity < 1) throw new RangeError('capacity must be >= 1');
    this._cap   = capacity;
    this._map   = new Map();
  }

  get(key) {
    if (!this._map.has(key)) return undefined;
    const val = this._map.get(key);
    this._map.delete(key);
    this._map.set(key, val);
    return val;
  }

  set(key, value) {
    if (this._map.has(key)) this._map.delete(key);
    else if (this._map.size >= this._cap) {
      this._map.delete(this._map.keys().next().value);
    }
    this._map.set(key, value);
    return this;
  }

  has(key) { return this._map.has(key); }

  delete(key) { return this._map.delete(key); }

  clear() { this._map.clear(); }

  get size() { return this._map.size; }

  keys() { return [...this._map.keys()]; }

  entries() { return [...this._map.entries()]; }

  toObject() { return Object.fromEntries(this._map); }
}

module.exports = { LRUCache };
