/**
 * util_01.js — String helpers
 */

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str, maxLen = 80) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

function camelToSnake(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

module.exports = { capitalize, truncate, camelToSnake, snakeToCamel, countWords };
