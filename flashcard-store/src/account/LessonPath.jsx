import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../i18n.jsx";
import FocusJourney from "../components/FocusJourney";
import PomoStatusBox from "../components/PomoStatusBox";
import CoursePicker, { StarsPill } from "../components/CoursePicker";
import LessonChat from "./LessonChat.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import { friendStandings, lastWeekStandings, leagueIndexFor, weekStandings } from "../data/leaderboardDemo.js";
import { PANDA } from "./panda.js";
import "./lessonPath.css";

/* ---------- LessonPath ----------
Faithful port of the standalone "Lesson path" prototype, now the account
home screen. The visuals are untouched — node sizes, offsets, scenery,
trail, mascot, popovers — only the data is real: lessons and completion
from storage, apples from the harvest, and the buttons navigate the app
instead of the prototype's demo steps.

The prototype's render script was lost (the original paste was truncated),
so the interaction below reconstructs it from the captured CSS: nodes in
done/now/lock states, a dotted trail through their centres with the walked
part drawn solid, a START bubble and progress ring on the current node,
and one popover card open at a time.
--------------------------------- */

/* the winding: mirrors the prototype's STEPS offsets for four lessons —
   lesson, lesson, chest, lesson, lesson, chest, exam */
const OFFS = [0, -2, -3, 0, 2, 3, -2];

function LessonStar({ percent = 0, id }) {
  const v = Math.max(0, Math.min(1, percent / 100));
  const gid = "star-" + id;
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true" className="done-star">
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="0" y2="0">
          <stop offset={v} stopColor="#F2C33C" />
          <stop offset={v} stopColor="#D8D2C6" />
        </linearGradient>
      </defs>
      <path d="M12 2 15 8.5 22 9.5 17 14.5 18.2 21.5 12 18.2 5.8 21.5 7 14.5 2 9.5 9 8.5Z"
            fill={`url(#${gid})`} stroke="#1F1D18" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = {
  lesson: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z" />
    </svg>
  ),
  chest: (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10a9 9 0 0 1 18 0v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
      <path d="M3 13h18" strokeLinecap="round" />
      <rect x="10" y="11.5" width="4" height="4.5" rx="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  exam: (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5 7 22l5-2.5L17 22l-1.5-8.5" />
    </svg>
  ),
  lock: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
};

/* the right rail's own small icons — a flame, an apple and a tick */
const RAIL_ICONS = {
  streak: (
    <svg width="20" height="21" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 13h2v9h-2z" fill="#8C5A46" />
      <circle cx="12" cy="9" r="7.5" fill="#5FA96D" />
      <circle cx="8.5" cy="8" r="1.3" fill="#B8433F" />
      <circle cx="15" cy="10.5" r="1.3" fill="#B8433F" />
    </svg>
  ),
  done: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#3E5F48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.4 2.4 4.6-4.9" />
    </svg>
  ),
  tasks: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="#D9A22F" aria-hidden="true">
      <path d="M13.5 2 4 13.6h6L9.5 22 20 10.2h-6.6z" />
    </svg>
  )
};

/* small stroke icons for the left rail — one per sidebar destination */
const SIDE_ICONS = {
  learn: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11 12 3l9 8" />
      <path d="M5.5 9.5V21h13V9.5" />
    </svg>
  ),
  lessons: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 6.5C10 4.8 7.3 4.2 4 4.5V19c3.3-.3 6 .3 8 2 2-1.7 4.7-2.3 8-2V4.5c-3.3-.3-6 .3-8 2Z" />
      <path d="M12 6.5V21" />
    </svg>
  ),
  practice: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  exam: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5 7 22l5-2.5L17 22l-1.5-8.5" />
    </svg>
  ),
  cert: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M10.8 12.2 10 17l2-1.2L14 17l-.8-4.8" />
    </svg>
  ),
  quests: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 21V4" />
      <path d="M5 5c3.2-1.6 5.8 1.6 9.3 0l.7 8c-3.5 1.6-6.1-1.6-9.3 0" />
    </svg>
  ),
  shop: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 8h13l-1 12.5h-11L5.5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  ),
  cart: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 5H6l2.2 11h9.9L20.5 8H7" />
      <circle cx="9.7" cy="20" r="1.6" />
      <circle cx="16.7" cy="20" r="1.6" />
    </svg>
  ),
  profile: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.4-3.2 4.2-4.8 7.5-4.8s6.1 1.6 7.5 4.8" />
    </svg>
  ),
  pomo: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  more: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="2.1" />
      <circle cx="12" cy="12" r="2.1" />
      <circle cx="19" cy="12" r="2.1" />
    </svg>
  ),
  leaderboard: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 21v-7M12 21V9M19 21v-4" />
      <path d="M9 6.5 12 3l3 3.5" />
    </svg>
  ),
  study: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 20h18" />
      <path d="M6 20v-6M12 20V8M18 20v-9" />
    </svg>
  ),
};

/* the course picker's catalogue — one entry per deck this store actually
   sells (see DECK_BY_ID in data/decks.js). `k` is the real deckId, so
   CoursePicker's onSelect/onBuy keys straight into session.decks with no
   translation table; `on` is filled in per-render from what's owned.
   Tile colours are the same accents DECK_BY_ID/DECK_COLOR use elsewhere
   (Store.jsx swatches, ReviewsRail), just paired with a lighter tint. */
const COURSE_SUBJECTS = [
  { k: "math", n: "Math", c1: "#D69A6E", c2: "#8C5A46", learners: "9.4k",
    g: (<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6.6h6v1.8H4Zm0 3.2h6v1.8H4ZM6.1 15h1.8v2H10v1.8H7.9v2H6.1v-2H4V17h2.1ZM14 6.6h6v1.8h-6Zm.6 8.2 1.3-1.3 1.6 1.6 1.6-1.6 1.3 1.3-1.6 1.6 1.6 1.6-1.3 1.3-1.6-1.6-1.6 1.6-1.3-1.3 1.6-1.6Z" /></svg>) },
  { k: "grammar", n: "English", c1: "#5FA96D", c2: "#2C4032", learners: "11.2k",
    g: (<span className="glyph">Aa</span>) },
  { k: "history", n: "History", c1: "#D6B96E", c2: "#9A7B32", learners: "5.8k",
    g: (<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M2.5 8 12 3.5 21.5 8" /><path d="M5 9v8M9.6 9v8M14.4 9v8M19 9v8" /><path d="M3 20.5h18" /></svg>) },
  // No "chemistry" entry: DECK_BY_ID lists it as a real store item, but
  // data/lessons.js's COURSES has no chemistry curriculum — buying it
  // here left the course with 0 lessons, which crashed Dashboard.jsx's
  // Lessons tab reading a lesson's .title off nothing.
  { k: "physics", n: "Physics", c1: "#6F97D6", c2: "#3B5B8C", learners: "4.6k",
    g: (<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" /><ellipse cx="12" cy="12" rx="10" ry="4.4" /><ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(120 12 12)" /></svg>) },
];
const COURSE_PRICE = 300;

function buildSteps(lessons, completed, deckName, pick, t) {
  const steps = [];
  let nowAssigned = false;

  lessons.forEach((l, i) => {
    const done = Boolean(completed[l.id]);
    const state = done ? "done" : !nowAssigned ? "now" : "lock";
    if (!done && !nowAssigned) nowAssigned = true;
    steps.push({ k: "lesson", lesson: l, state, n: t("lessonSheet.lessonOrdinal", { n: i + 1 }), h: pick(l.title) });

    // a reward chest after every pair of lessons, opening once both are done
    if (i % 2 === 1) {
      const pairDone = Boolean(completed[lessons[i - 1].id]) && done;
      steps.push({
        k: "chest",
        state: pairDone ? "done" : "lock",
        n: t("lp.reward"),
        h: t("lp.appleChest"),
      });
    }
  });

  const allDone = lessons.length > 0 && lessons.every((l) => completed[l.id]);
  steps.push({ k: "exam", state: allDone ? "now" : "lock", n: t("lp.unitExam"), h: deckName });

  steps.forEach((s, i) => {
    s.off = OFFS[i] ?? (i % 2 === 0 ? 0 : i % 4 === 1 ? -2 : 2);
  });
  return steps;
}

/* the dotted trail: a smooth curve through the node centres */
function curve(pts) {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = Math.round((pts[i].x + pts[i + 1].x) / 2);
    const yc = Math.round((pts[i].y + pts[i + 1].y) / 2);
    d += ` Q ${pts[i].x} ${pts[i].y} ${xc} ${yc}`;
  }
  const last = pts[pts.length - 1];
  d += ` Q ${last.x} ${last.y} ${last.x} ${last.y}`;
  return d;
}

const RING_R = 70;
const RING_C = 2 * Math.PI * RING_R;

/* the Pomo mode modal: a plain frame around FocusJourney, which draws
   its own back (←) and close (✕) buttons. Portalled to <body> so no
   ancestor overflow/transform clips it and the page's .lp-root-scoped
   rules (.cap, .card, …) can't leak into FocusJourney's own class names.
   With onStart, tearing the ticket hands the session over to the status
   box in the rail and closes this modal by itself; without it, unmounting
   is what stops the timer — never hide it while mounted. */
function PomoModal({ open, onClose, onStart }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="pomo-veil" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pomo-panel" role="dialog" aria-modal="true" aria-label="Pomo mode">
        <FocusJourney onClose={onClose} onStart={onStart} />
      </div>
    </div>,
    document.body
  );
}

export default function LessonPath({
  deck,
  lessons,
  completed,
  name = "",
  streak = 0,
  dailyGoal = 0,
  cardsToday = 0,
  justDone = null,
  onClearJustDone,
  onBack,
  onOpenLesson,
  onOpenExam,
  onOpenLessons,
  onOpenPractice,
  onOpenVouchers,
  onOpenProfile,
  onOpenDailyTasks,
  onOpenStudyPlan,
  currentDeckId,
  ownedDeckIds = [],
  stars = 0,
  onSwitchCourse,
  onBuyCourse,
}) {
  const { t, pick } = useI18n();
  const deckName = pick(deck.name);
  const steps = buildSteps(lessons, completed, deckName, pick, t);
  const doneCount = lessons.filter((l) => completed[l.id]).length;
  const nowIdx = steps.findIndex((s) => s.state === "now");
  const courseSubjects = useMemo(
    () => COURSE_SUBJECTS.map((s) => ({ ...s, on: ownedDeckIds.includes(s.k) })),
    [ownedDeckIds]
  );

  const [openIdx, setOpenIdx] = useState(null);
  const [openNode, setOpenNode] = useState(null);
  const [geom, setGeom] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [lbView, setLbView] = useState("week");

  const lbStandings =
    lbView === "last" ? lastWeekStandings(name)
    : lbView === "friends" ? friendStandings(name, streak)
    : weekStandings(name, streak);
  const lbMe = lbStandings.find((p) => p.me);
  const pathRef = useRef(null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    if (!openNode) return;
    const away = e => { if (!e.target.closest(".node-wrap")) setOpenNode(null); };
    const esc  = e => { if (e.key === "Escape") setOpenNode(null); };
    document.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away);
                   window.removeEventListener("keydown", esc); };
  }, [openNode]);

  /* measure node centres (getBoundingClientRect includes the translateX
     offsets) so the trail and mascot can follow the winding path */
  useLayoutEffect(() => {
    function measure() {
      const path = pathRef.current;
      if (!path) return;
      const pr = path.getBoundingClientRect();
      const pts = nodeRefs.current
        .filter(Boolean)
        .map((n) => {
          const r = n.getBoundingClientRect();
          return {
            x: Math.round(r.left - pr.left + r.width / 2),
            y: Math.round(r.top - pr.top + r.height / 2),
          };
        });
      setGeom({ w: path.offsetWidth, h: path.offsetHeight, pts });
    }
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [steps.length]);

  const trailD = geom ? curve(nowIdx >= 0 ? geom.pts.slice(nowIdx) : geom.pts) : "";
  const walkedD = geom && nowIdx >= 0 ? curve(geom.pts.slice(0, nowIdx + 1)) : "";
  const mascotTop = geom && nowIdx >= 0 ? Math.max(8, geom.pts[nowIdx].y - 150) : 0;
  const pct = lessons.length ? doneCount / lessons.length : 0;
  const currentLesson = Math.min(doneCount + 1, lessons.length);

  /* what the rail's Continue button points at: the first step still to do */
  const nextStep = nowIdx >= 0 ? steps[nowIdx] : null;
  function continueNext() {
    if (!nextStep) return;
    if (nextStep.k === "lesson") setLesson(nextStep.lesson);
    else onOpenExam();
  }
  const goalPct = dailyGoal > 0 ? Math.min(1, cardsToday / dailyGoal) : 0;

  const [pomoOpen, setPomoOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [morePos, setMorePos] = useState(null);
  const moreBtnRef = useRef(null);
  const moreTimer = useRef(null);
  const openMore = () => {
    clearTimeout(moreTimer.current);
    const r = moreBtnRef.current?.getBoundingClientRect();
    if (r) setMorePos({ top: r.top, left: r.right + 10 });
    setMoreOpen(true);
  };
  const closeMoreSoon = () => {
    clearTimeout(moreTimer.current);
    moreTimer.current = setTimeout(() => setMoreOpen(false), 150);
  };
  useEffect(() => () => clearTimeout(moreTimer.current), []);
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState({});

  /* the running Pomo session — set the moment the ticket is torn in the
     popup (onStart), kept by the status box in the rail; finish removes
     the box when the last leg ends. Stable so the box never re-fires it. */
  const [session, setSession] = useState(null);
  const finish = useCallback(() => setSession(null), []);

  const saveResult = useCallback(({ percent }) => {
    if (lesson) {
      setProgress(p => ({ ...p, [lesson.id]: percent }));
      onOpenLesson(lesson.id, percent);
    }
    // setLesson(null); // Remove this to let onClose handle it
  }, [lesson, onOpenLesson]);

  useEffect(() => {
    if (!justDone) return;
    const el = document.querySelector(`[data-node="${justDone}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => {
      if (onClearJustDone) onClearJustDone();
    }, 1400);
    return () => clearTimeout(t);
  }, [justDone, onClearJustDone]);

  const closeLesson = useCallback(() => {
    setLesson(null);
    setOpenNode(null);
  }, []);

  if (lesson) {
    return <LessonChat onClose={closeLesson} onDone={saveResult} />;
  }
  const sideItems = [
    { id: "learn", label: t("lp.learn"), onClick: () => { setShowLeaderboard(false); window.scrollTo({ top: 0, behavior: "smooth" }); } },
    { id: "lessons", label: t("account.tab.lessons"), onClick: onOpenLessons },
    { id: "practice", label: t("account.tab.practice"), onClick: onOpenPractice },
    { id: "leaderboard", label: t("lp.leaderboard"), onClick: () => setShowLeaderboard(true) },
    { id: "quests", label: t("lp.dailyTasks"), onClick: onOpenDailyTasks },
    { id: "shop", label: t("lp.shop"), onClick: onOpenVouchers },
    { id: "profile", label: t("lp.myProfile"), onClick: onOpenProfile },
  ];
  const moreItems = [
    { id: "pomo", label: t("lp.pomoMode"), onClick: () => setPomoOpen(true) },
    { id: "exam", label: t("account.tab.exam"), onClick: onOpenExam },
    { id: "study", label: t("lp.studyPlan"), onClick: onOpenStudyPlan },
  ];

  return (
    <div className="lp-root">
      <PomoModal open={pomoOpen} onClose={() => setPomoOpen(false)} onStart={setSession} />
      <div className="lp-shell">
        {/* ============ left rail ============ */}
        <aside className="lp-side">
          <span className="lp-logo">{t("brand.name")}</span>
          <nav className="lp-nav">
            {sideItems.map((it) => (
              <button
                key={it.id}
                type="button"
                className={`lp-item${
                  (it.id === "learn" && !showLeaderboard) || (it.id === "leaderboard" && showLeaderboard)
                    ? " active"
                    : ""
                }`}
                onClick={it.onClick}
              >
                <span className="lp-ic">{SIDE_ICONS[it.id]}</span>
                {it.label}
              </button>
            ))}
            <button
              ref={moreBtnRef}
              type="button"
              className={`lp-item${moreOpen || pomoOpen ? " active" : ""}`}
              onMouseEnter={openMore}
              onMouseLeave={closeMoreSoon}
              onClick={() => (moreOpen ? setMoreOpen(false) : openMore())}
            >
              <span className="lp-ic">{SIDE_ICONS.more}</span>
              {t("lp.more")}
            </button>
          </nav>
        </aside>

        {moreOpen && morePos && createPortal(
          <div
            className="lp-more-pop"
            style={{ top: morePos.top, left: morePos.left }}
            onMouseEnter={() => clearTimeout(moreTimer.current)}
            onMouseLeave={closeMoreSoon}
          >
            {moreItems.map((it) => (
              <button
                key={it.id}
                type="button"
                className="lp-more-item"
                onClick={() => { setMoreOpen(false); it.onClick(); }}
              >
                <span className="lp-ic">{SIDE_ICONS[it.id]}</span>
                {it.label}
              </button>
            ))}
          </div>,
          document.body
        )}

        <div className={`lp-main${showLeaderboard ? " lp-main--board" : ""}`}>
      {!showLeaderboard && <Scene />}

      {/* ============ header ============ */}
      {!showLeaderboard && (
        <header className="top">
          <div className="col">
            <div className="bar">
              <button className="back" aria-label={t("common.back")} onClick={(e) => { e.stopPropagation(); onBack(); }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M11 5l-6 7 6 7" />
                </svg>
              </button>
              <span className="t">
                <span className="lab">{t("lp.unitLesson", { u: 1, n: currentLesson })}</span>
                <h1>{deckName}</h1>
              </span>
            </div>
          </div>
        </header>
      )}

      {showLeaderboard ? (
        <div className="col">
          <button
            type="button"
            className="lb-back"
            aria-label={t("common.back")}
            onClick={(e) => { e.stopPropagation(); setShowLeaderboard(false); }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 5l-6 7 6 7" />
            </svg>
            {t("lp.learn")}
          </button>
          <Leaderboard
            people={lbStandings}
            leagueIndex={lbMe ? leagueIndexFor(lbMe.xp) : 0}
            week={23}
            promote={5}
            relegate={5}
            view={lbView}
            onViewChange={setLbView}
            numerals="km"
          />
        </div>
      ) : (
      <div className="col">
        <>
        {/* ============ the path ============ */}
        <div className="path" ref={pathRef}>
          <svg className="trail" width={geom?.w ?? 0} height={geom?.h ?? 0} viewBox={geom ? `0 0 ${geom.w} ${geom.h}` : undefined} aria-hidden="true">
            {trailD && <path d={trailD} />}
            {walkedD && <path className="walked" d={walkedD} />}
          </svg>

          {steps.map((s, i) => {
            const isDone = s.state === "done";
            const hasScore = progress[s.lesson?.id] !== undefined;
            const donePct = isDone ? (hasScore ? progress[s.lesson?.id] : (completed[s.lesson?.id] === true ? 100 : typeof completed[s.lesson?.id] === "number" ? completed[s.lesson?.id] : 0)) : 0;

            const tone = s.state === "lock" ? "grey" : s.k === "chest" ? "gold" : s.k === "exam" ? "red" : "";
            const xp = s.k === "exam" ? 50 : s.k === "chest" ? 0 : isDone ? (donePct === 100 ? 3 : 5) : 10;
            const label =
              s.state === "lock" ? t("lp.locked") :
              s.k === "chest" ? <>{t("lp.open")} <span className="xp">+5 XP</span></> :
              s.k === "exam" ? <>{t("lp.startExam")} <span className="xp">+{xp} XP</span></> :
              isDone ? <>{t("lp.practise")} <span className="xp">+{xp} XP</span></> :
              <>{t("common.start")} <span className="xp">+{xp} XP</span></>;

            function go() {
              if (s.state === "lock") return;
              if (s.k === "lesson") onOpenLesson(s.lesson.id);
              else if (s.k === "chest") onOpenVouchers();
              else onOpenExam();
            }

            return (
              <div
                key={i}
                ref={(el) => (nodeRefs.current[i] = el)}
                className={`node-wrap node ${s.k} ${s.state}${openIdx === i ? " open" : ""}${openNode === i ? " pop" : ""}${justDone === s.lesson?.id ? " just-done" : ""}`}
                data-off={s.off}
                data-node={s.lesson?.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (s.k === "lesson" && s.state !== "lock") {
                    setOpenNode(openNode === i ? null : i);
                  } else {
                    setOpenIdx(openIdx === i ? null : i);
                  }
                }}
              >
                {s.state === "now" && <span className="bubble">{t("common.start")}</span>}
                {openNode === i && (
                  <div className="start-pop" role="dialog">
                    <span className="tip" />
                    <p className="lab">{t("lp.unitLesson", { u: 1, n: i + 1 })}</p>
                    <button className="start-btn" onClick={() => { setOpenNode(null); setLesson(s.lesson); }}>
                      {isDone ? t("lp.practise") : t("common.start")}&nbsp;&nbsp;+{xp} XP
                    </button>
                  </div>
                )}
                <span className="disc" />
                {s.state === "now" && (
                  <svg className="ring" viewBox="0 0 154 154" aria-hidden="true">
                    <circle className="bg" cx="77" cy="77" r={RING_R} />
                    <circle
                      className="fg"
                      cx="77"
                      cy="77"
                      r={RING_R}
                      strokeDasharray={RING_C}
                      strokeDashoffset={RING_C * (1 - pct)}
                    />
                  </svg>
                )}
                  <span className="cap">
                    {s.k === "lesson" && isDone ? (
                      <LessonStar id={s.lesson?.id || i} percent={donePct} />
                    ) : ICONS[s.state === "lock" ? "lock" : s.k]}
                  </span>
                <span className="cap-label">{s.n}</span>

                <div className={`card ${tone}`.trim()} onClick={(e) => e.stopPropagation()}>
                  <h3>{s.h}</h3>
                  <button className="go" disabled={s.state === "lock"} onClick={go}>
                    {label}
                  </button>
                </div>
              </div>
            );
          })}

          {/* the panda mascot, standing beside the current node */}
          {nowIdx >= 0 && (
            <div className="mascot" style={{ top: mascotTop }}>
              <img src={PANDA} alt="" />
              <div className="shadow" />
            </div>
          )}
        </div>

        <p className="finish">{t("lp.finish")}</p>
        </>
      </div>
        )}
        </div>

        {/* ============ right rail ============
            .lp-stats sits outside the scrolling inner wrapper: the rail
            itself used to scroll (overflow-y:auto), which — even with no
            overflow-x set — clips horizontal overflow too, cutting off the
            course picker's dropdown. Scrolling now happens on
            .lp-rail-scroll instead, leaving .lp-stats unclipped. */}
        <aside className="lp-rail">
          <div className="lp-stats">
            <CoursePicker
              subjects={courseSubjects}
              current={currentDeckId}
              stars={stars}
              price={COURSE_PRICE}
              onSelect={onSwitchCourse}
              onBuy={onBuyCourse}
            />
            <span className="lp-stat">
              {RAIL_ICONS.streak}
              <b>{streak}</b>
              <i>{t("lp.rail.streak")}</i>
            </span>
            <StarsPill stars={stars} />
          </div>

          <div className="lp-rail-scroll">
            <section className="lp-block">
              <h2>{t("lp.rail.progress")}</h2>
              <div className="lp-bar"><span style={{ width: `${Math.round(pct * 100)}%` }} /></div>
              <p className="lp-note">{t("lp.rail.lessonsOf", { n: doneCount, total: lessons.length })}</p>
              {nextStep && (
                <>
                  <span className="lp-eyebrow">{t("lp.rail.nextUp")}</span>
                  <p className="lp-next">{nextStep.k === "exam" ? nextStep.n : nextStep.h}</p>
                  <button type="button" className="lp-go" onClick={continueNext}>
                    {t("lp.rail.continue")}
                  </button>
                  {nextStep.k === "exam" && <p className="lp-note">{t("lp.rail.examReady")}</p>}
                </>
              )}
            </section>

            <section className="lp-block">
              <h2>{t("lp.rail.dailyGoal")}</h2>
              <div className="lp-bar gold"><span style={{ width: `${Math.round(goalPct * 100)}%` }} /></div>
              <p className="lp-note">{t("lp.rail.cards", { n: cardsToday, total: dailyGoal })}</p>
              <p className="lp-note">
                {cardsToday >= dailyGoal
                  ? t("lp.rail.goalMet")
                  : t("lp.rail.goalLeft", { n: dailyGoal - cardsToday })}
              </p>
              <button type="button" className="lp-go ghost" onClick={onOpenDailyTasks}>
                <span className="lp-go-ic">{RAIL_ICONS.tasks}</span>
                {t("lp.rail.viewTasks")}
              </button>
            </section>

            {/* the running Pomo session — appears when the ticket is torn,
                renders nothing while nothing is running */}
            <PomoStatusBox session={session} onFinish={finish} />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- the landscape behind the path ----------
   Straight from the prototype: sky, sun, clouds, mountains, three grass
   bands, a river and flowers in the back layer; trees, bushes and rocks
   in the front one. Both SVGs stretch to the full height of the path. */
function Scene() {
  const flowers = [
    [70, 364, "#E5738C"], [318, 392, "#F2C14E"], [112, 556, "#E5738C"],
    [300, 660, "#C583D6"], [64, 760, "#F2C14E"], [336, 796, "#E5738C"],
    [190, 470, "#F2C14E"], [248, 760, "#C583D6"],
  ];
  const trees = [
    [26, 346, 1, "round"], [360, 330, 0.9, "pine"], [50, 508, 0.85, "pine"], [356, 540, 1.05, "round"],
    [20, 724, 0.95, "round"], [368, 752, 0.85, "pine"], [92, 300, 0.7, "round"], [306, 300, 0.72, "pine"],
  ];
  const bushes = [
    [96, 430, "#5C9E67"], [300, 640, "#4C8C58"], [126, 822, "#6EB177"], [292, 232, "#5C9E67"],
  ];
  const rocks = [[64, 600], [336, 470], [176, 832]];

  return (
    <div className="scene">
      <svg viewBox="0 0 400 900" preserveAspectRatio="none" style={{ height: "100%" }} aria-hidden="true">
        <defs>
          <linearGradient id="lp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#CFE3EF" /><stop offset="1" stopColor="#EAF1E6" />
          </linearGradient>
          <linearGradient id="lp-g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8FBF9C" /><stop offset="1" stopColor="#6FA87E" />
          </linearGradient>
          <linearGradient id="lp-g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#A8D2A9" /><stop offset="1" stopColor="#87BE8C" />
          </linearGradient>
          <linearGradient id="lp-g3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C2E0BC" /><stop offset="1" stopColor="#A3CFA2" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="400" height="330" fill="url(#lp-sky)" />

        <circle cx="322" cy="72" r="30" fill="#FBE0A0" />
        <circle cx="322" cy="72" r="20" fill="#F7CE6E" />

        <g fill="#FFFFFF" opacity=".9">
          <ellipse cx="86" cy="70" rx="26" ry="14" /><ellipse cx="108" cy="64" rx="20" ry="16" />
          <ellipse cx="64" cy="76" rx="18" ry="11" />
          <ellipse cx="248" cy="118" rx="22" ry="12" /><ellipse cx="266" cy="112" rx="16" ry="13" />
        </g>

        <path d="M0 210 Q60 150 120 196 T250 186 T400 214 V330 H0Z" fill="#B9D9C4" />
        <path d="M-10 300 L70 168 L124 246 L176 142 L250 300Z" fill="#7E9DB4" />
        <path d="M176 142 L206 186 L186 214 L200 246 L250 300Z" fill="#6A88A0" />
        <path d="M58 198 L70 168 L84 198 Q70 208 58 198Z" fill="#F6FAFC" />
        <path d="M164 168 L176 142 L190 170 Q176 180 164 168Z" fill="#F6FAFC" />
        <path d="M230 330 L300 208 L352 288 L410 330Z" fill="#7E9DB4" />
        <path d="M290 228 L300 208 L312 230 Q300 238 290 228Z" fill="#F6FAFC" />

        <path d="M0 300 Q100 268 200 296 T400 286 V560 H0Z" fill="url(#lp-g1)" />
        <path d="M0 520 Q120 486 240 516 T400 500 V760 H0Z" fill="url(#lp-g2)" />
        <path d="M0 720 Q110 690 230 716 T400 704 V900 H0Z" fill="url(#lp-g3)" />

        <path d="M-20 420 Q90 448 150 500 T280 596 T430 660" fill="none" stroke="#7FB6D6" strokeWidth="16" strokeLinecap="round" opacity=".75" />
        <path d="M-20 420 Q90 448 150 500 T280 596 T430 660" fill="none" stroke="#A9D4EC" strokeWidth="7" strokeLinecap="round" />

        {flowers.map(([x, y, c], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle cx="0" cy="0" r="3.4" fill={c} />
            <circle cx="0" cy="0" r="1.3" fill="#FFF6D8" />
            <path d="M0 3 v6" stroke="#4E8A56" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        ))}
      </svg>

      <svg viewBox="0 0 400 900" preserveAspectRatio="none" style={{ height: "100%" }} aria-hidden="true">
        {trees.map(([x, y, k, kind], i) =>
          kind === "pine" ? (
            <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
              <rect x="-3.5" y="0" width="7" height="22" rx="3" fill="#8A6A46" />
              <path d="M0 -46 L17 -14 H-17Z" fill="#3F7A4C" />
              <path d="M0 -32 L21 4 H-21Z" fill="#4C8C58" />
              <path d="M0 -18 L24 20 H-24Z" fill="#5C9E67" />
            </g>
          ) : (
            <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
              <rect x="-3.5" y="-4" width="7" height="26" rx="3" fill="#8A6A46" />
              <circle cx="0" cy="-18" r="20" fill="#5C9E67" />
              <circle cx="-14" cy="-6" r="14" fill="#4C8C58" />
              <circle cx="14" cy="-7" r="13" fill="#6EB177" />
              <circle cx="-6" cy="-24" r="4.5" fill="#E2574F" />
              <circle cx="9" cy="-16" r="4" fill="#E2574F" />
            </g>
          )
        )}

        {bushes.map(([x, y, c], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse cx="0" cy="0" rx="15" ry="10" fill={c} />
            <ellipse cx="-7" cy="-4" rx="9" ry="7" fill={c} opacity=".75" />
          </g>
        ))}

        {rocks.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse cx="0" cy="2" rx="12" ry="6" fill="#9AA79B" opacity=".5" />
            <path d="M-10 2 Q-8 -8 0 -9 Q9 -8 10 2Z" fill="#B7BFB2" />
            <path d="M0 -9 Q9 -8 10 2 H2Z" fill="#9AA79B" />
          </g>
        ))}
      </svg>
    </div>
  );
}
