import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { bankFor, buildChoicesForItems, checkTyped, hasFixedBank, typedExpected, typedPrompt } from "../data/questions.js";
import { useStudyTimer } from "./useStudyTimer.js";
import { recordCardsStudied, recordDailyExamScore, recordExamScore, recordReview, saveCertificate } from "../storage.js";
import { Alert, Badge, Button, Eyebrow, Input, Panel, ProgressBar, cx } from "../ui.jsx";

/* ---------- Exam ----------
Ten questions — five multiple choice, five type-the-answer. Both halves
are drawn from a single shuffled batch so the same fact never appears in
both modes. Everything grades instantly: multiple choice by exact match,
typed answers with the same typo-tolerant check practice mode uses. This
is a demo storefront with no back office, so a passing score issues the
certificate immediately rather than queuing for a reviewer that doesn't
exist here.
--------------------------------- */

const MC_COUNT = 5;
const TYPED_COUNT = 5;
export const QUESTION_COUNT = MC_COUNT + TYPED_COUNT;
const SECONDS_PER_QUESTION = 90;
export const EXAM_MINUTES = Math.round((QUESTION_COUNT * SECONDS_PER_QUESTION) / 60);
const PASS_RATIO = 0.7;

function formatTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// One shuffled batch, split so the multiple-choice half and the typed half
// never quiz the same fact twice.
function buildExamQuestions(subject, deckId) {
  const items = bankFor(subject, QUESTION_COUNT, 2, deckId);
  const mc = buildChoicesForItems(items.slice(0, MC_COUNT), subject).map((q) => ({
    mode: "choice",
    prompt: q.item.front,
    correct: q.correct,
    options: q.options,
    item: q.item,
  }));
  const typed = items.slice(MC_COUNT).map((item) => ({
    mode: "typed",
    prompt: typedPrompt(item),
    expected: typedExpected(item),
    item,
  }));
  return [...mc, ...typed];
}

export default function Exam({ deckId, subject, deckName, name, onFinished, mock = false }) {
  useStudyTimer();
  const { t, pick } = useI18n();
  const [attempt, setAttempt] = useState(0);

  return (
    <ExamRun
      key={attempt}
      deckId={deckId}
      subject={subject}
      deckName={deckName}
      name={name}
      mock={mock}
      onRetake={() => setAttempt((a) => a + 1)}
      onSubmitted={() => onFinished?.()}
      t={t}
      pick={pick}
    />
  );
}

/* ---------- running / submitted ---------- */

function ExamRun({ deckId, subject, deckName, name, mock, onRetake, onSubmitted, t, pick }) {
  const questions = useMemo(() => buildExamQuestions(subject, deckId), [subject, deckId]);
  const certId = useMemo(() => Math.random().toString(36).slice(2, 8).toUpperCase(), []);

  const [phase, setPhase] = useState("intro"); // intro | running | submitted
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // { mode, correct, timedOut, response }
  const [selected, setSelected] = useState(null); // choice mode: the chosen option (or "__timeout__")
  const [typedValue, setTypedValue] = useState(""); // typed mode: current input
  const [typedSubmitted, setTypedSubmitted] = useState(false); // typed mode: locked in
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [result, setResult] = useState(null); // { correct, total, passed } once submitted

  const q = questions[index];
  const answered = q?.mode === "choice" ? selected !== null : typedSubmitted;
  const correctSoFar = answers.filter((a) => a.correct).length;

  // Per-question countdown. Pauses as soon as an answer is locked in.
  useEffect(() => {
    if (phase !== "running" || answered) return;
    if (timeLeft <= 0) {
      if (q.mode === "choice") setSelected("__timeout__");
      else setTypedSubmitted(true);
      setAnswers((a) => [...a, { mode: q.mode, correct: false, timedOut: true, response: null }]);
      recordCardsStudied(1);
      if (hasFixedBank(subject)) recordReview(deckId, q.item.id, false);
      return;
    }
    const id = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, answered, timeLeft, q]);

  function choose(opt) {
    if (selected !== null) return;
    setSelected(opt);
    const correct = pick(opt) === pick(q.correct);
    setAnswers((a) => [...a, { mode: "choice", correct, timedOut: false, response: opt }]);
    recordCardsStudied(1);
    if (hasFixedBank(subject)) recordReview(deckId, q.item.id, correct);
  }

  function submitTyped(e) {
    e.preventDefault();
    if (typedSubmitted || !typedValue.trim()) return;
    setTypedSubmitted(true);
    // "close" (a near-miss within edit-distance tolerance) still counts —
    // the same leniency practice mode gives for a stray typo.
    const verdict = checkTyped(typedValue, q.item, subject);
    const correct = verdict !== "wrong";
    setAnswers((a) => [...a, { mode: "typed", correct, timedOut: false, response: typedValue.trim() }]);
    recordCardsStudied(1);
    if (hasFixedBank(subject)) recordReview(deckId, q.item.id, correct);
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected(null);
      setTypedValue("");
      setTypedSubmitted(false);
      setTimeLeft(SECONDS_PER_QUESTION);
      return;
    }

    const finalAnswers = answers; // last answer is already appended by choose/submitTyped/timeout
    const correct = finalAnswers.filter((a) => a.correct).length;
    const ratio = correct / QUESTION_COUNT;
    const passed = ratio >= PASS_RATIO;

    if (!mock) {
      recordExamScore(deckId, ratio);
      recordDailyExamScore(Math.round(ratio * 100));
      if (passed) {
        saveCertificate({
          certId,
          deckId,
          deckName,
          name,
          date: new Date().toISOString(),
          score: correct,
          total: QUESTION_COUNT,
        });
      }
    }

    setResult({ correct, total: QUESTION_COUNT, passed });
    onSubmitted?.();
    setPhase("submitted");
  }

  /* ---------- intro ----------
  Restyled to match the ported dashboard mockup (Dashboard.jsx /
  dashboard.css, jd- prefixed classes) with the exam's real numbers —
  the mockup's own 40-question/30-minute figures were invented and don't
  match this app's actual exam config. */
  if (phase === "intro") {
    return (
      <section className="jd-panel">
        <div className="jd-panel-body">
          <div className="jd-exam-row">
            <div className="jd-exam-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M9 11l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4>{deckName}</h4>
              <p>{t("exam.rules")}</p>
            </div>
            <button type="button" className="jd-ubtn jd-solid" onClick={() => setPhase("running")}>
              {t("exam.begin")}
            </button>
          </div>
        </div>
        <div className="jd-rules">
          <div>
            <b>{QUESTION_COUNT}</b>
            <span>{t("exam.questionsBreakdown", { mc: MC_COUNT, typed: TYPED_COUNT })}</span>
          </div>
          <div>
            <b>{EXAM_MINUTES}</b>
            <span>minutes max</span>
          </div>
          <div>
            <b>{Math.round(PASS_RATIO * 100)}%</b>
            <span>to pass</span>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- submitted ---------- */
  if (phase === "submitted") {
    return (
      <div className="animate-fade-in">
        {mock && (
          <Alert tone="warn" className="mb-6 text-center">
            {t("exam.mockNotRecorded")}
          </Alert>
        )}
        <Panel className="p-7 text-center mb-6 border-2 border-chalk/40">
          <Eyebrow className="!text-center">{result.passed ? t("exam.passed") : t("exam.failed")}</Eyebrow>
          <p className="font-mono text-5xl tabular-nums my-4">
            {result.correct}/{result.total}
          </p>
          <p className="text-sm text-ink/70 max-w-sm mx-auto leading-relaxed">
            {result.passed
              ? t("exam.resultScore", { score: result.correct, total: result.total })
              : t("exam.needed", { n: Math.ceil(QUESTION_COUNT * PASS_RATIO) })}
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            {!result.passed && (
              <Button variant="outline" onClick={onRetake}>
                {t("exam.retake")}
              </Button>
            )}
          </div>
        </Panel>

        <div className="space-y-3">
          {questions.map((question, i) => {
            const a = answers[i];
            const label = question.mode === "choice" ? t("practice.mode.quiz") : t("practice.mode.type");
            const correctText = question.mode === "choice" ? pick(question.correct) : pick(question.expected);
            return (
              <div
                key={i}
                className={cx(
                  "border rounded-card p-4",
                  a?.correct ? "border-chalk/30 bg-chalk/[0.04]" : "border-grease/30 bg-grease/[0.04]"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-ink/40 mt-1 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Badge className="!py-0.5 mb-1.5">{label}</Badge>
                    <p className="text-sm leading-relaxed">{pick(question.prompt)}</p>
                    <p className="text-sm mt-2">
                      <span className="label text-ink/45">{t("exam.yourAnswer")}</span>{" "}
                      <span className={a?.correct ? "text-chalk" : "text-grease-deep"}>
                        {a?.timedOut || !a?.response ? t("exam.noAnswer") : pick(a.response)}
                      </span>
                    </p>
                    {!a?.correct && (
                      <p className="text-sm mt-1">
                        <span className="label text-ink/45">{t("common.correct")}</span>{" "}
                        <span className="text-chalk">{correctText}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------- running ---------- */
  const urgent = timeLeft <= 15 && !answered;
  const timedOut = selected === "__timeout__" || (q.mode === "typed" && answers[index]?.timedOut);

  return (
    <div className="border-2 border-ink/15 rounded-card overflow-hidden">
      <ProgressBar
        value={((index + (answered ? 1 : 0)) / questions.length) * 100}
        className="!rounded-none !h-1.5"
      />

      <div className="p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="label text-ink/55">
              {t("exam.questionOf", { i: index + 1, n: questions.length })}
            </span>
            <Badge tone={q.mode === "choice" ? "neutral" : "accent"}>
              {q.mode === "choice" ? t("practice.mode.quiz") : t("practice.mode.type")}
            </Badge>
          </div>
          <span
            className={cx(
              "font-mono text-sm px-3 py-1 rounded-full border tabular-nums transition-colors",
              urgent ? "border-grease text-grease font-semibold" : "border-ink/25 text-ink/70"
            )}
            role="timer"
          >
            {answered ? "—:—" : formatTime(timeLeft)}
          </span>
        </div>

        <p className="text-lg sm:text-xl leading-relaxed mb-6">{pick(q.prompt)}</p>

        {timedOut && (
          <Alert tone="warn" className="mb-5">
            {t("exam.timeUp")}
          </Alert>
        )}

        {q.mode === "choice" ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = pick(opt) === pick(q.correct);
              const isChosen = opt === selected;
              return (
                <button
                  key={i}
                  onClick={() => choose(opt)}
                  disabled={answered}
                  className={cx(
                    "border rounded-card px-4 py-3.5 text-left text-sm leading-relaxed transition-all",
                    !answered && "border-ink/20 hover:border-ink/45 hover:-translate-y-0.5",
                    answered && isCorrect && "border-chalk bg-chalk/[0.09] text-chalk-deep",
                    answered && !isCorrect && isChosen && "border-grease bg-grease/[0.09] text-grease-deep",
                    answered && !isCorrect && !isChosen && "border-ink/10 opacity-45"
                  )}
                >
                  {pick(opt)}
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <form onSubmit={submitTyped} className="flex flex-wrap gap-3">
              <Input
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                disabled={answered}
                autoFocus
                placeholder={t("practice.yourAnswer")}
                className="flex-1 min-w-[200px]"
              />
              {!answered && (
                <Button type="submit" disabled={!typedValue.trim()}>
                  {t("exam.submitAnswer")}
                </Button>
              )}
            </form>

            {answered && !timedOut && (
              <Alert tone={answers[index]?.correct ? "info" : "warn"} className="mt-5">
                {answers[index]?.correct ? t("exam.typedCorrect") : t("exam.typedIncorrect", { expected: pick(q.expected) })}
              </Alert>
            )}
          </div>
        )}

        {answered && (
          <div className="flex items-center gap-4 mt-6">
            <Button onClick={next}>
              {index + 1 < questions.length ? `${t("common.next")} →` : t("exam.finishAndSubmit")}
            </Button>
            <span className="font-mono text-xs text-ink/45 tabular-nums">
              {t("common.score")} {correctSoFar}/{answers.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
