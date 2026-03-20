/**
 * gen_24.js — Generated: Token bucket (rate limiting)
 */

class TokenBucket {
  constructor(capacity, refillRate) {
    if (capacity <= 0)   throw new RangeError('capacity must be positive');
    if (refillRate <= 0) throw new RangeError('refillRate must be positive');
    this._capacity   = capacity;
    this._tokens     = capacity;
    this._refillRate = refillRate; // tokens per ms
    this._lastRefill = Date.now();
  }

  _refill() {
    const now  = Date.now();
    const delta = (now - this._lastRefill) * this._refillRate;
    this._tokens = Math.min(this._capacity, this._tokens + delta);
    this._lastRefill = now;
  }

  tryConsume(tokens = 1) {
    this._refill();
    if (this._tokens < tokens) return false;
    this._tokens -= tokens;
    return true;
  }

  consume(tokens = 1) {
    if (!this.tryConsume(tokens)) throw new Error('Rate limit exceeded');
  }

  available() {
    this._refill();
    return Math.floor(this._tokens);
  }

  reset() {
    this._tokens = this._capacity;
    this._lastRefill = Date.now();
  }

  stats() {
    return { capacity: this._capacity, available: this.available(), refillRate: this._refillRate };
  }
}

module.exports = { TokenBucket };
