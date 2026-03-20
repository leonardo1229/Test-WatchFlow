/**
 * gen_22.js — Generated: Billing calculator
 */

const PLAN_PRICES = { free: 0, starter: 9, pro: 29, enterprise: 99 };
const TAX_RATE = 0.08;

function calculateSubscription(plan, months = 1, discount = 0) {
  const base = PLAN_PRICES[plan];
  if (base === undefined) throw new RangeError(`Unknown plan: ${plan}`);
  const subtotal = base * months;
  const discountAmt = parseFloat((subtotal * (discount / 100)).toFixed(2));
  const taxable = subtotal - discountAmt;
  const tax = parseFloat((taxable * TAX_RATE).toFixed(2));
  return { plan, months, subtotal, discount: discountAmt, tax, total: parseFloat((taxable + tax).toFixed(2)) };
}

function prorateDays(plan, daysUsed, daysInMonth = 30) {
  const daily = PLAN_PRICES[plan] / daysInMonth;
  return parseFloat((daily * daysUsed).toFixed(2));
}

function upgradeCredit(fromPlan, toPlan, daysRemaining, daysInMonth = 30) {
  const credit = prorateDays(fromPlan, daysRemaining, daysInMonth);
  const charge = prorateDays(toPlan, daysRemaining, daysInMonth);
  return parseFloat((charge - credit).toFixed(2));
}

function formatInvoice(calc) {
  return [
    `Plan: ${calc.plan}`,
    `Subtotal: $${calc.subtotal.toFixed(2)}`,
    `Discount: -$${calc.discount.toFixed(2)}`,
    `Tax (${(TAX_RATE * 100).toFixed(0)}%): $${calc.tax.toFixed(2)}`,
    `Total: $${calc.total.toFixed(2)}`,
  ].join('\n');
}

module.exports = { calculateSubscription, prorateDays, upgradeCredit, formatInvoice, PLAN_PRICES };
