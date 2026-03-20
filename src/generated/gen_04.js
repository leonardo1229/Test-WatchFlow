/**
 * gen_04.js — Generated: Notification service
 */

const CHANNELS = ['email', 'sms', 'push', 'webhook'];

class NotificationService {
  constructor() {
    this._handlers = {};
    this._log = [];
  }

  register(channel, handler) {
    if (!CHANNELS.includes(channel)) throw new RangeError(`Unknown channel: ${channel}`);
    if (typeof handler !== 'function') throw new TypeError('handler must be a function');
    this._handlers[channel] = handler;
    return this;
  }

  async send(channel, payload) {
    if (!this._handlers[channel]) throw new Error(`No handler registered for channel: ${channel}`);
    const entry = { channel, payload, sentAt: new Date().toISOString(), success: false };
    try {
      await this._handlers[channel](payload);
      entry.success = true;
    } finally {
      this._log.push(entry);
    }
    return entry;
  }

  async broadcast(payload) {
    const results = await Promise.allSettled(
      Object.keys(this._handlers).map((ch) => this.send(ch, payload))
    );
    return results;
  }

  history(channel) {
    return channel ? this._log.filter((e) => e.channel === channel) : [...this._log];
  }

  clearHistory() { this._log = []; }
}

module.exports = { NotificationService, CHANNELS };
