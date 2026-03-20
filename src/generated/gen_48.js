/**
 * gen_46.js — Generated: String distance / fuzzy matching
 */

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i || j));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (!maxLen) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

function jaro(s, t) {
  if (s === t) return 1;
  const range = Math.floor(Math.max(s.length, t.length) / 2) - 1;
  const sm = Array(s.length).fill(false), tm = Array(t.length).fill(false);
  let matches = 0;
  for (let i = 0; i < s.length; i++) {
    const lo = Math.max(0, i - range), hi = Math.min(i + range + 1, t.length);
    for (let j = lo; j < hi; j++) {
      if (!tm[j] && s[i] === t[j]) { sm[i] = tm[j] = true; matches++; break; }
    }
  }
  if (!matches) return 0;
  const ms = s.filter((_, i) => sm[i]), mt = t.filter((_, j) => tm[j]);
  const transpositions = ms.filter((c, i) => c !== mt[i]).length / 2;
  return (matches / s.length + matches / t.length + (matches - transpositions) / matches) / 3;
}

function closestMatch(query, candidates) {
  return candidates.reduce((best, c) =>
    similarity(query, c) > similarity(query, best) ? c : best
  );
}

module.exports = { levenshtein, similarity, jaro, closestMatch };
