/**
 * util_10.js — Event emitter utility
 */

class EventEmitter {
  constructor() {
    this._listeners = {};
  }

  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
    return this;
  }

  off(event, fn) {
    if (!this._listeners[event]) return this;
    this._listeners[event] = this._listeners[event].filter((l) => l !== fn);
    return this;
  }

  emit(event, ...args) {
    (this._listeners[event] || []).forEach((fn) => fn(...args));
    return this;
  }

  once(event, fn) {
    const wrapper = (...args) => { fn(...args); this.off(event, wrapper); };
    return this.on(event, wrapper);
  }
}

module.exports = { EventEmitter };
