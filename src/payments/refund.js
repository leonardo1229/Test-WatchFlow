/**
 * refund.js — Refund processing
 */

const REFUND_REASONS = ['duplicate', 'fraudulent', 'customer_request', 'product_issue'];
const REFUND_STATUSES = ['pending', 'approved', 'rejected', 'processed'];

function createRefund({ orderId, amount, reason, requestedBy } = {}) {
  if (!orderId) throw new TypeError('orderId is required');
  if (typeof amount !== 'number' || amount <= 0) throw new RangeError('amount must be a positive number');
  if (!REFUND_REASONS.includes(reason)) throw new RangeError(`reason must be one of: ${REFUND_REASONS.join(', ')}`);
  if (!requestedBy) throw new TypeError('requestedBy is required');

  return {
    id: `ref_${Date.now()}`,
    orderId,
    amount: parseFloat(amount.toFixed(2)),
    reason,
    requestedBy,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function approveRefund(refund, approvedBy) {
  if (refund.status !== 'pending') throw new Error(`Cannot approve a refund in status: ${refund.status}`);
  return { ...refund, status: 'approved', approvedBy, updatedAt: new Date().toISOString() };
}

function rejectRefund(refund, rejectedBy, rejectionNote = '') {
  if (refund.status !== 'pending') throw new Error(`Cannot reject a refund in status: ${refund.status}`);
  return { ...refund, status: 'rejected', rejectedBy, rejectionNote, updatedAt: new Date().toISOString() };
}

function processRefund(refund) {
  if (refund.status !== 'approved') throw new Error('Only approved refunds can be processed');
  return { ...refund, status: 'processed', processedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

function isFullRefund(refund, originalAmount) {
  return refund.amount >= originalAmount;
}

function summarize(refund) {
  return `Refund ${refund.id}: $${refund.amount.toFixed(2)} for order ${refund.orderId} [${refund.status}] — ${refund.reason}`;
}

module.exports = { createRefund, approveRefund, rejectRefund, processRefund, isFullRefund, summarize, REFUND_REASONS, REFUND_STATUSES };
