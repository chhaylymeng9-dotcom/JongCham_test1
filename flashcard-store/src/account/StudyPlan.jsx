import { useMemo, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { lessonsFor } from "../data/lessons.js";
import { addStudyPlan, getDailyGoal, getStudyPlans, removeStudyPlan, setDailyGoal } from "../storage.js";
import "./studyPlan.css";

/* ---------- StudyPlan ----------
Its own page, reached from More > Study plan in the Learn rail. It used to
be a tab inside the profile, under the avatar, the stats and the account
settings — a weekly plan has nothing to do with your email address, and
you had to scroll past all of it to change a day.

Everything here is real: the daily goal is the one Home and the Learn rail
read (storage.js's getDailyGoal), and saved plans persist through
addStudyPlan/removeStudyPlan. What the app does NOT do is remind you — no
notifications exist, so a plan is a commitment you keep, not an alarm.
--------------------------------- */

const GOALS = [
  { n: 10, label: "relaxed" },
  { n: 20, label: "steady" },
  { n: 40, label: "serious" },
  { n: 60, label: "intense" },
];

/* the real drill modes — see Practice.jsx's MODES, so a saved plan names
   something the app can actually run */
const MODES = [
  { id: "review", label: "Flip review" },
  { id: "quiz", label: "Multiple choice" },
  { id: "type", label: "Type the answer" },
  { id: "match", label: "Match pairs" },
];
const DAYS = [
  { k: "mon", label: "Mon" },
  { k: "tue", label: "Tue" },
  { k: "wed", label: "Wed" },
  { k: "thu", label: "Thu" },
  { k: "fri", label: "Fri" },
  { k: "sat", label: "Sat" },
  { k: "sun", label: "Sun" },
];
const CARD_PRESETS = [5, 10, 20, 30, 50];
/* a planning estimate, not a measurement — same spirit as Exam.jsx's
   SECONDS_PER_QUESTION, for self-paced review rather than a timed paper */
const SECONDS_PER_CARD = 30;
const minutesFor = (cards) => Math.max(1, Math.round((cards * SECONDS_PER_CARD) / 60));

export default function StudyPlan({ decks = [], onBack, onOpenPractice }) {
  const { pick } = useI18n();

  /* "Customize Set" decks have no course behind them, so nothing to plan */
  const studyDecks = useMemo(() => decks.filter((d) => !d.catalog?.customizable), [decks]);

  const [goal, setGoal] = useState(() => getDailyGoal());
  const [plans, setPlans] = useState(() => getStudyPlans());
  const [days, setDays] = useState(() => new Set());
  const [deckId, setDeckId] = useState(studyDecks[0]?.deckId ?? "");
  const [lesson, setLesson] = useState("all");
  const [mode, setMode] = useState("review");
  const [cards, setCards] = useState(10);
  const [justSaved, setJustSaved] = useState(null);

  const deck = studyDecks.find((d) => d.deckId === deckId) ?? null;
  const lessons = deck ? lessonsFor(deck.subject) : [];
  const planMinutes = minutesFor(cards);

  /* the week, as it currently stands: cards per day across every plan */
  const week = DAYS.map((d) => ({
    ...d,
    cards: plans.reduce((n, p) => n + (p.days.includes(d.k) ? p.cards : 0), 0),
  }));
  const weekTotal = week.reduce((n, d) => n + d.cards, 0);
  const busiest = Math.max(1, ...week.map((d) => d.cards));

  function chooseGoal(n) {
    setGoal(n);
    setDailyGoal(n);
  }
  function toggleDay(k) {
    setDays((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  }
  function quickDays(preset) {
    setDays(new Set(
      preset === "weekdays" ? ["mon", "tue", "wed", "thu", "fri"]
        : preset === "weekend" ? ["sat", "sun"]
        : preset === "everyday" ? DAYS.map((d) => d.k)
        : []
    ));
  }
  function save() {
    if (days.size === 0 || !deck) return;
    const lessonLabel = lesson === "all" ? "All lessons" : pick(lessons[Number(lesson)]?.title) || "A lesson";
    const entry = addStudyPlan({
      days: Array.from(days),
      deckId: deck.deckId,
      deckName: pick(deck.catalog?.name) || deck.subject,
      lessonLabel,
      mode,
      cards,
    });
    setPlans((p) => [...p, entry]);
    setDays(new Set());
    setJustSaved(entry.id);
    setTimeout(() => setJustSaved(null), 2200);
  }
  function remove(id) {
    removeStudyPlan(id);
    setPlans((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="sp-root">
      <div className="sp-wrap">
        <button type="button" className="sp-back" onClick={onBack}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 5l-6 7 6 7" />
          </svg>
          Back to learn
        </button>

        <header className="sp-head">
          <span className="sp-eyebrow">Study plan</span>
          <h1>When are you studying?</h1>
          <p>Set a daily goal, then say which days you sit down and what for. Nothing here nags you — it's the shape of your week, written down.</p>
        </header>

        {/* ---------- the week at a glance ---------- */}
        <section className="sp-card sp-week-card">
          <div className="sp-chead">
            <h2>Your week</h2>
            <span className="sp-when">
              {weekTotal > 0
                ? `${weekTotal} cards · about ${minutesFor(weekTotal)} minutes`
                : "Nothing planned yet"}
            </span>
          </div>
          <div className="sp-week">
            {week.map((d) => (
              <div key={d.k} className={"sp-day" + (d.cards ? " sp-has" : "")}>
                <span className="sp-bar" style={{ height: `${Math.max(6, (d.cards / busiest) * 100)}%` }} />
                <b>{d.cards || "—"}</b>
                <em>{d.label}</em>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- daily goal ---------- */}
        <section className="sp-card">
          <div className="sp-chead">
            <h2>Daily goal</h2>
            <span className="sp-when">about {minutesFor(goal)} minutes a day</span>
          </div>
          <p className="sp-note">How many cards you want to get through each day. The Learn view's goal bar counts against this.</p>
          <div className="sp-choices">
            {GOALS.map((g) => (
              <button key={g.n} type="button" className={"sp-choice" + (goal === g.n ? " sp-on" : "")}
                      onClick={() => chooseGoal(g.n)}>
                <b>{g.n}</b>
                <span>{g.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ---------- the builder ---------- */}
        <section className="sp-card">
          <div className="sp-chead">
            <h2>Add a plan</h2>
            <span className="sp-when">{cards} cards · about {planMinutes} min</span>
          </div>

          {studyDecks.length === 0 ? (
            <p className="sp-note">Activate a course deck first — a plan has to point at something to study.</p>
          ) : (
            <>
              <p className="sp-field-label">Which days?</p>
              <div className="sp-days">
                {DAYS.map((d) => (
                  <button key={d.k} type="button" className={"sp-pill" + (days.has(d.k) ? " sp-on" : "")}
                          onClick={() => toggleDay(d.k)}>
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="sp-quick">
                <button type="button" onClick={() => quickDays("weekdays")}>Mon–Fri</button>
                <button type="button" onClick={() => quickDays("weekend")}>Weekend</button>
                <button type="button" onClick={() => quickDays("everyday")}>Every day</button>
                <button type="button" onClick={() => quickDays("clear")}>Clear</button>
              </div>

              <div className="sp-two">
                <label className="sp-field">
                  <span>Subject</span>
                  <select value={deckId} onChange={(e) => { setDeckId(e.target.value); setLesson("all"); }}>
                    {studyDecks.map((d) => (
                      <option key={d.deckId} value={d.deckId}>{pick(d.catalog?.name) || d.subject}</option>
                    ))}
                  </select>
                </label>
                <label className="sp-field">
                  <span>Lesson</span>
                  <select value={lesson} onChange={(e) => setLesson(e.target.value)}>
                    <option value="all">All lessons · whatever is due</option>
                    {lessons.map((l, i) => (
                      <option key={l.id} value={i}>{pick(l.title)}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="sp-field">
                <span>Exercise</span>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                  {MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </label>

              <p className="sp-field-label">How many cards each day?</p>
              <div className="sp-days">
                {CARD_PRESETS.map((n) => (
                  <button key={n} type="button" className={"sp-pill" + (cards === n ? " sp-on" : "")}
                          onClick={() => setCards(n)}>
                    {n}
                  </button>
                ))}
              </div>

              <button type="button" className="sp-save" onClick={save} disabled={days.size === 0}>
                {days.size === 0 ? "Pick at least one day" : `Add plan · ${days.size} day${days.size === 1 ? "" : "s"} a week`}
              </button>
            </>
          )}
        </section>

        {/* ---------- what's saved ---------- */}
        {plans.length > 0 && (
          <section className="sp-card">
            <div className="sp-chead">
              <h2>Your plans</h2>
              <span className="sp-when">{plans.length} saved</span>
            </div>
            <ul className="sp-list">
              {plans.map((p) => (
                <li key={p.id} className={"sp-plan" + (justSaved === p.id ? " sp-fresh" : "")}>
                  <span className="sp-count"><b>{p.days.length}</b><em>days</em></span>
                  <span className="sp-plan-t">
                    <b>{p.deckName} · {p.cards} cards</b>
                    <span>
                      {DAYS.filter((d) => p.days.includes(d.k)).map((d) => d.label).join(", ")} · {p.lessonLabel} ·{" "}
                      {MODES.find((m) => m.id === p.mode)?.label}
                    </span>
                  </span>
                  {onOpenPractice && (
                    <button type="button" className="sp-go" onClick={onOpenPractice}>Practise</button>
                  )}
                  <button type="button" className="sp-remove" onClick={() => remove(p.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
