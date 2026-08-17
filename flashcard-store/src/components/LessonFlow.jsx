import React from "react";
import { createPortal } from "react-dom";
import LessonStatus from "./LessonStatus.jsx";
import LessonRead from "./LessonRead.jsx";

/* ─────────────────────────────────────────────────────────────
   LessonFlow — the list and the reading page, plus the one piece of
   state that switches between them. Renders LessonStatus; when a
   lesson with a written body is opened, portals LessonRead full-
   screen over everything (its sticky top bar and fixed bottom bar
   are meant to own the whole viewport, not a column inside a shell).
   A lesson with no body (see `bodies`) skips the reader and goes
   straight to `onStartQuiz` — same as a plain question-only lesson
   always has.

   Known trade-off: LessonRead's reading-progress line and section
   chips track `window` scroll. Portalled full-screen here, this
   overlay scrolls itself (so it can cover the page without also
   being clipped by any ancestor), so that line won't animate and the
   chips won't highlight as you scroll — everything else (chips still
   navigate on click, the CTA, self-check) works normally. Fixing that
   means either giving LessonRead a scroll-container prop or lifting
   "is reading" state up to swap out the whole page shell instead of
   overlaying it; out of scope for this pass.

   <LessonFlow
     chapters={CHAPTERS}
     bodies={LESSON_BODY}       // { [lessonId]: htmlString }
     qa={LESSON_QA}             // { [lessonId]: [[q,a], ...] }
     course="Biology · ជីវវិទ្យា"
     numerals="km"
     exam={{ label, note, unlocked }}
     onStartQuiz={lesson => …} // your existing question screen
   />
   ───────────────────────────────────────────────────────────── */

export default function LessonFlow({ chapters, bodies = {}, qa = {}, course, numerals = "km", exam, onStartQuiz }) {
  const [reading, setReading] = React.useState(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [reading]);

  function openLesson(lesson) {
    if (bodies[lesson.id]) setReading(lesson);
    else onStartQuiz(lesson);
  }

  return (
    <>
      <LessonStatus chapters={chapters} exam={exam} numerals={numerals} onOpen={openLesson} />

      {reading &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              overflowY: "auto",
              background: "#F7F5EF",
            }}
          >
            <LessonRead
              lesson={{
                title: reading.title,
                subtitle: reading.subtitle,
                chapterN: reading.chapterN,
                n: reading.n,
                minutes: reading.readMinutes,
                questions: reading.q,
                course,
              }}
              html={bodies[reading.id]}
              qa={qa[reading.id] ?? []}
              numerals={numerals}
              onBack={() => setReading(null)}
              onClose={() => setReading(null)}
              onStart={() => {
                onStartQuiz(reading);
                setReading(null);
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
}
