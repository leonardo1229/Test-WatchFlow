/**
 * gen_20.js — Generated: Health check registry
 */

const CHECK_STATUSES = ['healthy', 'degraded', 'unhealthy'];

class HealthRegistry {
  constructor() {
    this._checks = new Map();
  }

  register(name, checkFn, { critical = true, timeoutMs = 3000 } = {}) {
    this._checks.set(name, { checkFn, critical, timeoutMs });
    return this;
  }

  unregister(name) { this._checks.delete(name); return this; }

  async run(name) {
    const check = this._checks.get(name);
    if (!check) throw new Error(`Unknown check: ${name}`);
    const start = Date.now();
    try {
      const timer = new Promise((_, rej) =>
        setTimeout(() => rej(new Error('Check timed out')), check.timeoutMs)
      );
      await Promise.race([check.checkFn(), timer]);
      return { name, status: 'healthy', durationMs: Date.now() - start };
    } catch (err) {
      return { name, status: 'unhealthy', error: err.message, durationMs: Date.now() - start };
    }
  }

  async runAll() {
    const results = await Promise.all([...this._checks.keys()].map((n) => this.run(n)));
    const hasCritical = results.some((r) => r.status === 'unhealthy' &&
      this._checks.get(r.name)?.critical);
    const anyDegraded = results.some((r) => r.status === 'unhealthy');
    const overall = hasCritical ? 'unhealthy' : anyDegraded ? 'degraded' : 'healthy';
    return { overall, checks: results, timestamp: new Date().toISOString() };
  }
}

module.exports = { HealthRegistry, CHECK_STATUSES };
