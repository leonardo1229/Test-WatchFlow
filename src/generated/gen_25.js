/**
 * gen_25.js — Generated: Markdown renderer (plain text)
 */

function renderHeading(text, level) {
  const prefix = '#'.repeat(Math.min(level, 6));
  return `${prefix} ${text}`;
}

function renderList(items, ordered = false) {
  return items.map((item, i) => `${ordered ? `${i + 1}.` : '-'} ${item}`).join('\n');
}

function renderTable(headers, rows) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[i] ?? '').length))
  );
  const pad = (s, w) => String(s).padEnd(w);
  const sep = widths.map((w) => '-'.repeat(w)).join(' | ');
  const head = headers.map((h, i) => pad(h, widths[i])).join(' | ');
  const body = rows.map((r) => widths.map((w, i) => pad(r[i] ?? '', w)).join(' | ')).join('\n');
  return [head, sep, body].join('\n');
}

function renderCodeBlock(code, lang = '') {
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

function renderBlockquote(text) {
  return text.split('\n').map((l) => `> ${l}`).join('\n');
}

function renderBadge(label, value, color = 'blue') {
  return `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color})`;
}

module.exports = { renderHeading, renderList, renderTable, renderCodeBlock, renderBlockquote, renderBadge };
