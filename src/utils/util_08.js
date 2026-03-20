/**
 * util_08.js — Logger utility
 */

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

class Logger {
  constructor(name, level = 'info') {
    this.name = name;
    this.level = level;
  }

  _log(level, msg, meta = {}) {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.level]) return;
    const entry = { time: new Date().toISOString(), level, name: this.name, msg, ...meta };
    console.log(JSON.stringify(entry));
  }

  debug(msg, meta) { this._log('debug', msg, meta); }
  info(msg, meta)  { this._log('info',  msg, meta); }
  warn(msg, meta)  { this._log('warn',  msg, meta); }
  error(msg, meta) { this._log('error', msg, meta); }
}

function createLogger(name, level) {
  return new Logger(name, level);
}

module.exports = { Logger, createLogger };
