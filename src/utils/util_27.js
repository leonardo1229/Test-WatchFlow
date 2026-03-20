/**
 * util_27.js — Diff / patch helpers
 */

function diffArrays(before, after) {
  const added = after.filter((x) => !before.includes(x));
  const removed = before.filter((x) => !after.includes(x));
  const unchanged = before.filter((x) => after.includes(x));
  return { added, removed, unchanged };
}

function diffObjects(before, after) {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const added = {};
  const removed = {};
  const changed = {};
  const unchanged = {};
  for (const k of keys) {
    if (!(k in before)) { added[k] = after[k]; }
    else if (!(k in after)) { removed[k] = before[k]; }
    else if (before[k] !== after[k]) { changed[k] = { before: before[k], after: after[k] }; }
    else { unchanged[k] = before[k]; }
  }
  return { added, removed, changed, unchanged };
}

function applyPatch(obj, patch) {
  return { ...obj, ...patch };
}

module.exports = { diffArrays, diffObjects, applyPatch };
