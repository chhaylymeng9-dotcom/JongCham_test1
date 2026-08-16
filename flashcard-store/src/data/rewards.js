/* ---------- apple-harvest reward catalog ----------
Shared between the account area (src/account/Vouchers.jsx, where apples
buy these) and Checkout (src/pages/Checkout.jsx, where a claimed code
actually gets redeemed against an order) — one source of truth for what
each voucher is worth, so the two never drift apart.
--------------------------------- */
export const REWARDS = [
  {
    id: "ship",
    kind: "ship",
    cost: 12,
    val: "Free delivery",
    title: "Free delivery on your next box",
    body: "Applies to one order, any subject or Customize Set.",
  },
  {
    id: "print10",
    kind: "print",
    cost: 18,
    val: "10%",
    title: "10% off printing your own deck",
    body: "Customize Set only — applies to the printing cost, not delivery.",
  },
  {
    id: "box10",
    kind: "pct",
    cost: 20,
    val: "10%",
    title: "10% off any subject box",
    body: "One box per order. Printed boxes only — the online half is already free.",
  },
  {
    id: "print25",
    kind: "print",
    cost: 45,
    val: "25%",
    title: "25% off printing your own deck",
    body: "Customize Set only — applies to the printing cost, not delivery.",
  },
  {
    id: "box25",
    kind: "pct",
    cost: 45,
    val: "25%",
    title: "25% off any subject box",
    body: "One box per order. Printed boxes only — the online half is already free.",
  },
  {
    id: "free",
    kind: "free",
    cost: 140,
    val: "Free box",
    title: "A free printed box",
    body: "Any subject box, or a Customize Set up to 50 cards. Delivery not included.",
  },
];
