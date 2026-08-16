import { useI18n } from "../i18n.jsx";
import { lessonsFor } from "../data/lessons.js";
import { cx } from "../ui.jsx";

/* ---------- HistoryQuizCard ----------
A one-off showcase card for the History Set's Store preview — built to a
different, more elaborate template than the general-purpose Flashcard.
The question is written for this card, but the answer, explanation, key
points and trivia are all pulled straight from the real "Independence,
1953" lesson (data/lessons.js) so it stays true to the deck's actual
content rather than inventing new facts.
--------------------------------- */

// Served from /public so a missing file 404s quietly instead of breaking
// the build — drop the real photo at public/images/history-independence.png
// (any image works; this is just where the front face looks for one).
const PHOTO_SRC = "/images/history-independence.png";

const MAROON = "#5B1A1E";
const MAROON_DEEP = "#3D1114";
const GOLD = "#C99A44";
const GOLD_LIGHT = "#F4E4C1";
const CREAM = "#FBF3E4";
const INK = "#241812";

const HEADER_TITLE = { en: "History", km: "ប្រវត្តិសាស្ត្រ" };
const HEADER_SUBTITLE = { en: "World History", km: "ប្រវត្តិសាស្ត្រពិភពលោក" };
const BACK_HEADER_TITLE = { en: "Answer & Explanation", km: "ចម្លើយ និងការពន្យល់" };
const TOPIC_LABEL = { en: "Topic", km: "ប្រធានបទ" };
const ANSWER_LABEL = { en: "The correct answer is", km: "ចម្លើយត្រឹមត្រូវគឺ" };
const TRIVIA_LABEL = { en: "Did you know?", km: "តើអ្នកដឹងទេ?" };
const EXPLANATION_LABEL = { en: "Explanation", km: "ការពន្យល់" };
const TOPIC = { en: "Cambodian Independence", km: "ឯករាជ្យកម្ពុជា" };
const QUESTION = {
  en: "When did Cambodia gain full independence from France?",
  km: "តើកម្ពុជាទទួលបានឯករាជ្យពេញលេញពីបារាំងនៅពេលណា?",
};
const CHOICES = [
  { letter: "A", text: { en: "1863", km: "១៨៦៣" } },
  { letter: "B", text: { en: "9 November 1953", km: "៩ វិច្ឆិកា ១៩៥៣" } },
  { letter: "C", text: { en: "17 April 1975", km: "១៧ មេសា ១៩៧៥" } },
  { letter: "D", text: { en: "24 September 1993", km: "២៤ កញ្ញា ១៩៩៣" } },
];
const CORRECT_LETTER = "B";
const META = [
  { icon: "event", label: { en: "Event", km: "ព្រឹត្តិការណ៍" }, value: { en: "1953", km: "១៩៥៣" } },
  { icon: "place", label: { en: "Place", km: "ទីកន្លែង" }, value: { en: "Phnom Penh", km: "ភ្នំពេញ" } },
  { icon: "theme", label: { en: "Theme", km: "ប្រធានបទ" }, value: { en: "Independence", km: "ឯករាជ្យ" } },
  { icon: "remember", label: { en: "Remember", km: "ចងចាំ" }, value: { en: "1863 + 90 yrs", km: "១៨៦៣ + ៩០ឆ្នាំ" } },
];

function MonumentIcon({ className }) {
  return (
    <svg viewBox="0 0 200 160" className={className} fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <rect x="66" y="112" width="68" height="26" />
      <path d="M76 112 L76 90 L124 90 L124 112" />
      <path d="M84 90 L84 68 L116 68 L116 90" />
      <path d="M92 68 L92 48 L108 48 L108 68" />
      <path d="M100 48 L90 26 L100 14 L110 26 Z" />
    </svg>
  );
}

const META_ICONS = {
  event: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  place: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  ),
  theme: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M4 21V9l8-6 8 6v12" />
      <path d="M9 21v-6h6v6" />
    </svg>
  ),
  remember: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M9.5 3a5.5 5.5 0 0 0-3 10 4 4 0 0 0 1.5 7.5h8a4 4 0 0 0 1.5-7.5 5.5 5.5 0 0 0-3-10 4.9 4.9 0 0 0-5 0Z" />
    </svg>
  ),
};

const ICON_PROPS = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full" };

function HeaderBar({ children }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-t-[10px]"
      style={{ background: MAROON, color: CREAM }}
    >
      {children}
    </div>
  );
}

function NotesBox({ label }) {
  return (
    <div className="relative mt-3">
      <span
        className="absolute -top-2.5 left-3 z-10 rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
        style={{ background: MAROON, color: CREAM }}
      >
        {label}
      </span>
      <div
        className="rounded-md h-[74px]"
        style={{
          border: `1.5px solid ${MAROON}`,
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 17px, ${MAROON}33 17px 18px)`,
          backgroundPosition: "0 20px",
        }}
      />
    </div>
  );
}

export default function HistoryQuizCard({ flipped, onFlip, interactive = true, className }) {
  const { t, pick } = useI18n();
  const lesson = lessonsFor("history").find((l) => l.id === "h3");

  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      type={interactive ? "button" : undefined}
      onClick={interactive ? onFlip : undefined}
      aria-label={interactive ? t("hero.flipHint") : undefined}
      style={{ perspective: "1600px", aspectRatio: "10 / 16.5" }}
      className={cx("block w-full text-left select-none", interactive && "cursor-pointer", className)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(.4,.2,.2,1)]"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* ---- front ---- */}
        <div
          className="absolute inset-0 rounded-[10px] overflow-hidden shadow-panel flex flex-col"
          style={{ background: CREAM, color: INK, backfaceVisibility: "hidden", border: `1px solid ${MAROON}22` }}
        >
          <HeaderBar>
            <div className="flex items-center gap-2.5 min-w-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 21h16M5 21V10M19 21V10M3 10l9-6 9 6M7 10v11M11 10v11M13 10v11M17 10v11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="min-w-0">
                <p className="font-display text-sm leading-tight truncate">{pick(HEADER_TITLE)}</p>
                <p className="text-[10px] opacity-70 truncate">{pick(HEADER_SUBTITLE)}</p>
              </div>
            </div>
            <div className="text-center shrink-0">
              <span
                className="block rounded-sm px-2 py-0.5 text-[10px] font-mono font-semibold"
                style={{ background: GOLD_LIGHT, color: MAROON_DEEP }}
              >
                H-001
              </span>
              <span className="block text-[10px] mt-0.5" style={{ color: GOLD }}>★</span>
            </div>
          </HeaderBar>

          <div className="flex-1 min-h-0 flex flex-col px-4 pt-3 pb-3 overflow-hidden">
            <span
              className="self-center rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider mb-2.5"
              style={{ background: GOLD_LIGHT, color: MAROON_DEEP }}
            >
              • {pick(TOPIC_LABEL)}: {pick(TOPIC)} •
            </span>

            <p className="font-display text-[15px] leading-snug text-center mb-2.5" style={{ color: MAROON_DEEP }}>
              {pick(QUESTION)}
            </p>

            <div className="flex items-center justify-center gap-2 mb-2.5 opacity-50">
              <span className="h-px w-8" style={{ background: MAROON }} />
              <span style={{ color: GOLD }}>★</span>
              <span className="h-px w-8" style={{ background: MAROON }} />
            </div>

            <div
              className="relative rounded-md flex-1 min-h-0 overflow-hidden"
              style={{ background: GOLD_LIGHT, color: MAROON }}
            >
              <img
                src={PHOTO_SRC}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
              <div className="absolute inset-0 hidden items-center justify-center">
                <MonumentIcon className="w-16 h-14" />
              </div>
            </div>
          </div>
        </div>

        {/* ---- back ---- */}
        <div
          className="absolute inset-0 rounded-[10px] overflow-hidden shadow-panel flex flex-col"
          style={{ background: CREAM, color: INK, backfaceVisibility: "hidden", transform: "rotateY(180deg)", border: `1px solid ${MAROON}22` }}
        >
          <HeaderBar>
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9.5" />
                <path d="M8 12.5l2.5 2.5L16 9.5" />
              </svg>
              <p className="font-display text-sm leading-tight">{pick(BACK_HEADER_TITLE)}</p>
            </div>
          </HeaderBar>

          <div className="flex-1 min-h-0 flex flex-col px-4 pt-2.5 pb-2.5 overflow-hidden">
            <span
              className="self-start inline-block rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider mb-2"
              style={{ background: GOLD_LIGHT, color: MAROON_DEEP }}
            >
              {pick(ANSWER_LABEL)}:
            </span>

            <div className="flex items-center gap-2.5 mb-2">
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: MAROON, color: CREAM }}
              >
                {CORRECT_LETTER}
              </span>
              <p className="font-display text-[14px] leading-snug" style={{ color: MAROON_DEEP }}>
                {pick(CHOICES.find((c) => c.letter === CORRECT_LETTER).text)}
              </p>
            </div>

            <div className="h-px mb-2" style={{ background: `${MAROON}33` }} />

            <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: MAROON }}>
              {pick(EXPLANATION_LABEL)}
            </p>
            <p className="text-[11px] leading-relaxed mb-2">{pick(lesson.sections[0].body[0])}</p>

            <div className="rounded-md p-2 mb-2" style={{ background: GOLD_LIGHT }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: MAROON_DEEP }}>
                {t("lesson.keyPoints")}
              </p>
              <ul className="space-y-0.5">
                {lesson.keyPoints.map((k, i) => (
                  <li key={i} className="text-[10.5px] leading-snug flex gap-1.5">
                    <span style={{ color: MAROON }}>•</span>
                    {pick(k)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md p-2 mb-2" style={{ border: `1px solid ${MAROON}33` }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: MAROON }}>
                {pick(TRIVIA_LABEL)}
              </p>
              <p className="text-[10.5px] leading-relaxed">{pick(lesson.sections[0].body[1])}</p>
            </div>

            <NotesBox label={t("custom.noteLabel")} compact />

            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {META.map((m) => {
                const Icon = META_ICONS[m.icon];
                return (
                  <div key={m.icon} className="text-center">
                    <div className="w-5 h-5 mx-auto mb-1" style={{ color: MAROON }}>
                      <Icon {...ICON_PROPS} />
                    </div>
                    <p className="text-[7px] font-bold uppercase tracking-wide opacity-60">{pick(m.label)}</p>
                    <p className="text-[9.5px] font-semibold leading-tight">{pick(m.value)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Tag>
  );
}
