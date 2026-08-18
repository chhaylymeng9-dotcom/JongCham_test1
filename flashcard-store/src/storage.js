/* ---------- storage ----------
Every read/write to localStorage goes through here, namespaced under `ic.`.
Keeping it in one place means swapping in a real backend later is a change
to this file only — nothing else touches localStorage directly.

All reads are defensive: private-browsing modes and disabled storage throw
on access, and a half-written value shouldn't take the app down.
--------------------------------- */

const PREFIX = "ic.";

// Keys written by the pre-namespace version of the app, read once so an
// existing customer's order history survives the upgrade.
const LEGACY_KEYS = { invoices: "invoices" };

export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw !== null) return JSON.parse(raw);
    const legacy = LEGACY_KEYS[key] && localStorage.getItem(LEGACY_KEYS[key]);
    if (legacy) {
      const migrated = JSON.parse(legacy);
      writeStore(key, migrated);
      return migrated;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false; // quota exceeded or storage disabled — caller carries on
  }
}

export function removeStore(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* nothing to do */
  }
}

/* ---------- device identity ----------
Used to enforce "one activation code, one device". This is a client-side
lock only: clearing site data resets it. Real enforcement needs the check
to happen server-side against the account.
--------------------------------- */
export function getDeviceId() {
  let id = readStore("device_id", null);
  if (!id) {
    id = crypto.randomUUID();
    writeStore("device_id", id);
  }
  return id;
}

/* ---------- orders ---------- */
export function getInvoices() {
  const list = readStore("invoices", []);
  return Array.isArray(list) ? list : [];
}

export function saveInvoice(invoice) {
  writeStore("invoices", [invoice, ...getInvoices()]);
}

export function clearInvoices() {
  writeStore("invoices", []);
}

/* ---------- course progress ----------
Shape: { [deckId]: { lessons: { [lessonId]: true }, bestScore: 0..1 } }
--------------------------------- */
export function getProgress() {
  const p = readStore("progress", {});
  return p && typeof p === "object" ? p : {};
}

export function getDeckProgress(deckId) {
  return getProgress()[deckId] || { lessons: {}, bestScore: null };
}

export function setLessonComplete(deckId, lessonId, status) {
  const all = getProgress();
  const deck = all[deckId] || { lessons: {}, bestScore: null };
  const lessons = { ...deck.lessons };
  if (status) lessons[lessonId] = status;
  else delete lessons[lessonId];
  writeStore("progress", { ...all, [deckId]: { ...deck, lessons } });
}

export function recordExamScore(deckId, ratio) {
  const all = getProgress();
  const deck = all[deckId] || { lessons: {}, bestScore: null };
  const best = deck.bestScore == null ? ratio : Math.max(deck.bestScore, ratio);
  writeStore("progress", { ...all, [deckId]: { ...deck, bestScore: best } });
}

/* ---------- customize-set card designs ----------
Only decks flagged `customizable` reach this — full card-by-card design
happens after purchase, gated behind the deck's activation code, so it's
keyed by deckId the same way lesson progress is.
--------------------------------- */
export function getCustomDesign(deckId) {
  const all = readStore("custom_designs", {});
  return (all && typeof all === "object" && all[deckId]) || null;
}

export function setCustomDesign(deckId, design) {
  const all = readStore("custom_designs", {});
  writeStore("custom_designs", { ...(all && typeof all === "object" ? all : {}), [deckId]: design });
}

/* ---------- study time ----------
Wall-clock time spent with a Lessons/Practice/Exam tab open, accumulated
across every session (see useStudyTimer.js). Not activity-aware — a tab
left open in the background still counts — good enough for a rough
"study time" stat, not a productivity tracker. */
export function getStudySeconds() {
  const n = readStore("study_seconds", 0);
  return typeof n === "number" && n >= 0 ? n : 0;
}

export function addStudySeconds(seconds) {
  if (!(seconds > 0)) return;
  writeStore("study_seconds", getStudySeconds() + Math.round(seconds));
}

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

/* ---------- day streak ----------
A calendar-day activity log — logStudyDay() marks today whenever
useStudyTimer flushes time. Streak counts consecutive days up to today;
if today has no activity yet, it counts back from yesterday instead, so
the streak doesn't look broken first thing in the morning before you've
opened the app. */
export function logStudyDay() {
  const days = getStudyDays();
  const today = dateKey();
  if (!days.includes(today)) writeStore("study_days", [...days, today].sort());
}

export function getStudyDays() {
  const d = readStore("study_days", []);
  return Array.isArray(d) ? d : [];
}

export function getStreak() {
  const days = new Set(getStudyDays());
  const oneDay = 86400000;

  let cursor = new Date();
  if (!days.has(dateKey(cursor))) cursor = new Date(cursor.getTime() - oneDay);
  let current = 0;
  while (days.has(dateKey(cursor))) {
    current++;
    cursor = new Date(cursor.getTime() - oneDay);
  }

  let best = 0;
  let run = 0;
  let prevTime = null;
  for (const day of [...days].sort()) {
    const t = new Date(day).getTime();
    run = prevTime != null && Math.round((t - prevTime) / oneDay) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prevTime = t;
  }

  return { current, best: Math.max(best, current) };
}

/* ---------- apple harvest ----------
Once a streak *run* passes 100 consecutive study days, day 101 onward
earns one apple per day. Apples are tallied per run (same consecutive-day
grouping getStreak() uses for `best`) so a broken streak doesn't erase
what was already picked — only the tree itself goes back to a sapling;
the apples move to a separate "spent" ledger once redeemed, so redeeming
a reward can't be undone by studying less. */
function studyRuns() {
  const days = [...new Set(getStudyDays())].sort();
  const oneDay = 86400000;
  const runs = [];
  let run = [];
  let prevTime = null;
  for (const day of days) {
    const t = new Date(day).getTime();
    if (prevTime != null && Math.round((t - prevTime) / oneDay) === 1) {
      run.push(day);
    } else {
      if (run.length) runs.push(run);
      run = [day];
    }
    prevTime = t;
  }
  if (run.length) runs.push(run);
  return runs;
}

export function getHarvest() {
  // Two sources feed the same pool: the streak tree (1/day past a
  // 100-day run) and daily tasks (see syncDailyTasks below) — a fast
  // path to apples that doesn't require months of an unbroken streak.
  const streakApples = studyRuns().reduce((sum, run) => sum + Math.max(0, run.length - 100), 0);
  const taskApples = readStore("task_apples_earned", 0);
  const earned = streakApples + taskApples;
  const spent = readStore("apples_spent", 0);
  return { earned, spent, available: Math.max(0, earned - spent) };
}

export function getClaimedRewards() {
  const c = readStore("apples_claimed", []);
  return Array.isArray(c) ? c : [];
}

// The actual codes issued by claimReward(), so a claimed voucher can still
// show its code later (the Vouchers page's "Used" list) instead of only
// being remembered as "claimed" with nothing to display.
export function getVouchers() {
  const v = readStore("apples_vouchers", []);
  return Array.isArray(v) ? v : [];
}

// Looks up a claimed-but-not-yet-redeemed voucher by its code — spending
// apples on a reward and actually redeeming it at checkout are two
// separate steps, so this only matches ones without a usedAt yet.
export function findVoucher(code) {
  const wanted = code.trim().toUpperCase();
  return getVouchers().find((v) => v.code === wanted && !v.usedAt) ?? null;
}

// Marks a voucher permanently spent once Checkout actually applies it to
// a placed order — a code can discount exactly one order, same as a
// reward can only be claimed once.
export function markVoucherUsed(code) {
  const next = getVouchers().map((v) => (v.code === code ? { ...v, usedAt: new Date().toISOString() } : v));
  writeStore("apples_vouchers", next);
}

// Returns the voucher code on success, or null if the reward is already
// claimed or there aren't enough apples — callers should treat null as
// "nothing happened" rather than an error.
export function claimReward(rewardId, cost) {
  const { available } = getHarvest();
  const claimed = getClaimedRewards();
  if (available < cost || claimed.includes(rewardId)) return null;
  const code = `APL-${rewardId.toUpperCase()}-${Math.floor(1000 + Math.random() * 8999)}`;
  writeStore("apples_spent", readStore("apples_spent", 0) + cost);
  writeStore("apples_claimed", [...claimed, rewardId]);
  writeStore("apples_vouchers", [...getVouchers(), { rewardId, code, claimedAt: new Date().toISOString() }]);
  return code;
}

/* ---------- stars ----------
A separate balance from apples, spent from the Learn view to add a new
course directly (see CoursePicker in LessonPath.jsx) rather than
through a real-money checkout. Seeded so the picker is usable right
away. Three ways in, all through the star shop (StarShop.jsx, opened by
clicking the stars pill): a simulated top-up purchase, one free daily
claim, and trading apples from the harvest. */
const STARS_SEED = 1000;

export function getStars() {
  const n = readStore("stars_balance", STARS_SEED);
  return typeof n === "number" && n >= 0 ? n : STARS_SEED;
}

// Returns true and deducts on success, false (untouched) if the balance
// can't cover it — callers should treat false as "nothing happened."
export function spendStars(amount) {
  if (!(amount > 0)) return false;
  const balance = getStars();
  if (balance < amount) return false;
  writeStore("stars_balance", balance - amount);
  return true;
}

// Credits the balance. The caller decides where the stars came from —
// this doesn't take payment (the shop's checkout is a simulation, same
// as Plans.jsx's) and doesn't check anything.
export function addStars(amount) {
  if (!(amount > 0)) return false;
  writeStore("stars_balance", getStars() + Math.round(amount));
  return true;
}

/* the free daily claim — one per calendar day, keyed by date so it
   resets on its own, the same trick recordCardsStudied uses. */
export const DAILY_STARS = 50;

export function dailyStarsClaimed() {
  return readStore("stars_daily_claim", null) === dateKey();
}

// Returns how many stars were credited, or 0 if today's is already taken.
export function claimDailyStars() {
  if (dailyStarsClaimed()) return 0;
  writeStore("stars_daily_claim", dateKey());
  addStars(DAILY_STARS);
  return DAILY_STARS;
}

/* apples → stars. Apples are the slow currency (a streak past 100 days,
   or daily tasks) and normally buy vouchers via claimReward; this is a
   second thing to spend them on, so it books the cost the same way — by
   adding to apples_spent, which getHarvest() subtracts. */
export const STARS_PER_APPLE = 200;

// Returns the stars credited, or 0 if the harvest can't cover it.
export function exchangeApplesForStars(apples = 1) {
  if (!(apples > 0)) return 0;
  if (getHarvest().available < apples) return 0;
  writeStore("apples_spent", readStore("apples_spent", 0) + apples);
  const stars = apples * STARS_PER_APPLE;
  addStars(stars);
  return stars;
}

/* ---------- the Pro free trial ----------
One free week of Pro, started from the profile or the plans page and kept
per browser (the same limit the activation lock has — clearing site data
resets it, real enforcement needs an account server). Like session.plan
itself this is cosmetic: nothing in the app is actually gated, so the
trial changes what the plan panel says, not what works. */
export const TRIAL_DAYS = 7;

export function getProTrial() {
  const startedAt = readStore("pro_trial_started", null);
  if (typeof startedAt !== "string") {
    return { started: false, active: false, expired: false, daysLeft: 0, startedAt: null, endsAt: null };
  }
  const start = new Date(startedAt);
  if (Number.isNaN(start.getTime())) {
    return { started: false, active: false, expired: false, daysLeft: 0, startedAt: null, endsAt: null };
  }
  const endsAt = new Date(start.getTime() + TRIAL_DAYS * 864e5);
  const msLeft = endsAt.getTime() - Date.now();
  return {
    started: true,
    active: msLeft > 0,
    expired: msLeft <= 0,
    // a trial with 30 minutes left still reads as "1 day left", not "0"
    daysLeft: Math.max(0, Math.ceil(msLeft / 864e5)),
    startedAt,
    endsAt: endsAt.toISOString(),
  };
}

// Returns the fresh trial, or null if this browser already had one.
export function startProTrial() {
  if (readStore("pro_trial_started", null)) return null;
  writeStore("pro_trial_started", new Date().toISOString());
  return getProTrial();
}

/* ---------- daily goal ----------
A daily target (cards answered in Practice or Exam) plus a per-day
counter that naturally resets each day since it's keyed by date. The
goal itself is set from Profile.jsx's "Study settings" tab. */
export function getDailyGoal() {
  const n = readStore("daily_goal", 20);
  return typeof n === "number" && n > 0 ? n : 20;
}

export function setDailyGoal(n) {
  if (!(n > 0)) return;
  writeStore("daily_goal", n);
}

export function recordCardsStudied(n = 1) {
  const all = readStore("cards_studied_by_day", {});
  const today = dateKey();
  writeStore("cards_studied_by_day", { ...(all && typeof all === "object" ? all : {}), [today]: (all?.[today] ?? 0) + n });
}

export function getCardsStudiedToday() {
  const all = readStore("cards_studied_by_day", {});
  return (all && typeof all === "object" && all[dateKey()]) || 0;
}

// Best EXAM score of the day, 0-100 (not Practice — Practice.jsx is
// deliberately never scored into progress, "somewhere you can be wrong
// cheaply", so the daily-task score check only looks at real exam
// attempts). Keeps the highest of however many exams get taken, same
// "best, not last" idea recordExamScore already uses for a deck's
// all-time bestScore.
export function recordDailyExamScore(pct) {
  const all = readStore("exam_score_by_day", {});
  const today = dateKey();
  const prev = (all && typeof all === "object" && all[today]) || 0;
  writeStore("exam_score_by_day", { ...(all && typeof all === "object" ? all : {}), [today]: Math.max(prev, pct) });
}

export function getBestExamScoreToday() {
  const all = readStore("exam_score_by_day", {});
  return (all && typeof all === "object" && all[dateKey()]) || 0;
}

/* ---------- daily tasks ----------
Three real, already-tracked signals turned into a small game: today's
study goal, today's due cards cleared, and today's best exam score
(Practice.jsx is intentionally never scored — see its own header
comment — so this only looks at Exam.jsx). Each is auto-detected
(not a manual checkbox — ticking a box
without doing the work would defeat the point) and grants one apple the
moment it first becomes true; finishing all three the same day adds a
2-apple bonus, and a full 7-for-7 week adds 5. Every apple lands in the
same pool getHarvest() reports and the Vouchers page spends — there's no
separate "task currency". syncDailyTasks() is idempotent (safe to call
on every relevant page load) since it only ever grants a given day's or
week's apples once, recorded in daily_tasks / week_bonus_claimed. */
const TASK_IDS = ["goal", "due", "score"];
const DAILY_TASK_APPLE = 1;
const DAILY_BONUS_APPLE = 2;
const WEEKLY_BONUS_APPLE = 5;

function getDailyTaskLog() {
  const log = readStore("daily_tasks", {});
  return log && typeof log === "object" ? log : {};
}

function weekFromLog(log) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() + (now.getDay() === 0 ? -6 : 1 - now.getDay()));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = dateKey(d);
    const rec = log[key];
    return { key, isToday: key === dateKey(now), complete: !!(rec && TASK_IDS.every((id) => rec[id])) };
  });
  const weekKey = dateKey(monday);
  const claimedWeeks = readStore("week_bonus_claimed", []);
  return {
    days,
    allDone: days.every((d) => d.complete),
    claimed: Array.isArray(claimedWeeks) && claimedWeeks.includes(weekKey),
    weekKey,
  };
}

// Today's task/bonus state without granting anything — safe to call just
// to render, e.g. before the caller has gathered the live signals below.
export function getDailyTaskState() {
  const log = getDailyTaskLog();
  const day = log[dateKey()] ?? { goal: false, due: false, score: false, bonus: false };
  return { ...day, doneCount: TASK_IDS.filter((id) => day[id]).length, week: weekFromLog(log) };
}

// Compares today's live signals against what's already been recorded,
// grants apples for whatever just became true, and returns the resulting
// state. `totalDue` is the caller's live sum across owned decks (storage.js
// doesn't know about deck data) — 0 due counts as the task being clear.
export function syncDailyTasks({ cardsToday, dailyGoal, totalDue, bestScoreToday }) {
  const log = getDailyTaskLog();
  const today = dateKey();
  const day = { goal: false, due: false, score: false, bonus: false, ...log[today] };

  const live = { goal: cardsToday >= dailyGoal, due: totalDue === 0, score: bestScoreToday >= 80 };
  let earnedNow = 0;
  TASK_IDS.forEach((id) => {
    if (live[id] && !day[id]) {
      day[id] = true;
      earnedNow += DAILY_TASK_APPLE;
    }
  });
  const doneCount = TASK_IDS.filter((id) => day[id]).length;
  if (doneCount === 3 && !day.bonus) {
    day.bonus = true;
    earnedNow += DAILY_BONUS_APPLE;
  }

  const nextLog = { ...log, [today]: day };
  if (earnedNow > 0) writeStore("daily_tasks", nextLog);

  const week = weekFromLog(nextLog);
  if (week.allDone && !week.claimed) {
    const claimedWeeks = readStore("week_bonus_claimed", []);
    writeStore("week_bonus_claimed", [...(Array.isArray(claimedWeeks) ? claimedWeeks : []), week.weekKey]);
    earnedNow += WEEKLY_BONUS_APPLE;
    week.claimed = true;
  }

  if (earnedNow > 0) writeStore("task_apples_earned", readStore("task_apples_earned", 0) + earnedNow);

  return { ...day, doneCount, week, earnedNow };
}

/* ---------- study plans ----------
Weekly study-day rules a student sets for themselves (Profile → Study
settings). Purely a personal organizer: saving a plan doesn't filter,
schedule, or unlock anything elsewhere in the app — there's no
notification system to actually remind anyone, so a plan is only ever
what it says it is, a note to self. */
export function getStudyPlans() {
  const list = readStore("study_plans", []);
  return Array.isArray(list) ? list : [];
}

export function addStudyPlan(plan) {
  const entry = { id: `sp_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, ...plan };
  writeStore("study_plans", [...getStudyPlans(), entry]);
  return entry;
}

export function removeStudyPlan(id) {
  writeStore("study_plans", getStudyPlans().filter((p) => p.id !== id));
}

/* ---------- spaced repetition ("due today") ----------
A minimal fixed-interval scheduler, not a full SM-2 implementation:
answering an item right pushes its due date out along INTERVAL_DAYS;
answering wrong resets it to due again tomorrow. Keyed by deckId+itemId
since the same subject can be owned as more than one deck. Only
meaningful for subjects with a fixed question bank (see
questions.js's hasFixedBank) — math's bank is generated fresh on every
draw, so it has no stable item identity to schedule against, and is
excluded from "due" entirely rather than faked. An item that's never
been reviewed counts as due immediately, same as a new card in any SRS
app. --------------------------------- */
const INTERVAL_DAYS = [1, 3, 7, 14, 30];

function reviewKey(deckId, itemId) {
  return `${deckId}::${itemId}`;
}

export function getReviewState() {
  const s = readStore("review_state", {});
  return s && typeof s === "object" ? s : {};
}

export function recordReview(deckId, itemId, correct) {
  const all = getReviewState();
  const key = reviewKey(deckId, itemId);
  const prevStep = all[key]?.step ?? -1;
  const step = correct ? Math.min(prevStep + 1, INTERVAL_DAYS.length - 1) : 0;
  const days = correct ? INTERVAL_DAYS[step] : 1;
  const dueAt = new Date(Date.now() + days * 86400000).toISOString();
  writeStore("review_state", { ...all, [key]: { step, dueAt } });
}

export function getDueItemIds(deckId, itemIds) {
  if (itemIds.length === 0) return [];
  const all = getReviewState();
  const now = Date.now();
  return itemIds.filter((id) => {
    const st = all[reviewKey(deckId, id)];
    return !st || new Date(st.dueAt).getTime() <= now;
  });
}

export function getDueCount(deckId, itemIds) {
  return getDueItemIds(deckId, itemIds).length;
}

/* ---------- certificates ---------- */
export function getCertificates() {
  const list = readStore("certificates", []);
  return Array.isArray(list) ? list : [];
}

export function saveCertificate(cert) {
  // One certificate per deck — a retake with a better score replaces it.
  const existing = getCertificates().filter((c) => c.deckId !== cert.deckId);
  writeStore("certificates", [cert, ...existing]);
}

export function deleteCertificate(certId) {
  writeStore("certificates", getCertificates().filter((c) => c.certId !== certId));
}

/* ---------- cart ---------- */
export function getCart() {
  const list = readStore("cart", []);
  return Array.isArray(list) ? list : [];
}

export function setCart(items) {
  writeStore("cart", items);
}

/* ---------- account session ----------
Shape: { name, email, ..., decks: [{ code, deckId, subject, capacity,
addedAt }], activeDeckId }. One account can own several decks — `decks`
is the list, `activeDeckId` is whichever one's dashboard is showing.

Older sessions were written flat (code/deckId/subject/capacity directly
on the session, one deck only) before multi-deck support existed —
normalized to the current shape on read so nothing downstream has to
know about the old format. --------------------------------------- */
function normalizeSession(s) {
  if (!s) return s;
  if (Array.isArray(s.decks)) return s;
  if (!s.deckId) return s;
  const { code, deckId, subject, capacity, ...rest } = s;
  return {
    ...rest,
    decks: [{ code, deckId, subject, capacity, addedAt: new Date().toISOString() }],
    activeDeckId: deckId,
  };
}

export function getSession() {
  return normalizeSession(readStore("session", null));
}

export function setSession(session) {
  writeStore("session", session);
}

export function clearSession() {
  removeStore("session");
}

export function updateSession(patch) {
  const current = getSession();
  if (!current) return null;
  const next = { ...current, ...patch };
  setSession(next);
  return next;
}

export function getActivationLock(code) {
  return readStore(`activation.${code}`, null);
}

export function setActivationLock(code, deviceId) {
  writeStore(`activation.${code}`, deviceId);
}

/* ---------- full local reset ----------
Used by "Delete account" on the profile page. This is a demo storefront
with everything kept in localStorage, so there's no server-side account
to delete — this wipes every key this app has ever written (progress,
certificates, cart, custom designs, activation locks, the session
itself) rather than just signing out. */
export function clearAllData() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX) || k === LEGACY_KEYS.invoices)
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* storage disabled — nothing to clear */
  }
}
