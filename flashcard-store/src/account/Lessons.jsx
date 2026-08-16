import { useEffect, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { lessonsFor } from "../data/lessons.js";
import { setLessonComplete } from "../storage.js";
import { useStudyTimer } from "./useStudyTimer.js";
import LessonSheet from "../components/LessonSheet.jsx";
import { Alert, Badge, Button, EmptyState, Eyebrow, LinkButton, Panel, ProgressBar, cx } from "../ui.jsx";

/* ---------- Lessons ----------
The written course behind a deck. A list of lessons, and a reading view
for one of them. Completion is per deck and persisted, so the dashboard
can show real progress rather than a decorative bar.
--------------------------------- */

export default function Lessons({ deckId, deck, subject, completed, onProgressChange, initialOpenId, onConsumedOpen }) {
  useStudyTimer();
  const { t, pick } = useI18n();
  const lessons = lessonsFor(subject);
  const [openId, setOpenId] = useState(initialOpenId ?? null);
  const [showSheet, setShowSheet] = useState(false);

  // A lesson clicked on the home path arrives as initialOpenId; open it
  // once, then hand the token back so later visits start on the list.
  useEffect(() => {
    if (initialOpenId) {
      setOpenId(initialOpenId);
      setShowSheet(false);
      onConsumedOpen?.();
    }
  }, [initialOpenId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (lessons.length === 0) {
    return <EmptyState title={t("lesson.locked")} body={t("lesson.lockedBody")} />;
  }

  const openIndex = lessons.findIndex((l) => l.id === openId);
  const lesson = openIndex >= 0 ? lessons[openIndex] : null;

  function toggle(lessonId, done) {
    setLessonComplete(deckId, lessonId, done);
    onProgressChange();
  }

  if (lesson) {
    const isDone = Boolean(completed[lesson.id]);
    const next = lessons[openIndex + 1];

    return (
      <article className="animate-fade-in">
        <LinkButton
          onClick={() => {
            setOpenId(null);
            setShowSheet(false);
          }}
          className="mb-5 inline-block"
        >
          ← {t("lesson.backToList")}
        </LinkButton>

        <div className="flex items-center gap-3 flex-wrap mb-3">
          <span className="font-mono text-xs text-grease">
            {String(openIndex + 1).padStart(2, "0")}
          </span>
          <Badge>{t("lesson.minutes", { n: lesson.minutes })}</Badge>
          {isDone && <Badge tone="success">✓ {t("lesson.completed")}</Badge>}
        </div>

        <h2 className="font-display text-2xl md:text-3xl leading-tight mb-5">{pick(lesson.title)}</h2>

        <Panel tone="cardstock" className="p-5 mb-8">
          <Eyebrow>{t("lesson.objective")}</Eyebrow>
          <p className="text-[15px] leading-relaxed mt-2">{pick(lesson.objective)}</p>
        </Panel>

        <div className="space-y-8">
          {lesson.sections.map((section, i) => (
            <section key={i}>
              <h3 className="font-display text-xl mb-3">{pick(section.heading)}</h3>
              <div className="space-y-4">
                {section.body.map((p, j) => (
                  <p key={j} className="text-[15px] leading-[1.75] text-ink/80">
                    {pick(p)}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {lesson.keyPoints?.length > 0 && (
          <Panel className="p-5 mt-8">
            <Eyebrow>{t("lesson.keyPoints")}</Eyebrow>
            <ul className="mt-3 space-y-2.5">
              {lesson.keyPoints.map((k, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span className="text-grease shrink-0 mt-px">▸</span>
                  {pick(k)}
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {lesson.examples?.length > 0 && (
          <div className="mt-8">
            <Eyebrow>{t("lesson.examples")}</Eyebrow>
            <div className="space-y-3 mt-3">
              {lesson.examples.map((ex, i) => (
                <Worked key={i} example={ex} />
              ))}
            </div>
          </div>
        )}

        {lesson.tip && (
          <Alert tone="info" title={t("lesson.tip")} className="mt-8">
            {pick(lesson.tip)}
          </Alert>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-9 pt-7 border-t border-ink/10">
          <Button variant={isDone ? "outline" : "dark"} onClick={() => toggle(lesson.id, !isDone)}>
            {isDone ? `✓ ${t("lesson.completed")}` : t("lesson.markDone")}
          </Button>
          <Button variant="ghost" onClick={() => setShowSheet((s) => !s)}>
            {showSheet ? t("lessonSheet.hide") : t("lessonSheet.show")}
          </Button>
          {next && (
            <Button
              variant="ghost"
              onClick={() => {
                setOpenId(next.id);
                setShowSheet(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {t("lesson.nextLesson")} →
            </Button>
          )}
        </div>

        {showSheet && (
          <div className="mt-8 animate-fade-in">
            <Eyebrow className="mb-3">{t("lessonSheet.eyebrow")}</Eyebrow>
            <LessonSheet lesson={lesson} deck={deck} index={openIndex} />
          </div>
        )}
      </article>
    );
  }

  const doneCount = lessons.filter((l) => completed[l.id]).length;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-3">
        <div>
          <Eyebrow>{t("lesson.eyebrow")}</Eyebrow>
          <p className="text-sm text-ink/65 mt-1.5">{t("lesson.count", { n: lessons.length })}</p>
        </div>
        <span className="font-mono text-sm text-ink/60 tabular-nums">
          {doneCount}/{lessons.length}
        </span>
      </div>
      <ProgressBar value={(doneCount / lessons.length) * 100} className="mb-7" />

      <div className="space-y-3">
        {lessons.map((l, i) => {
          const isDone = Boolean(completed[l.id]);
          return (
            <button
              key={l.id}
              onClick={() => setOpenId(l.id)}
              className={cx(
                "w-full text-left border rounded-card p-5 flex items-start gap-4 transition-all",
                isDone
                  ? "border-chalk/30 bg-chalk/[0.04]"
                  : "border-ink/15 hover:border-ink/35 hover:-translate-y-0.5"
              )}
            >
              <span
                className={cx(
                  "shrink-0 w-9 h-9 rounded-full border flex items-center justify-center font-mono text-xs",
                  isDone ? "bg-chalk border-chalk text-cardstock" : "border-ink/25 text-ink/60"
                )}
              >
                {isDone ? "✓" : String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg leading-snug">{pick(l.title)}</span>
                <span className="block text-sm text-ink/65 mt-1.5 leading-relaxed">
                  {pick(l.objective)}
                </span>
                <span className="label text-ink/40 mt-2.5 block">
                  {t("lesson.minutes", { n: l.minutes })}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Worked examples stay hidden until asked for — reading the solution
   straight away is the whole failure mode this course warns about. */
function Worked({ example }) {
  const { t, pick } = useI18n();
  const [shown, setShown] = useState(false);

  return (
    <div className="border border-ink/15 rounded-card p-5">
      <p className="text-[15px] leading-relaxed mb-3">{pick(example.prompt)}</p>
      {shown ? (
        <p className="text-sm leading-relaxed text-ink/75 border-l-2 border-grease pl-4 animate-fade-in">
          {pick(example.solution)}
        </p>
      ) : (
        <LinkButton onClick={() => setShown(true)}>{t("practice.showAnswer")}</LinkButton>
      )}
    </div>
  );
}
