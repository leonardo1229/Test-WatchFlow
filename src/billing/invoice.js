// src/billing/invoice.js
// CRITICAL PATH: Changes here require senior reviewer (Watchflow rule: severity critical)

const express = require('express');
const router = express.Router();

/**
 * POST /billing/invoices
 * Create an invoice for a user.
 */
router.post('/', (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'userId and non-empty items array are required' });
  }
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  res.status(201).json({
    invoiceId: `inv_${Date.now()}`,
    userId,
    items,
    total,
    currency: 'USD',
    status: 'draft',
  });
});

/**
 * GET /billing/invoices/:id
 * Retrieve an invoice.
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    invoiceId: id,
    userId: 1,
    items: [{ name: 'Subscription', price: 99, quantity: 1 }],
    total: 99,
    currency: 'USD',
    status: 'paid',
  });
});

module.exports = router;
