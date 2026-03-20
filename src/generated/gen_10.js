/**
 * gen_10.js — Generated: Slug / handle generator
 */

const STOP_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toHandle(str, maxLen = 30) {
  const slug = toSlug(str);
  const words = slug.split('-').filter((w) => !STOP_WORDS.has(w));
  return words.join('-').slice(0, maxLen);
}

function uniqueSlug(str, existingSet) {
  const base = toSlug(str);
  if (!existingSet.has(base)) return base;
  let i = 2;
  while (existingSet.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

function slugToTitle(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function isValidSlug(str) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

module.exports = { toSlug, toHandle, uniqueSlug, slugToTitle, isValidSlug };
