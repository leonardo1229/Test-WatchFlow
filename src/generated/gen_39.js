/**
 * gen_39.js — Generated: Money / currency helpers
 */

const PRECISION = 2;

function toCents(amount) { return Math.round(parseFloat(amount) * 100); }

function fromCents(cents) { return (cents / 100).toFixed(PRECISION); }

function add(a, b)        { return fromCents(toCents(a) + toCents(b)); }
function subtract(a, b)   { return fromCents(toCents(a) - toCents(b)); }
function multiply(a, qty) { return fromCents(Math.round(toCents(a) * qty)); }
function divide(a, n)     { return fromCents(Math.round(toCents(a) / n)); }

function formatMoney(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(parseFloat(amount));
}

function splitEvenly(total, n) {
  const cents = toCents(total);
  const base  = Math.floor(cents / n);
  const remainder = cents % n;
  return Array.from({ length: n }, (_, i) => fromCents(base + (i < remainder ? 1 : 0)));
}

function applyTax(amount, taxRate) {
  return fromCents(Math.round(toCents(amount) * (1 + taxRate)));
}

function isPositive(amount) { return parseFloat(amount) > 0; }
function isZero(amount)     { return toCents(amount) === 0; }

module.exports = { toCents, fromCents, add, subtract, multiply, divide,
                   formatMoney, splitEvenly, applyTax, isPositive, isZero };
