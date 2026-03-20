/**
 * util_26.js — Config loader
 */

function loadConfig(defaults, overrides = {}, env = process.env) {
  const merged = { ...defaults, ...overrides };
  // Apply env-var overrides: CONFIG_FOO_BAR -> fooBar
  for (const [key, val] of Object.entries(env)) {
    if (!key.startsWith('CONFIG_')) continue;
    const camel = key.slice(7).toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    merged[camel] = val;
  }
  return merged;
}

function validateConfig(config, schema) {
  const errors = [];
  for (const [key, rule] of Object.entries(schema)) {
    if (rule.required && (config[key] === undefined || config[key] === null)) {
      errors.push(`Missing required config key: ${key}`);
    }
    if (rule.type && config[key] !== undefined && typeof config[key] !== rule.type) {
      errors.push(`Config key "${key}" must be of type ${rule.type}`);
    }
  }
  return errors;
}

module.exports = { loadConfig, validateConfig };
