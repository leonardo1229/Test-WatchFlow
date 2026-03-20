/**
 * gen_07.js — Generated: Webhook dispatcher
 */

class WebhookDispatcher {
  constructor() {
    this._endpoints = [];
    this._retries = 3;
    this._timeoutMs = 5000;
  }

  addEndpoint(url, secret = null) {
    this._endpoints.push({ url, secret });
    return this;
  }

  removeEndpoint(url) {
    this._endpoints = this._endpoints.filter((e) => e.url !== url);
    return this;
  }

  async dispatch(event, payload) {
    const body = JSON.stringify({ event, payload, timestamp: Date.now() });
    const results = await Promise.allSettled(
      this._endpoints.map((ep) => this._sendWithRetry(ep, body))
    );
    return results.map((r, i) => ({
      url: this._endpoints[i].url,
      ok: r.status === 'fulfilled',
      error: r.reason?.message,
    }));
  }

  async _sendWithRetry(ep, body) {
    for (let attempt = 1; attempt <= this._retries; attempt++) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), this._timeoutMs);
        const res = await fetch(ep.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res;
      } catch (err) {
        if (attempt === this._retries) throw err;
      }
    }
  }
}

module.exports = { WebhookDispatcher };
