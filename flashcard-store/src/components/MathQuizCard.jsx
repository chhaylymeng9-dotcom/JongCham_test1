import { useI18n } from "../i18n.jsx";
import { cx } from "../ui.jsx";

/* ---------- MathQuizCard ----------
A one-off showcase card for the Math Fundamentals' Store preview, styled
after the same navy/gold "study-card" look as GrammarQuizCard — just a
question on the front, and the answer plus its formula on the back. No
photo panel: unlike Grammar and History, this template is text-only.
--------------------------------- */

const NAVY = "#1B3A5C";
const NAVY_DEEP = "#102540";
const GOLD = "#C9A227";
const GOLD_LIGHT = "#F3E7C4";
const CREAM = "#FBF3E4";
const INK = "#22201A";
const SKY = "#9FC0DD";

const HEADER_TITLE = { en: "Mathematics", km: "គណិតវិទ្យា" };
const HEADER_SUBTITLE = { en: "Fundamentals & Formulas", km: "មូលដ្ឋាន និងរូបមន្ត" };
const BACK_HEADER_TITLE = { en: "Answer & Form", km: "ចម្លើយ និងរូបមន្ត" };
const QUESTION_LABEL = { en: "Question", km: "សំណួរ" };
const ANSWER_LABEL = { en: "The answer:", km: "ចម្លើយ៖" };
const FORM_LABEL = { en: "Form:", km: "រូបមន្ត៖" };
const FRONT_TAGLINE = { en: "Master math, build the foundation.", km: "ស្ទាត់ជំនាញគណិតវិទ្យា សាងគ្រឹះមួយរឹងមាំ។" };
const BACK_TAGLINE = { en: "Practice today, improve tomorrow!", km: "អនុវត្តថ្ងៃនេះ ល្អប្រសើរថ្ងៃស្អែក!" };
const QUESTION = { en: "What is the Pythagorean theorem?", km: "តើទ្រឹស្តីបទពីតាហ្គ័រ គឺជាអ្វី?" };
const ANSWER_TEXT = {
  en: "In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.",
  km: "ក្នុងត្រីកោណកែង ការេនៃអ៊ីប៉ូតេនុស ស្មើនឹងផលបូកនៃការេនៃជ្រុងទាំងពីរទៀត។",
};
const LEGEND = { en: "a, b = the two legs · c = the hypotenuse", km: "a, b = ជ្រុងទាំងពីរ · c = អ៊ីប៉ូតេនុស" };
const EXAMPLE = { en: "Example: if a = 3 and b = 4, then c = 5.", km: "ឧទាហរណ៍៖ បើ a = ៣ និង b = ៤ នោះ c = ៥។" };

// A right triangle — the shape the whole card is about — doubles as the
// decorative corner flourish and the front footer icon.
function TriangleIcon({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h16M4 20V4l16 16" />
    </svg>
  );
}

function CompassIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" opacity="0.9" />
      <path d="M12 3v18M3 12h18" strokeWidth="1.3" opacity="0.55" />
    </svg>
  );
}

function HeaderBar({ children }) {
  return (
    <div className="relative flex items-center justify-between px-4 py-3 rounded-t-[10px] overflow-hidden" style={{ background: NAVY, color: CREAM }}>
      {children}
    </div>
  );
}

// Wing—ribbon—wing label, matching the pasted card's section dividers.
function RibbonRow({ children, leftWing = true }) {
  return (
    <div className="flex items-center gap-3">
      {leftWing && <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${SKY})` }} />}
      <span
        className="shrink-0 text-[11px] font-bold uppercase tracking-[2.5px] px-4 py-2 rounded-md whitespace-nowrap"
        style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DEEP})`, color: CREAM }}
      >
        {children}
      </span>
      <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${SKY}, transparent)` }} />
    </div>
  );
}

function NotesBox() {
  const { t } = useI18n();
  return (
    <div
      className="relative mt-4 flex-1 min-h-[64px] flex flex-col rounded-2xl pt-[26px] px-[22px] pb-[20px]"
      style={{ border: `2px solid ${NAVY}`, background: CREAM, boxShadow: "0 12px 28px -10px rgba(16,37,64,0.35)" }}
    >
      <span
        className="absolute -top-4 left-[22px] z-10 rounded-md px-4 py-[7px] text-xs font-display font-bold uppercase"
        style={{
          background: NAVY_DEEP,
          color: CREAM,
          letterSpacing: "1.5px",
          boxShadow: "0 3px 8px rgba(16,37,64,0.4)",
        }}
      >
        {t("custom.noteLabel")}
      </span>
      <div className="flex-1 flex flex-col">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1"
            style={{ borderBottom: i < 2 ? `1px solid ${NAVY}30` : "none" }}
          />
        ))}
      </div>
    </div>
  );
}

function FooterStrip({ icon, children }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-b-[10px]" style={{ background: GOLD_LIGHT, color: NAVY_DEEP }}>
      <span className="w-5 h-5 shrink-0" style={{ color: GOLD }}>
        {icon}
      </span>
      <p className="text-[10.5px] font-semibold leading-snug">{children}</p>
    </div>
  );
}

export default function MathQuizCard({ flipped, onFlip, interactive = true, className }) {
  const { t, pick } = useI18n();

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
          style={{ background: CREAM, color: INK, backfaceVisibility: "hidden", border: `1px solid ${NAVY}22` }}
        >
          <HeaderBar>
            <div className="flex items-center gap-2.5 min-w-0">
              <CompassIcon className="w-6 h-6 shrink-0" />
              <div className="min-w-0">
                <p className="font-display text-sm leading-tight truncate">{pick(HEADER_TITLE)}</p>
                <p className="text-[10px] opacity-70 truncate italic">{pick(HEADER_SUBTITLE)}</p>
              </div>
            </div>
            <div className="text-center shrink-0">
              <span className="block rounded-sm px-2 py-0.5 text-[10px] font-mono font-semibold" style={{ background: GOLD_LIGHT, color: NAVY_DEEP }}>
                M-001
              </span>
              <span className="block text-[10px] mt-0.5" style={{ color: GOLD }}>★</span>
            </div>
            <TriangleIcon className="absolute right-5 -bottom-3.5 w-9 h-[52px] opacity-90" style={{ color: GOLD }} />
          </HeaderBar>

          <div className="px-5 pt-6">
            <RibbonRow>{pick(QUESTION_LABEL)}</RibbonRow>
          </div>

          <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 pb-2 overflow-hidden">
            <p className="font-display text-[23px] leading-snug text-center max-w-[280px]" style={{ color: NAVY_DEEP }}>
              {pick(QUESTION)}
            </p>
            <hr className="w-14 mt-5 border-t-2 border-dotted opacity-60" style={{ borderColor: GOLD }} />
          </div>

          <FooterStrip icon={<TriangleIcon className="w-full h-full" />}>{pick(FRONT_TAGLINE)}</FooterStrip>
        </div>

        {/* ---- back ---- */}
        <div
          className="absolute inset-0 rounded-[10px] overflow-hidden shadow-panel flex flex-col"
          style={{ background: CREAM, color: INK, backfaceVisibility: "hidden", transform: "rotateY(180deg)", border: `1px solid ${NAVY}22` }}
        >
          <HeaderBar>
            <div className="flex items-center gap-2.5">
              <CompassIcon className="w-5 h-5 shrink-0" />
              <p className="font-display text-sm leading-tight">{pick(BACK_HEADER_TITLE)}</p>
            </div>
          </HeaderBar>

          <div className="flex-1 min-h-0 flex flex-col px-4 pt-4 pb-3 overflow-hidden">
            <RibbonRow leftWing={false}>{pick(ANSWER_LABEL)}</RibbonRow>

            <div className="flex items-center gap-2.5 mt-3 mb-3 rounded-md px-3 py-2.5" style={{ background: GOLD_LIGHT }}>
              <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: NAVY, color: CREAM }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7" />
                </svg>
              </span>
              <p className="font-display text-[13.5px] leading-snug" style={{ color: NAVY_DEEP }}>
                {pick(ANSWER_TEXT)}
              </p>
            </div>

            <RibbonRow leftWing={false}>{pick(FORM_LABEL)}</RibbonRow>

            <p className="font-display text-[26px] font-bold text-center tracking-wide my-3" style={{ color: NAVY_DEEP }}>
              a<sup className="text-base">2</sup> + b<sup className="text-base">2</sup> = c<sup className="text-base">2</sup>
            </p>
            <p className="text-[11px] leading-relaxed">{pick(LEGEND)}</p>
            <p className="text-[11px] leading-relaxed mb-2">{pick(EXAMPLE)}</p>

            <NotesBox />

            <div className="-mx-4 mt-3 shrink-0">
              <FooterStrip
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <path d="M12 2.5l2.7 5.9 6.3.8-4.7 4.4 1.2 6.3-5.5-3.1-5.5 3.1 1.2-6.3-4.7-4.4 6.3-.8Z" />
                  </svg>
                }
              >
                {pick(BACK_TAGLINE)}
              </FooterStrip>
            </div>
          </div>
        </div>
      </div>
    </Tag>
  );
}
