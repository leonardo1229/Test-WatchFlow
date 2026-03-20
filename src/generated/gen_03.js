/**
 * gen_03.js — Generated: Order model factory
 */

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function createOrder({ userId, items = [], shippingAddress } = {}) {
  if (!userId) throw new TypeError('userId is required');
  if (!items.length) throw new Error('Order must have at least one item');
  if (!shippingAddress) throw new TypeError('shippingAddress is required');
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return {
    id: `ord_${Date.now()}`,
    userId,
    items: items.map((i) => ({ ...i })),
    shippingAddress,
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat((subtotal * 0.1).toFixed(2)),
    total: parseFloat((subtotal * 1.1).toFixed(2)),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function transitionOrder(order, newStatus) {
  if (!ORDER_STATUSES.includes(newStatus)) throw new RangeError(`Invalid status: ${newStatus}`);
  return { ...order, status: newStatus, updatedAt: new Date().toISOString() };
}

function cancelOrder(order) { return transitionOrder(order, 'cancelled'); }

function orderSummary(order) {
  return `Order ${order.id}: ${order.items.length} item(s), total ${order.total} [${order.status}]`;
}

function isFulfilled(order) { return order.status === 'delivered'; }

module.exports = { createOrder, transitionOrder, cancelOrder, orderSummary, isFulfilled, ORDER_STATUSES };
