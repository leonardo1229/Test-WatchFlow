/**
 * gen_06.js — Generated: Session manager
 */

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 min

class SessionManager {
  constructor(ttlMs = SESSION_TTL_MS) {
    this._sessions = new Map();
    this._ttlMs = ttlMs;
  }

  create(userId, data = {}) {
    const token = `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    this._sessions.set(token, {
      userId,
      data,
      createdAt: Date.now(),
      lastSeen: Date.now(),
    });
    return token;
  }

  get(token) {
    const s = this._sessions.get(token);
    if (!s) return null;
    if (Date.now() - s.lastSeen > this._ttlMs) { this._sessions.delete(token); return null; }
    s.lastSeen = Date.now();
    return { ...s };
  }

  touch(token) { return Boolean(this.get(token)); }

  destroy(token) { return this._sessions.delete(token); }

  destroyUser(userId) {
    for (const [token, s] of this._sessions) {
      if (s.userId === userId) this._sessions.delete(token);
    }
  }

  activeCount() { return this._sessions.size; }

  purgeExpired() {
    const now = Date.now();
    for (const [token, s] of this._sessions) {
      if (now - s.lastSeen > this._ttlMs) this._sessions.delete(token);
    }
  }
}

module.exports = { SessionManager, SESSION_TTL_MS };
