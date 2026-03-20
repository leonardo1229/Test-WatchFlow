/**
 * gen_19.js — Generated: Data transformer pipeline
 */

class Transformer {
  constructor() {
    this._steps = [];
  }

  use(name, fn) {
    if (typeof fn !== 'function') throw new TypeError('fn must be a function');
    this._steps.push({ name, fn });
    return this;
  }

  remove(name) {
    this._steps = this._steps.filter((s) => s.name !== name);
    return this;
  }

  async transform(data) {
    let result = data;
    for (const step of this._steps) {
      result = await step.fn(result);
    }
    return result;
  }

  async transformMany(items) {
    return Promise.all(items.map((item) => this.transform(item)));
  }

  steps() { return this._steps.map((s) => s.name); }
}

function trimStrings(obj) {
  if (typeof obj === 'string') return obj.trim();
  if (Array.isArray(obj)) return obj.map(trimStrings);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, trimStrings(v)]));
  }
  return obj;
}

function removeNulls(obj) {
  if (Array.isArray(obj)) return obj.filter((v) => v != null).map(removeNulls);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v != null).map(([k, v]) => [k, removeNulls(v)])
    );
  }
  return obj;
}

module.exports = { Transformer, trimStrings, removeNulls };
