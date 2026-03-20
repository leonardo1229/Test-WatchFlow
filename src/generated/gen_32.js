/**
 * gen_32.js — Generated: Observable value
 */

class Observable {
  constructor(initial) {
    this._value     = initial;
    this._listeners = [];
    this._history   = [initial];
    this._maxHistory = 50;
  }

  get value() { return this._value; }

  set(newValue) {
    const prev = this._value;
    this._value = newValue;
    this._history.push(newValue);
    if (this._history.length > this._maxHistory) this._history.shift();
    for (const fn of this._listeners) fn(newValue, prev);
    return this;
  }

  update(fn) { return this.set(fn(this._value)); }

  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter((l) => l !== fn); };
  }

  once(fn) {
    const unsub = this.subscribe((val, prev) => { fn(val, prev); unsub(); });
    return unsub;
  }

  map(fn) {
    const derived = new Observable(fn(this._value));
    this.subscribe((val) => derived.set(fn(val)));
    return derived;
  }

  history() { return [...this._history]; }

  undo() {
    if (this._history.length < 2) return false;
    this._history.pop();
    this._value = this._history[this._history.length - 1];
    return true;
  }
}

module.exports = { Observable };
