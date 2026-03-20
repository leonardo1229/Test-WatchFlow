/**
 * util_11.js — URL / query-string helpers
 */

function parseQueryString(qs) {
  const params = {};
  new URLSearchParams(qs).forEach((val, key) => { params[key] = val; });
  return params;
}

function buildQueryString(params) {
  return new URLSearchParams(params).toString();
}

function getPathSegments(urlStr) {
  return new URL(urlStr).pathname.split('/').filter(Boolean);
}

function withTrailingSlash(str) {
  return str.endsWith('/') ? str : str + '/';
}

function withoutTrailingSlash(str) {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}

function joinPaths(...parts) {
  return parts.map(withoutTrailingSlash).join('/');
}

module.exports = {
  parseQueryString, buildQueryString, getPathSegments,
  withTrailingSlash, withoutTrailingSlash, joinPaths,
};
