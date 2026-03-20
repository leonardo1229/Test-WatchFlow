/**
 * util_24.js — CSV helpers
 */

function parseCsvLine(line, delimiter = ',') {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === delimiter && !inQuotes) { result.push(current); current = ''; continue; }
    current += ch;
  }
  result.push(current);
  return result;
}

function csvToObjects(csvText, delimiter = ',') {
  const lines = csvText.trim().split('\n');
  const headers = parseCsvLine(lines[0], delimiter);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line, delimiter);
    return headers.reduce((obj, h, i) => { obj[h.trim()] = (values[i] || '').trim(); return obj; }, {});
  });
}

function objectsToCsv(rows, delimiter = ',') {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(delimiter)];
  for (const row of rows) lines.push(headers.map((h) => `"${row[h] ?? ''}"`).join(delimiter));
  return lines.join('\n');
}

module.exports = { parseCsvLine, csvToObjects, objectsToCsv };
