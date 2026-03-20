/**
 * util_29.js — Assertions / invariants
 */

function assert(condition, message = 'Assertion failed') {
  if (!condition) throw new Error(message);
}

function assertType(value, type, name = 'value') {
  if (typeof value !== type) {
    throw new TypeError(`Expected ${name} to be ${type}, got ${typeof value}`);
  }
}

function assertNonNull(value, name = 'value') {
  if (value === null || value === undefined) {
    throw new Error(`Expected ${name} to be non-null`);
  }
}

function assertOneOf(value, allowed, name = 'value') {
  if (!allowed.includes(value)) {
    throw new Error(`Expected ${name} to be one of [${allowed.join(', ')}], got ${value}`);
  }
}

function assertRange(value, min, max, name = 'value') {
  if (value < min || value > max) {
    throw new RangeError(`Expected ${name} to be in [${min}, ${max}], got ${value}`);
  }
}

module.exports = { assert, assertType, assertNonNull, assertOneOf, assertRange };
