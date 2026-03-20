/**
 * gen_02.js — Generated: Product model factory
 */

const CURRENCIES = ['USD', 'EUR', 'GBP'];

function createProduct({ name, sku, price, currency = 'USD', stock = 0, tags = [] } = {}) {
  if (!name) throw new TypeError('name is required');
  if (!sku)  throw new TypeError('sku is required');
  if (typeof price !== 'number' || price < 0) throw new RangeError('price must be a non-negative number');
  if (!CURRENCIES.includes(currency)) throw new RangeError(`currency must be one of: ${CURRENCIES.join(', ')}`);
  return {
    id: `prod_${sku}`,
    name: name.trim(),
    sku: sku.toUpperCase(),
    price,
    currency,
    stock,
    tags: [...tags],
    active: true,
    createdAt: new Date().toISOString(),
  };
}

function applyDiscount(product, pct) {
  if (pct < 0 || pct > 100) throw new RangeError('pct must be 0–100');
  return { ...product, price: parseFloat((product.price * (1 - pct / 100)).toFixed(2)) };
}

function formatPrice(product) {
  const symbols = { USD: '$', EUR: '€', GBP: '£' };
  return `${symbols[product.currency] || ''}${product.price.toFixed(2)}`;
}

function isInStock(product) { return product.stock > 0; }

function restock(product, qty) {
  if (qty <= 0) throw new RangeError('qty must be positive');
  return { ...product, stock: product.stock + qty };
}

module.exports = { createProduct, applyDiscount, formatPrice, isInStock, restock };
