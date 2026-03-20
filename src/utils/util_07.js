/**
 * util_07.js — Async helpers
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry(fn, attempts = 3, delay = 200) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await sleep(delay * Math.pow(2, i));
    }
  }
}

async function timeout(promise, ms) {
  const timer = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timer]);
}

async function mapConcurrent(arr, fn, concurrency = 5) {
  const results = [];
  for (let i = 0; i < arr.length; i += concurrency) {
    const batch = await Promise.all(arr.slice(i, i + concurrency).map(fn));
    results.push(...batch);
  }
  return results;
}

module.exports = { sleep, retry, timeout, mapConcurrent };
