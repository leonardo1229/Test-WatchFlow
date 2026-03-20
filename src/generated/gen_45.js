/**
 * gen_45.js — Generated: Feature experiment / A/B helper
 */

class Experiment {
  constructor(name, variants) {
    if (!variants.length) throw new Error('At least one variant required');
    this._name     = name;
    this._variants = variants;
    this._weights  = variants.map(() => 1);
    this._log      = [];
  }

  weights(w) {
    if (w.length !== this._variants.length) throw new Error('weights length must match variants');
    this._weights = w;
    return this;
  }

  assign(userId) {
    const total = this._weights.reduce((a, b) => a + b, 0);
    const hash  = [...String(userId)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
    let bucket  = (hash % 1000) / 1000 * total;
    for (let i = 0; i < this._variants.length; i++) {
      bucket -= this._weights[i];
      if (bucket < 0) return this._variants[i];
    }
    return this._variants[this._variants.length - 1];
  }

  track(userId, event, meta = {}) {
    this._log.push({ userId, variant: this.assign(userId), event, meta, ts: Date.now() });
    return this;
  }

  results() {
    const counts = {};
    for (const entry of this._log) counts[entry.variant] = (counts[entry.variant] || 0) + 1;
    return counts;
  }

  name() { return this._name; }

  variants() { return [...this._variants]; }
}

module.exports = { Experiment };
