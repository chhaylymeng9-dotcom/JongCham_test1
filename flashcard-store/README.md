# Index & Co. — Flashcard Store

A React + Tailwind storefront for selling custom-printed physical
flashcards, with a deck builder, ABA KHQR / card checkout, and an
account area holding lessons, practice drills and a certification exam.

The interface is bilingual — English and Khmer — switchable from the
header at any time.

## Run it

```
npm install
npm run dev
```

Then open the local link it prints (usually **http://localhost:5173**).

## Build for production

```
npm run build
```

Produces a static `dist/` folder you can upload to any host.

## What's in it

**Deck builder** — pick a format, then write both sides of every card,
choose the stock colour, lettering, text size, back layout (ruled, grid,
dot, timeline), card size and corners. A bulk-paste tab turns a pasted
list into cards. Price updates live with the options chosen.

**Checkout** — delivery details, then ABA KHQR or card. The card form
does real validation (Luhn check, brand detection, expiry, CVC). An
activation code is issued per deck on payment, and an invoice is saved.

**Account** — sign in with the activation code from the box. Each deck
carries a written course (four lessons with objectives, worked examples
and key points), four practice modes, and a timed exam that issues a
printable certificate on a pass.

## Demonstration limits

This is a front-end prototype. Everything persists to `localStorage` in
the visitor's browser and nothing is sent to a server, which means:

- **No payment is taken.** The card form validates locally and stops
  there. Charging real cards needs a payment provider (ABA PayWay,
  Stripe) called from a server — never from the browser. No card number
  is stored or transmitted; the invoice records only the brand.
- **Accounts aren't real accounts.** The "one code, one device" rule is
  enforced against a device id in local storage, so clearing site data
  resets it. Real enforcement has to happen server-side.
- **Orders, progress and certificates live in one browser.** They don't
  follow the customer to another device, and clearing site data erases
  them.

All storage goes through `src/storage.js`, so swapping in a real backend
is a change to that one file plus the API calls behind it.

## Project structure

```
index.html              entry HTML, font loading
src/main.jsx            mounts the app
src/App.jsx             shell: nav, language switch, routing, cart
src/i18n.jsx            English/Khmer strings + language provider
src/ui.jsx              shared UI primitives (Button, Panel, Field…)
src/storage.js          every localStorage read/write
src/index.css           Tailwind layers, base styles, print rules

src/data/decks.js       deck catalogue, options, pricing, card rendering
src/data/lessons.js     course content per subject
src/data/questions.js   question banks, quiz building, answer checking
src/data/codes.js       activation codes

src/components/Flashcard.jsx   the card itself, front and back

src/pages/Store.jsx     hero, deck picker, deck builder
src/pages/Cart.jsx      cart lines and totals
src/pages/Checkout.jsx  details → payment → confirmation
src/pages/Orders.jsx    order history and printable invoices
src/pages/Account.jsx   sign-in and course dashboard

src/account/Lessons.jsx      lesson list and reading view
src/account/Practice.jsx     four drill modes
src/account/Exam.jsx         timed exam and results
src/account/Certificate.jsx  printable certificate

tailwind.config.js      design tokens (colours, type, shadows)
vite.config.js          Vite + React plugin
```

## Demo activation codes

`WORD-2201` vocabulary · `NUM-1187` maths · `HIST-5521` Khmer history ·
`LEC-4402` lecture set · `OPEN-3390` blank stock
