/**
 * gen_35.js — Generated: Decorator / middleware chain
 */

function withLogging(fn, logger = console) {
  return async function (...args) {
    logger.log(`[LOG] calling ${fn.name || 'fn'} with`, args.length, 'args');
    const result = await fn.apply(this, args);
    logger.log(`[LOG] ${fn.name || 'fn'} returned`);
    return result;
  };
}

function withTiming(fn, label = fn.name || 'fn') {
  return async function (...args) {
    const start = Date.now();
    try {
      return await fn.apply(this, args);
    } finally {
      console.log(`[TIMER] ${label} took ${Date.now() - start}ms`);
    }
  };
}

function withRetry(fn, maxAttempts = 3, delayMs = 200) {
  return async function (...args) {
    for (let i = 1; i <= maxAttempts; i++) {
      try {
        return await fn.apply(this, args);
      } catch (err) {
        if (i === maxAttempts) throw err;
        await new Promise((r) => setTimeout(r, delayMs * i));
      }
    }
  };
}

function withCache(fn, ttlMs = 5000) {
  const cache = new Map();
  return async function (...args) {
    const key = JSON.stringify(args);
    const hit = cache.get(key);
    if (hit && Date.now() - hit.ts < ttlMs) return hit.value;
    const value = await fn.apply(this, args);
    cache.set(key, { value, ts: Date.now() });
    return value;
  };
}

module.exports = { withLogging, withTiming, withRetry, withCache };
