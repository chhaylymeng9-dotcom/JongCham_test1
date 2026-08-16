import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useI18n } from "../i18n.jsx";
import { cx } from "../ui.jsx";
import Reveal from "../components/Reveal.jsx";
import "./about.css";

/* ---------- About ----------
Ported from the supplied About mockup: polaroid-stack hero, story band
with its pull-quote and refusal note, three value cards, the dashed
timeline, a count-up numbers row, the team cards and the dark closing
CTA. All the bespoke styling lives in about.css, scoped under .ab-root
so nothing leaks onto the Tailwind-based rest of the app. The mockup's
.rv reveal script is replaced by wrapping blocks in the site's Reveal
component, and its nav/footer are dropped — the app already renders its
own header and footer around every page.

The two hero pills are in-page anchors (#story / #team) that smooth-
scroll via scrollIntoView (lenis only intercepts the wheel, and the
sticky app header is cleared with scroll-margin-top in the CSS); the
closing CTA buttons navigate through onNavigate to the customize and
contact pages.
--------------------------------- */

/* little right-arrow used inside the pill buttons */
function ArrowIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 15 13" fill="none" aria-hidden="true">
      <path d="M1 6.5h12M8.5 2l4.5 4.5L8.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* the green check that leads each "what we refuse to do" line */
function TickIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1 5l2.6 2.6L9 2" stroke="#2E9B70" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* value-card icons, one per belief */
function CardsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h7v13H4zM13 6h7v13h-7z" stroke="#B4573D" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6.5 10h2M15.5 10h2" stroke="#B4573D" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="#5B7CFA" strokeWidth="1.8" />
      <path d="M12 7.5v5l3 2" stroke="#5B7CFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="3.4" stroke="#2E9B70" strokeWidth="1.8" />
      <path d="M3 19c0-3.3 2.7-5.3 6-5.3 1.4 0 2.7.4 3.7 1" stroke="#2E9B70" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17.5 12.5v5M15 15h5" stroke="#2E9B70" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const VALUES = [
  { n: 1, bg: "#FBEEDC", Icon: CardsIcon },
  { n: 2, bg: "#E7EDFB", Icon: ClockIcon },
  { n: 3, bg: "#EAF7F1", Icon: PeopleIcon },
];

/* timeline milestones — the years are language-neutral, the copy comes
   from i18n. The last entry gets the filled "now" dot. */
const TIMELINE = [
  { yr: "2023", n: 1 },
  { yr: "2024", n: 2 },
  { yr: "2025", n: 3 },
  { yr: "2026", n: 4, now: true },
];

/* the numbers band — the last figure appends a localized suffix
   (" days" / its km equivalent) instead of a plain "+". */
const NUMS = [
  { n: 12400, suffix: "+", label: "about.num1" },
  { n: 2400, suffix: "+", label: "about.num2" },
  { n: 18, suffix: "", label: "about.num3" },
  { n: 4, suffixKey: "about.num4Suffix", label: "about.num4" },
];

/* team members — names stay in Latin script in both languages; the
   initials doubles as the avatar. */
const TEAM = [
  { initials: "SR", color: "#B4573D", name: "Sophea Ren" },
  { initials: "MP", color: "#5B7CFA", name: "Mony Pich" },
  { initials: "KL", color: "#2E9B70", name: "Kanha Lim" },
  { initials: "TN", color: "#D9A441", name: "Thida Nou" },
];

/* One figure of the numbers band — the same odometer the home page's
   CounterSection runs: each figure starts from a round base just below
   its target (12,400 counts up from 12,000, the small figures from zero)
   and eases up slowly over COUNT_MS with a cubic ease-out, each figure
   staggered by delayMs. !active parks it back at the base so the replay
   interval can re-run it. Reduced motion shows the final value
   immediately. */
const COUNT_MS = 5000;
const REPLAY_MS = 30000;

function baseFor(n) {
  return n >= 1000 ? Math.floor(n / 1000) * 1000 : 0;
}

function NumValue({ value, suffix, active, reduceMotion, delayMs = 0 }) {
  const base = baseFor(value);
  const [display, setDisplay] = useState(base);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    if (!active) {
      setDisplay(base);
      return;
    }
    let raf;
    const start = performance.now() + delayMs;
    const tick = (now) => {
      const p = Math.max(0, Math.min(1, (now - start) / COUNT_MS));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(base + (value - base) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduceMotion, value, base, delayMs]);

  return (
    <b>
      {display.toLocaleString("en-US")}
      {/* the "+" / " days" rides along small and raised, like the home
          page counter's suffix */}
      {suffix && <span>{suffix.trim()}</span>}
    </b>
  );
}

export default function About({ onNavigate }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  const numsRef = useRef(null);
  const [numsActive, setNumsActive] = useState(false);

  // The count runs like the home page counter: it fires when the numbers
  // band scrolls into view, then re-counts on a replay interval for as
  // long as the band stays on screen.
  useEffect(() => {
    if (reduceMotion) {
      setNumsActive(true);
      return;
    }
    const el = numsRef.current;
    if (!el) return;
    let timer;
    // park the figures back at their base for a frame, then let the count
    // run again — the double rAF makes sure the reset actually paints first
    const replay = () => {
      setNumsActive(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setNumsActive(true));
      });
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNumsActive(true);
          if (!timer) timer = setInterval(replay, REPLAY_MS);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [reduceMotion]);

  // in-page anchor jumps — lenis only intercepts the wheel, so the
  // browser's hash jump would snap instantly; scrollIntoView smooth keeps
  // the glide. scroll-margin-top in the CSS clears the sticky header.
  const scrollToId = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="ab-root">
      {/* ---------------- hero ---------------- */}
      <div className="ab-hero">
        <div className="ab-blob ab-a" aria-hidden="true" />
        <div className="ab-blob ab-b" aria-hidden="true" />
        <div className="ab-wrap ab-grid">
          <Reveal>
            <div className="ab-eyebrow">{t("about.hero.eyebrow")}</div>
            <h1>
              {t("about.hero.l1")}
              <br />
              {t("about.hero.l2")}
              <br />
              <span className="ab-mark">{t("about.hero.l3")}</span>
            </h1>
            <p className="ab-lede">{t("about.hero.lede")}</p>
            <div className="ab-ctarow">
              <a href="#story" onClick={(e) => scrollToId(e, "story")} className="ab-btn ab-ghost">
                {t("about.hero.story")}
              </a>
              <a href="#team" onClick={(e) => scrollToId(e, "team")} className="ab-btn">
                {t("about.hero.team")}
                <ArrowIcon />
              </a>
            </div>
          </Reveal>

          {/* three overlapping polaroids that fan further apart on hover */}
          <Reveal delay={0.15}>
            <div className="ab-stack">
              <div className="ab-polaroid ab-p1">
                <div className="ab-pic ab-a">
                  <div style={{ width: "70%" }}>
                    <div className="ab-miniline" />
                    <div className="ab-miniline" style={{ width: "60%" }} />
                    <div className="ab-miniline" style={{ width: "74%" }} />
                  </div>
                </div>
                <div className="ab-cap">{t("about.cap1")}</div>
              </div>
              <div className="ab-polaroid ab-p2">
                <span className="ab-tape" />
                <div className="ab-pic ab-b">
                  <svg width="66" height="66" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                    <rect x="12" y="8" width="34" height="46" rx="5" fill="#fff" stroke="#C3D0EE" strokeWidth="2" />
                    <rect x="19" y="18" width="20" height="3.4" rx="1.7" fill="#D7E0F4" />
                    <rect x="19" y="26" width="14" height="3.4" rx="1.7" fill="#D7E0F4" />
                    <rect x="19" y="34" width="18" height="3.4" rx="1.7" fill="#D7E0F4" />
                    <circle cx="45" cy="45" r="10" fill="#5B7CFA" />
                    <path d="M41 45l3 3 5-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="ab-cap">{t("about.cap2")}</div>
              </div>
              <div className="ab-polaroid ab-p3">
                <div className="ab-pic ab-c">
                  <svg width="60" height="60" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                    <circle cx="24" cy="24" r="9" stroke="#2E9B70" strokeWidth="2.4" />
                    <circle cx="42" cy="34" r="7" stroke="#2E9B70" strokeWidth="2.4" />
                    <path d="M8 50c0-7 7-11 16-11s16 4 16 11" stroke="#2E9B70" strokeWidth="2.4" strokeLinecap="round" />
                    <path d="M50 24v10M45 29h10" stroke="#2E9B70" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ab-cap">{t("about.cap3")}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ---------------- story ---------------- */}
      <section id="story" className="ab-band ab-section">
        <div className="ab-wrap ab-two">
          <Reveal>
            <div className="ab-eyebrow">{t("about.story.eyebrow")}</div>
            <h2>{t("about.story.title")}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="ab-story">
              <p>{t("about.story.p1")}</p>
              <div className="ab-pull">“{t("about.story.pull")}”</div>
              <p>{t("about.story.p2")}</p>
              <p>{t("about.story.p3")}</p>
              <div className="ab-note" style={{ marginTop: 30 }}>
                <h4>{t("about.story.noteTitle")}</h4>
                <ul>
                  {[1, 2, 3].map((n) => (
                    <li key={n}>
                      <span className="ab-tick">
                        <TickIcon />
                      </span>
                      {t(`about.story.refuse${n}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- values ----------------
          one full-screen band like the timeline below it; the promise
          strip under the cards fills the space the viewport leaves */}
      <section className="ab-full">
        <div className="ab-wrap">
          <Reveal>
            <div className="ab-eyebrow">{t("about.values.eyebrow")}</div>
            <h2>{t("about.values.title")}</h2>
          </Reveal>
          <div className="ab-vals">
            {VALUES.map((v, i) => (
              <Reveal key={v.n} delay={i * 0.09}>
                <div className="ab-val">
                  <div className="ab-ic" style={{ background: v.bg }}>
                    <v.Icon />
                  </div>
                  <h3>{t(`about.value${v.n}.title`)}</h3>
                  <p>{t(`about.value${v.n}.body`)}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* the extra content the one-screen layout has room for: a
              ruled strip with the standing promise and a way to hold
              us to it */}
          <Reveal delay={0.3}>
            <div className="ab-promise">
              <span className="ab-plabel">{t("about.values.promiseLabel")}</span>
              <p>{t("about.values.promise")}</p>
              <button type="button" className="ab-btn ab-ghost" onClick={() => onNavigate?.("contact")}>
                {t("about.values.promiseCta")}
                <ArrowIcon />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- timeline + numbers ---------------- */}
      {/* one full-screen band: the milestone rail and the count-up row
          below it, vertically centered as a single screen */}
      <section className="ab-band ab-full">
        <div className="ab-wrap">
          <div className="ab-two">
            <Reveal>
              <div className="ab-eyebrow">{t("about.timeline.eyebrow")}</div>
              <h2>{t("about.timeline.title")}</h2>
              <p style={{ marginTop: 16, maxWidth: "34ch" }}>{t("about.timeline.side")}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="ab-tl">
                {TIMELINE.map((m) => (
                  <div key={m.yr} className={cx("ab-tl-item", m.now && "ab-now")}>
                    <div className="ab-yr">{m.yr}</div>
                    <h4>{t(`about.tl${m.n}.title`)}</h4>
                    <p>{t(`about.tl${m.n}.body`)}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div ref={numsRef} className="ab-nums">
            {NUMS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="ab-num">
                  <NumValue
                    value={s.n}
                    suffix={s.suffixKey ? t(s.suffixKey) : s.suffix}
                    active={numsActive}
                    reduceMotion={reduceMotion}
                    delayMs={i * 150}
                  />
                  <span>{t(s.label)}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- team ---------------- */}
      <section id="team" className="ab-section">
        <div className="ab-wrap">
          <Reveal>
            <div className="ab-eyebrow">{t("about.team.eyebrow")}</div>
            <h2>{t("about.team.title")}</h2>
          </Reveal>
          <div className="ab-team">
            {TEAM.map((m, i) => (
              <Reveal key={m.initials} delay={i * 0.08}>
                <div className="ab-person">
                  <div className="ab-av" style={{ background: m.color }}>
                    {m.initials}
                  </div>
                  <div className="ab-nm">{m.name}</div>
                  <div className="ab-role">{t(`about.member${i + 1}.role`)}</div>
                  <p>{t(`about.member${i + 1}.body`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="ab-section" style={{ paddingTop: 24 }}>
        <div className="ab-wrap">
          <Reveal>
            <div className="ab-cta">
              <span className="ab-glow ab-g1" aria-hidden="true" />
              <span className="ab-glow ab-g2" aria-hidden="true" />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2>{t("about.cta.title")}</h2>
                <p>{t("about.cta.body")}</p>
                <div className="ab-row">
                  <button type="button" className="ab-btn" onClick={() => onNavigate?.("customize")}>
                    {t("about.cta.build")}
                    <ArrowIcon />
                  </button>
                  <button type="button" className="ab-btn ab-ghost" onClick={() => onNavigate?.("contact")}>
                    {t("about.cta.talk")}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
