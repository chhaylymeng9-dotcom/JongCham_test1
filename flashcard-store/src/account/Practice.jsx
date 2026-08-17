import { useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useI18n } from "../i18n.jsx";
import {
  bankFor,
  buildChoiceQuestions,
  checkTyped,
  hasFixedBank,
  shuffle,
  typedExpected,
  typedPrompt,
} from "../data/questions.js";
import { recordCardsStudied, recordReview } from "../storage.js";
import { Alert, Badge, Button, Eyebrow, Input, LinkButton, Panel, ProgressBar, cx } from "../ui.jsx";
import { useStudyTimer } from "./useStudyTimer.js";
import PracticeModes from "../components/PracticeModes.jsx";
import Exam, { QUESTION_COUNT as EXAM_QUESTION_COUNT, EXAM_MINUTES } from "./Exam.jsx";

/* ---------- Practice ----------
Six modes now: the original four drills over the same question bank
(nothing here is scored into progress on purpose — practice should be
somewhere you can be wrong cheaply, as often as you like), plus two full
papers — a lesson-set quiz and a mock exam — that reuse the same
unrecorded philosophy. See PracticeModes.jsx for the tab's visual design.
--------------------------------- */

// There's no per-lesson question bank in data/lessons.js (lessons are
// reading content only) — the lesson-set drill instead draws this many
// questions per unlocked lesson from the subject's regular question bank,
// via the same QuizDrill used by the "mcq" mode.
const QUESTIONS_PER_LESSON = 5;

const MODES = [
  { id: "review", titleKey: "practice.mode.review", subKey: "practice.mode.reviewSub" },
  { id: "quiz", titleKey: "practice.mode.quiz", subKey: "practice.mode.quizSub" },
  { id: "type", titleKey: "practice.mode.type", subKey: "practice.mode.typeSub", hard: true },
  { id: "match", titleKey: "practice.mode.match", subKey: "practice.mode.matchSub" },
];

export default function Practice({ deckId, subject, deckName, name, cardCount, unlockedLessonCount = 0 }) {
  useStudyTimer();
  const { t } = useI18n();
  const [mode, setMode] = useState(null);
  const [round, setRound] = useState(0); // bumping this remounts the drill

  const lessonSetCount = unlockedLessonCount * QUESTIONS_PER_LESSON;

  function handleStart(key) {
    if (key === "flip") return setMode("review");
    if (key === "mcq") return setMode("quiz");
    if (key === "type") return setMode("type");
    if (key === "match") return setMode("match");
    if (key === "lesson") return lessonSetCount > 0 && setMode("lessonSet");
    if (key === "mock") return setMode("mock");
  }

  if (!mode) {
    return (
      <PracticeModes
        stats={{
          cards: cardCount,
          // No tracking exists yet for "last mcq played" or a practice-mode
          // best score (Practice is deliberately never scored into
          // progress) — dashes rather than an invented number.
          lastMcq: undefined,
          bestType: "—",
          bestMatch: undefined,
          lessons: unlockedLessonCount,
          lessonQuestions: lessonSetCount,
          examQuestions: EXAM_QUESTION_COUNT,
          examMinutes: EXAM_MINUTES,
        }}
        numerals="km"
        kicker={t("practice.eyebrow")}
        title={t("practice.title")}
        sub={t("practice.subtitle")}
        note={t("practice.note")}
        onStart={handleStart}
      />
    );
  }

  // `round` is the remount key — restarting a drill draws a fresh set.
  const restart = () => setRound((r) => r + 1);
  const badgeLabel =
    mode === "lessonSet" ? t("practice.mode.lessonSet")
    : mode === "mock" ? null
    : t(MODES.find((m) => m.id === mode).titleKey);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <LinkButton onClick={() => setMode(null)}>← {t("practice.eyebrow")}</LinkButton>
        {badgeLabel && <Badge>{badgeLabel}</Badge>}
      </div>

      {mode === "review" && <ReviewDrill key={round} subject={subject} onRestart={restart} />}
      {mode === "quiz" && <QuizDrill key={round} deckId={deckId} subject={subject} onRestart={restart} />}
      {mode === "type" && <TypeDrill key={round} deckId={deckId} subject={subject} onRestart={restart} />}
      {mode === "match" && <MatchDrill key={round} subject={subject} onRestart={restart} />}
      {mode === "lessonSet" && (
        <QuizDrill key={round} deckId={deckId} subject={subject} onRestart={restart} count={lessonSetCount} />
      )}
      {mode === "mock" && <Exam deckId={deckId} subject={subject} deckName={deckName} name={name} mock />}
    </div>
  );
}

/* ---------- flip review ---------- */

const SWIPE_THRESHOLD = 100;
const SPRING_SNAP = { type: "spring", stiffness: 380, damping: 32 };
const SPRING_FLY = { type: "spring", stiffness: 260, damping: 24 };
const SPRING_FLIP = { type: "spring", stiffness: 260, damping: 28 };

function ReviewDrill({ subject, onRestart }) {
  const { t, pick } = useI18n();
  const initial = useMemo(() => bankFor(subject, 10), [subject]);
  const total = initial.length;
  // `items` is the current pass; `next` collects anything forgotten during
  // it. Forgotten cards don't cut back in line — they only resurface once
  // this whole pass is done, as their own follow-up pass, repeating until
  // one pass comes back clean.
  const [session, setSession] = useState({ items: initial, next: [] });
  const [remembered, setRemembered] = useState(0);
  const [forgot, setForgot] = useState(0);
  const [seen, setSeen] = useState(0); // cosmetic card counter for the header badge
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Drives the drag-to-judge gesture — live on both the front and the
  // flipped card, so you can judge from recall alone without flipping.
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-15, 15]);
  const forgotOpacity = useTransform(x, [-140, -10], [1, 0]);
  const rememberOpacity = useTransform(x, [10, 140], [0, 1]);

  const item = session.items[0];

  if (!item) {
    return (
      <div className="text-center py-10">
        <p className="font-display text-2xl mb-2">{t("practice.roundDone")}</p>
        <p className="text-sm text-ink/65 mb-2">{t("practice.reviewDone", { n: total })}</p>
        {forgot > 0 && (
          <p className="font-mono text-xs text-ink/50 tabular-nums mb-7">
            {t("practice.reviewRetries", { n: forgot })}
          </p>
        )}
        <Button onClick={onRestart} className={forgot > 0 ? "" : "mt-7"}>
          {t("practice.restart")}
        </Button>
      </div>
    );
  }

  function commit(didRemember) {
    setFlipped(false);
    x.set(0);
    setSeen((n) => n + 1);
    if (didRemember) setRemembered((n) => n + 1);
    else setForgot((n) => n + 1);

    setSession(({ items, next }) => {
      const [current, ...rest] = items;
      const missed = didRemember ? next : [...next, current];
      // Pass finished: hand off to whatever got missed (a fresh pass), or
      // stop if nothing did.
      return rest.length > 0 ? { items: rest, next: missed } : { items: missed, next: [] };
    });
  }

  async function mark(didRemember) {
    if (isAnimating) return;
    setIsAnimating(true);
    await animate(x, didRemember ? 500 : -500, SPRING_FLY);
    commit(didRemember);
    setIsAnimating(false);
  }

  function handleDragEnd(_e, info) {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) mark(info.offset.x > 0);
    else animate(x, 0, SPRING_SNAP);
  }

  // A single tap is easy to trigger by accident while starting a swipe, so
  // revealing the answer needs a deliberate double-tap. Going back from the
  // answer to the question is the opposite — that one stays a single tap.
  const lastTapRef = useRef(0);
  function handleTap() {
    if (isAnimating) return;
    if (flipped) {
      lastTapRef.current = 0;
      setFlipped(false);
      return;
    }
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      lastTapRef.current = 0;
      setFlipped(true);
    } else {
      lastTapRef.current = now;
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="label text-ink/50">
          {t("practice.remembered", { n: remembered, total })}
        </span>
        <span className="font-mono text-xs text-ink/50 tabular-nums">
          {t("practice.forgotCount", { n: forgot })}
        </span>
      </div>
      <ProgressBar value={(remembered / total) * 100} className="mb-6" />

      <motion.button
        // 74 x 105mm — the same A7 stock size as the printed cards.
        style={{ x, rotate, cursor: isAnimating ? "default" : "grab", width: "74mm", height: "105mm" }}
        drag={!isAnimating ? "x" : false}
        dragElastic={1}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        className="relative mx-auto rounded-card bg-[#F4ECDF] text-center
                   shadow-card overflow-hidden flex flex-col touch-none
                   [perspective:1400px]"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#14293C] shrink-0">
          <span className="text-2xl leading-none text-[#EFE4D3]" style={{ fontFamily: "'Pinyon Script', cursive" }}>
            JongCham
          </span>
          <span className="font-mono text-[10px] tracking-widest text-[#7FA6BE]">
            {String(Math.min(seen + 1, 99)).padStart(2, "0")}
          </span>
        </div>

        <div className="relative flex-1 min-h-0 overflow-hidden">
          <motion.div
            style={{ opacity: forgotOpacity }}
            className="absolute top-3 left-3 z-20 pointer-events-none select-none border-4 rounded-lg px-2.5 py-1
                       font-mono font-extrabold uppercase text-base tracking-widest -rotate-[18deg] border-grease text-grease-deep"
          >
            {t("practice.forgot")}
          </motion.div>
          <motion.div
            style={{ opacity: rememberOpacity }}
            className="absolute top-3 right-3 z-20 pointer-events-none select-none border-4 rounded-lg px-2.5 py-1
                       font-mono font-extrabold uppercase text-base tracking-widest rotate-[18deg] border-chalk text-chalk-deep"
          >
            {t("practice.remember")}
          </motion.div>

          <motion.div
            className="relative w-full h-full [transform-style:preserve-3d]"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={SPRING_FLIP}
          >
            {/* front — the question, with the brand wave riding the bottom edge */}
            <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col">
              <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-3 px-5">
                <span className="label text-ink/40">{t("practice.tapReveal")}</span>
                <p className="text-xl leading-relaxed text-ink">{pick(item.front)}</p>
              </div>
              <WaveArt className="w-full h-[58px] shrink-0" />
            </div>

            {/* back — the answer, plain */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center gap-3 px-5">
              <span className="label text-ink/40">{t("common.back_side")}</span>
              <p className="text-xl leading-relaxed text-ink">{pick(item.back)}</p>
            </div>
          </motion.div>
        </div>

        <div className="h-6 bg-[#14293C] shrink-0" />
      </motion.button>

      <div className="grid grid-cols-2 gap-6 mt-12 max-w-[320px] mx-auto">
        <button
          type="button"
          onClick={() => mark(false)}
          disabled={isAnimating}
          className="flex items-center justify-center gap-2 w-full h-[54px] px-4 rounded-[14px] border-[1.5px]
                     text-[15px] font-semibold tracking-[-0.01em]
                     bg-[#F7E6E9] hover:bg-[#F3DCE1] border-[#EDCBD2] text-[#A6485A]
                     transition-[transform,background-color,border-color] duration-150
                     active:scale-[0.975] disabled:opacity-40 disabled:pointer-events-none
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#233229] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <StudyAgainIcon />
          {t("practice.studyAgain")}
        </button>

        <button
          type="button"
          onClick={() => mark(true)}
          disabled={isAnimating}
          className="flex items-center justify-center gap-2 w-full h-[54px] px-4 rounded-[14px] border-[1.5px] border-transparent
                     text-[15px] font-semibold tracking-[-0.01em]
                     bg-[#233229] hover:bg-[#182319] text-white
                     transition-[transform,background-color,border-color] duration-150
                     active:scale-[0.975] disabled:opacity-40 disabled:pointer-events-none
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#233229] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <KnowItIcon />
          {t("practice.iKnowIt")}
        </button>
      </div>
    </div>
  );
}

function StudyAgainIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0" aria-hidden="true">
      <path d="M1 4v6h6" />
      <path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" />
    </svg>
  );
}

function KnowItIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// The brand wave/sun mark from the printed card template's front face.
function WaveArt({ className }) {
  return (
    <svg viewBox="0 0 260 78" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path d="M0,30 C40,18 80,34 120,26 C170,16 210,10 260,16 L260,78 L0,78 Z" fill="#A9C6D6" />
      <path d="M0,44 C50,32 90,46 140,38 C190,30 220,26 260,30 L260,78 L0,78 Z" fill="#6FA0BC" />
      <circle cx="72" cy="42" r="12" fill="#6FA0BC" />
      <g fill="none" stroke="#F1F8FA" strokeLinecap="round">
        <path d="M62.8,34.3 A12,12 0 1 0 74.1,30.2" strokeWidth="1.7" />
        <path d="M65.5,36.5 A8.5,8.5 0 1 0 73.5,33.6" strokeWidth="1.2" />
        <path d="M67.8,38.5 A5.5,5.5 0 1 0 73,36.6" strokeWidth=".9" />
      </g>
      <path d="M0,56 C50,48 100,58 150,52 C200,46 230,44 260,46 L260,78 L0,78 Z" fill="#3B7091" />
      <path d="M0,66 C60,60 110,70 170,64 C210,60 240,60 260,61 L260,78 L0,78 Z" fill="#14293C" />
      <path d="M200,42 C199,52 198,56 199,62" fill="none" stroke="#6F8A6B" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="194" cy="62" rx="16" ry="4" fill="#6F8A6B" />
      <g transform="translate(200,42) scale(.22)">
        <g fill="#F1CDD2" stroke="#B25E7A" strokeWidth="4">
          <path transform="rotate(-64)" d="M0,0 C-13,-26 -9,-58 0,-72 C9,-58 13,-26 0,0 Z" />
          <path transform="rotate(-32)" d="M0,0 C-13,-26 -9,-58 0,-72 C9,-58 13,-26 0,0 Z" />
          <path d="M0,0 C-13,-26 -9,-58 0,-72 C9,-58 13,-26 0,0 Z" />
          <path transform="rotate(32)" d="M0,0 C-13,-26 -9,-58 0,-72 C9,-58 13,-26 0,0 Z" />
          <path transform="rotate(64)" d="M0,0 C-13,-26 -9,-58 0,-72 C9,-58 13,-26 0,0 Z" />
        </g>
        <g fill="#D98BA0" stroke="#B25E7A" strokeWidth="4">
          <path transform="rotate(-24) scale(.6)" d="M0,0 C-13,-26 -9,-58 0,-72 C9,-58 13,-26 0,0 Z" />
          <path transform="scale(.6)" d="M0,0 C-13,-26 -9,-58 0,-72 C9,-58 13,-26 0,0 Z" />
          <path transform="rotate(24) scale(.6)" d="M0,0 C-13,-26 -9,-58 0,-72 C9,-58 13,-26 0,0 Z" />
        </g>
      </g>
    </svg>
  );
}

/* ---------- multiple choice ---------- */

function QuizDrill({ deckId, subject, onRestart, count = 8 }) {
  const { t, pick } = useI18n();
  const questions = useMemo(() => buildChoiceQuestions(subject, count, 1, deckId), [subject, deckId, count]);
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[i];
  if (!q) return null;

  function choose(opt) {
    if (selected !== null) return;
    setSelected(opt);
    const correct = pick(opt) === pick(q.correct);
    if (correct) setScore((s) => s + 1);
    recordCardsStudied(1);
    if (hasFixedBank(subject)) recordReview(deckId, q.item.id, correct);
  }

  function next() {
    if (i + 1 < questions.length) {
      setI((n) => n + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <RoundResult score={score} total={questions.length} onRestart={onRestart} />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="label text-ink/50">
          {t("exam.questionOf", { i: i + 1, n: questions.length })}
        </span>
        <span className="font-mono text-xs text-ink/50 tabular-nums">
          {t("common.score")} {score}
        </span>
      </div>
      <ProgressBar value={(i / questions.length) * 100} className="mb-6" />

      <p className="text-xl leading-relaxed mb-6">{pick(q.item.front)}</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {q.options.map((opt, k) => (
          <ChoiceButton
            key={k}
            label={pick(opt)}
            state={
              selected === null
                ? "idle"
                : pick(opt) === pick(q.correct)
                ? "correct"
                : opt === selected
                ? "wrong"
                : "dim"
            }
            onClick={() => choose(opt)}
          />
        ))}
      </div>

      {selected !== null && (
        <Button className="mt-6" onClick={next}>
          {i + 1 < questions.length ? `${t("common.next")} →` : t("common.finish")}
        </Button>
      )}
    </div>
  );
}

/* ---------- type the answer ---------- */

function TypeDrill({ deckId, subject, onRestart }) {
  const { t, pick } = useI18n();
  const items = useMemo(() => bankFor(subject, 8, 1, deckId), [subject, deckId]);
  const [i, setI] = useState(0);
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null); // correct | close | wrong
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = items[i];
  if (!item) return null;

  function check(e) {
    e.preventDefault();
    if (result) return;
    const outcome = checkTyped(value, item, subject);
    setResult(outcome);
    // "close" is a typo, not a wrong answer — it counts.
    if (outcome !== "wrong") setScore((s) => s + 1);
    recordCardsStudied(1);
    if (hasFixedBank(subject)) recordReview(deckId, item.id, outcome !== "wrong");
  }

  function next() {
    if (i + 1 < items.length) {
      setI((n) => n + 1);
      setValue("");
      setResult(null);
    } else {
      setDone(true);
    }
  }

  if (done) return <RoundResult score={score} total={items.length} onRestart={onRestart} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="label text-ink/50">{t("exam.questionOf", { i: i + 1, n: items.length })}</span>
        <span className="font-mono text-xs text-ink/50 tabular-nums">
          {t("common.score")} {score}
        </span>
      </div>
      <ProgressBar value={(i / items.length) * 100} className="mb-6" />

      <Panel tone="cardstock" className="p-6 mb-5">
        <p className="text-lg leading-relaxed">{pick(typedPrompt(item, subject))}</p>
      </Panel>

      <form onSubmit={check} className="flex flex-wrap gap-3">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={Boolean(result)}
          autoFocus
          placeholder={t("practice.yourAnswer")}
          className="flex-1 min-w-[200px]"
        />
        {result ? (
          <Button type="button" variant="dark" onClick={next}>
            {i + 1 < items.length ? `${t("common.next")} →` : t("common.finish")}
          </Button>
        ) : (
          <Button type="submit" disabled={!value.trim()}>
            {t("practice.check")}
          </Button>
        )}
      </form>

      {result && (
        <Alert
          tone={result === "correct" ? "success" : result === "close" ? "warn" : "error"}
          className="mt-5"
        >
          {result === "correct" && `✓ ${t("common.correct")}`}
          {result === "close" && t("practice.almost")}
          {result === "wrong" && (
            <>
              {t("practice.theAnswer")}{" "}
              <strong className="font-medium">{pick(typedExpected(item, subject))}</strong>
            </>
          )}
        </Alert>
      )}
    </div>
  );
}

/* ---------- match pairs ---------- */

function MatchDrill({ subject, onRestart }) {
  const { t, pick } = useI18n();
  // Generated maths problems can share an answer (3×8 and 4×6 are both 24),
  // which makes a matching grid ambiguous — keep one item per answer.
  const items = useMemo(() => {
    const seen = new Set();
    return bankFor(subject, 12)
      .filter((it) => !seen.has(it.back.en) && seen.add(it.back.en))
      .slice(0, 5);
  }, [subject]);
  const rights = useMemo(() => shuffle(items), [items]);

  const [pickedLeft, setPickedLeft] = useState(null);
  const [matched, setMatched] = useState({});
  const [wrongPair, setWrongPair] = useState(null);
  const [tries, setTries] = useState(0);

  const complete = Object.keys(matched).length === items.length;

  function chooseRight(item) {
    if (!pickedLeft || matched[item.id]) return;
    setTries((n) => n + 1);
    if (item.id === pickedLeft) {
      setMatched((m) => ({ ...m, [item.id]: true }));
      setPickedLeft(null);
    } else {
      setWrongPair(item.id);
      setTimeout(() => setWrongPair(null), 500);
    }
  }

  if (complete) {
    return (
      <div className="text-center py-10">
        <p className="font-display text-2xl mb-2">{t("practice.roundDone")}</p>
        <p className="text-sm text-ink/65 mb-7">{t("practice.matchDone", { n: tries })}</p>
        <Button onClick={onRestart}>{t("practice.restart")}</Button>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar value={(Object.keys(matched).length / items.length) * 100} className="mb-6" />
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2.5">
          {items.map((item) => {
            const isMatched = matched[item.id];
            const isPicked = pickedLeft === item.id;
            return (
              <button
                key={item.id}
                onClick={() => !isMatched && setPickedLeft(isPicked ? null : item.id)}
                disabled={isMatched}
                className={cx(
                  "w-full text-left border rounded-card px-4 py-3 text-sm transition-all",
                  isMatched
                    ? "border-chalk/30 bg-chalk/[0.06] opacity-45"
                    : isPicked
                    ? "border-grease bg-grease/[0.08]"
                    : "border-ink/20 hover:border-ink/45"
                )}
              >
                {pick(item.front)}
              </button>
            );
          })}
        </div>

        <div className="space-y-2.5">
          {rights.map((item) => {
            const isMatched = matched[item.id];
            return (
              <button
                key={item.id}
                onClick={() => chooseRight(item)}
                disabled={isMatched || !pickedLeft}
                className={cx(
                  "w-full text-left border rounded-card px-4 py-3 text-sm transition-all",
                  isMatched
                    ? "border-chalk/30 bg-chalk/[0.06] opacity-45"
                    : wrongPair === item.id
                    ? "border-red-600 bg-red-600/[0.06]"
                    : pickedLeft
                    ? "border-ink/20 hover:border-grease"
                    : "border-ink/15 opacity-60"
                )}
              >
                {pick(item.back)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- shared pieces ---------- */

function ChoiceButton({ label, state, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={state !== "idle"}
      className={cx(
        "border rounded-card px-4 py-3.5 text-left text-sm leading-relaxed transition-all",
        state === "idle" && "border-ink/20 hover:border-ink/45 hover:-translate-y-0.5",
        state === "correct" && "border-chalk bg-chalk/[0.09] text-chalk-deep",
        state === "wrong" && "border-grease bg-grease/[0.09] text-grease-deep",
        state === "dim" && "border-ink/10 opacity-45"
      )}
    >
      {label}
    </button>
  );
}

function RoundResult({ score, total, onRestart }) {
  const { t } = useI18n();
  return (
    <div className="text-center py-10">
      <p className="font-display text-2xl mb-2">{t("practice.roundDone")}</p>
      <p className="text-sm text-ink/65 mb-2">{t("practice.roundScore", { score, total })}</p>
      <p className="font-mono text-4xl tabular-nums my-5">{Math.round((score / total) * 100)}%</p>
      <Button onClick={onRestart}>{t("practice.restart")}</Button>
    </div>
  );
}
