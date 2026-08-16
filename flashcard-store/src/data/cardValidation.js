/* ---------- card validation ----------
Shared by Checkout.jsx (real orders) and the Plans upgrade flow
(decorative — see account/Plans.jsx). Validates properly (Luhn, expiry,
CVC, brand detection) because a form that accepts nonsense teaches
customers nothing, but no card data ever leaves the browser or is
written to storage in either place.
--------------------------------- */

export const BRANDS = [
  { id: "visa", label: "Visa", test: /^4/, lengths: [16], cvc: 3 },
  { id: "mastercard", label: "Mastercard", test: /^(5[1-5]|2[2-7])/, lengths: [16], cvc: 3 },
  { id: "unionpay", label: "UnionPay", test: /^62/, lengths: [16, 19], cvc: 3 },
  { id: "amex", label: "Amex", test: /^3[47]/, lengths: [15], cvc: 4 },
];

export function detectBrand(digits) {
  return BRANDS.find((b) => b.test.test(digits)) ?? null;
}

export function luhnValid(digits) {
  if (digits.length < 13) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export function formatCardNumber(digits, brand) {
  const groups = brand?.id === "amex" ? [4, 6, 5] : [4, 4, 4, 4, 3];
  const out = [];
  let i = 0;
  for (const g of groups) {
    if (i >= digits.length) break;
    out.push(digits.slice(i, i + g));
    i += g;
  }
  return out.join(" ");
}

export function expiryValid(value) {
  const m = value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  // Cards are valid through the last day of their expiry month.
  const end = new Date(year, month, 1);
  return end > now;
}
