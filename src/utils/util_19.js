/**
 * util_19.js — Rate limiter
 */

class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const timestamps = (this.requests.get(key) || []).filter((t) => t > windowStart);
    if (timestamps.length >= this.maxRequests) return false;
    timestamps.push(now);
    this.requests.set(key, timestamps);
    return true;
  }

  remaining(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const timestamps = (this.requests.get(key) || []).filter((t) => t > windowStart);
    return Math.max(0, this.maxRequests - timestamps.length);
  }

  reset(key) {
    this.requests.delete(key);
  }
}

module.exports = { RateLimiter };
