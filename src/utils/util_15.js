/**
 * util_15.js — UUID / ID generation
 */

const crypto = require('crypto');

function uuid4() {
  return crypto.randomUUID ? crypto.randomUUID() : _fallbackUuid();
}

function _fallbackUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function shortId(len = 8) {
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
}

function prefixedId(prefix, len = 8) {
  return `${prefix}_${shortId(len)}`;
}

function isUuid(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

module.exports = { uuid4, shortId, prefixedId, isUuid };
