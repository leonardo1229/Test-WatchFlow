/**
 * gen_15.js — Generated: Plugin registry
 */

class PluginRegistry {
  constructor() {
    this._plugins = new Map();
    this._hooks = {};
  }

  register(name, plugin) {
    if (this._plugins.has(name)) throw new Error(`Plugin '${name}' is already registered`);
    if (typeof plugin.install !== 'function') throw new TypeError('Plugin must expose an install() method');
    this._plugins.set(name, plugin);
    plugin.install(this);
    return this;
  }

  unregister(name) {
    const plugin = this._plugins.get(name);
    plugin?.uninstall?.(this);
    return this._plugins.delete(name);
  }

  has(name) { return this._plugins.has(name); }

  get(name) { return this._plugins.get(name) || null; }

  list() { return [...this._plugins.keys()]; }

  addHook(hookName, fn) {
    if (!this._hooks[hookName]) this._hooks[hookName] = [];
    this._hooks[hookName].push(fn);
    return this;
  }

  async runHook(hookName, context) {
    for (const fn of (this._hooks[hookName] || [])) {
      await fn(context);
    }
    return context;
  }

  hookNames() { return Object.keys(this._hooks); }
}

module.exports = { PluginRegistry };
