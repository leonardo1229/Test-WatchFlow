/**
 * util_06.js — Validation helpers
 */

function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function isNonEmpty(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

function isInteger(value) {
  return Number.isInteger(value);
}

function isInRange(value, min, max) {
  return value >= min && value <= max;
}

module.exports = { isEmail, isUrl, isNonEmpty, isInteger, isInRange };
