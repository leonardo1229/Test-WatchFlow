/**
 * gen_16.js — Generated: Circuit breaker
 */

const CB_STATES = ['closed', 'open', 'half-open'];

class CircuitBreaker {
  constructor({ threshold = 5, timeout = 30000, halfOpenMax = 1 } = {}) {
    this._threshold   = threshold;
    this._timeout     = timeout;
    this._halfOpenMax = halfOpenMax;
    this._failures    = 0;
    this._state       = 'closed';
    this._openedAt    = null;
    this._halfAttempts = 0;
  }

  get state() { return this._state; }

  async call(fn) {
    if (this._state === 'open') {
      if (Date.now() - this._openedAt >= this._timeout) {
        this._state = 'half-open';
        this._halfAttempts = 0;
      } else {
        throw new Error('Circuit is OPEN — request rejected');
      }
    }

    if (this._state === 'half-open' && this._halfAttempts >= this._halfOpenMax) {
      throw new Error('Circuit is HALF-OPEN — max probe attempts reached');
    }

    try {
      if (this._state === 'half-open') this._halfAttempts++;
      const result = await fn();
      this._onSuccess();
      return result;
    } catch (err) {
      this._onFailure();
      throw err;
    }
  }

  _onSuccess() { this._failures = 0; this._state = 'closed'; }

  _onFailure() {
    this._failures++;
    if (this._failures >= this._threshold) {
      this._state = 'open';
      this._openedAt = Date.now();
    }
  }

  stats() { return { state: this._state, failures: this._failures }; }
}

module.exports = { CircuitBreaker, CB_STATES };
