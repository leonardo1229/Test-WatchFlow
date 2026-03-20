// src/billing/payment.js
// CRITICAL PATH: Changes here require senior reviewer (Watchflow rule: severity critical)

const express = require('express');
const router = express.Router();

/**
 * POST /billing/payments
 * Initiate a payment transaction.
 */
router.post('/', (req, res) => {
  const { userId, amount, currency } = req.body;
  if (!userId || !amount || !currency) {
    return res.status(400).json({ error: 'userId, amount, and currency are required' });
  }
  // Simulated payment response
  res.status(201).json({
    transactionId: `txn_${Date.now()}`,
    userId,
    amount,
    currency,
    status: 'pending',
  });
});

/**
 * GET /billing/payments/:id
 * Get payment status by transaction ID.
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    transactionId: id,
    status: 'completed',
    amount: 100,
    currency: 'USD',
  });
});

module.exports = router;
