import { useRef, useState } from "react";
import { LANGUAGES, useI18n } from "../i18n.jsx";
import { formatStudyTime } from "./studyTime.js";
import { lessonsFor } from "../data/lessons.js";
import {
  TRIAL_DAYS,
  addStudyPlan,
  getDailyGoal,
  getProTrial,
  getStudyPlans,
  removeStudyPlan,
  setDailyGoal,
  startProTrial,
} from "../storage.js";
import defaultAvatar from "../assets/default-avatar.jpg";
import "./profile.css";

/* ---------- Profile ----------
Ported from a supplied "My profile" mockup, scoped like AuthPanel /
Dashboard. Full visual layout is ported (side nav, avatar upload, Study
settings, Password tabs) — but this app has no multi-deck ownership, no
per-device study prefs, and no password auth at all, so:

  - Full name, Display name, Email, Phone, Country, Time zone genuinely
    save to the session (updateSession just merges whatever patch it's
    given, so these are real fields now, not fakes).
  - Interface language is the app's real i18n switch.
  - The avatar photo is a real local preview (FileReader), just not
    persisted anywhere — refreshing loses it, same honesty level as
    AuthPanel's non-functional Google button.
  - "Activate a deck" is the real multi-deck flow (see addDeck in
    Account.jsx) — one account can own several decks/subjects at once;
    entering a code appends a deck rather than replacing the current one,
    and the list below lets you switch which owned deck is active.
  - Study settings and the Password tab (including "Signed in devices")
    have nothing real behind them anywhere in this app and stay
    demo-only, same spirit as AuthPanel's password-strength meter.
--------------------------------- */

const emailOk = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

const COUNTRIES = ["Cambodia", "Thailand", "Vietnam", "China", "Other"];
const TIMEZONES = ["(GMT+7) Phnom Penh", "(GMT+8) Shanghai", "(GMT+9) Tokyo"];
const GOALS = [
  { n: 10, label: "relaxed" },
  { n: 20, label: "steady" },
  { n: 40, label: "serious" },
  { n: 60, label: "intense" },
];

// Real drill modes — see Practice.jsx's own MODES. Kept as the same four
// here so a saved plan actually names something Practice can run.
const PLAN_MODES = [
  { id: "review", label: "Flip review" },
  { id: "quiz", label: "Multiple choice" },
  { id: "type", label: "Type the answer" },
  { id: "match", label: "Match pairs" },
];
const PLAN_DAYS = [
  { k: "mon", label: "Mon" },
  { k: "tue", label: "Tue" },
  { k: "wed", label: "Wed" },
  { k: "thu", label: "Thu" },
  { k: "fri", label: "Fri" },
  { k: "sat", label: "Sat" },
  { k: "sun", label: "Sun" },
];
const PLAN_CARD_PRESETS = [5, 10, 20, 30, 50];
// A rough planning estimate (not tracked timing, unlike studySeconds) —
// same spirit as Exam.jsx's SECONDS_PER_QUESTION, just for self-paced
// review instead of a timed exam.
const PLAN_SECONDS_PER_CARD = 30;

function BackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function CamIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="15" height="14" rx="2" />
      <path d="M18 8h3v11a2 2 0 0 1-2 2H7" />
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

function Switch({ checked, onChange }) {
  return (
    <label className="jp-sw">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <i />
    </label>
  );
}

export default function Profile({
  session,
  deckName,
  decks,
  activeDeckId,
  stats,
  onSetActiveDeck,
  onBack,
  onOpenPlans,
  onSave,
  onAddDeck,
  switchError,
  onDeleteAccount,
  onSignOut,
  initialTab = "personal",
}) {
  const { lang, setLang, pick } = useI18n();
  const [tab, setTab] = useState(initialTab);
  const personalRef = useRef(null);
  function focusPersonalInfo() {
    setTab("personal");
    // Wait a tick for the personal tab's content to mount before scrolling.
    setTimeout(() => {
      personalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      personalRef.current?.querySelector("#pf-name")?.focus();
    }, 0);
  }

  // Cosmetic — see the Plan and billing panel below and Plans.jsx.
  const plan = session.plan ?? null;
  const planLabel = plan === "pro" ? "Pro" : plan === "max" ? "Max" : "Free";
  const planPrice = plan === "pro" ? "$4.99" : plan === "max" ? "$12" : null;

  /* the one-week Pro trial. Held in storage, not in session.plan, so a
     paid (simulated) upgrade and a running trial can't fight over the
     same field — a real plan simply outranks the trial everywhere. */
  const [trial, setTrial] = useState(() => getProTrial());
  const onTrial = !plan && trial.active;
  const canStartTrial = !plan && !trial.started;
  const badgeLabel = onTrial ? `Pro trial · ${trial.daysLeft} day${trial.daysLeft === 1 ? "" : "s"} left` : `${planLabel} plan`;
  const trialEnds = trial.endsAt
    ? new Date(trial.endsAt).toLocaleDateString(undefined, { day: "numeric", month: "long" })
    : "";

  function beginTrial() {
    const started = startProTrial();
    if (started) setTrial(started);
  }

  const [avatar, setAvatar] = useState(null);
  const fileInput = useRef(null);
  function pickAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const memberSince = stats?.memberSince
    ? new Date(stats.memberSince).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;
  const studyTime = formatStudyTime(stats?.studySeconds ?? 0);

  const base = {
    name: session.name || "",
    email: session.email || "",
    displayName: session.displayName || "",
    phone: session.phone || "",
    country: session.country || COUNTRIES[0],
    timezone: session.timezone || TIMEZONES[0],
  };
  const [draft, setDraft] = useState(base);
  const [fieldError, setFieldError] = useState("");
  const dirty = Object.keys(base).some((k) => draft[k] !== base[k]);

  const [switchCode, setSwitchCode] = useState("");
  const [switching, setSwitching] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [deleted, setDeleted] = useState(false);

  // Daily goal is real — Home's "Today's goal" panel reads it (see
  // storage.js). The toggles below it still aren't backed by anything.
  const [goal, setGoal] = useState(() => getDailyGoal());
  function chooseGoal(n) {
    setGoal(n);
    setDailyGoal(n);
  }

  // Study plan is real too — saved plans persist via storage.js and are
  // built from this account's actual owned decks/lessons/drill modes.
  // "Customize Set" decks have no course behind them, so they're excluded.
  const studyDecks = decks.filter((d) => !d.catalog?.customizable);
  const [plans, setPlans] = useState(() => getStudyPlans());
  const [planDays, setPlanDays] = useState(() => new Set());
  const [planDeckId, setPlanDeckId] = useState(studyDecks[0]?.deckId ?? "");
  const [planLesson, setPlanLesson] = useState("all");
  const [planMode, setPlanMode] = useState("review");
  const [planCards, setPlanCards] = useState(10);

  const planDeck = studyDecks.find((d) => d.deckId === planDeckId) ?? null;
  const planLessons = planDeck ? lessonsFor(planDeck.subject) : [];
  const planMinutes = Math.max(1, Math.round((planCards * PLAN_SECONDS_PER_CARD) / 60));
  const weeklyPlanTotal = plans.reduce((n, p) => n + p.days.length * p.cards, 0);
  const weekByDay = PLAN_DAYS.map((d) => ({
    ...d,
    cards: plans.reduce((n, p) => n + (p.days.includes(d.k) ? p.cards : 0), 0),
  }));

  function toggleDay(k) {
    setPlanDays((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  }
  function quickDays(preset) {
    setPlanDays(
      new Set(
        preset === "weekdays"
          ? ["mon", "tue", "wed", "thu", "fri"]
          : preset === "weekend"
          ? ["sat", "sun"]
          : preset === "everyday"
          ? PLAN_DAYS.map((d) => d.k)
          : []
      )
    );
  }
  function savePlan() {
    if (planDays.size === 0 || !planDeck) return;
    const lessonLabel = planLesson === "all" ? "All lessons" : pick(planLessons[Number(planLesson)]?.title) || "A lesson";
    const entry = addStudyPlan({
      days: Array.from(planDays),
      deckId: planDeck.deckId,
      deckName: pick(planDeck.catalog?.name) || planDeck.subject,
      lessonLabel,
      mode: planMode,
      cards: planCards,
    });
    setPlans((p) => [...p, entry]);
    setPlanDays(new Set());
  }
  function deletePlan(id) {
    removeStudyPlan(id);
    setPlans((p) => p.filter((x) => x.id !== id));
  }

  const [shuffle, setShuffle] = useState(false);
  const [sound, setSound] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyEmail, setWeeklyEmail] = useState(false);
  const [reminderTime, setReminderTime] = useState("19:30");

  // Password tab — this app has no password auth, so this can't do
  // anything real; it mirrors AuthPanel's fake loading→done pattern.
  const [pw, setPw] = useState({ cur: "", new1: "", new2: "" });
  const [pwError, setPwError] = useState("");
  const [pwStatus, setPwStatus] = useState("idle"); // idle | loading | done
  const [otherDeviceGone, setOtherDeviceGone] = useState(false);

  function cancel() {
    setDraft(base);
    setFieldError("");
  }

  function save() {
    if (!draft.name.trim()) return setFieldError("Please enter your full name.");
    if (!emailOk(draft.email)) return setFieldError("Enter a valid email address.");
    setFieldError("");
    onSave({
      name: draft.name.trim(),
      email: draft.email.trim(),
      displayName: draft.displayName.trim(),
      phone: draft.phone.trim(),
      country: draft.country,
      timezone: draft.timezone,
    });
  }

  async function activateCode() {
    if (!switchCode.trim() || switching) return;
    setSwitching(true);
    const ok = await onAddDeck(switchCode.trim());
    setSwitching(false);
    if (ok) setSwitchCode("");
  }

  function deleteAccount() {
    if (!deleteArmed) {
      setDeleteArmed(true);
      return;
    }
    setDeleted(true);
    onDeleteAccount();
  }

  function submitPassword(e) {
    e.preventDefault();
    if (pwStatus === "loading") return;
    if (pw.new1.length < 8) return setPwError("Use 8 characters or more.");
    if (pw.new1 !== pw.new2) return setPwError("Passwords don't match.");
    setPwError("");
    setPwStatus("loading");
    setTimeout(() => {
      setPwStatus("done");
      setPw({ cur: "", new1: "", new2: "" });
      setTimeout(() => setPwStatus("idle"), 1200);
    }, 800);
  }

  return (
    <div className="jp-root">
      <div className="jp-wrap">
        <button type="button" className="jp-back" onClick={onBack}>
          <BackIcon /> Back
        </button>

        <div className="jp-head">
          <span className="jp-label">Account</span>
          <h1>My profile</h1>
        </div>

        {/* Always mounted (not just on the Personal info tab) so the
            camera badge below works no matter which tab is active. */}
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={pickAvatar} />

        {/* One identity card: photo, who you are, what you've done. The
            page used to print the avatar and name twice — here and again
            at the top of Personal info — and hang the four numbers off it
            as four more bordered tiles. Photo controls live on the photo
            now, and the stats are a strip inside the same card. */}
        <section className="jp-summary">
          <div className="jp-summary-id">
            <div className="jp-summary-avatar" style={{ backgroundImage: `url(${avatar || defaultAvatar})` }}>
              <span className="jp-cam" role="button" aria-label="Change photo" onClick={() => fileInput.current?.click()}>
                <CamIcon />
              </span>
            </div>

            <div className="jp-summary-who">
              <b>{session.name}</b>
              <span>{session.email}</span>
              <div className="jp-summary-badges">
                <span className={"jp-badge jp-badge-plan" + (onTrial ? " jp-badge-trial" : "")}>{badgeLabel}</span>
                {memberSince && <span className="jp-badge">Member since {memberSince}</span>}
              </div>
              <div className="jp-photo-acts">
                <button type="button" className="jp-linkbtn" onClick={() => fileInput.current?.click()}>
                  Upload photo
                </button>
                {avatar && (
                  <button type="button" className="jp-linkbtn" onClick={() => setAvatar(null)}>
                    Remove
                  </button>
                )}
                <span className="jp-photo-note">
                  {decks.length} deck{decks.length === 1 ? "" : "s"} · currently on {deckName}
                </span>
              </div>
            </div>

            <div className="jp-summary-acts">
              <button type="button" className="jp-btn" onClick={focusPersonalInfo}>
                Edit profile
              </button>
              <button type="button" className="jp-btn jp-solid" onClick={onOpenPlans}>
                {plan ? "Manage plan" : "Upgrade"}
              </button>
            </div>
          </div>

          {stats && (
            <div className="jp-summary-stats">
              <div className="jp-stat-tile">
                <span className="jp-label">Decks</span>
                <b>{stats.decksOwned}</b>
                <span>in your library</span>
              </div>
              <div className="jp-stat-tile">
                <span className="jp-label">Lessons completed</span>
                <b>{stats.lessonsDone}</b>
                <span>{stats.lessonsTotal ? `of ${stats.lessonsTotal}` : "no course decks yet"}</span>
              </div>
              <div className="jp-stat-tile">
                <span className="jp-label">Study time</span>
                <b>{studyTime}</b>
                <span>{memberSince ? `since ${memberSince}` : "on Lessons, Practice and Exam"}</span>
              </div>
              <div className="jp-stat-tile">
                <span className="jp-label">Certificates</span>
                <b>{stats.certificatesEarned}</b>
                <span>{stats.courseDecks ? `of ${stats.courseDecks} eligible` : "none eligible yet"}</span>
              </div>
            </div>
          )}
        </section>

        <div className="jp-shell">
          {/* two tabs don't earn a sidebar column — a segmented switch
              over the content reads faster and leaves the page full width */}
          <nav className="jp-nav">
            <button type="button" className={tab === "personal" ? "jp-on" : ""} onClick={() => setTab("personal")}>
              <PersonIcon /> Personal info
            </button>
            <button type="button" className={tab === "password" ? "jp-on" : ""} onClick={() => setTab("password")}>
              <LockIcon /> Password
            </button>
          </nav>

          <main>
            {/* ============ PERSONAL INFO ============ */}
            {tab === "personal" && (
              <div>
                {/* Decorative — this store sells one-time decks, not a
                    subscription, so there's no real plan/usage-cap system
                    behind this. "See plans" opens the Plans page, where
                    "Upgrade" runs a real payment simulation (see
                    Plans.jsx) that sets session.plan — reflected here, but
                    it still doesn't unlock or restrict anything. */}
                <section className="jp-panel">
                  <div className="jp-panel-head jp-panel-head-row">
                    <h2>Plan and billing</h2>
                    <span className="jp-optional">{plan ? "No invoices yet" : "No payment method"}</span>
                  </div>
                  <div className="jp-panel-body">
                    <div className="jp-plan-now">
                      <span className="jp-plan-mark">
                        <CardIcon />
                      </span>
                      <div className="jp-txt">
                        <b>{onTrial ? "Pro trial" : `${planLabel} plan`}</b>
                        <span>
                          {onTrial
                            ? `Free until ${trialEnds} · ${trial.daysLeft} day${trial.daysLeft === 1 ? "" : "s"} left`
                            : plan
                              ? `${planPrice} / month`
                              : "$0 / month · free forever"}
                        </span>
                      </div>
                      <button type="button" className="jp-btn jp-solid" onClick={onOpenPlans}>
                        {plan ? "Manage plan" : onTrial ? "Keep Pro" : "See plans"}
                      </button>
                    </div>

                    {/* the free week: offered once, then it either runs or
                        it's spent — the button never comes back */}
                    {canStartTrial && (
                      <div className="jp-trial">
                        <div className="jp-t">
                          <b>Try Pro free for {TRIAL_DAYS} days.</b>
                          No card, no charge — it simply ends after a week.
                        </div>
                        <button type="button" className="jp-btn jp-solid" onClick={beginTrial}>
                          Start free trial
                        </button>
                      </div>
                    )}

                    {onTrial && (
                      <div className="jp-trial jp-trial-on">
                        <div className="jp-t">
                          <b>{trial.daysLeft} day{trial.daysLeft === 1 ? "" : "s"} of Pro left.</b>
                          Your trial ends on {trialEnds}, and the account drops back to Free on its own.
                        </div>
                      </div>
                    )}

                    {!plan && trial.expired && (
                      <div className="jp-trial jp-trial-off">
                        <div className="jp-t">
                          <b>Your Pro trial has ended.</b>
                          You're back on Free — everything you made during the trial is still here.
                        </div>
                        <button type="button" className="jp-btn jp-solid" onClick={onOpenPlans}>
                          See plans
                        </button>
                      </div>
                    )}

                    {plan ? (
                      <div className="jp-upsell" style={{ background: "var(--green-soft)", borderColor: "var(--green-line)" }}>
                        <div className="jp-t" style={{ color: "var(--green)" }}>
                          <b>Unlimited decks and cards.</b>
                          Thanks for the (simulated) support — this doesn't change what actually works here, everything
                          was already available.
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="jp-usage">
                          <div className="jp-use">
                            <b>
                              Decks <em>{decks.length} of 1</em>
                            </b>
                            <div className="jp-usetrack">
                              <i style={{ width: "100%" }} />
                            </div>
                          </div>
                          <div className="jp-use">
                            <b>
                              Cards in your own deck <em>20 of 20</em>
                            </b>
                            <div className="jp-usetrack">
                              <i style={{ width: "100%" }} />
                            </div>
                          </div>
                          <div className="jp-use">
                            <b>
                              Exercise types <em>2 of 6</em>
                            </b>
                            <div className="jp-usetrack">
                              <i style={{ width: "33%" }} />
                            </div>
                          </div>
                        </div>

                        <div className="jp-upsell">
                          <div className="jp-t">
                            <b>Your free deck is full.</b>
                            Pro gives you unlimited decks, 500+ ready-made decks and 20% off printed boxes.
                          </div>
                          <button type="button" className="jp-btn jp-solid" onClick={onOpenPlans}>
                            Upgrade to Pro
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </section>

                <section className="jp-panel" ref={personalRef}>
                  <div className="jp-panel-head">
                    <h2>Personal information</h2>
                    <p>This is what appears on your certificates.</p>
                  </div>
                  <div className="jp-panel-body">
                    <div className="jp-two">
                      <div className="jp-field">
                        <label htmlFor="pf-name">Full name</label>
                        <div className="jp-input">
                          <input id="pf-name" type="text" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
                        </div>
                      </div>
                      <div className="jp-field">
                        <label htmlFor="pf-dname">
                          Display name <span className="jp-optional">Optional</span>
                        </label>
                        <div className="jp-input">
                          <input
                            id="pf-dname"
                            type="text"
                            placeholder="What we call you"
                            value={draft.displayName}
                            onChange={(e) => setDraft((d) => ({ ...d, displayName: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="jp-field">
                      <label htmlFor="pf-email">
                        Email{" "}
                        <span className="jp-verified">
                          <CheckIcon /> Verified
                        </span>
                      </label>
                      <div className="jp-input">
                        <input id="pf-email" type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
                      </div>
                      <p className="jp-note">If you change this, we send a link to the new address to confirm it.</p>
                    </div>

                    <div className="jp-two">
                      <div className="jp-field">
                        <label htmlFor="pf-phone">
                          Phone <span className="jp-optional">Optional</span>
                        </label>
                        <div className="jp-input">
                          <input
                            id="pf-phone"
                            type="tel"
                            placeholder="+855 …"
                            value={draft.phone}
                            onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="jp-field">
                        <label htmlFor="pf-lang">Interface language</label>
                        <div className="jp-input">
                          <select id="pf-lang" value={lang} onChange={(e) => setLang(e.target.value)}>
                            {LANGUAGES.map((l) => (
                              <option key={l.id} value={l.id}>
                                {l.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="jp-two">
                      <div className="jp-field">
                        <label htmlFor="pf-country">Country</label>
                        <div className="jp-input">
                          <select id="pf-country" value={draft.country} onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))}>
                            {COUNTRIES.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="jp-field">
                        <label htmlFor="pf-tz">Time zone</label>
                        <div className="jp-input">
                          <select id="pf-tz" value={draft.timezone} onChange={(e) => setDraft((d) => ({ ...d, timezone: e.target.value }))}>
                            {TIMEZONES.map((z) => (
                              <option key={z}>{z}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {fieldError && <p style={{ color: "var(--rose)", fontSize: 13, margin: "4px 0 0" }}>{fieldError}</p>}
                  </div>
                </section>

                <section className="jp-panel">
                  <div className="jp-panel-head">
                    <h2>Activate a deck</h2>
                    <p>Type the code printed inside your flashcard box to add that deck to your account.</p>
                  </div>
                  <div className="jp-panel-body">
                    <div className="jp-activate">
                      <div className="jp-input">
                        <input
                          type="text"
                          placeholder="GRAM-2201"
                          value={switchCode}
                          onChange={(e) => setSwitchCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === "Enter" && activateCode()}
                          autoComplete="off"
                          spellCheck={false}
                        />
                      </div>
                      <button type="button" className="jp-btn jp-solid" onClick={activateCode} disabled={switching}>
                        {switching ? "Adding…" : "Add deck"}
                      </button>
                    </div>
                    {switchError && <div className="jp-result">{switchError}</div>}

                    <div className="jp-decks">
                      {decks.map((d) => {
                        const isActive = d.deckId === activeDeckId;
                        return (
                          <div key={d.deckId} className="jp-deck-row">
                            <span className="jp-sq">{d.code.split("-")[0]}</span>
                            <div className="jp-txt">
                              <b>{pick(d.catalog.name)}</b>
                              <span>{d.capacity} cards</span>
                            </div>
                            {isActive ? (
                              <span className="jp-verified">Active</span>
                            ) : (
                              <button type="button" className="jp-btn" onClick={() => onSetActiveDeck(d.deckId)}>
                                Switch to this
                              </button>
                            )}
                            <span className="jp-code-tag">{d.code}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <section className="jp-panel">
                  <div className="jp-panel-head">
                    <h2>Sign out</h2>
                    <p>Ends the session on this device. Your decks, progress and certificates stay put — sign back in with your code.</p>
                  </div>
                  <div className="jp-panel-body">
                    <button type="button" className="jp-btn" onClick={onSignOut}>
                      Sign out
                    </button>
                  </div>
                </section>

                <section className="jp-panel jp-danger">
                  <div className="jp-panel-head">
                    <h2>Delete account</h2>
                    <p>Your progress and certificates are removed for good on this device.</p>
                  </div>
                  <div className="jp-panel-body">
                    <button type="button" className="jp-btn jp-ghost-danger" onClick={deleteAccount} disabled={deleted}>
                      {deleted ? "Account deleted" : deleteArmed ? "Click again to confirm" : "Delete my account"}
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* ============ STUDY SETTINGS — Daily goal and Study plan are real
                (see storage.js); Study preferences and Reminders below them
                still aren't backed by anything. ============ */}
            {tab === "study" && (
              <div>
                <section className="jp-panel">
                  <div className="jp-panel-head">
                    <h2>Daily goal</h2>
                    <p>How many cards you want to study each day.</p>
                  </div>
                  <div className="jp-panel-body">
                    <div className="jp-goals">
                      {GOALS.map((g) => (
                        <button key={g.n} type="button" className={`jp-goal${goal === g.n ? " jp-on" : ""}`} onClick={() => chooseGoal(g.n)}>
                          {g.n} <small>{g.label}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="jp-panel">
                  <div className="jp-panel-head">
                    <h2>Study plan</h2>
                    <p>Pick the days you want to study, what to study, and how many cards. Add more than one — e.g. maths on Monday, history on Thursday.</p>
                  </div>
                  <div className="jp-panel-body">
                    {studyDecks.length === 0 ? (
                      <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
                        Activate a course deck above to build a study plan.
                      </p>
                    ) : (
                      <>
                        <div className="jp-field">
                          <label>Which days?</label>
                          <div className="jp-goals" style={{ marginBottom: 10 }}>
                            {PLAN_DAYS.map((d) => (
                              <button
                                key={d.k}
                                type="button"
                                className={`jp-goal${planDays.has(d.k) ? " jp-on" : ""}`}
                                onClick={() => toggleDay(d.k)}
                              >
                                {d.label}
                              </button>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                            <button type="button" className="jp-btn jp-small" onClick={() => quickDays("weekdays")}>Mon–Fri</button>
                            <button type="button" className="jp-btn jp-small" onClick={() => quickDays("weekend")}>Weekend</button>
                            <button type="button" className="jp-btn jp-small" onClick={() => quickDays("everyday")}>Every day</button>
                            <button type="button" className="jp-btn jp-small" onClick={() => quickDays("clear")}>Clear</button>
                          </div>
                        </div>

                        <div className="jp-two">
                          <div className="jp-field">
                            <label htmlFor="sp-deck">Subject</label>
                            <div className="jp-input">
                              <select
                                id="sp-deck"
                                value={planDeckId}
                                onChange={(e) => {
                                  setPlanDeckId(e.target.value);
                                  setPlanLesson("all");
                                }}
                              >
                                {studyDecks.map((d) => (
                                  <option key={d.deckId} value={d.deckId}>
                                    {pick(d.catalog?.name) || d.subject}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="jp-field">
                            <label htmlFor="sp-lesson">Lesson</label>
                            <div className="jp-input">
                              <select id="sp-lesson" value={planLesson} onChange={(e) => setPlanLesson(e.target.value)}>
                                <option value="all">All lessons · whatever is due</option>
                                {planLessons.map((l, i) => (
                                  <option key={l.id} value={i}>
                                    {pick(l.title)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="jp-field">
                          <label htmlFor="sp-mode">Exercise</label>
                          <div className="jp-input">
                            <select id="sp-mode" value={planMode} onChange={(e) => setPlanMode(e.target.value)}>
                              {PLAN_MODES.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="jp-field">
                          <label>How many cards each day?</label>
                          <div className="jp-goals">
                            {PLAN_CARD_PRESETS.map((n) => (
                              <button
                                key={n}
                                type="button"
                                className={`jp-goal${planCards === n ? " jp-on" : ""}`}
                                onClick={() => setPlanCards(n)}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                          <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--muted)" }}>
                            About <b style={{ color: "var(--ink)", fontWeight: 600 }}>{planMinutes} minute{planMinutes === 1 ? "" : "s"}</b> a day.
                          </p>
                        </div>

                        <button type="button" className="jp-btn jp-solid" onClick={savePlan} disabled={planDays.size === 0}>
                          Add this plan
                        </button>
                      </>
                    )}

                    {plans.length > 0 && (
                      <div style={{ marginTop: 22, borderTop: "1px solid var(--hair)", paddingTop: 18 }}>
                        {plans.map((p) => (
                          <div key={p.id} className="jp-deck-row">
                            <span className="jp-sq">{p.days.length}×</span>
                            <div className="jp-txt">
                              <b>
                                {p.deckName} · {p.cards} cards
                              </b>
                              <span>
                                {PLAN_DAYS.filter((d) => p.days.includes(d.k)).map((d) => d.label).join(", ")} · {p.lessonLabel} ·{" "}
                                {PLAN_MODES.find((m) => m.id === p.mode)?.label}
                              </span>
                            </div>
                            <button type="button" className="jp-btn jp-small" onClick={() => deletePlan(p.id)}>
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {plans.length > 0 && (
                  <section className="jp-panel">
                    <div className="jp-panel-head">
                      <h2>Your week</h2>
                    </div>
                    <div className="jp-panel-body">
                      <div className="jp-week">
                        {weekByDay.map((d) => (
                          <div key={d.k} className={`jp-weekrow${d.cards === 0 ? " jp-rest" : ""}`}>
                            <span className="jp-dn">{d.label}</span>
                            <span className="jp-cnt">{d.cards === 0 ? "rest" : `${d.cards} cards`}</span>
                          </div>
                        ))}
                      </div>
                      <div className="jp-plantotal">
                        <span>Cards each week</span>
                        <b>{weeklyPlanTotal}</b>
                      </div>
                    </div>
                  </section>
                )}

                <div className="jp-tip">
                  <b>A small tip</b>
                  Three or four days of 10 cards beats one day of 40. Short and often is how memory sticks.
                </div>

                <section className="jp-panel" style={{ marginTop: 20 }}>
                  <div className="jp-panel-head">
                    <h2>Study preferences</h2>
                  </div>
                  <div className="jp-panel-body">
                    <div className="jp-srow">
                      <div className="jp-txt">
                        <b>Shuffle cards</b>
                        <span>Study in a new order every time.</span>
                      </div>
                      <Switch checked={shuffle} onChange={setShuffle} />
                    </div>
                    <div className="jp-srow">
                      <div className="jp-txt">
                        <b>Sound effects</b>
                        <span>A short chime on a correct answer.</span>
                      </div>
                      <Switch checked={sound} onChange={setSound} />
                    </div>
                  </div>
                </section>

                <section className="jp-panel">
                  <div className="jp-panel-head">
                    <h2>Reminders</h2>
                  </div>
                  <div className="jp-panel-body">
                    <div className="jp-srow">
                      <div className="jp-txt">
                        <b>Daily study reminder</b>
                        <span>A small nudge if you have not studied yet.</span>
                      </div>
                      <Switch checked={dailyReminder} onChange={setDailyReminder} />
                    </div>
                    <div className="jp-srow">
                      <div className="jp-txt">
                        <b>Weekly progress email</b>
                        <span>Every Sunday evening.</span>
                      </div>
                      <Switch checked={weeklyEmail} onChange={setWeeklyEmail} />
                    </div>
                    <div className="jp-field" style={{ marginTop: 18, maxWidth: 220 }}>
                      <label htmlFor="pf-time">Reminder time</label>
                      <div className="jp-input">
                        <input id="pf-time" type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* ============ PASSWORD (this app has no password auth — demo only) ============ */}
            {tab === "password" && (
              <div>
                <section className="jp-panel">
                  <div className="jp-panel-head">
                    <h2>Change password</h2>
                    <p>Use 8 characters or more. A long sentence is easier to remember than a short mess.</p>
                  </div>
                  <div className="jp-panel-body">
                    <form onSubmit={submitPassword}>
                      <div className="jp-field" style={{ maxWidth: 360 }}>
                        <label htmlFor="pw-cur">Current password</label>
                        <div className="jp-input">
                          <input id="pw-cur" type="password" placeholder="••••••••" value={pw.cur} onChange={(e) => setPw((p) => ({ ...p, cur: e.target.value }))} />
                        </div>
                      </div>
                      <div className="jp-field" style={{ maxWidth: 360 }}>
                        <label htmlFor="pw-new1">New password</label>
                        <div className="jp-input">
                          <input
                            id="pw-new1"
                            type="password"
                            placeholder="At least 8 characters"
                            value={pw.new1}
                            onChange={(e) => setPw((p) => ({ ...p, new1: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="jp-field" style={{ maxWidth: 360 }}>
                        <label htmlFor="pw-new2">Repeat new password</label>
                        <div className="jp-input">
                          <input
                            id="pw-new2"
                            type="password"
                            placeholder="Type it again"
                            value={pw.new2}
                            onChange={(e) => setPw((p) => ({ ...p, new2: e.target.value }))}
                          />
                        </div>
                      </div>
                      {pwError && <p style={{ color: "var(--rose)", fontSize: 13, margin: "0 0 12px" }}>{pwError}</p>}
                      <button type="submit" className="jp-btn jp-solid" style={{ marginTop: 6 }} disabled={pwStatus === "loading"}>
                        {pwStatus === "loading" ? "Updating…" : pwStatus === "done" ? "Updated ✓" : "Update password"}
                      </button>
                    </form>
                  </div>
                </section>

                <section className="jp-panel">
                  <div className="jp-panel-head">
                    <h2>Signed in devices</h2>
                    <p>Sign out anywhere you do not recognise.</p>
                  </div>
                  <div className="jp-panel-body">
                    <div className="jp-srow">
                      <div className="jp-txt">
                        <b>This browser</b>
                        <span>This device · active now</span>
                      </div>
                      <span className="jp-verified">Current</span>
                    </div>
                    {!otherDeviceGone && (
                      <div className="jp-srow">
                        <div className="jp-txt">
                          <b>Another device</b>
                          <span>Last used 2 days ago</span>
                        </div>
                        <button type="button" className="jp-btn" onClick={() => setOtherDeviceGone(true)}>
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>

      {tab === "personal" && dirty && (
        <div className="jp-savebar">
          <p>You have unsaved changes</p>
          <button type="button" className="jp-btn" onClick={cancel}>
            Cancel
          </button>
          <button type="button" className="jp-btn jp-solid" onClick={save}>
            Save changes
          </button>
        </div>
      )}
    </div>
  );
}
