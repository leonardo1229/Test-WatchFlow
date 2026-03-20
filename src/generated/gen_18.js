/**
 * gen_18.js — Generated: Task scheduler
 */

class TaskScheduler {
  constructor() {
    this._tasks = new Map();
    this._timers = new Map();
  }

  schedule(name, fn, intervalMs) {
    if (this._timers.has(name)) this.cancel(name);
    const task = { name, fn, intervalMs, runs: 0, lastRun: null, errors: [] };
    this._tasks.set(name, task);
    const timer = setInterval(async () => {
      task.lastRun = new Date().toISOString();
      task.runs++;
      try { await fn(); } catch (e) { task.errors.push({ time: task.lastRun, msg: e.message }); }
    }, intervalMs);
    this._timers.set(name, timer);
    return this;
  }

  runOnce(name, fn, delayMs) {
    const timer = setTimeout(async () => {
      try { await fn(); } finally { this._tasks.delete(name); this._timers.delete(name); }
    }, delayMs);
    this._timers.set(name, timer);
    this._tasks.set(name, { name, fn, delayMs, runs: 0, oneShot: true });
    return this;
  }

  cancel(name) {
    const timer = this._timers.get(name);
    if (timer) { clearInterval(timer); clearTimeout(timer); }
    this._timers.delete(name);
    this._tasks.delete(name);
    return this;
  }

  cancelAll() { for (const name of this._tasks.keys()) this.cancel(name); }

  list() { return [...this._tasks.values()].map((t) => ({ ...t, fn: undefined })); }
}

module.exports = { TaskScheduler };
