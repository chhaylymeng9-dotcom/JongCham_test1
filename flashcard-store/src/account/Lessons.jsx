import { useState } from "react";
import LessonFlow from "../components/LessonFlow.jsx";
import LessonChat from "./LessonChat.jsx";
import { setLessonComplete } from "../storage.js";
import { useStudyTimer } from "./useStudyTimer.js";
import { LESSON_BODY, LESSON_QA } from "./lessonContent.js";

/* ---------- Lessons ----------
Demo build, matching the "lesson-flow.html" reference exactly: CHAPTERS
below is the reference's own dataset (chapters, states, scores), not
this deck's real lessons. That's deliberate for now — it's how the
design (chapter folding, all five row states, the gold rail) gets
checked against the reference before real per-deck progress is wired
back in as the chapter/lesson source. `deckId` and the quiz itself
(LessonChat, via onStartQuiz) are still real; only the list's shape is
the placeholder.
--------------------------------- */

const CHAPTERS = [
  {
    n: 1,
    title: "ស៊ីមណូស្ពែម និងអង់ស្យូស្ពែម",
    lessons: [
      { id: 1, n: 1, title: "ស៊ីមណូស្ពែម", state: "done", q: 8, min: 4, score: 100 },
      { id: 2, n: 2, title: "អង់ស្យូស្ពែម", state: "done", q: 8, min: 4, score: 88 },
    ],
  },
  {
    n: 2,
    title: "ការលូតលាស់ និងតំណបរំញោចរុក្ខជាតិ",
    lessons: [
      { id: 3, n: 3, title: "ដំណឹកនាំ និងការលូតលាស់នៅក្នុងរុក្ខជាតិ", state: "now", q: 8, min: 5, at: 5 },
      { id: 4, n: 4, title: "តំណបរំញោច", state: "rev", q: 10, min: 6, score: 63 },
    ],
  },
  {
    n: 3,
    title: "តម្រូវផ្សេងៗរបស់សារពាង្គកាយ",
    lessons: [
      { id: 5, n: 5, title: "តម្រូវប្រសាទ", state: "next", q: 14, min: 8, readMinutes: 12, chapterN: 3, subtitle: "Nervous Regulation" },
      { id: 6, n: 6, title: "សរីរាង្គវិញ្ញាណ", state: "lock", q: 8, min: 4, needs: 5 },
      { id: 7, n: 7, title: "ប្រព័ន្ធអង់ដូគ្រីន", state: "lock", q: 8, min: 4, needs: 6 },
    ],
  },
];

export default function Lessons({ deckId, onProgressChange }) {
  useStudyTimer();
  const [quiz, setQuiz] = useState(null);

  // Save is real; it just files under the reference's placeholder
  // lesson ids (1-7) until real lessons replace CHAPTERS above.
  function handleDone({ percent }) {
    if (quiz) {
      setLessonComplete(deckId, quiz.id, percent);
      onProgressChange();
    }
  }

  if (quiz) {
    return <LessonChat onClose={() => setQuiz(null)} onDone={handleDone} />;
  }

  return (
    <LessonFlow
      chapters={CHAPTERS}
      bodies={LESSON_BODY}
      qa={LESSON_QA}
      course="Biology · ជីវវិទ្យា"
      numerals="km"
      exam={{
        label: "ការប្រឡងបើកនៅ ៧ / ៧",
        note: "បញ្ចប់មេរៀនទាំងអស់ ដើម្បីធ្វើការប្រឡង និងទទួលបានវិញ្ញាបនបត្រ។",
        unlocked: false,
      }}
      onStartQuiz={(lesson) => setQuiz(lesson)}
    />
  );
}
