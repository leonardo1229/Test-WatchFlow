/**
 * gen_08.js — Generated: Audit log
 */

const MAX_ENTRIES = 10_000;

class AuditLog {
  constructor() {
    this._entries = [];
  }

  record({ actor, action, resource, resourceId, meta = {} }) {
    if (!actor)    throw new TypeError('actor is required');
    if (!action)   throw new TypeError('action is required');
    if (!resource) throw new TypeError('resource is required');
    const entry = {
      id: `audit_${this._entries.length + 1}`,
      actor,
      action,
      resource,
      resourceId: resourceId ?? null,
      meta,
      timestamp: new Date().toISOString(),
    };
    this._entries.push(entry);
    if (this._entries.length > MAX_ENTRIES) this._entries.shift();
    return entry;
  }

  query({ actor, action, resource, from, to } = {}) {
    return this._entries.filter((e) => {
      if (actor    && e.actor    !== actor)    return false;
      if (action   && e.action   !== action)   return false;
      if (resource && e.resource !== resource) return false;
      if (from && new Date(e.timestamp) < new Date(from)) return false;
      if (to   && new Date(e.timestamp) > new Date(to))   return false;
      return true;
    });
  }

  recent(n = 20) { return this._entries.slice(-n).reverse(); }

  count() { return this._entries.length; }

  clear() { this._entries = []; }
}

module.exports = { AuditLog, MAX_ENTRIES };
