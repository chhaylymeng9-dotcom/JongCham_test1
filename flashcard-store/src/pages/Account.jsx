import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { resolveCode } from "../data/codes.js";
import { DECK_BY_ID, cardHasContent } from "../data/decks.js";
import { lessonsFor } from "../data/lessons.js";
import { bankItemIds, hasFixedBank } from "../data/questions.js";
import {
  DAILY_STARS,
  STARS_PER_APPLE,
  TRIAL_DAYS,
  addStars,
  claimDailyStars,
  claimReward,
  clearAllData,
  clearSession,
  dailyStarsClaimed,
  exchangeApplesForStars,
  getActivationLock,
  deleteCertificate,
  getBestExamScoreToday,
  getCardsStudiedToday,
  getCertificates,
  getClaimedRewards,
  getCustomDesign,
  getDailyGoal,
  getDeckProgress,
  getDeviceId,
  getDueCount,
  getHarvest,
  getProTrial,
  getSession,
  getStars,
  getStreak,
  getStudyDays,
  getStudySeconds,
  getVouchers,
  setActivationLock,
  setLessonComplete,
  setSession,
  spendStars,
  syncDailyTasks,
  updateSession,
} from "../storage.js";
import Lessons from "../account/Lessons.jsx";
import Practice from "../account/Practice.jsx";
import Exam from "../account/Exam.jsx";
import Design from "../account/Design.jsx";
import { CertificateList } from "../account/Certificate.jsx";
import AuthPanel from "../account/AuthPanel.jsx";
import Dashboard from "../account/Dashboard.jsx";
import Home from "../account/Home.jsx";
import LessonPath from "../account/LessonPath.jsx";
import Profile from "../account/Profile.jsx";
import Vouchers from "../account/Vouchers.jsx";
import Shop from "../account/Shop.jsx";
import StudyPlan from "../account/StudyPlan.jsx";
import DailyTasks from "../account/DailyTasks.jsx";
import Plans from "../account/Plans.jsx";
import MyDecks from "../account/MyDecks.jsx";
import Reveal from "../components/Reveal.jsx";
import { Alert, Button, Eyebrow, Field, LinkButton, Panel, Stat, Tabs } from "../ui.jsx";

/* ---------- Account ----------
Sign in with the code from the box, then work through that deck's course.

The one-device rule is enforced against a device id in local storage. It's
a demonstration of the rule, not a security boundary — clearing site data
resets it, and real enforcement has to happen server-side.
--------------------------------- */

export default function Account({ onGoToOrders, onBuildDeck, onGoToCart, onSessionChange }) {
  const { t, pick } = useI18n();
  const [session, setSessionRaw] = useState(() => getSession());
  // report sign-in / sign-out to the app shell so it can hide the
  // floating nav while a session is active
  const setSessionState = (next) => {
    setSessionRaw(next);
    onSessionChange?.(next);
  };
  const [tab, setTab] = useState(() => {
    const s = getSession();
    const active = s?.decks?.find((d) => d.deckId === s.activeDeckId) ?? s?.decks?.[0];
    return active && DECK_BY_ID[active.deckId]?.customizable ? "design" : "lessons";
  });
  const [progress, setProgress] = useState({ lessons: {}, bestScore: null });
  const [certificates, setCertificates] = useState([]);

  const [form, setForm] = useState({ name: "", code: "", email: "" });
  const [error, setError] = useState("");
  // AuthPanel (below) is a demo-only visual port with no code field, so it
  // can't reach the real signIn() — this toggle reveals the actual
  // code/name/email form as a fallback so signing in is possible at all.
  const [showCodeForm, setShowCodeForm] = useState(false);
  // "home" | "dashboard" | "profile" | "plans" | "vouchers" — a signed-in
  // student lands on "home" first (see the Home component), then drills
  // into a deck.
  const [view, setView] = useState("home");
  // which Profile tab to land on next time view becomes "profile" — reset
  // to "personal" at every normal entry point, set to "study" only by the
  // sidebar's More > Study plan shortcut
  const [profileTab, setProfileTab] = useState("personal");
  const [switchError, setSwitchError] = useState("");
  // A lesson node clicked on the home path lands here; the Lessons tab
  // opens that lesson and clears it again (see onConsumedOpen below).
  const [pendingLesson, setPendingLesson] = useState(null);
  // Records the node that was just finished so LessonPath can pulse it
  const [justDone, setJustDone] = useState(null);
  // Bumped after anything that moves a balance — claimReward(), and the
  // star shop's top-up/claim/trade — so the harvest, claimedRewards and
  // stars props below (read fresh from storage on every render, same as
  // streak/studyDays) pick the change up. None of those helpers has any
  // state of its own.
  const [walletTick, setWalletTick] = useState(0);
  const bumpWallet = useCallback(() => setWalletTick((n) => n + 1), []);

  function onClaimReward(rewardId, cost) {
    const code = claimReward(rewardId, cost);
    if (code) bumpWallet();
    return code;
  }

  /* ---------- the star shop (StarShop.jsx, opened from LessonPath) ----------
  Three ways to add stars. The purchase is a simulation — the shop's pay
  sheet takes no money, the same demo checkout Plans.jsx runs — so this
  just credits the balance. Claim and trade return how many stars landed
  (0 if storage refused), which is what the shop shows in its payoff. */
  function topUpStars(amount) {
    if (!addStars(amount)) return 0;
    bumpWallet();
    return amount;
  }

  function onClaimDailyStars() {
    const n = claimDailyStars();
    if (n) bumpWallet();
    return n;
  }

  function onTradeAppleForStars() {
    const n = exchangeApplesForStars(1);
    if (n) bumpWallet();
    return n;
  }

  const refresh = useCallback(() => {
    if (!session) return;
    const activeId = session.decks?.find((d) => d.deckId === session.activeDeckId)?.deckId ?? session.decks?.[0]?.deckId;
    if (!activeId) return;
    setProgress(getDeckProgress(activeId));
    setCertificates(getCertificates());
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function signIn(e) {
    e.preventDefault();
    setError("");

    const resolved = resolveCode(form.code);
    if (!resolved) return setError(t("account.errCode"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError(t("account.errEmail"));
    if (!form.name.trim()) return setError(t("account.errName"));

    const deviceId = getDeviceId();
    const lockedTo = getActivationLock(resolved.code);
    if (lockedTo && lockedTo !== deviceId) return setError(t("account.errDevice"));
    setActivationLock(resolved.code, deviceId);

    const next = {
      name: form.name.trim(),
      email: form.email.trim(),
      decks: [
        {
          code: resolved.code,
          deckId: resolved.deckId,
          subject: resolved.subject,
          capacity: resolved.capacity,
          addedAt: new Date().toISOString(),
        },
      ],
      activeDeckId: resolved.deckId,
    };
    setSession(next);
    setSessionState(next);
    setTab(resolved.deck.customizable ? "design" : "lessons");
  }

  function signOut() {
    clearSession();
    setSessionState(null);
    setForm({ name: "", code: "", email: "" });
  }

  function saveProfile(patch) {
    const next = updateSession(patch);
    if (next) setSessionState(next);
  }

  // Cosmetic only — see Plans.jsx. Doesn't unlock or restrict anything;
  // just lets the profile page's Plan and billing panel reflect a choice.
  function upgradePlan(planId) {
    const next = updateSession({ plan: planId });
    if (next) setSessionState(next);
  }

  // One account can own several decks — adding a code appends it to
  // session.decks rather than replacing the current one.
  function addDeck(codeRaw) {
    setSwitchError("");
    const resolved = resolveCode(codeRaw);
    if (!resolved) {
      setSwitchError(t("account.errCode"));
      return false;
    }
    if (session.decks.some((d) => d.deckId === resolved.deckId)) {
      setSwitchError("You already have this deck.");
      return false;
    }

    const deviceId = getDeviceId();
    const lockedTo = getActivationLock(resolved.code);
    if (lockedTo && lockedTo !== deviceId) {
      setSwitchError(t("account.errDevice"));
      return false;
    }
    setActivationLock(resolved.code, deviceId);

    const entry = {
      code: resolved.code,
      deckId: resolved.deckId,
      subject: resolved.subject,
      capacity: resolved.capacity,
      addedAt: new Date().toISOString(),
    };
    const next = { ...session, decks: [...session.decks, entry], activeDeckId: resolved.deckId };
    setSession(next);
    setSessionState(next);
    setTab(resolved.deck.customizable ? "design" : "lessons");
    setView("dashboard");
    return true;
  }

  // Switches which owned deck's dashboard is showing — no code needed,
  // just picking among decks already added. `targetTab` lets callers like
  // Home's "review due cards" jump straight to Practice instead of the
  // usual Lessons/Design landing tab.
  function setActiveDeck(deckId, targetTab) {
    if (!session.decks.some((d) => d.deckId === deckId)) return;
    // Still navigate even if it's already active — MyDecks calls this on
    // click regardless, e.g. to jump back to the deck you're already on.
    if (deckId !== session.activeDeckId) {
      const next = { ...session, activeDeckId: deckId };
      setSession(next);
      setSessionState(next);
    }
    setTab(targetTab ?? (DECK_BY_ID[deckId]?.customizable ? "design" : "lessons"));
    setView("dashboard");
  }

  // The course picker's "switch to an owned course" action — unlike
  // setActiveDeck above, this stays on the Learn view (LessonPath) instead
  // of jumping to the dashboard's tabs, since picking a course from the
  // strip is meant to swap the path in place.
  function switchActiveDeck(deckId) {
    if (!session.decks.some((d) => d.deckId === deckId) || deckId === session.activeDeckId) return;
    const next = { ...session, activeDeckId: deckId };
    setSession(next);
    setSessionState(next);
  }

  // The course picker's "buy with stars" action — an alternate, in-app-
  // currency path to owning a deck, alongside the real-money cart/checkout
  // + activation-code path (see addDeck above). Mirrors addDeck's
  // session.decks entry shape; the "code" is synthetic since no physical
  // code was issued.
  function buyCourseWithStars(deckId, price) {
    const catalogDeck = DECK_BY_ID[deckId];
    if (!catalogDeck || session.decks.some((d) => d.deckId === deckId)) return false;
    if (!spendStars(price)) return false;
    const entry = {
      code: `STARS-${deckId.toUpperCase()}-${Math.floor(1000 + Math.random() * 8999)}`,
      deckId,
      subject: catalogDeck.subject,
      capacity: catalogDeck.capacity,
      addedAt: new Date().toISOString(),
    };
    const next = { ...session, decks: [...session.decks, entry], activeDeckId: deckId };
    setSession(next);
    setSessionState(next);
    return true;
  }

  function deleteAccount() {
    clearAllData();
    setSessionState(null);
    setForm({ name: "", code: "", email: "" });
    setView("dashboard");
  }

  function removeCertificate(certId) {
    deleteCertificate(certId);
    setCertificates(getCertificates());
  }

  /* ---------- sign in ----------
  AuthPanel is a literal port of the supplied mockup — email/password UI,
  demo-only submit, no code field. The real course/deck sign-in needs a
  box code, so "Have a box code?" swaps to the actual form below. */
  if (!session) {
    if (showCodeForm) {
      return (
        <div className="max-w-md mx-auto px-5 sm:px-6 py-16 md:py-20">
          <LinkButton onClick={() => setShowCodeForm(false)} className="mb-6 inline-block">
            ← {t("account.tabSignIn")}
          </LinkButton>
          <Reveal>
            <Eyebrow>{t("account.eyebrow")}</Eyebrow>
            <h1 className="font-display text-2xl md:text-3xl mt-2 mb-2">{t("account.signInTitle")}</h1>
            <p className="text-sm text-ink/65 mb-8 leading-relaxed">{t("account.signInBody")}</p>
          </Reveal>

          <form onSubmit={signIn} className="space-y-4">
            <Field
              label={t("account.yourName")}
              hint={t("account.nameHint")}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Field
              label={t("checkout.email")}
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Field
              label={t("account.code")}
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
            />

            {error && <Alert tone="error">{error}</Alert>}

            <Button type="submit" full>
              {t("account.unlock")}
            </Button>
          </form>

        </div>
      );
    }
    return <AuthPanel onHaveCode={() => setShowCodeForm(true)} />;
  }

  if (view === "plans") {
    return (
      <Plans
        decksOwned={session.decks.length}
        currentPlan={session.plan ?? null}
        onBack={() => setView("profile")}
        onUpgrade={upgradePlan}
      />
    );
  }

  /* ---------- dashboard ---------- */
  // The active deck's own fields (code/subject/capacity) live in
  // session.decks now that an account can own several — everything below
  // reads from this entry rather than the session directly.
  const activeDeckEntry = session.decks.find((d) => d.deckId === session.activeDeckId) ?? session.decks[0];
  const rawDeck = DECK_BY_ID[activeDeckEntry.deckId];
  const isCustomizable = Boolean(rawDeck.customizable);
  // The Customize Set's real capacity is whatever the customer actually
  // bought, not the catalogue's default — a customer who ordered 120
  // cards gets a 120-card editor, not the default 20.
  const deck = isCustomizable ? { ...rawDeck, capacity: activeDeckEntry.capacity ?? rawDeck.capacity } : rawDeck;
  // Flattened so Dashboard/Lessons/Exam (which expect session.code etc.
  // for a single deck) don't need to know about the decks list at all.
  const flatSession = {
    ...session,
    code: activeDeckEntry.code,
    deckId: activeDeckEntry.deckId,
    subject: activeDeckEntry.subject,
    capacity: activeDeckEntry.capacity,
  };

  // Per-deck progress, shared by Home, the profile header stats, and the
  // Decks tab — Account.jsx otherwise only tracks progress for the one
  // active deck, but all three of those need every owned deck at once.
  function summarizeDeck(d) {
    const catalog = DECK_BY_ID[d.deckId];
    const isCustom = Boolean(catalog?.customizable);
    let pct = 0;
    let totalLessons = 0;
    let doneCount = 0;
    let hasCert = false;
    if (isCustom) {
      const design = getCustomDesign(d.deckId);
      const capacity = d.capacity ?? catalog.capacity;
      const designed = design ? design.cards.filter(cardHasContent).length : 0;
      pct = capacity ? Math.round((designed / capacity) * 100) : 0;
    } else {
      const prog = getDeckProgress(d.deckId);
      const deckLessons = lessonsFor(d.subject);
      totalLessons = deckLessons.length;
      doneCount = deckLessons.filter((l) => prog.lessons?.[l.id]).length;
      pct = totalLessons ? Math.round((doneCount / totalLessons) * 100) : 0;
      hasCert = certificates.some((c) => c.deckId === d.deckId);
    }
    const state = pct === 100 || hasCert ? "done" : pct > 0 ? "now" : "new";
    return { ...d, catalog, isCustom, pct, totalLessons, doneCount, hasCert, state };
  }

  if (view === "home") {
    const deckSummaries = session.decks.map(summarizeDeck);
    const activeLessons = isCustomizable ? [] : lessonsFor(activeDeckEntry.subject);
    const activeCompleted = progress.lessons ?? {};
    const activeDone = activeLessons.filter((l) => activeCompleted[l.id]).length;
    const activeNext = activeLessons.find((l) => !activeCompleted[l.id]);
    const activeAllDone = activeLessons.length > 0 && activeDone === activeLessons.length;

    // "Due" only exists for subjects with a fixed question bank — math has
    // no stable item identity to schedule against (see hasFixedBank).
    const dueByDeck = deckSummaries
      .filter((d) => hasFixedBank(d.subject))
      .map((d) => ({
        deckId: d.deckId,
        subject: d.subject,
        name: pick(d.catalog.name),
        dueCount: getDueCount(d.deckId, bankItemIds(d.subject)),
      }))
      .filter((d) => d.dueCount > 0)
      .sort((a, b) => b.dueCount - a.dueCount);

    // The Customize Set has no course to walk — it keeps the old home
    // screen; every course deck gets the lesson path instead.
    if (isCustomizable) {
      return (
        <Home
          session={session}
          deckName={pick(deck.name)}
          isCustomizable={isCustomizable}
          activeLessons={activeLessons}
          activeDone={activeDone}
          activeNext={activeNext}
          activeAllDone={activeAllDone}
          deckSummaries={deckSummaries}
          studySeconds={getStudySeconds()}
          dueByDeck={dueByDeck}
          streak={getStreak()}
          studyDays={getStudyDays()}
          dailyGoal={getDailyGoal()}
          cardsToday={getCardsStudiedToday()}
          onContinue={() => {
            setTab(isCustomizable ? "design" : activeAllDone ? "exam" : "lessons");
            setView("dashboard");
          }}
          onOpenDeck={setActiveDeck}
          onReviewDue={(deckId) => setActiveDeck(deckId, "practice")}
          onSeeAllDecks={() => {
            setTab("decks");
            setView("dashboard");
          }}
          onOpenProfile={() => { setProfileTab("personal"); setView("profile"); }}
          onOpenVouchers={() => setView("vouchers")}
          onOpenDailyTasks={() => setView("dailyTasks")}
          onGoToOrders={onGoToOrders}
          onBuildDeck={onBuildDeck}
          onSignOut={signOut}
        />
      );
    }

    return (
      <LessonPath
        deck={deck}
        lessons={activeLessons}
        completed={activeCompleted}
        name={session.name}
        streak={getStreak().current}
        apples={getHarvest().available}
        dailyGoal={getDailyGoal()}
        cardsToday={getCardsStudiedToday()}
        justDone={justDone}
        onClearJustDone={() => setJustDone(null)}
        currentDeckId={activeDeckEntry.deckId}
        ownedDeckIds={session.decks.map((d) => d.deckId)}
        stars={getStars()}
        dailyStarsClaimed={dailyStarsClaimed()}
        dailyStars={DAILY_STARS}
        starsPerApple={STARS_PER_APPLE}
        onSwitchCourse={switchActiveDeck}
        onBuyCourse={buyCourseWithStars}
        onTopUpStars={topUpStars}
        onClaimDailyStars={onClaimDailyStars}
        onTradeAppleForStars={onTradeAppleForStars}
        onBack={() => {
          setTab("decks");
          setView("dashboard");
        }}
        onOpenLesson={(lessonId, percent) => {
          if (typeof percent === "number") {
            const activeId = session.decks?.find((d) => d.deckId === session.activeDeckId)?.deckId ?? session.decks?.[0]?.deckId;
            setLessonComplete(activeId, lessonId, percent);
            refresh();
            // Just updating the percent - the user relies on LessonPath's own state for pulsing
            setJustDone(lessonId);
            return;
          }
          setPendingLesson(lessonId);
          setTab("lessons");
          setView("dashboard");
        }}
        onOpenExam={() => {
          setTab("exam");
          setView("dashboard");
        }}
        onOpenLessons={() => {
          setTab("lessons");
          setView("dashboard");
        }}
        onOpenPractice={() => {
          setTab("practice");
          setView("dashboard");
        }}
        onOpenCertificates={() => {
          setTab("certificates");
          setView("dashboard");
        }}
        onOpenVouchers={() => setView("vouchers")}
        onOpenShop={() => setView("shop")}
        onOpenPlans={() => setView("plans")}
        trial={getProTrial()}
        trialDays={TRIAL_DAYS}
        hasPlan={Boolean(session.plan)}
        onOpenProfile={() => { setProfileTab("personal"); setView("profile"); }}
        onOpenStudyPlan={() => setView("studyPlan")}
        onOpenDailyTasks={() => setView("dailyTasks")}
        onGoToCart={onGoToCart}
      />
    );
  }

  if (view === "profile") {
    // Real aggregates only — no invented "study time" or "streak", since
    // nothing in storage.js tracks either beyond studySeconds below.
    const deckSummaries = session.decks.map(summarizeDeck);
    const courseSummaries = deckSummaries.filter((d) => !d.isCustom);
    const memberSince = session.decks.reduce((min, d) => (!min || d.addedAt < min ? d.addedAt : min), null);
    const stats = {
      decksOwned: session.decks.length,
      courseDecks: courseSummaries.length,
      lessonsDone: courseSummaries.reduce((n, d) => n + d.doneCount, 0),
      lessonsTotal: courseSummaries.reduce((n, d) => n + d.totalLessons, 0),
      certificatesEarned: deckSummaries.filter((d) => d.hasCert).length,
      memberSince,
      studySeconds: getStudySeconds(),
    };
    return (
      <Profile
        session={session}
        deckName={pick(deck.name)}
        decks={session.decks.map((d) => ({ ...d, catalog: DECK_BY_ID[d.deckId] }))}
        activeDeckId={activeDeckEntry.deckId}
        stats={stats}
        onSetActiveDeck={setActiveDeck}
        onBack={() => setView("dashboard")}
        onOpenPlans={() => setView("plans")}
        onSave={saveProfile}
        onAddDeck={addDeck}
        switchError={switchError}
        onDeleteAccount={deleteAccount}
        onSignOut={signOut}
        initialTab={profileTab}
      />
    );
  }

  if (view === "studyPlan") {
    return (
      <StudyPlan
        decks={session.decks.map((d) => ({ ...d, catalog: DECK_BY_ID[d.deckId] }))}
        onBack={() => setView("home")}
        onOpenPractice={() => { setTab("practice"); setView("dashboard"); }}
      />
    );
  }

  if (view === "shop") {
    return (
      <Shop
        stars={getStars()}
        apples={getHarvest().available}
        dailyStarsClaimed={dailyStarsClaimed()}
        dailyStars={DAILY_STARS}
        starsPerApple={STARS_PER_APPLE}
        ownedDeckIds={session.decks.map((d) => d.deckId)}
        onBack={() => setView("home")}
        onBuyCourse={buyCourseWithStars}
        onStudyCourse={(deckId) => {
          switchActiveDeck(deckId);
          setView("home");
        }}
        onOpenVouchers={() => setView("vouchers")}
        onTopUpStars={topUpStars}
        onClaimDailyStars={onClaimDailyStars}
        onTradeAppleForStars={onTradeAppleForStars}
      />
    );
  }

  if (view === "vouchers") {
    return (
      <Vouchers
        harvest={getHarvest()}
        claimedRewards={getClaimedRewards()}
        vouchers={getVouchers()}
        onClaimReward={onClaimReward}
        onBack={() => setView("home")}
        onOpenDailyTasks={() => setView("dailyTasks")}
      />
    );
  }

  if (view === "dailyTasks") {
    const deckSummaries = session.decks.map(summarizeDeck);
    // Same "due" definition Home's own "Due today" panel uses — see the
    // hasFixedBank note above.
    const totalDue = deckSummaries
      .filter((d) => hasFixedBank(d.subject))
      .reduce((n, d) => n + getDueCount(d.deckId, bankItemIds(d.subject)), 0);
    const cardsToday = getCardsStudiedToday();
    const dailyGoal = getDailyGoal();
    const bestExamScoreToday = getBestExamScoreToday();
    const state = syncDailyTasks({ cardsToday, dailyGoal, totalDue, bestScoreToday: bestExamScoreToday });

    // the active course, for the progress card this page shows on phones
    // (the Learn rail keeps it on wider screens) — same numbers LessonPath
    // puts in its rail, read the same way
    const dtLessons = isCustomizable ? [] : lessonsFor(activeDeckEntry.subject);
    const dtCompleted = progress.lessons ?? {};
    const dtDone = dtLessons.filter((l) => dtCompleted[l.id]).length;
    const dtNext = dtLessons.find((l) => !dtCompleted[l.id]);
    const dtExamReady = dtLessons.length > 0 && !dtNext;

    return (
      <DailyTasks
        cardsToday={cardsToday}
        dailyGoal={dailyGoal}
        totalDue={totalDue}
        bestExamScoreToday={bestExamScoreToday}
        state={state}
        harvest={getHarvest()}
        claimedRewards={getClaimedRewards()}
        streak={getStreak().current}
        lessonsDone={dtDone}
        lessonsTotal={dtLessons.length}
        nextLabel={dtNext ? pick(dtNext.title) : dtExamReady ? t("lp.unitExam") : ""}
        examReady={dtExamReady}
        onContinue={
          dtLessons.length === 0
            ? undefined
            : () => {
                if (dtNext) setPendingLesson(dtNext.id);
                setTab(dtNext ? "lessons" : "exam");
                setView("dashboard");
              }
        }
        onBack={() => setView("home")}
        onOpenVouchers={() => setView("vouchers")}
      />
    );
  }

  const lessons = lessonsFor(activeDeckEntry.subject);
  const hasCourse = lessons.length > 0;
  const deckCertificates = certificates.filter((c) => c.deckId === activeDeckEntry.deckId);

  // Customizable decks (Customize Set) have no course, practice, exam or
  // certificate — the deck itself is the deliverable, so the only tab is
  // the card designer.
  const tabs = isCustomizable
    ? [{ id: "design", label: t("account.tab.design") }]
    : [
        { id: "lessons", label: t("account.tab.lessons"), badge: hasCourse ? lessons.length : null },
        ...(hasCourse ? [{ id: "practice", label: t("account.tab.practice") }] : []),
        ...(hasCourse ? [{ id: "exam", label: t("account.tab.exam") }] : []),
        {
          id: "certificates",
          label: t("account.tab.certificates"),
          badge: deckCertificates.length || null,
        },
      ];

  /* ---------- Customize Set: unchanged, no course/practice/exam/certificate ---------- */
  if (isCustomizable) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-16 md:py-20">
        <Reveal className="flex items-start justify-between gap-6 flex-wrap mb-7">
          <div>
            <Eyebrow>{t("account.yourDeck")}</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl mt-1.5">{pick(deck.name)}</h1>
            <p className="font-mono text-xs text-ink/45 mt-2">{activeDeckEntry.code}</p>
          </div>
          <LinkButton onClick={signOut}>{t("account.signOut")}</LinkButton>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <Stat label={t("account.learner")} value={session.name} />
          <Stat label={t("account.capacity")} value={t("decks.cardCount", { n: deck.capacity })} />
        </div>

        <Panel tone="cardstock" className="p-5 mb-8">
          <p className="text-sm leading-relaxed text-ink/80">{pick(deck.blurb)}</p>
        </Panel>

        <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-7" />

        <div className="animate-fade-in">
          {tab === "design" && <Design deckId={activeDeckEntry.deckId} deck={deck} />}
        </div>
      </div>
    );
  }

  // Only needed when the Decks tab is open.
  const decksWithProgress = tab === "decks" ? session.decks.map(summarizeDeck) : [];

  // Same sequential unlock rule as the path map's own node states
  // (LessonPath.jsx): completed lessons, plus the single next one in line.
  // Feeds Practice's "lesson set" mode, which only draws from what's
  // actually reachable.
  const completedLessonMap = progress.lessons ?? {};
  const doneLessonCount = lessons.filter((l) => completedLessonMap[l.id]).length;
  const unlockedLessonCount = lessons.length === 0 ? 0 : Math.min(doneLessonCount + 1, lessons.length);

  /* ---------- course decks: ported dashboard mockup, wired to real data ---------- */
  return (
    <Dashboard
      session={flatSession}
      deck={deck}
      lessons={lessons}
      completedLessons={progress.lessons ?? {}}
      bestScore={progress.bestScore}
      certificates={deckCertificates}
      tab={tab}
      onTabChange={setTab}
      onSignOut={signOut}
      onOpenProfile={() => { setProfileTab("personal"); setView("profile"); }}
      onOpenVouchers={() => setView("vouchers")}
      onOpenDailyTasks={() => setView("dailyTasks")}
      onGoToOrders={onGoToOrders}
      onGoHome={() => setView("home")}
    >
      {tab === "decks" && (
        <MyDecks decks={decksWithProgress} onOpenDeck={setActiveDeck} onAddDeck={() => { setProfileTab("personal"); setView("profile"); }} embedded />
      )}

      {tab === "lessons" && (
        <Lessons
          deckId={activeDeckEntry.deckId}
          deck={deck}
          subject={activeDeckEntry.subject}
          completed={progress.lessons ?? {}}
          onProgressChange={refresh}
          initialOpenId={pendingLesson}
          onConsumedOpen={() => setPendingLesson(null)}
          onCloseLesson={() => setView("home")}
        />
      )}

      {tab === "practice" && (
        <Practice
          deckId={activeDeckEntry.deckId}
          subject={activeDeckEntry.subject}
          deckName={pick(deck.name)}
          name={session.name}
          cardCount={deck.capacity}
          unlockedLessonCount={unlockedLessonCount}
        />
      )}

      {tab === "exam" && (
        <Exam
          deckId={activeDeckEntry.deckId}
          subject={activeDeckEntry.subject}
          deckName={pick(deck.name)}
          name={session.name}
          onFinished={refresh}
        />
      )}

      {tab === "certificates" && <CertificateList certificates={deckCertificates} onDelete={removeCertificate} />}
    </Dashboard>
  );
}
