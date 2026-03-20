/**
 * gen_44.js — Generated: Sparse matrix
 */

class SparseMatrix {
  constructor(rows, cols, defaultVal = 0) {
    this._rows    = rows;
    this._cols    = cols;
    this._default = defaultVal;
    this._data    = new Map();
  }

  _key(r, c) { return `${r},${c}`; }

  set(r, c, val) {
    if (r < 0 || r >= this._rows || c < 0 || c >= this._cols)
      throw new RangeError(`Index (${r}, ${c}) out of bounds`);
    if (val === this._default) { this._data.delete(this._key(r, c)); }
    else { this._data.set(this._key(r, c), val); }
    return this;
  }

  get(r, c) { return this._data.get(this._key(r, c)) ?? this._default; }

  row(r) { return Array.from({ length: this._cols }, (_, c) => this.get(r, c)); }

  col(c) { return Array.from({ length: this._rows }, (_, r) => this.get(r, c)); }

  nonZero() { return this._data.size; }

  density() { return this._data.size / (this._rows * this._cols); }

  toArray() {
    return Array.from({ length: this._rows }, (_, r) => this.row(r));
  }

  add(other) {
    const result = new SparseMatrix(this._rows, this._cols, this._default);
    for (let r = 0; r < this._rows; r++)
      for (let c = 0; c < this._cols; c++)
        result.set(r, c, this.get(r, c) + other.get(r, c));
    return result;
  }
}

module.exports = { SparseMatrix };
