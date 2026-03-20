/**
 * util_23.js — Pipeline / compose helpers
 */

function compose(...fns) {
  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}

function pipe(...fns) {
  return (value) => fns.reduce((acc, fn) => fn(acc), value);
}

async function pipeAsync(...fns) {
  return async (value) => {
    let result = value;
    for (const fn of fns) result = await fn(result);
    return result;
  };
}

function tap(fn) {
  return (value) => { fn(value); return value; };
}

function when(predicate, fn) {
  return (value) => (predicate(value) ? fn(value) : value);
}

module.exports = { compose, pipe, pipeAsync, tap, when };
