/**
 * gen_42.js — Generated: Pub/sub bus
 */

class PubSubBus {
  constructor() {
    this._subs   = {};
    this._msgCount = 0;
  }

  subscribe(topic, fn) {
    if (!this._subs[topic]) this._subs[topic] = [];
    this._subs[topic].push(fn);
    return () => this.unsubscribe(topic, fn);
  }

  unsubscribe(topic, fn) {
    if (!this._subs[topic]) return;
    this._subs[topic] = this._subs[topic].filter((s) => s !== fn);
    if (!this._subs[topic].length) delete this._subs[topic];
  }

  async publish(topic, data) {
    this._msgCount++;
    const subs = this._subs[topic] || [];
    const wildcard = this._subs['*'] || [];
    const all = [...subs, ...wildcard];
    const results = await Promise.allSettled(all.map((fn) => Promise.resolve(fn({ topic, data }))));
    return results;
  }

  topics() { return Object.keys(this._subs); }

  subscriberCount(topic) { return (this._subs[topic] || []).length; }

  messageCount() { return this._msgCount; }

  clear() { this._subs = {}; }
}

module.exports = { PubSubBus };
