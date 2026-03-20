/**
 * gen_11.js — Generated: Pagination helpers
 */

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function paginate(items, { page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const size = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
  const pg   = Math.max(1, page);
  const total = items.length;
  const totalPages = Math.ceil(total / size);
  const start = (pg - 1) * size;
  return {
    data: items.slice(start, start + size),
    meta: { page: pg, pageSize: size, total, totalPages,
            hasPrev: pg > 1, hasNext: pg < totalPages },
  };
}

function cursorPaginate(items, { cursor, pageSize = DEFAULT_PAGE_SIZE, idKey = 'id' } = {}) {
  const size = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
  let start = 0;
  if (cursor) {
    const idx = items.findIndex((i) => String(i[idKey]) === String(cursor));
    start = idx >= 0 ? idx + 1 : 0;
  }
  const page = items.slice(start, start + size);
  const nextCursor = page.length === size ? String(page[page.length - 1][idKey]) : null;
  return { data: page, nextCursor };
}

function buildPageLinks(base, meta) {
  const links = { self: `${base}?page=${meta.page}&pageSize=${meta.pageSize}` };
  if (meta.hasPrev) links.prev = `${base}?page=${meta.page - 1}&pageSize=${meta.pageSize}`;
  if (meta.hasNext) links.next = `${base}?page=${meta.page + 1}&pageSize=${meta.pageSize}`;
  links.first = `${base}?page=1&pageSize=${meta.pageSize}`;
  links.last  = `${base}?page=${meta.totalPages}&pageSize=${meta.pageSize}`;
  return links;
}

module.exports = { paginate, cursorPaginate, buildPageLinks, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE };
