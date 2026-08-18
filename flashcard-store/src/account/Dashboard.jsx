import { useEffect, useRef, useState } from "react";
import defaultAvatar from "../assets/default-avatar.jpg";
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

export default function Dashboard({
  session,
  deck,
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

  const firstName = (session.name || "").trim().split(/\s+/)[0] || "Learner";
  /* the deck's own name in both languages when it has both, e.g.
     "គណិតវិទ្យាមូលដ្ឋាន - MATH FUNDAMENTALS" */
  const deckTitle = deck?.name
    ? [deck.name.km, (deck.name.en || "").toUpperCase()].filter(Boolean).join(" - ")
    : "";

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
            <span className="jd-avatar" style={{ backgroundImage: `url(${defaultAvatar})` }} />
            {firstName}
            <CaretIcon />
          </button>

          <div className={`jd-menu${menuOpen ? " jd-open" : ""}`} role="menu">
            <div className="jd-who">
              <span className="jd-avatar" style={{ backgroundImage: `url(${defaultAvatar})` }} />
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

        {/* the course you are actually in. This was hardcoded to
            "ជីវវិទ្យា - BIOLOGY" from the mockup it was ported from, so
            every deck — maths, history, physics — announced itself as
            biology while the Learn map's header named it correctly. */}
        <div className="jd-head">
          <h1 className="jd-title" style={{ fontFamily: '"Khmer OS Siemreap","Siemreap","Noto Sans Khmer",sans-serif' }}>
            {deckTitle}
          </h1>
        </div>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
