/**
 * util_05.js — Date helpers
 */

function formatDate(date, separator = '-') {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return [y, m, day].join(separator);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function diffInDays(a, b) {
  const ms = Math.abs(new Date(b) - new Date(a));
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function isWeekend(date) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

module.exports = { formatDate, addDays, diffInDays, isWeekend, startOfDay };
