/**
 * gen_41.js — Generated: Semaphore
 */

class Semaphore {
  constructor(permits) {
    if (permits < 1) throw new RangeError('permits must be >= 1');
    this._permits  = permits;
    this._acquired = 0;
    this._queue    = [];
  }

  async acquire() {
    if (this._acquired < this._permits) {
      this._acquired++;
      return;
    }
    await new Promise((resolve) => this._queue.push(resolve));
  }

  release() {
    const next = this._queue.shift();
    if (next) { next(); }
    else { this._acquired = Math.max(0, this._acquired - 1); }
  }

  async use(fn) {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }

  get available() { return this._permits - this._acquired; }

  get waiting()   { return this._queue.length; }

  drain() {
    while (this._queue.length) {
      const resolve = this._queue.shift();
      resolve();
    }
    this._acquired = 0;
  }
}

module.exports = { Semaphore };
