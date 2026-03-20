/**
 * util_04.js — Number helpers
 */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sum(arr) {
  return arr.reduce((acc, n) => acc + n, 0);
}

function average(arr) {
  if (!arr.length) return 0;
  return sum(arr) / arr.length;
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

module.exports = { clamp, roundTo, randomInt, sum, average, isPrime };
