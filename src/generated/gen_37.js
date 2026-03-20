/**
 * gen_37.js — Generated: Interval / range helpers
 */

function range(start, end, step = 1) {
  if (step === 0) throw new RangeError('step cannot be zero');
  const result = [];
  for (let i = start; step > 0 ? i < end : i > end; i += step) result.push(i);
  return result;
}

function linspace(start, end, n) {
  if (n < 2) return n === 1 ? [start] : [];
  const step = (end - start) / (n - 1);
  return Array.from({ length: n }, (_, i) => parseFloat((start + i * step).toFixed(10)));
}

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

function union(a, b) {
  if (!overlaps(a, b)) return [a, b];
  return [{ start: Math.min(a.start, b.start), end: Math.max(a.end, b.end) }];
}

function intersection(a, b) {
  const start = Math.max(a.start, b.start);
  const end   = Math.min(a.end, b.end);
  return start < end ? { start, end } : null;
}

function clampToRange(value, { start, end }) {
  return Math.min(Math.max(value, start), end);
}

function inRange(value, { start, end }, inclusive = true) {
  return inclusive ? value >= start && value <= end : value > start && value < end;
}

module.exports = { range, linspace, overlaps, union, intersection, clampToRange, inRange };
