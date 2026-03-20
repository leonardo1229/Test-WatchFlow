/**
 * gen_17.js — Generated: Dependency injection container
 */

class Container {
  constructor() {
    this._bindings   = new Map();
    this._singletons = new Map();
    this._resolved   = new Map();
  }

  bind(name, factory) {
    if (typeof factory !== 'function') throw new TypeError('factory must be a function');
    this._bindings.set(name, { factory, singleton: false });
    return this;
  }

  singleton(name, factory) {
    if (typeof factory !== 'function') throw new TypeError('factory must be a function');
    this._bindings.set(name, { factory, singleton: true });
    return this;
  }

  instance(name, value) {
    this._resolved.set(name, value);
    return this;
  }

  resolve(name) {
    if (this._resolved.has(name)) return this._resolved.get(name);
    const binding = this._bindings.get(name);
    if (!binding) throw new Error(`No binding found for: ${name}`);
    const value = binding.factory(this);
    if (binding.singleton) this._resolved.set(name, value);
    return value;
  }

  has(name) { return this._bindings.has(name) || this._resolved.has(name); }

  reset(name) { this._resolved.delete(name); }

  resetAll() { this._resolved.clear(); }

  registered() { return [...this._bindings.keys()]; }
}

module.exports = { Container };
