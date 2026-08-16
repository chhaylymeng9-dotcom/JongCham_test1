/* ---------- activation codes ----------
Every deck ships with a code printed on a card inside the box. Entering it
under "My account" unlocks that deck's course.

Two sources:
  1. Fixed demo codes, so the account area can be explored without buying.
  2. Codes issued at checkout, saved to this browser so a purchase in the
     store actually unlocks something.

A real deployment issues these server-side at fulfilment time and validates
them against the order — this is the local stand-in for that.
--------------------------------- */

import { readStore, writeStore } from "../storage.js";
import { DECK_BY_ID } from "./decks.js";

const DEMO_CODES = {
  "GRAM-2201": "grammar",
  "NUM-1187": "math",
  "HIST-5521": "history",
  "CUST-9001": "custom",
  "PHYS-3312": "physics",
};

const PREFIX_BY_DECK = {
  grammar: "GRAM",
  math: "NUM",
  history: "HIST",
  custom: "CUST",
  physics: "PHYS",
};

export const DEMO_CODE_LIST = Object.entries(DEMO_CODES).map(([code, deckId]) => ({
  code,
  deckId,
}));

function issuedCodes() {
  const map = readStore("issued_codes", {});
  return map && typeof map === "object" ? map : {};
}

export function issueCode(deckId, cardCount) {
  const prefix = PREFIX_BY_DECK[deckId] ?? "DECK";
  let code;
  const existing = issuedCodes();
  do {
    code = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (existing[code] || DEMO_CODES[code]);

  writeStore("issued_codes", { ...existing, [code]: { deckId, cardCount } });
  return code;
}

/* Returns the deck this code unlocks, or null. Demo codes and older
   issued codes carry just a deckId string — those fall back to the
   deck's default capacity rather than a purchased card count. */
export function resolveCode(raw) {
  const code = String(raw ?? "").trim().toUpperCase();
  const issued = issuedCodes()[code];
  const deckId = DEMO_CODES[code] ?? (typeof issued === "string" ? issued : issued?.deckId) ?? null;
  if (!deckId) return null;
  const deck = DECK_BY_ID[deckId];
  if (!deck) return null;
  const capacity = (typeof issued === "object" && issued?.cardCount) || deck.capacity;
  return { code, deckId, subject: deck.subject, deck, capacity };
}
