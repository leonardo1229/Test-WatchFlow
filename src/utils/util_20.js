/**
 * util_20.js — Feature flags
 */

class FeatureFlags {
  constructor(flags = {}) {
    this._flags = { ...flags };
  }

  isEnabled(name) {
    return Boolean(this._flags[name]);
  }

  enable(name) {
    this._flags[name] = true;
  }

  disable(name) {
    this._flags[name] = false;
  }

  set(name, value) {
    this._flags[name] = Boolean(value);
  }

  all() {
    return { ...this._flags };
  }

  enabledList() {
    return Object.keys(this._flags).filter((k) => this._flags[k]);
  }
}

const defaultFlags = new FeatureFlags();

module.exports = { FeatureFlags, defaultFlags };
