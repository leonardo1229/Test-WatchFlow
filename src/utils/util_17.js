/**
 * util_17.js — Sorting helpers
 */

function sortByKey(arr, key, dir = 'asc') {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

function sortByMultiple(arr, ...comparators) {
  return [...arr].sort((a, b) => {
    for (const cmp of comparators) {
      const result = cmp(a, b);
      if (result !== 0) return result;
    }
    return 0;
  });
}

function rankBy(arr, scoreFn) {
  return arr
    .map((item) => ({ item, score: scoreFn(item) }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

function stableSort(arr, compareFn) {
  return arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => compareFn(a.item, b.item) || a.index - b.index)
    .map(({ item }) => item);
}

module.exports = { sortByKey, sortByMultiple, rankBy, stableSort };
