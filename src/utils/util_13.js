/**
 * util_13.js — File-path helpers (Node.js)
 */

const path = require('path');

function ensureExtension(filePath, ext) {
  return filePath.endsWith(ext) ? filePath : filePath + ext;
}

function getBasename(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

function changeExtension(filePath, newExt) {
  const dir = path.dirname(filePath);
  const base = getBasename(filePath);
  return path.join(dir, base + newExt);
}

function normalizeSlashes(filePath) {
  return filePath.replace(/\\/g, '/');
}

function relativeTo(from, to) {
  return normalizeSlashes(path.relative(from, to));
}

function isAbsolute(filePath) {
  return path.isAbsolute(filePath);
}

module.exports = {
  ensureExtension, getBasename, changeExtension,
  normalizeSlashes, relativeTo, isAbsolute,
};
