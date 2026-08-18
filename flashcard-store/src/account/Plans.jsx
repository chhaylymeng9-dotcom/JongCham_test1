import { useState } from "react";
import paymentQR from "../assets/payment-qr.png";
import { detectBrand, expiryValid, formatCardNumber, luhnValid } from "../data/cardValidation.js";
import { TRIAL_DAYS, getProTrial, startProTrial } from "../storage.js";
import "./plans.css";

/* ---------- Plans ----------
Ported from a supplied "Upgrade your plan" mockup. Reached from the
"Plan and billing" panel on the profile page. The tier system itself is
decorative — this store sells one-time printed decks, not a subscription,
so Pro/Max, the monthly/yearly toggle and the comparison table describe
plans that don't exist. But clicking "Upgrade" runs a real payment
simulation instead of doing nothing: the same KHQR/card flow
Checkout.jsx uses for real orders (see data/cardValidation.js) — no card
data is stored or sent anywhere either way. A "successful" payment saves
a cosmetic session.plan (read by the profile page's Plan and billing
panel) but doesn't unlock anything for real. Free's "N of 1 deck used"
note is the one honest number on this page — it echoes decks.length,
not an enforced cap.
--------------------------------- */

const PRICES = {
  pro: { m: "$4.99", y: "$3.99", note: "billed monthly", yNote: "$47.90 billed yearly" },
  max: { m: "$12", y: "$9.60", note: "billed monthly", yNote: "$115.20 billed yearly" },
};
const PLAN_NAMES = { pro: "Pro", max: "Max" };

// Each feature carries a short "why" — shown in a hover tooltip so the
// list can stay scannable at a glance and still explain itself on demand.
const FREE_FEATS = [
  { t: "1 deck, up to 20 cards", why: "Your first deck, sized for a quick trial before you commit to a box." },
  { t: "Swipe study and multiple choice", why: "The two core drill modes — enough to actually learn the deck." },
  { t: "Day streak and daily goal", why: "Simple habit tracking, no plan required." },
  { t: "Activate one printed deck code", why: "Every box you buy adds its own deck for free, on any plan." },
  { t: "Study on phone and computer", why: "Your progress follows you — no separate app needed." },
];
const PRO_FEATS = [
  { t: "Unlimited decks and cards", why: "No cap on how many decks you build or study." },
  { t: "500+ ready-made decks in the library", why: "Every subject JongCham has published, without buying the box." },
  {
    t: "6 exercise types: choice, typing, listening, matching, order, writing",
    why: "More ways to drill the same material so it actually sticks.",
  },
  { t: "New practice sets every week", why: "Fresh questions added regularly, so review doesn't go stale." },
  { t: "Spaced review that plans your day", why: "Cards you get wrong come back sooner than ones you know well." },
  { t: "Exams, scores and progress reports", why: "Timed exams with a score history you can look back on." },
  { t: "Native audio on every card", why: "Hear pronunciation instead of guessing from spelling." },
  { t: "20% off every printed card box", why: "The discount applies for as long as you're subscribed." },
  { t: "3 rest days a month for your streak", why: "Miss a day without losing your streak — up to three a month." },
  { t: "Study offline", why: "Download a deck and review it without a connection." },
];
const MAX_FEATS = [
  { t: "Design your own cards and print your own box", why: "Full access to the card builder, not just ready-made decks." },
  { t: "30% off every print order, priority printing", why: "A bigger discount, and your order moves to the front of the queue." },
  { t: "Classes of up to 200 students", why: "Invite by link — students don't need a paid plan to join." },
  { t: "Full class reports — see every student's progress", why: "Who studied, who passed, who's falling behind." },
  { t: "Import from CSV, Anki and Quizlet", why: "Bring decks you already built elsewhere instead of retyping them." },
  { t: "Sell your decks in the shop", why: "Publish a deck you made and earn from other students using it." },
  { t: "Advanced study analytics for your own learning", why: "Deeper stats than the daily streak — retention trends over time." },
  { t: "Early access to new features", why: "Try new drill modes and tools before they roll out to everyone." },
  { t: "Answers from support within one day", why: "A priority queue instead of the standard response time." },
];

// [label, free, pro, max] — true/false render as a check/dash, strings render as-is.
const ROWS = [
  ["Decks", "1", "Unlimited", "Unlimited"],
  ["Cards per deck", "20", "Unlimited", "Unlimited"],
  ["Ready-made deck library", "3 sample decks", "500+ decks", "500+ decks"],
  ["Exercise types", "2", "6", "6"],
  ["New practice sets weekly", false, true, true],
  ["Spaced review", false, true, true],
  ["Exams and scores", false, true, true],
  ["Card audio", false, true, true],
  ["Rest days a month", "0", "3", "5"],
  ["Offline study", false, true, true],
  ["Make your own box", false, false, true],
  ["Print discount", false, "20%", "30%"],
  ["Class sharing", false, false, "200 students"],
  ["Class reports", false, false, true],
  ["Priority printing", false, false, true],
  ["Early access to new features", false, false, true],
];

const FAQ = [
  {
    q: "What happens to my cards if I stop paying?",
    a: "Nothing is deleted. Your decks go read-only above the free limit — you can still study every card, but you cannot add new ones until you upgrade again.",
    open: true,
  },
  {
    q: "I bought a printed box. Do I still need a plan?",
    a: "No. Every printed box comes with its own deck code, and that deck works on the Free plan forever. A plan is only for extra decks and the smarter review tools.",
  },
  {
    q: "Can I change or cancel later?",
    a: "Yes, any time from this page. If you cancel, your plan stays active until the end of the period you already paid for.",
  },
  {
    q: "Is there a student price?",
    a: "Yes. Send us a photo of your student card and we take 40% off the Pro plan for one year.",
  },
];

function BackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-5M12 8v.01" />
    </svg>
  );
}
function CheckIcon({ width = 14, height = 14 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function FreeMark() {
  return (
    <svg className="jpl-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="15" height="14" rx="2" />
      <path d="M18 8h3v11a2 2 0 0 1-2 2H7" />
    </svg>
  );
}
function ProMark() {
  return (
    <svg className="jpl-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V9" />
      <path d="M12 9C12 5 9 3 5 3c0 4 3 6 7 6Z" />
      <path d="M12 12c0-3 2.5-5 6-5 0 3-2.5 5-6 5Z" />
    </svg>
  );
}
function MaxMark() {
  return (
    <svg className="jpl-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function KhqrMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" rx="1.5" fill="none" stroke="#2F4538" strokeWidth="2" />
      <rect x="14" y="1" width="9" height="9" rx="1.5" fill="none" stroke="#2F4538" strokeWidth="2" />
      <rect x="1" y="14" width="9" height="9" rx="1.5" fill="none" stroke="#2F4538" strokeWidth="2" />
      <rect x="14" y="14" width="4" height="4" fill="#D65F42" />
      <rect x="19.5" y="19.5" width="3.5" height="3.5" fill="#D65F42" />
    </svg>
  );
}
function CardMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2.5" fill="none" stroke="#2F4538" strokeWidth="2" />
      <rect x="1" y="8" width="22" height="3" fill="#2F4538" />
      <rect x="4" y="14.5" width="7" height="2" rx="1" fill="#D65F42" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" className="jpl-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Feats({ title, items, onShowTip, onHideTip }) {
  return (
    <div className="jpl-feats">
      <h3>{title}</h3>
      <ul>
        {items.map((f) => (
          <li key={f.t} onPointerEnter={(e) => onShowTip(e, f.t, f.why)} onPointerLeave={onHideTip}>
            <CheckIcon /> {f.t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Plans({ decksOwned, currentPlan, onBack, onUpgrade }) {
  const [cycle, setCycle] = useState("m");
  const [stage, setStage] = useState("plans"); // plans | payment | confirmed
  const [target, setTarget] = useState(null); // "pro" | "max"

  const [payMethod, setPayMethod] = useState("khqr");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [cardErrors, setCardErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [tip, setTip] = useState(null); // { title, body, x, y } — the feature-row hover tooltip

  /* the one free week of Pro — one per browser, see storage.js. Unlike the
     upgrade below it takes no payment at all, simulated or otherwise. */
  const [trial, setTrial] = useState(getProTrial);
  function beginTrial() {
    const started = startProTrial();
    if (started) setTrial(started);
  }

  function showTip(e, title, body) {
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ title, body, x: r.left + r.width / 2, y: r.top });
  }
  function hideTip() {
    setTip(null);
  }

  const digits = card.number.replace(/\D/g, "");
  const brand = detectBrand(digits);
  const amount = target ? PRICES[target][cycle] : null;

  // Positions the hover spotlight (see .jpl-glow in plans.css) at the
  // cursor — set directly on the DOM node rather than via state so it
  // doesn't trigger a re-render on every pointer move.
  function handleGlow(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  function startUpgrade(plan) {
    setTarget(plan);
    setStage("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateCard() {
    const next = {};
    if (!luhnValid(digits) || (brand && !brand.lengths.includes(digits.length))) next.number = "Enter a valid card number.";
    if (!card.name.trim()) next.name = "Enter the name on the card.";
    if (!expiryValid(card.expiry)) next.expiry = "Enter a valid expiry date.";
    if (card.cvc.length < (brand?.cvc ?? 3)) next.cvc = "Enter the security code.";
    setCardErrors(next);
    return Object.keys(next).length === 0;
  }

  function pay() {
    if (payMethod === "card" && !validateCard()) return;
    setProcessing(true);
    // Stands in for the round-trip to a payment provider — same
    // simulation Checkout.jsx uses for real orders.
    setTimeout(() => {
      setProcessing(false);
      onUpgrade(target);
      setStage("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1300);
  }

  /* ---------- confirmed ---------- */
  if (stage === "confirmed") {
    return (
      <div className="jpl-root">
        <div className="jpl-wrap">
          <div className="jpl-done">
            <div className="jpl-doneseal">
              <CheckIcon width={22} height={22} />
            </div>
            <h2>You're on {PLAN_NAMES[target]}</h2>
            <p>
              This is a demo — nothing was charged and your account limits haven't actually changed. The profile
              page will show {PLAN_NAMES[target]} as your plan from here on.
            </p>
            <button type="button" className="jpl-cta jpl-solid" onClick={onBack} style={{ maxWidth: 220, margin: "0 auto" }}>
              Back to profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- payment ---------- */
  if (stage === "payment") {
    return (
      <div className="jpl-root">
        <div className="jpl-wrap">
          <button type="button" className="jpl-back" onClick={() => setStage("plans")}>
            <BackIcon /> Back to plans
          </button>

          <div className="jpl-pay">
            <div className="jpl-pay-head">
              <span className="jpl-label">Upgrade</span>
              <h1>Pay for {PLAN_NAMES[target]}</h1>
              <p>
                {amount} / month{cycle === "y" ? ", billed yearly" : ""} · cancel anytime
              </p>
            </div>

            <div className="jpl-methods">
              <button type="button" className={`jpl-method${payMethod === "khqr" ? " jpl-mon" : ""}`} onClick={() => setPayMethod("khqr")}>
                <KhqrMark />
                <span>
                  <b>KHQR</b>
                  <span>Scan with your banking app</span>
                </span>
                <span className="jpl-dot" />
              </button>
              <button type="button" className={`jpl-method${payMethod === "card" ? " jpl-mon" : ""}`} onClick={() => setPayMethod("card")}>
                <CardMark />
                <span>
                  <b>Card</b>
                  <span>Visa, Mastercard, UnionPay</span>
                </span>
                <span className="jpl-dot" />
              </button>
            </div>

            {payMethod === "khqr" ? (
              <div className="jpl-paybox">
                <div className="jpl-qr">
                  <img src={paymentQR} alt="Scan to pay" />
                  <div>
                    <div className="jpl-qr-rows">
                      <div className="jpl-qr-row">
                        <span>Amount</span>
                        <span>{amount}</span>
                      </div>
                      <div className="jpl-qr-row">
                        <span>Reference</span>
                        <span>PLAN-{target?.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="jpl-paybox">
                <div className="jpl-field">
                  <label htmlFor="pl-num">Card number</label>
                  <input
                    id="pl-num"
                    className={cardErrors.number ? "jpl-bad" : ""}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    value={card.number}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 19);
                      setCard((c) => ({ ...c, number: formatCardNumber(raw, detectBrand(raw)) }));
                      setCardErrors((x) => ({ ...x, number: undefined }));
                    }}
                  />
                  {cardErrors.number && <p className="jpl-err">{cardErrors.number}</p>}
                </div>
                <div className="jpl-field">
                  <label htmlFor="pl-name">Name on card</label>
                  <input
                    id="pl-name"
                    className={cardErrors.name ? "jpl-bad" : ""}
                    autoComplete="cc-name"
                    placeholder="MING SOKHA"
                    value={card.name}
                    onChange={(e) => {
                      setCard((c) => ({ ...c, name: e.target.value }));
                      setCardErrors((x) => ({ ...x, name: undefined }));
                    }}
                  />
                  {cardErrors.name && <p className="jpl-err">{cardErrors.name}</p>}
                </div>
                <div className="jpl-fieldrow">
                  <div className="jpl-field">
                    <label htmlFor="pl-exp">Expiry</label>
                    <input
                      id="pl-exp"
                      className={cardErrors.expiry ? "jpl-bad" : ""}
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setCard((c) => ({ ...c, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }));
                        setCardErrors((x) => ({ ...x, expiry: undefined }));
                      }}
                    />
                    {cardErrors.expiry && <p className="jpl-err">{cardErrors.expiry}</p>}
                  </div>
                  <div className="jpl-field">
                    <label htmlFor="pl-cvc">Security code</label>
                    <input
                      id="pl-cvc"
                      className={cardErrors.cvc ? "jpl-bad" : ""}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder={brand?.cvc === 4 ? "1234" : "123"}
                      value={card.cvc}
                      onChange={(e) => {
                        setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }));
                        setCardErrors((x) => ({ ...x, cvc: undefined }));
                      }}
                    />
                    {cardErrors.cvc && <p className="jpl-err">{cardErrors.cvc}</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="jpl-demo">
              <InfoIcon />
              <span>
                <b>Demo payment.</b> This mirrors the real checkout's card validation, but nothing is charged and no
                card details are sent anywhere or saved.
              </span>
            </div>

            <div className="jpl-payactions">
              <button type="button" className="jpl-cta jpl-solid" style={{ maxWidth: 240 }} onClick={pay} disabled={processing}>
                {processing ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <SpinnerIcon /> Processing…
                  </span>
                ) : payMethod === "khqr" ? (
                  "I've paid"
                ) : (
                  `Pay ${amount}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- plan list ---------- */
  return (
    <div className="jpl-root">
      <div className="jpl-wrap">
        <button type="button" className="jpl-back" onClick={onBack}>
          <BackIcon /> Back to profile
        </button>

        <div className="jpl-head">
          <span className="jpl-label">Your plan</span>
          <h1>Study more, remember longer</h1>
          <p>
            You are on the {PLAN_NAMES[currentPlan] ?? "Free"} plan. Upgrade any time — your cards and progress stay
            exactly where they are.
          </p>
        </div>

        <div className="jpl-toggle">
          <div className={`jpl-seg${cycle === "y" ? " jpl-y" : ""}`}>
            <span className="jpl-seg-indicator" aria-hidden="true" />
            <button type="button" className={cycle === "m" ? "jpl-on" : ""} onClick={() => setCycle("m")}>
              Monthly
            </button>
            <button type="button" className={cycle === "y" ? "jpl-on" : ""} onClick={() => setCycle("y")}>
              Yearly
            </button>
          </div>
          <span className="jpl-save">Save 20% yearly</span>
        </div>

        <div className="jpl-plans">
          {/* FREE */}
          <section className="jpl-plan" onPointerMove={handleGlow}>
            <span className="jpl-glow" aria-hidden="true" />
            <div className="jpl-top">
              <FreeMark />
              <h2>Free</h2>
              <p className="jpl-tag">One small deck, all the basics</p>

              <div className="jpl-price" key={cycle}>
                <span className="jpl-amt">$0</span>
                <span className="jpl-per">
                  USD / month
                  <b>free forever</b>
                </span>
              </div>

              <div className="jpl-note">
                <InfoIcon />
                <span>
                  {!currentPlan ? (
                    <>
                      <b>This is your plan.</b> {decksOwned} of 1 deck used.
                    </>
                  ) : (
                    <>
                      <b>Included with every plan.</b> {decksOwned} deck{decksOwned === 1 ? "" : "s"} active.
                    </>
                  )}
                </span>
              </div>

              {!currentPlan ? (
                <button type="button" className="jpl-cta jpl-current" disabled>
                  Your current plan
                </button>
              ) : (
                <button type="button" className="jpl-cta" onClick={() => onUpgrade(null)}>
                  Downgrade to Free
                </button>
              )}
            </div>
            <Feats title="What you get:" items={FREE_FEATS} onShowTip={showTip} onHideTip={hideTip} />
          </section>

          {/* PRO */}
          <section className="jpl-plan jpl-best" onPointerMove={handleGlow}>
            <span className="jpl-glow" aria-hidden="true" />
            <span className="jpl-flag">Most popular</span>
            <div className="jpl-top">
              <ProMark />
              <h2>Pro</h2>
              <p className="jpl-tag">Every deck, every exercise</p>

              <div className="jpl-price" key={cycle}>
                <span className="jpl-amt">{PRICES.pro[cycle]}</span>
                <span className="jpl-per">
                  USD / month
                  <b>{cycle === "m" ? PRICES.pro.note : PRICES.pro.yNote}</b>
                </span>
              </div>

              <div className="jpl-note">
                <InfoIcon />
                <span>
                  <b>500+ decks and 6 exercise types.</b> Pay yearly and save 20% — $47.90 instead of $59.88.
                </span>
              </div>

              {currentPlan === "pro" ? (
                <button type="button" className="jpl-cta jpl-current" disabled>
                  Your current plan
                </button>
              ) : (
                <button type="button" className="jpl-cta" onClick={() => startUpgrade("pro")}>
                  Upgrade to Pro
                </button>
              )}

              {/* the free week is real (storage.js's Pro trial), so this
                  line does what it says instead of just promising it */}
              {currentPlan ? (
                <p className="jpl-fine">Cancel anytime</p>
              ) : trial.active ? (
                <p className="jpl-fine jpl-trial-on">
                  Trial running · {trial.daysLeft} day{trial.daysLeft === 1 ? "" : "s"} left
                </p>
              ) : trial.expired ? (
                <p className="jpl-fine">Your free trial has ended</p>
              ) : (
                <button type="button" className="jpl-cta jpl-ghost" onClick={beginTrial}>
                  Start {TRIAL_DAYS} days free
                </button>
              )}
            </div>
            <Feats title="Everything in Free, plus:" items={PRO_FEATS} onShowTip={showTip} onHideTip={hideTip} />
          </section>

          {/* MAX */}
          <section className="jpl-plan" onPointerMove={handleGlow}>
            <span className="jpl-glow" aria-hidden="true" />
            <div className="jpl-top">
              <MaxMark />
              <h2>Max</h2>
              <p className="jpl-tag">Everything in Pro, without limits</p>

              <div className="jpl-price" key={cycle}>
                <span className="jpl-amt">{PRICES.max[cycle]}</span>
                <span className="jpl-per">
                  USD / month
                  <b>{cycle === "m" ? PRICES.max.note : PRICES.max.yNote}</b>
                </span>
              </div>

              <div className="jpl-note">
                <InfoIcon />
                <span>
                  <b>Our most advanced plan.</b> For teachers, tutors and people who build their own decks.
                </span>
              </div>

              {currentPlan === "max" ? (
                <button type="button" className="jpl-cta jpl-current" disabled>
                  Your current plan
                </button>
              ) : (
                <button type="button" className="jpl-cta" onClick={() => startUpgrade("max")}>
                  Upgrade to Max
                </button>
              )}
              {/* the free week is a Pro offer only — Max promising one too
                  would be a promise nothing in the app keeps */}
              <p className="jpl-fine">Cancel anytime</p>
            </div>
            <Feats title="Everything in Pro, plus:" items={MAX_FEATS} onShowTip={showTip} onHideTip={hideTip} />
          </section>
        </div>

        {/* ============ COMPARE ============ */}
        <section className="jpl-compare">
          <h2>Compare plans</h2>
          <div className="jpl-compare-scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Feature</th>
                  <th>Free</th>
                  <th className="jpl-hl">Pro</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, free, pro, max]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <Cell value={free} />
                    <Cell value={pro} hl />
                    <Cell value={max} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="jpl-faq">
          <h2>Questions</h2>
          {FAQ.map((item) => (
            <details key={item.q} className="jpl-q" open={item.open}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>
      </div>

      {tip && (
        <div className="jpl-pop" style={{ left: tip.x, top: tip.y }}>
          <b>{tip.title}</b>
          <span>{tip.body}</span>
        </div>
      )}
    </div>
  );
}

function Cell({ value, hl }) {
  if (value === true) return <td className={hl ? "jpl-hl jpl-yes" : "jpl-yes"}>✓</td>;
  if (value === false) return <td className={hl ? "jpl-hl jpl-no" : "jpl-no"}>—</td>;
  return <td className={hl ? "jpl-hl" : ""}>{value}</td>;
}
