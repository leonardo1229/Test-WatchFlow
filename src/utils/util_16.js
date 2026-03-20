/**
 * util_16.js — HTTP response helpers
 */

function ok(data, meta = {}) {
  return { success: true, data, ...meta };
}

function fail(message, code = 'ERROR', details = {}) {
  return { success: false, error: { message, code, details } };
}

function paginate(items, page, perPage) {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  return {
    data: items.slice(start, start + perPage),
    pagination: { page, perPage, total, totalPages },
  };
}

function httpStatus(code) {
  const map = { 200: 'OK', 201: 'Created', 400: 'Bad Request', 401: 'Unauthorized',
                403: 'Forbidden', 404: 'Not Found', 500: 'Internal Server Error' };
  return map[code] || 'Unknown';
}

module.exports = { ok, fail, paginate, httpStatus };
