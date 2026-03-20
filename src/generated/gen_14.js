/**
 * gen_14.js — Generated: State machine
 */

class StateMachine {
  constructor({ initial, states, transitions }) {
    if (!states[initial]) throw new Error(`Unknown initial state: ${initial}`);
    this._states = states;
    this._transitions = transitions;
    this._current = initial;
    this._history = [initial];
    this._listeners = [];
  }

  get state() { return this._current; }

  can(event) {
    return Boolean(this._transitions[this._current]?.[event]);
  }

  transition(event) {
    const next = this._transitions[this._current]?.[event];
    if (!next) throw new Error(`No transition '${event}' from state '${this._current}'`);
    const prev = this._current;
    this._current = next;
    this._history.push(next);
    for (const fn of this._listeners) fn({ from: prev, event, to: next });
    return this;
  }

  onTransition(fn) { this._listeners.push(fn); return this; }

  history() { return [...this._history]; }

  reset() {
    this._current = this._history[0];
    this._history = [this._current];
    return this;
  }

  availableEvents() {
    return Object.keys(this._transitions[this._current] || {});
  }
}

module.exports = { StateMachine };
