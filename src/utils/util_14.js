/**
 * util_14.js — Environment helpers
 */

function getEnv(key, defaultValue) {
  const val = process.env[key];
  if (val === undefined || val === '') return defaultValue;
  return val;
}

function requireEnv(key) {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

function isDev() {
  return getEnv('NODE_ENV', 'development') === 'development';
}

function isProd() {
  return getEnv('NODE_ENV', '') === 'production';
}

function isTest() {
  return getEnv('NODE_ENV', '') === 'test';
}

function getBoolEnv(key, defaultValue = false) {
  const val = process.env[key];
  if (val === undefined) return defaultValue;
  return val === '1' || val.toLowerCase() === 'true';
}

module.exports = { getEnv, requireEnv, isDev, isProd, isTest, getBoolEnv };
