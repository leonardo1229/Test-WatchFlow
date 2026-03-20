/**
 * gen_09.js — Generated: Job queue (in-memory)
 */

const JOB_STATES = ['queued', 'running', 'done', 'failed'];

class JobQueue {
  constructor(concurrency = 3) {
    this._jobs = new Map();
    this._queue = [];
    this._running = 0;
    this._concurrency = concurrency;
  }

  enqueue(type, payload, priority = 0) {
    const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const job = { id, type, payload, priority, state: 'queued', createdAt: Date.now(), result: null, error: null };
    this._jobs.set(id, job);
    this._queue.push(id);
    this._queue.sort((a, b) => (this._jobs.get(b).priority - this._jobs.get(a).priority));
    this._drain();
    return id;
  }

  async _drain() {
    while (this._running < this._concurrency && this._queue.length) {
      const id = this._queue.shift();
      const job = this._jobs.get(id);
      if (!job || !this._handler) continue;
      job.state = 'running';
      this._running++;
      this._handler(job)
        .then((r) => { job.state = 'done'; job.result = r; })
        .catch((e) => { job.state = 'failed'; job.error = e.message; })
        .finally(() => { this._running--; this._drain(); });
    }
  }

  process(handler) { this._handler = handler; this._drain(); return this; }

  get(id) { return this._jobs.get(id) || null; }

  pending() { return [...this._jobs.values()].filter((j) => j.state === 'queued'); }

  stats() {
    const counts = Object.fromEntries(JOB_STATES.map((s) => [s, 0]));
    for (const j of this._jobs.values()) counts[j.state]++;
    return counts;
  }
}

module.exports = { JobQueue, JOB_STATES };
