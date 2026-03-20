/**
 * gen_13.js — Generated: Localisation / i18n helpers
 */

class I18n {
  constructor(locale = 'en', fallback = 'en') {
    this._locale = locale;
    this._fallback = fallback;
    this._catalogs = {};
  }

  load(locale, catalog) {
    this._catalogs[locale] = { ...(this._catalogs[locale] || {}), ...catalog };
    return this;
  }

  t(key, vars = {}) {
    const catalog = this._catalogs[this._locale] || this._catalogs[this._fallback] || {};
    let msg = catalog[key] ?? this._catalogs[this._fallback]?.[key] ?? key;
    for (const [k, v] of Object.entries(vars)) {
      msg = msg.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    }
    return msg;
  }

  setLocale(locale) { this._locale = locale; return this; }

  hasKey(key, locale = this._locale) {
    return Boolean(this._catalogs[locale]?.[key]);
  }

  availableLocales() { return Object.keys(this._catalogs); }

  missing(locale) {
    const ref = this._catalogs[this._fallback] || {};
    const tgt = this._catalogs[locale] || {};
    return Object.keys(ref).filter((k) => !(k in tgt));
  }
}

module.exports = { I18n };
