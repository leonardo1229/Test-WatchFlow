/**
 * util_18.js — Crypto / hash helpers
 */

const crypto = require('crypto');

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function hmacSha256(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function base64Encode(str) {
  return Buffer.from(str).toString('base64');
}

function base64Decode(str) {
  return Buffer.from(str, 'base64').toString('utf8');
}

function randomBytes(n = 16) {
  return crypto.randomBytes(n).toString('hex');
}

module.exports = { md5, sha256, hmacSha256, base64Encode, base64Decode, randomBytes };
