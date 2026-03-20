/**
 * gen_23.js — Generated: Repository pattern (in-memory)
 */

class Repository {
  constructor(idKey = 'id') {
    this._store = new Map();
    this._idKey = idKey;
  }

  save(entity) {
    const id = entity[this._idKey];
    if (!id) throw new TypeError(`Entity must have a "${this._idKey}" field`);
    this._store.set(String(id), { ...entity });
    return { ...entity };
  }

  findById(id) {
    return this._store.has(String(id)) ? { ...this._store.get(String(id)) } : null;
  }

  findOne(predicate) {
    for (const entity of this._store.values()) {
      if (predicate(entity)) return { ...entity };
    }
    return null;
  }

  findAll(predicate) {
    const results = [];
    for (const entity of this._store.values()) {
      if (!predicate || predicate(entity)) results.push({ ...entity });
    }
    return results;
  }

  update(id, patch) {
    const existing = this._store.get(String(id));
    if (!existing) throw new Error(`Entity ${id} not found`);
    const updated = { ...existing, ...patch, [this._idKey]: existing[this._idKey] };
    this._store.set(String(id), updated);
    return { ...updated };
  }

  delete(id) { return this._store.delete(String(id)); }

  count(predicate) { return this.findAll(predicate).length; }

  clear() { this._store.clear(); }
}

module.exports = { Repository };
