/**
 * gen_43.js — Generated: UUID v5 (deterministic, namespace-based)
 */

const crypto = require('crypto');

const NS_DNS  = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const NS_URL  = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
const NS_OID  = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';

function parseUuid(uuid) {
  return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}

function formatUuid(bytes) {
  const hex = bytes.toString('hex');
  return [
    hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16),
    hex.slice(16, 20), hex.slice(20),
  ].join('-');
}

function uuidV5(namespace, name) {
  const nsBytes   = parseUuid(namespace);
  const nameBytes = Buffer.from(name, 'utf8');
  const hash      = crypto.createHash('sha1').update(nsBytes).update(nameBytes).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50; // version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // variant
  return formatUuid(hash.slice(0, 16));
}

function deterministicId(namespace, ...parts) {
  return uuidV5(namespace, parts.join(':'));
}

function isNamespacedUuid(candidate, namespace, name) {
  return uuidV5(namespace, name) === candidate;
}

module.exports = { uuidV5, deterministicId, isNamespacedUuid, NS_DNS, NS_URL, NS_OID };
