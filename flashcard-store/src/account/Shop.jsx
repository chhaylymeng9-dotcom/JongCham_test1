import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../i18n.jsx";
import { COURSE_GROUPS, SHOP_COURSES } from "../data/courses.js";
import { lessonsFor } from "../data/lessons.js";
import { Star } from "../components/CoursePicker";
import StarShop from "../components/StarShop.jsx";
import AppleMark from "../components/AppleMark.jsx";
import "./shop.css";

/* ---------- Shop ----------
The course shop, reached from SHOP in the Learn rail. Courses are bought
with stars (storage.js), which is the same in-app currency the course
picker on the Learn view spends — this is that picker's catalogue given
room to breathe: what each course teaches, how long it is, and what it
costs, with the star balance and a top-up right in the header.

What's on sale comes from data/courses.js. An entry with no curriculum is
listed but not sellable ("Coming soon"): selling an empty course would
hand someone a deck with no lessons in it.

The real-money path — a printed box of cards — is still the store front
and checkout. Nothing here charges money.
--------------------------------- */

const ICONS = {
  math: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 6.6h6v1.8H4Zm0 3.2h6v1.8H4ZM6.1 15h1.8v2H10v1.8H7.9v2H6.1v-2H4V17h2.1ZM14 6.6h6v1.8h-6Zm.6 8.2 1.3-1.3 1.6 1.6 1.6-1.6 1.3 1.3-1.6 1.6 1.6 1.6-1.3 1.3-1.6-1.6-1.6 1.6-1.3-1.3 1.6-1.6Z" />
    </svg>
  ),
  english: <span className="sh-glyph">Aa</span>,
  khmer: <span className="sh-glyph sh-km">ក</span>,
  history: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 8 12 3.5 21.5 8" />
      <path d="M5 9v8M9.6 9v8M14.4 9v8M19 9v8" />
      <path d="M3 20.5h18" />
    </svg>
  ),
  physics: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.4" />
      <ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(120 12 12)" />
    </svg>
  ),
  chem: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 3v6.5L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.5V3" />
      <path d="M9 3h6M7.5 14h9" />
    </svg>
  ),
  ielts: <span className="sh-glyph sh-word">IELTS</span>,
  toefl: <span className="sh-glyph sh-word">TOEFL</span>,
  hsk: <span className="sh-glyph">汉</span>,
};

const TICK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5 10 17.5 19 7" />
  </svg>
);

const tileStyle = (c) => ({ background: `linear-gradient(${c.c1},${c.c2})` });

export default function Shop({
  stars = 0,
  apples = 0,
  dailyStarsClaimed = false,
  dailyStars = 50,
  starsPerApple = 200,
  ownedDeckIds = [],
  onBack,
  onBuyCourse,
  onStudyCourse,
  onOpenVouchers,
  onTopUpStars,
  onClaimDailyStars,
  onTradeAppleForStars,
}) {
  const { pick } = useI18n();
  const [group, setGroup] = useState("all");
  const [open, setOpen] = useState(null);     /* the course in the detail sheet */
  const [poor, setPoor] = useState(null);     /* the key that just failed to buy */
  const [topUp, setTopUp] = useState(false);
  const [bought, setBought] = useState(null); /* the one just added, for the tick */

  const list = useMemo(
    () =>
      SHOP_COURSES.map((c) => ({
        ...c,
        owned: Boolean(c.deckId && ownedDeckIds.includes(c.deckId)),
        lessons: c.deckId ? lessonsFor(c.deckId === "grammar" ? "grammar" : c.deckId).length : 0,
      })),
    [ownedDeckIds]
  );

  const shown = group === "all" ? list : list.filter((c) => c.group === group);
  const ownedCount = list.filter((c) => c.owned).length;

  function buy(c) {
    if (c.owned || c.soon) return;
    if (stars < c.price) {
      setPoor(null);
      requestAnimationFrame(() => setPoor(c.k));
      return;
    }
    const ok = onBuyCourse && onBuyCourse(c.deckId, c.price);
    if (ok === false) return;
    setOpen(null);
    setBought(c.k);
    setTimeout(() => setBought(null), 2200);
  }

  return (
    <div className="sh-root">
      <div className="sh-wrap">
        <button type="button" className="sh-back" onClick={onBack}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 5l-6 7 6 7" />
          </svg>
          Back to learn
        </button>

        <header className="sh-head">
          <div>
            <span className="sh-eyebrow">Shop</span>
            <h1>Course shop</h1>
            <p>Nine courses, bought with stars. {ownedCount} in your library so far.</p>
          </div>

          <div className="sh-balance">
            <Star size={30} />
            <span>
              <b>{stars.toLocaleString()}</b>
              <i>Your stars</i>
            </span>
            <button type="button" className="sh-topup" onClick={() => setTopUp(true)}>
              Top up
            </button>
          </div>
        </header>

        <div className="sh-chips" role="tablist">
          {COURSE_GROUPS.map((g) => (
            <button key={g.id} type="button" role="tab" aria-selected={group === g.id}
                    className={"sh-chip" + (group === g.id ? " sh-on" : "")}
                    onClick={() => setGroup(g.id)}>
              {pick(g.label)}
            </button>
          ))}
        </div>

        <div className="sh-grid">
          {shown.map((c, i) => (
            <article key={c.k}
                     className={"sh-card" + (c.owned ? " sh-owned" : "") + (c.soon ? " sh-soon" : "")
                       + (poor === c.k ? " sh-poor" : "") + (bought === c.k ? " sh-justbought" : "")}
                     style={{ animationDelay: 0.04 * i + "s" }}>
              <button type="button" className="sh-face" onClick={() => setOpen(c)}
                      aria-label={`${pick(c.name)} — details`}>
                <span className="sh-tile" style={tileStyle(c)}>{ICONS[c.icon]}</span>
                <span className="sh-name">{pick(c.name)}</span>
                <span className="sh-meta">
                  {c.soon ? "Course in progress" : `${c.lessons} lessons · ${c.learners} learners`}
                </span>
              </button>

              <div className="sh-foot">
                {c.owned ? (
                  <>
                    <span className="sh-have">{TICK} In your library</span>
                    <button type="button" className="sh-btn sh-ghost" onClick={() => onStudyCourse && onStudyCourse(c.deckId)}>
                      Study
                    </button>
                  </>
                ) : c.soon ? (
                  <span className="sh-later">Coming soon</span>
                ) : (
                  <>
                    <span className="sh-price"><Star size={18} />{c.price}</span>
                    <button type="button" className="sh-btn" onClick={() => buy(c)}>Add</button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* apples buy money off a printed box — a different currency and a
            different shop, so it gets a pointer rather than a section */}
        <button type="button" className="sh-vouchers" onClick={onOpenVouchers}>
          <span className="sh-vart"><AppleMark size={30} /></span>
          <span className="sh-vtext">
            <b>Vouchers &amp; offers</b>
            <span>Spend the apples from your daily tasks on money off a printed box.</span>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ---------- the detail sheet ---------- */}
      {open && createPortal(
        <>
          <div className="sh-veil" onClick={() => setOpen(null)} />
          <div className="sh-sheetwrap" role="dialog" aria-modal="true" aria-label={pick(open.name)}>
            <div className="sh-sheet">
              <button className="sh-x" aria-label="Close" onClick={() => setOpen(null)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>

              <span className="sh-tile sh-big" style={tileStyle(open)}>{ICONS[open.icon]}</span>
              <h2>{pick(open.name)}</h2>
              <p className="sh-blurb">{pick(open.blurb)}</p>

              <ul className="sh-what">
                <li>{open.soon ? "Lessons being written" : `${open.lessons} lessons, each with worked examples`}</li>
                <li>Practice modes with unlimited attempts</li>
                <li>Timed exam and a printable certificate</li>
                <li>Both languages — English and Khmer</li>
              </ul>

              {open.owned ? (
                <button type="button" className="sh-cta" onClick={() => onStudyCourse && onStudyCourse(open.deckId)}>
                  Start studying
                </button>
              ) : open.soon ? (
                <p className="sh-note">
                  This one isn't ready to sell yet — the deck exists, the lessons don't. It'll appear here
                  the day the course does.
                </p>
              ) : stars < open.price ? (
                <>
                  <button type="button" className="sh-cta sh-dim" onClick={() => setTopUp(true)}>
                    <Star size={19} />
                    {open.price} — top up {(open.price - stars).toLocaleString()} more
                  </button>
                  <p className="sh-note">You have {stars.toLocaleString()} stars.</p>
                </>
              ) : (
                <button type="button" className="sh-cta" onClick={() => buy(open)}>
                  <Star size={19} />
                  Add for {open.price}
                </button>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      <StarShop
        open={topUp}
        stars={stars}
        apples={apples}
        dailyClaimed={dailyStarsClaimed}
        dailyStars={dailyStars}
        starsPerApple={starsPerApple}
        onClose={() => setTopUp(false)}
        onBuyPack={(pack) => onTopUpStars && onTopUpStars(pack.stars + pack.bonus, pack.k)}
        onClaimDaily={() => (onClaimDailyStars ? onClaimDailyStars() : 0)}
        onTradeApple={() => (onTradeAppleForStars ? onTradeAppleForStars() : 0)}
      />
    </div>
  );
}
