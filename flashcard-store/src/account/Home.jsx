import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { cx } from "../ui.jsx";
import { formatStudyTime } from "./studyTime.js";
import "./dashboard.css";
import "./mysubjects.css";

/* ---------- Home ----------
The landing screen a signed-in student sees before diving into a specific
deck — ported from a supplied "Home with many subjects" mockup, using
real data throughout:

  - Greeting + date: real (time of day, session.name, today's date).
  - Hero: resumes the active deck's real next lesson, using its actual
    `minutes` estimate rather than an invented "cards left".
  - "Due today": a real (if minimal) spaced-repetition scheduler — see
    getDueCount/recordReview in storage.js and hasFixedBank in
    questions.js. Only subjects with a fixed question bank (not math,
    which generates items fresh on every draw) can have due cards.
    Answering a due item in Practice or Exam actually reschedules it
    (bankFor prioritizes due items when given a deckId) — this isn't a
    cosmetic counter next to an unrelated practice session.
  - "Day streak": a real calendar-day activity log (useStudyTimer.js
    calls logStudyDay() whenever a Lessons/Practice/Exam tab opens).
  - "Today's goal": a real persisted daily target (set from Profile's
    Study settings tab) against a real per-day answered-cards counter.
  - My subjects: the "My subjects" mockup panel — header with the deck
    count, filter chips and search over the deck cards — wired to the
    same deckSummaries the old strip used (see MySubjects below).

Dropped, not ported: "needs work" (no per-card mistake-frequency tracking
exists), the mockup's own deck-count switcher (1/3/12 decks), which
was demo-only scaffolding for previewing the mockup, not a real feature,
and the subjects mockup's shipping card (the app has no "on the way"
deck state for it to show).
--------------------------------- */

function CaretIcon() {
  return (
    <svg className="jd-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
function SignOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
function OrdersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 4 5v15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5l-2-3Z" />
      <path d="M4 5h16M9 9a3 3 0 0 0 6 0" />
    </svg>
  );
}
function TaskIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="m7 12 2.5 2.5L15 9" />
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
      <path d="M9 6v12" strokeDasharray="1.5 2.5" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
// Tree growth stage from the current streak length — same six tiers the
// old flame badge used (0 / <3 / <7 / <30 / <100 / 100+ days), so the
// switch to a tree didn't change what "day 30" or "day 100" mean anywhere
// else. Only the top tier (a mature, fruiting tree) grows apples — those
// are what feed the harvest panel below.
const LEAF = "#3F6B48";
const LEAF_LIGHT = "#5C8C63";
const TRUNK = "#7A5B42";
const SOIL = "#6B4F3A";
const SOIL_TOP = "#7A5B42";
// Reuses the store's own accent (grease) so the fruit reads as "on brand"
// rather than a generic clip-art red.
const APPLE = "#D65F42";
const APPLE_DARK = "#B94A30";
const STEM = "#5C4A33";

function treeTier(days) {
  if (days === 0) return 0;
  if (days < 3) return 1;
  if (days < 7) return 2;
  if (days < 30) return 3;
  if (days < 100) return 4;
  return 5;
}

function AppleGlyph({ x, y, r }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M0 ${-r * 0.62} c${-r * 0.5} ${-r * 0.5} ${-r * 1.15} ${-r * 0.05} ${-r * 1.02} ${r * 0.62} c${r * 0.1} ${r * 0.62} ${r * 0.5} ${r * 1.02} ${r * 1.02} ${r * 1.02} c${r * 0.52} 0 ${r * 0.92} ${-r * 0.4} ${r * 1.02} ${-r * 1.02} c${r * 0.13} ${-r * 0.67} ${-r * 0.52} ${-r * 1.12} ${-r * 1.02} ${-r * 0.62}Z`}
        fill={APPLE}
      />
      <path
        d={`M0 ${-r * 0.62} c${r * 0.5} ${-r * 0.5} ${r * 1.15} ${-r * 0.05} ${r * 1.02} ${r * 0.62} c${-r * 0.1} ${r * 0.62} ${-r * 0.5} ${r * 1.02} ${-r * 1.02} ${r * 1.02}Z`}
        fill={APPLE_DARK}
        opacity=".55"
      />
      <path d={`M0 ${-r * 0.62} v${-r * 0.55}`} stroke={STEM} strokeWidth={r * 0.24} strokeLinecap="round" />
      <path
        d={`M${r * 0.06} ${-r * 0.98} c${r * 0.5} ${-r * 0.3} ${r * 0.72} ${r * 0.04} ${r * 0.5} ${r * 0.34} c${-r * 0.4} ${r * 0.12} ${-r * 0.7} ${-r * 0.06} ${-r * 0.5} ${-r * 0.34}Z`}
        fill={LEAF}
      />
    </g>
  );
}

function TreeIcon({ days, size = 22 }) {
  const tier = treeTier(days);
  const h = Math.round((size * 56) / 64);

  let body = (
    <>
      <ellipse cx="32" cy="44" rx="5.4" ry="4" fill={SOIL_TOP} />
      <path d="M32 44 v-4" stroke={LEAF} strokeWidth="2" strokeLinecap="round" />
      <path d="M32 40.5 c-1.6 -1.4 -3.4 -1.2 -4.4 .6 1.8 1 3.3 .7 4.4 -.6Z" fill={LEAF} />
    </>
  );
  if (tier === 2) {
    body = (
      <>
        <path d="M32 46 V32" stroke={LEAF} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M32 36 c-4 -3 -7.5 -2.4 -9.5 1.6 4 2.2 7.4 1.4 9.5 -1.6Z" fill={LEAF} />
        <path d="M32 33 c4 -3.2 7.6 -2.6 9.6 1.4 -4 2.3 -7.5 1.5 -9.6 -1.4Z" fill={LEAF_LIGHT} />
      </>
    );
  } else if (tier === 3) {
    body = (
      <>
        <path d="M32 46 V22" stroke={LEAF} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M32 38 c-5 -3.6 -9 -3 -11.4 1.8 4.8 2.7 8.9 1.8 11.4 -1.8Z" fill={LEAF} />
        <path d="M32 33 c5 -3.6 9 -3 11.4 1.8 -4.8 2.7 -8.9 1.8 -11.4 -1.8Z" fill={LEAF_LIGHT} />
        <path d="M32 27 c-4.4 -3 -8 -2.4 -10 1.6 4.2 2.4 7.8 1.6 10 -1.6Z" fill={LEAF} />
      </>
    );
  } else if (tier >= 4) {
    body = (
      <>
        <path d="M32 46 V26" stroke={TRUNK} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M32 34 l-6 -5 M32 30 l6.5 -5.5" stroke={TRUNK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <ellipse cx="23.5" cy="23" rx="9.4" ry="7.4" fill={LEAF} />
        <ellipse cx="41" cy="21.5" rx="9" ry="7" fill={LEAF} />
        <ellipse cx="32" cy="18" rx="12.4" ry="9.6" fill={LEAF_LIGHT} />
        {tier === 5 && <ellipse cx="32" cy="14" rx="13" ry="9.4" fill={LEAF_LIGHT} opacity=".85" />}
        {tier === 5 && (
          <>
            <AppleGlyph x={24.5} y={21.5} r={2.9} />
            <AppleGlyph x={39} y={18.5} r={2.6} />
            <AppleGlyph x={32} y={26} r={2.4} />
          </>
        )}
      </>
    );
  }

  return (
    <svg width={size} height={h} viewBox="0 0 64 56" aria-hidden="true">
      {body}
      <path d="M8 46 q24 -5 48 0 v6 q-24 5 -48 0 Z" fill={SOIL} />
      <path d="M8 46 q24 -5 48 0 q-24 4 -48 0 Z" fill={SOIL_TOP} />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const SPINE_COLOR = { grammar: "#2C4032", math: "#8C5A46", history: "#9A7B32", blank: "#5E7A86", physics: "#3B5B8C", chemistry: "#5B3B8C" };
const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

// Monday-start week containing today, flagged against the real
// study-day log — see getStudyDays() in storage.js.
function buildWeek(studyDays) {
  const studied = new Set(studyDays);
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const mondayOffset = now.getDay() === 0 ? -6 : 1 - now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  return WEEKDAY_LABELS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return { key, label, on: studied.has(key), isToday: key === todayKey };
  });
}

/* ---------- My subjects ----------
Ported from the supplied "My subjects" mockup — replaces Home's old
six-card .jmd-deck strip with the full panel: title + deck-count pill,
"Build a deck" button, filter chips and search in the toolbar, and the
responsive grid of deck cards (status pills, animated progress fills,
certificate strip, action buttons, the dashed add card) plus the
no-matches empty state. All of it runs on the real deckSummaries from
Account.jsx — chips carry live per-state counts, search matches the
localized deck name, "mastered" is pct of capacity, and the certificate
strip appears only when the deck actually has one. The mockup's shipping
card was dropped: summarizeDeck only derives now/done/new, there is no
"on the way" state to show. All styling lives in mysubjects.css scoped
under .ms-root.
--------------------------------- */

// Status pill classes/labels per deck state (see summarizeDeck).
const MS_STATUS = {
  now: { cls: "ms-s-live", label: "In progress" },
  done: { cls: "ms-s-done", label: "Finished" },
  new: { cls: "ms-s-new", label: "Not started" },
};
// progress-fill gradient per state: green while studying, gold when
// finished, blue for a deck that hasn't started
const MS_FILL = { now: "ms-g", done: "ms-y", new: "ms-b" };
// tint pairs for the 38px subject icon tile, keyed like SPINE_COLOR
const MS_ICON_TINT = {
  grammar: { bg: "#EAF2EC", fg: "#2C4032" },
  math: { bg: "#FBEEDC", fg: "#B4573D" },
  history: { bg: "#FBF1DC", fg: "#9A7B32" },
  blank: { bg: "#EDF1FC", fg: "#5E7A86" },
  physics: { bg: "#EDF1FC", fg: "#3B5B8C" },
  chemistry: { bg: "#F2ECFB", fg: "#5B3B8C" },
};

/* the little stroke glyph inside the subject tile */
function SubjectGlyph({ subject, color }) {
  const p = { stroke: color, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  if (subject === "math") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h6M7 4v6M14.5 6.5h5M14 16l4 4M18 16l-4 4M5 17h6" {...p} strokeWidth="1.9" />
      </svg>
    );
  }
  if (subject === "chemistry") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="2.4" fill={color} />
        <ellipse cx="12" cy="12" rx="9" ry="4" {...p} strokeWidth="1.7" />
        <ellipse cx="12" cy="12" rx="9" ry="4" {...p} strokeWidth="1.7" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="4" {...p} strokeWidth="1.7" transform="rotate(120 12 12)" />
      </svg>
    );
  }
  if (subject === "physics") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4.6" {...p} strokeWidth="1.7" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3" {...p} strokeWidth="1.5" transform="rotate(-18 12 12)" />
      </svg>
    );
  }
  if (subject === "history") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 21h16M6 21V10M10 21V10M14 21V10M18 21V10M4 10l8-6 8 6z" {...p} strokeWidth="1.7" />
      </svg>
    );
  }
  if (subject === "blank") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20l1-4L16.5 4.5a2.12 2.12 0 0 1 3 3L8 19l-4 1z" {...p} strokeWidth="1.7" />
      </svg>
    );
  }
  // grammar (default): an open book, from the mockup
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5h6c1 0 2 .8 2 2V19c0-1-.9-1.8-2-1.8H4zM20 5.5h-6c-1 0-2 .8-2 2V19c0-1 .9-1.8 2-1.8h6z" {...p} strokeWidth="1.7" />
    </svg>
  );
}

/* toolbar + card icons, mostly lifted straight from the mockup */
function MsPlusIcon({ color = "#fff" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
function MsSearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="#16130F" strokeWidth="1.6" />
      <path d="M11 11l4 4" stroke="#16130F" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function MsLessonsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 4h5.5c.8 0 1.5.7 1.5 1.5V15c0-.8-.7-1.5-1.5-1.5H3zM15 4H9.5C8.7 4 8 4.7 8 5.5V15c0-.8.7-1.5 1.5-1.5H15z" stroke="#16130F" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function MsExamIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 2.5h10v13H4z" stroke="#16130F" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6.5 7h5M6.5 10.5h3" stroke="#16130F" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function MsSealIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7l3.2 3.2L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MsClockHint() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.6" stroke="#A29B87" strokeWidth="1.3" />
      <path d="M6 3.6V6l1.7 1.1" stroke="#A29B87" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function MsStarHint() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 1.5l1.4 3 3.1.4-2.3 2.2.6 3.1L6 8.7 3.2 10.2l.6-3.1L1.5 4.9l3.1-.4z" stroke="#A29B87" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
function MsEmptyIcon() {
  return (
    <svg width="46" height="46" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.35 }} aria-hidden="true">
      <rect x="8" y="10" width="20" height="28" rx="3" stroke="#8E8877" strokeWidth="2" />
      <rect x="20" y="10" width="20" height="28" rx="3" stroke="#8E8877" strokeWidth="2" fill="#EDF4F2" />
      <path d="M25 20h10M25 26h6" stroke="#8E8877" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MySubjects({ deckSummaries, onOpenDeck, onBuildDeck }) {
  const { pick } = useI18n();
  const [filter, setFilter] = useState("all");
  const [term, setTerm] = useState("");
  // The progress fills animate in like the mockup's rAF+timeout: they
  // render at width 0, then ease out to their real percentage shortly
  // after mount. Reduced motion kills the transition in the CSS, so the
  // same flip just lands them instantly.
  const [fillsOn, setFillsOn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setFillsOn(true), 120);
    return () => clearTimeout(id);
  }, []);

  // chips carry live counts — "all" plus one per state summarizeDeck
  // derives (no Shipping chip: that state doesn't exist in the app)
  const counts = {
    all: deckSummaries.length,
    now: deckSummaries.filter((d) => d.state === "now").length,
    done: deckSummaries.filter((d) => d.state === "done").length,
    new: deckSummaries.filter((d) => d.state === "new").length,
  };
  const chips = [
    { id: "all", label: "All" },
    { id: "now", label: "In progress" },
    { id: "done", label: "Finished" },
    { id: "new", label: "Not started" },
  ];

  // same double filter the mockup's apply() ran: chip AND search term
  const q = term.trim().toLowerCase();
  const visible = deckSummaries.filter(
    (d) => (filter === "all" || d.state === filter) && (!q || pick(d.catalog.name).toLowerCase().includes(q))
  );

  return (
    <section className="ms-root">
      <div className="ms-panel">
        <div className="ms-phead">
          <div className="ms-ptop">
            <div>
              <div className="ms-ptitle">
                <h2>My subjects</h2>
                <span className="ms-count">
                  {deckSummaries.length} {deckSummaries.length === 1 ? "deck" : "decks"}
                </span>
              </div>
              <p>Everything you've built or unlocked. Pick one up where you left off.</p>
            </div>
            {onBuildDeck && (
              <button type="button" className="ms-btn" onClick={onBuildDeck}>
                <MsPlusIcon />
                Build a deck
              </button>
            )}
          </div>

          <div className="ms-tools">
            <div className="ms-chips">
              {chips.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={cx("ms-chip", filter === c.id && "ms-on")}
                  aria-pressed={filter === c.id}
                  onClick={() => setFilter(c.id)}
                >
                  {c.label} <span className="ms-n">{counts[c.id]}</span>
                </button>
              ))}
            </div>
            <div className="ms-search">
              <MsSearchIcon />
              <input
                type="text"
                placeholder="Search subjects…"
                autoComplete="off"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="ms-empty">
            <MsEmptyIcon />
            <b>No subjects match that</b>
            <p>Try a different filter, or build a deck for it.</p>
          </div>
        ) : (
          <div className="ms-grid">
            {visible.map((d) => {
              const tint = MS_ICON_TINT[d.subject] ?? { bg: "#F3F1EB", fg: "#7A7464" };
              const status = MS_STATUS[d.state];
              const mastered = Math.round((d.pct / 100) * d.capacity);
              const open = (tab) => onOpenDeck(d.deckId, tab);
              return (
                <article key={d.deckId} className="ms-deck" style={{ "--ms-c": SPINE_COLOR[d.subject] ?? "#5E7A86" }}>
                  <div className="ms-spine" />
                  <div className="ms-deck-in">
                    <div className="ms-dhead">
                      <div className="ms-icon" style={{ background: tint.bg }}>
                        <SubjectGlyph subject={d.subject} color={tint.fg} />
                      </div>
                      <div className="ms-dname">
                        <h3>{pick(d.catalog.name)}</h3>
                        <div className="ms-dmeta">
                          {d.capacity} cards · {d.isCustom ? "Your own deck" : `${d.totalLessons} lessons`}
                          <span className="ms-code">{d.code}</span>
                        </div>
                      </div>
                    </div>
                    <span className={cx("ms-status", status.cls)}>
                      <span className="ms-d" />
                      {status.label}
                    </span>

                    <div className="ms-prog">
                      <div className="ms-prow">
                        <span>
                          {d.state === "new" ? "Nothing mastered yet" : `${mastered} of ${d.capacity} cards mastered`}
                        </span>
                        <b>{d.pct}%</b>
                      </div>
                      <div className="ms-bar">
                        <span className={cx("ms-fill", MS_FILL[d.state])} style={{ width: fillsOn ? `${d.pct}%` : 0 }} />
                      </div>
                      {d.state === "new" && (
                        <div className="ms-hint">
                          <MsStarHint />
                          {d.isCustom ? "Add your first cards to get started" : "Start with your first lesson"}
                        </div>
                      )}
                      {d.state === "now" && (
                        <div className="ms-hint">
                          <MsClockHint />
                          {d.isCustom
                            ? `${mastered} of ${d.capacity} cards written`
                            : `${d.doneCount} of ${d.totalLessons} lessons done`}
                        </div>
                      )}
                    </div>

                    {/* the gold strip only exists for decks that actually
                        earned a certificate — see summarizeDeck's hasCert */}
                    {d.hasCert && (
                      <div className="ms-cert">
                        <span className="ms-sl">
                          <MsSealIcon />
                        </span>
                        <span>Certificate earned</span>
                        <button type="button" onClick={() => open("certificates")}>
                          View
                        </button>
                      </div>
                    )}

                    <div className="ms-acts">
                      {d.state === "done" ? (
                        <button type="button" className="ms-btn ms-sm ms-ghost" onClick={() => open()}>
                          Revise again
                        </button>
                      ) : (
                        <button type="button" className="ms-btn ms-sm" onClick={() => open()}>
                          {d.state === "new"
                            ? d.isCustom
                              ? "Start designing"
                              : "Start studying"
                            : d.isCustom
                            ? "Continue designing"
                            : "Continue studying"}
                        </button>
                      )}
                      {d.isCustom ? (
                        <button type="button" className="ms-iconbtn" data-tip="Design" onClick={() => open("design")}>
                          <MsLessonsIcon />
                        </button>
                      ) : (
                        <>
                          <button type="button" className="ms-iconbtn" data-tip="Lessons" onClick={() => open("lessons")}>
                            <MsLessonsIcon />
                          </button>
                          {d.state === "now" && (
                            <button type="button" className="ms-iconbtn" data-tip="Exam" onClick={() => open("exam")}>
                              <MsExamIcon />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {/* the dashed add card hides while searching, like the mockup */}
            {!q && onBuildDeck && (
              <button type="button" className="ms-add" onClick={onBuildDeck}>
                <span className="ms-plus">
                  <MsPlusIcon color="#16130F" />
                </span>
                <b>Build a new deck</b>
                <small>Write both sides, pick your stock, we print and post it.</small>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home({
  session,
  deckName,
  isCustomizable,
  activeLessons,
  activeDone,
  activeNext,
  activeAllDone,
  deckSummaries,
  studySeconds,
  dueByDeck,
  streak,
  studyDays,
  dailyGoal,
  cardsToday,
  onContinue,
  onOpenDeck,
  onReviewDue,
  onSeeAllDecks,
  onOpenProfile,
  onOpenDailyTasks,
  onOpenVouchers,
  onGoToOrders,
  onBuildDeck,
  onSignOut,
}) {
  const { pick } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickAway(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [menuOpen]);

  const initial = (session.name || "?").trim().charAt(0).toUpperCase() || "?";
  const firstName = (session.name || "").trim().split(/\s+/)[0] || "there";
  const hour = new Date().getHours();
  const period = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  let heroLabel = "Pick up where you left off";
  let heroTitle = deckName;
  let heroSub = "";
  let heroBtn = "Continue";
  if (isCustomizable) {
    heroSub = "Keep building your own deck, card by card.";
    heroBtn = "Continue designing";
  } else if (activeLessons.length === 0) {
    heroLabel = "Your deck";
    heroSub = "This deck's course isn't available yet.";
    heroBtn = "Open deck";
  } else if (activeAllDone) {
    heroLabel = "Course complete";
    heroSub = "Review any lesson, or head to the exam.";
    heroBtn = "Go to exam";
  } else {
    const lessonNum = activeLessons.indexOf(activeNext) + 1;
    heroTitle = `${deckName} · Lesson ${lessonNum}`;
    heroSub = `${pick(activeNext.title)} · about ${activeNext.minutes} minute${activeNext.minutes === 1 ? "" : "s"}`;
    heroBtn = activeDone === 0 ? `Start lesson ${lessonNum}` : `Continue lesson ${lessonNum}`;
  }

  const totalDue = dueByDeck.reduce((n, d) => n + d.dueCount, 0);
  const week = buildWeek(studyDays);
  const goalPct = Math.min(100, Math.round((cardsToday / dailyGoal) * 100));

  return (
    <div className="jd-root" ref={rootRef}>
      <div className="jd-wrap">
        <div className="jd-account">
          <button
            type="button"
            className={`jd-chip${menuOpen ? " jd-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span className="jd-avatar">{initial}</span>
            {firstName}
            <CaretIcon />
          </button>

          <div className={`jd-menu${menuOpen ? " jd-open" : ""}`} role="menu">
            <div className="jd-who">
              <span className="jd-avatar">{initial}</span>
              <div>
                <h5>{session.name}</h5>
                <span>{session.email}</span>
              </div>
            </div>
            {onOpenProfile && (
              <button type="button" role="menuitem" onClick={onOpenProfile}>
                <ProfileIcon />
                My profile
              </button>
            )}
            {onGoToOrders && (
              <button type="button" role="menuitem" onClick={onGoToOrders}>
                <OrdersIcon />
                My orders
              </button>
            )}
            {onOpenDailyTasks && (
              <button type="button" role="menuitem" onClick={onOpenDailyTasks}>
                <TaskIcon />
                Daily tasks
              </button>
            )}
            {onOpenVouchers && (
              <button type="button" role="menuitem" onClick={onOpenVouchers}>
                <TicketIcon />
                Vouchers
              </button>
            )}
            <hr />
            <button type="button" role="menuitem" className="jd-danger" onClick={onSignOut}>
              <SignOutIcon />
              Sign out
            </button>
          </div>
        </div>

        <div className="jd-head" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span className="jd-label">Welcome back</span>
            <h1 className="jd-title">
              Good {period}, {firstName}
            </h1>
          </div>
          <span className="jd-code" style={{ marginTop: 0 }}>{today}</span>
        </div>

        <section className="jd-continue">
          <span className="jd-label">{heroLabel}</span>
          <h3>{heroTitle}</h3>
          <p>{heroSub}</p>
          <button type="button" className="jd-cbtn" onClick={onContinue}>
            <PlayIcon />
            <span>{heroBtn}</span>
          </button>

          <hr className="jd-hrule" />

          <div className="jd-today">
            <div className="jd-todaycol">
              <span className="jd-label">Study time</span>
              <div className="jd-svalue">{formatStudyTime(studySeconds)}</div>
              <p className="jd-ssub">on Lessons, Practice and Exam</p>
            </div>

            <div className="jd-tdiv" />

            <div className="jd-todaycol">
              <span className="jd-label">Today's goal</span>
              <div className="jd-gtop">
                <span>
                  {cardsToday >= dailyGoal
                    ? "Goal reached for today."
                    : `${dailyGoal - cardsToday} more card${dailyGoal - cardsToday === 1 ? "" : "s"} to go.`}
                </span>
                <b>
                  {cardsToday} / {dailyGoal}
                </b>
              </div>
              <div className="jd-gbar">
                <i style={{ width: `${goalPct}%` }} />
              </div>
              <div className="jd-facts">
                <div>
                  <b>{totalDue}</b>cards due today
                </div>
                <div>
                  <b>{deckSummaries.length}</b>{deckSummaries.length === 1 ? "deck" : "decks"}
                </div>
              </div>
            </div>

            <div className="jd-tdiv" />

            <div className="jd-todaycol">
              <span className="jd-label">Day streak</span>
              <div className="jd-srow">
                <span className="jd-treeslot">
                  <TreeIcon days={streak.current} size={64} />
                </span>
                <div>
                  <b>
                    {streak.current} day{streak.current === 1 ? "" : "s"}
                  </b>
                  <span>
                    Best {streak.best} day{streak.best === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
              <div className="jd-heroweek">
                {week.map((d) => (
                  <div key={d.key}>
                    <em>{d.label}</em>
                    <div className={`jd-hdot${d.on ? " jd-on" : ""}${!d.on && d.isToday ? " jd-today" : ""}`}>
                      {d.on ? <CheckIcon /> : d.isToday ? "·" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <main>
          {dueByDeck.length > 0 && (
            <section className="jd-panel">
              <div className="jd-panel-head">
                <h3>Due today</h3>
                <span className="jd-meta">
                  {totalDue} card{totalDue === 1 ? "" : "s"} · {dueByDeck.length} deck{dueByDeck.length === 1 ? "" : "s"}
                </span>
              </div>
              <div>
                {dueByDeck.map((d) => (
                  <div key={d.deckId} className="jd-due-row">
                    <span className="jd-spine" style={{ background: SPINE_COLOR[d.subject] ?? "#5E7A86" }} />
                    <span className="jd-t">
                      <b>{d.name}</b>
                    </span>
                    <span className="jd-n">{d.dueCount}</span>
                  </div>
                ))}
              </div>
              <div className="jd-panel-body" style={{ borderTop: "1px solid var(--hair)" }}>
                <button type="button" className="jd-ubtn jd-solid" style={{ width: "100%" }} onClick={() => onReviewDue(dueByDeck[0].deckId)}>
                  Review {dueByDeck[0].name} · {dueByDeck[0].dueCount} due
                </button>
              </div>
            </section>
          )}


          {/* the "My subjects" mockup panel — filter chips, search and the
              full deck-card grid, wired to the same deckSummaries the old
              six-card strip used (component defined above) */}
          <MySubjects deckSummaries={deckSummaries} onOpenDeck={onOpenDeck} onBuildDeck={onBuildDeck} />
        </main>
      </div>
    </div>
  );
}
