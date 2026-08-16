/* ---------- promo codes ----------
Flat percentage-off codes typed on the cart page. Kept apart from the
reward vouchers in rewards.js: those are earned in the account area and
burned on one order, these are plain marketing codes anyone can type.
The discount is a straight percent off the subtotal — applied in Cart
and carried into Checkout through the shell's `promo` state.
--------------------------------- */

export const PROMO_CODES = [
  { code: "STUDENT10", pct: 10 },
  { code: "WELCOME15", pct: 15 },
  { code: "CHAM20", pct: 20 },
];

export const promoByCode = (code) => PROMO_CODES.find((p) => p.code === code) ?? null;
