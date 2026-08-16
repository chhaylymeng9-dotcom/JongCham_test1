import { useEffect, useRef, useState } from "react";
import "./dashboard.css";

/* ---------- Dashboard ----------
Ported from the supplied static mockup — the post-sign-in sequel to
AuthPanel's sign-in screen. Same treatment: a literal, scoped port, not a
reskin of the app's Tailwind design system.

Only the shell (identity chip, deck head, stats, continue hero, tabs,
deck sidebar) lives here. The tab body is handed in as `children` —
Account.jsx still decides which of Lessons/Practice/Exam/CertificateList
to render, exactly as it did before this component existed. Those
components' own entry screens (unit rows, mode grid, exam rules, empty
cert state) were separately restyled to use this file's dashboard.css
classes so they read as one piece with this shell; their interactive
internals (drills, the timed exam run, the printable certificate) were
left on the app's existing Tailwind styling.

The mockup's stats that nothing in this app actually tracks — day streak,
cards due, cards mastered, per-unit card counts, a past-attempts list —
were dropped rather than faked. What's shown here is only what
`storage.js` really records: lessons completed, best exam score, and
whether a certificate has been earned.
--------------------------------- */

const TABS = [
  { id: "decks", label: "Decks" },
  { id: "lessons", label: "Lessons" },
  { id: "practice", label: "Practice" },
  { id: "exam", label: "Exam" },
  { id: "certificates", label: "Certificates" },
];

function CaretIcon() {
  return (
    <svg className="jd-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-5.5h4V20h3.5a1 1 0 0 0 1-1v-9" />
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

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5V6a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z" />
      <path d="M9 8h7M9 12h7" />
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

// Deck blurbs already open with their own "N cards with a ... back"
// sentence (see data/decks.js) — bolding that lead sentence instead of
// prepending our own avoids doubling up on "N cards" text.
function AboutBlurb({ text }) {
  const [lead, ...rest] = text.split(/\.\s+/);
  if (rest.length === 0) return <span>{text}</span>;
  return (
    <span>
      <b>{lead}.</b> {rest.join(". ")}
    </span>
  );
}

export default function Dashboard({
  session,
  deck,
  lessons,
  completedLessons,
  bestScore,
  certificates,
  tab,
  onTabChange,
  onSignOut,
  onOpenProfile,
  onOpenDailyTasks,
  onOpenVouchers,
  onGoToOrders,
  onGoHome,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickAway(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setMenuOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const deckName = deck.name.en;
  const initial = (session.name || "?").trim().charAt(0).toUpperCase() || "?";
  const firstName = (session.name || "").trim().split(/\s+/)[0] || "Learner";

  const doneCount = lessons.filter((l) => completedLessons[l.id]).length;
  const coursePct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
  const nextLesson = lessons.find((l) => !completedLessons[l.id]);
  const allDone = lessons.length > 0 && doneCount === lessons.length;
  const hasCertificate = certificates.length > 0;

  const tabs = TABS.map((t) => ({
    ...t,
    badge:
      t.id === "lessons"
        ? lessons.length
        : t.id === "certificates"
        ? certificates.length || null
        : t.id === "decks"
        ? session.decks?.length || null
        : null,
  }));

  return (
    <div className="jd-root" ref={rootRef}>
      <div className="jd-wrap">
        <div className="jd-account">
          {onGoHome && (
            <button type="button" className="jd-back" onClick={onGoHome}>
              <ArrowLeftIcon />
              Back to dashboard
            </button>
          )}
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
            <div className="jd-code">
              Activation code <b>{session.code}</b>
            </div>
            {onGoHome && (
              <button type="button" role="menuitem" onClick={onGoHome}>
                <HomeIcon />
                Home
              </button>
            )}
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

        <div className="jd-head">
          <span className="jd-label">Your deck</span>
          <h1 className="jd-title">{deckName}</h1>
          <span className="jd-code">{session.code}</span>
        </div>

        <div className="jd-about">
          <BookIcon />
          <AboutBlurb text={deck.blurb.en} />
        </div>

        <div className="jd-stats">
          <div className="jd-stat">
            <span className="jd-label">Course progress</span>
            <div className="jd-value">{coursePct}%</div>
            <div className="jd-sub">
              {doneCount} of {lessons.length} lessons
            </div>
            <div className="jd-track">
              <i style={{ width: `${coursePct}%` }} />
            </div>
          </div>

          <div className="jd-stat">
            <span className="jd-label">Best exam score</span>
            <div className="jd-value">{bestScore == null ? "Not taken" : `${Math.round(bestScore * 100)}%`}</div>
            <div className="jd-sub">{bestScore == null ? "70% needed to pass" : bestScore >= 0.7 ? "Passed" : "Below the 70% pass mark"}</div>
            <div className="jd-track">
              <i style={{ width: `${bestScore == null ? 0 : Math.round(bestScore * 100)}%` }} />
            </div>
          </div>

          <div className="jd-stat">
            <span className="jd-label">Certificate</span>
            <div className="jd-value">{hasCertificate ? "Earned" : "Not earned"}</div>
            <div className="jd-sub">{hasCertificate ? "Ready to view and print" : "Pass the exam to earn one"}</div>
            <div className="jd-track">
              <i style={{ width: hasCertificate ? "100%" : "0%" }} />
            </div>
          </div>
        </div>

        <nav className="jd-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? "jd-on" : ""}
              onClick={() => onTabChange(t.id)}
            >
              {t.label}
              {t.badge != null && <em>{t.badge}</em>}
            </button>
          ))}
        </nav>

        <main>
          {tab === "lessons" && (
            <section className="jd-continue">
              <span className="jd-label">{doneCount === 0 ? "Start here" : allDone ? "Course complete" : "Continue"}</span>
              <h3>
                {allDone
                  ? "Ready when you are"
                  : `Lesson ${lessons.indexOf(nextLesson) + 1} · ${nextLesson.title.en}`}
              </h3>
              <p>
                {allDone
                  ? "Review any lesson, or head to the exam."
                  : `${doneCount} of ${lessons.length} lessons complete`}
              </p>
              <button
                type="button"
                className="jd-cbtn"
                onClick={() => onTabChange(allDone ? "exam" : "lessons")}
              >
                <PlayIcon />
                <span>{allDone ? "Go to exam" : doneCount === 0 ? "Start lesson 1" : "Continue"}</span>
              </button>
            </section>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
