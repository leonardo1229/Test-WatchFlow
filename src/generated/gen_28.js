/**
 * gen_28.js — Generated: Bloom filter (approximate membership)
 */

const DEFAULT_SIZE = 1024;
const DEFAULT_HASHES = 3;

class BloomFilter {
  constructor(size = DEFAULT_SIZE, numHashes = DEFAULT_HASHES) {
    this._size     = size;
    this._hashes   = numHashes;
    this._bits     = new Uint8Array(Math.ceil(size / 8));
    this._count    = 0;
  }

  _hash(str, seed) {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 0x9e3779b9);
      h ^= h >>> 16;
    }
    return Math.abs(h) % this._size;
  }

  _setBit(pos) {
    this._bits[pos >>> 3] |= (1 << (pos & 7));
  }

  _testBit(pos) {
    return Boolean(this._bits[pos >>> 3] & (1 << (pos & 7)));
  }

  add(item) {
    const str = String(item);
    for (let i = 0; i < this._hashes; i++) this._setBit(this._hash(str, i + 1));
    this._count++;
    return this;
  }

  has(item) {
    const str = String(item);
    for (let i = 0; i < this._hashes; i++) {
      if (!this._testBit(this._hash(str, i + 1))) return false;
    }
    return true;
  }

  approximateCount() { return this._count; }

  clear() { this._bits.fill(0); this._count = 0; }
}

module.exports = { BloomFilter };
