/**
 * util_02.js — Array helpers
 */

function unique(arr) {
  return [...new Set(arr)];
}

function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function flatten(arr) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

module.exports = { unique, chunk, flatten, groupBy };
