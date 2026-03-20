/**
 * gen_12.js — Generated: Search / filter engine
 */

function tokenize(str) {
  return str.toLowerCase().split(/\s+/).filter(Boolean);
}

function scoreMatch(item, query, fields) {
  const tokens = tokenize(query);
  let score = 0;
  for (const field of fields) {
    const value = String(item[field] ?? '').toLowerCase();
    for (const token of tokens) {
      if (value === token)            score += 3;
      else if (value.startsWith(token)) score += 2;
      else if (value.includes(token)) score += 1;
    }
  }
  return score;
}

function search(items, query, fields = ['name', 'title', 'description']) {
  if (!query.trim()) return items;
  return items
    .map((item) => ({ item, score: scoreMatch(item, query, fields) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

function filter(items, predicates) {
  return items.filter((item) =>
    Object.entries(predicates).every(([key, val]) => {
      if (Array.isArray(val)) return val.includes(item[key]);
      if (val === null || val === undefined) return item[key] == null;
      return item[key] === val;
    })
  );
}

function filterRange(items, key, min, max) {
  return items.filter((i) => {
    const v = i[key];
    return (min === undefined || v >= min) && (max === undefined || v <= max);
  });
}

module.exports = { tokenize, scoreMatch, search, filter, filterRange };
