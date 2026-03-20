/**
 * gen_05.js — Generated: Permission matrix
 */

const ACTIONS = ['read', 'write', 'delete', 'admin'];

class PermissionMatrix {
  constructor() {
    this._rules = {};
  }

  grant(role, action) {
    if (!ACTIONS.includes(action)) throw new RangeError(`Unknown action: ${action}`);
    if (!this._rules[role]) this._rules[role] = new Set();
    this._rules[role].add(action);
    return this;
  }

  revoke(role, action) {
    this._rules[role]?.delete(action);
    return this;
  }

  can(role, action) {
    return Boolean(this._rules[role]?.has(action));
  }

  allowed(role) {
    return [...(this._rules[role] || [])];
  }

  merge(other) {
    for (const [role, actions] of Object.entries(other._rules)) {
      for (const action of actions) this.grant(role, action);
    }
    return this;
  }

  toJSON() {
    return Object.fromEntries(
      Object.entries(this._rules).map(([r, s]) => [r, [...s]])
    );
  }
}

function buildDefaultMatrix() {
  return new PermissionMatrix()
    .grant('admin', 'read').grant('admin', 'write').grant('admin', 'delete').grant('admin', 'admin')
    .grant('editor', 'read').grant('editor', 'write')
    .grant('viewer', 'read');
}

module.exports = { PermissionMatrix, buildDefaultMatrix, ACTIONS };
