/**
 * gen_21.js — Generated: Config schema validator
 */

const TYPES = ['string', 'number', 'boolean', 'array', 'object'];

function defineSchema(fields) {
  return fields;
}

function validate(config, schema) {
  const errors = [];
  for (const [key, def] of Object.entries(schema)) {
    const val = config[key];
    if (def.required && (val === undefined || val === null)) {
      errors.push({ key, message: `"${key}" is required` }); continue;
    }
    if (val === undefined || val === null) continue;
    if (def.type === 'array' && !Array.isArray(val)) {
      errors.push({ key, message: `"${key}" must be an array` }); continue;
    }
    if (def.type && def.type !== 'array' && typeof val !== def.type) {
      errors.push({ key, message: `"${key}" must be of type ${def.type}` });
    }
    if (def.min !== undefined && val < def.min)
      errors.push({ key, message: `"${key}" must be >= ${def.min}` });
    if (def.max !== undefined && val > def.max)
      errors.push({ key, message: `"${key}" must be <= ${def.max}` });
    if (def.pattern && !new RegExp(def.pattern).test(String(val)))
      errors.push({ key, message: `"${key}" does not match pattern ${def.pattern}` });
    if (def.enum && !def.enum.includes(val))
      errors.push({ key, message: `"${key}" must be one of: ${def.enum.join(', ')}` });
  }
  return errors;
}

function assertValid(config, schema) {
  const errors = validate(config, schema);
  if (errors.length) throw new Error(`Config validation failed:\n${errors.map((e) => e.message).join('\n')}`);
}

module.exports = { defineSchema, validate, assertValid, TYPES };
