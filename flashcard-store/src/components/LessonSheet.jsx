import { useI18n } from "../i18n.jsx";
import { Button, cx } from "../ui.jsx";

/* ---------- LessonSheet ----------
A print-ready study sheet generated from one lesson: two companion cards
laid out front-and-back for cutting — card fronts in the left column, card
backs in the right column. Card 1 carries the core idea, card 2 carries a
practice problem with a scan-to-watch panel on its back.
------------------------------------ */

const NUM_BADGE =
  "flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-grease text-paper text-[11px] font-mono mt-0.5";

function NumBadge({ n }) {
  return <span className={NUM_BADGE}>{n}</span>;
}

function CellLabel({ children }) {
  return <p className="label text-ink/40 mb-3">{children}</p>;
}

/* Decorative only — a QR-shaped glyph, not a scannable code. */
function QrGlyph({ seed = 0 }) {
  const cells = [];
  let n = seed || 1;
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      n = (n * 1103515245 + 12345) & 0x7fffffff;
      const inCorner = (x < 2 && y < 2) || (x > 2 && y < 2) || (x < 2 && y > 2);
      if (inCorner || n % 2 === 0) cells.push(`${x},${y}`);
    }
  }
  return (
    <svg viewBox="0 0 5 5" className="w-full h-full" aria-hidden="true">
      {cells.map((c) => {
        const [x, y] = c.split(",").map(Number);
        return <rect key={c} x={x} y={y} width="1" height="1" fill="currentColor" />;
      })}
    </svg>
  );
}

export default function LessonSheet({ lesson, deck, index, printable = false, onPrintRequest }) {
  const { t, pick } = useI18n();
  const example = lesson.examples?.[0];
  const practiceExample = lesson.examples?.[1] ?? lesson.examples?.[0];
  const rule = lesson.keyPoints?.[1] ?? lesson.keyPoints?.[0];
  const initial = (deck?.subject || deck?.tag || "L")[0].toUpperCase();

  return (
    <div>
      <div className={cx(printable && "print-area", "bg-paper p-2 sm:p-3")}>
        <div className="border border-ink/15 rounded-card overflow-hidden bg-paper">
          <div className="grid sm:grid-cols-2">
            {/* ---- card 1 · front ---- */}
            <div className="p-6 sm:p-7 border-b border-dashed border-ink/25 sm:border-r">
              <CellLabel>
                {t("lessonSheet.card", { n: 1 })} · {t("common.front")}
              </CellLabel>

              <div className="bg-chalk-deep text-cardstock rounded-lg px-4 py-3.5 mb-5">
                <p className="label text-cardstock/55 mb-1.5">
                  {t("lessonSheet.lessonOrdinal", { n: index + 1 })}
                </p>
                <h3 className="font-display text-xl sm:text-2xl leading-tight">{pick(lesson.title)}</h3>
              </div>

              {rule && <p className="text-center label text-ink/45 mb-3">{pick(rule)}</p>}

              {example && (
                <p className="text-center font-display text-lg sm:text-xl leading-snug break-words">
                  {pick(example.prompt)} <span className="text-grease">→</span> {pick(example.solution)}
                </p>
              )}
            </div>

            {/* ---- card 1 · back ---- */}
            <div className="p-6 sm:p-7 border-b border-dashed border-ink/25">
              <CellLabel>
                {t("lessonSheet.card", { n: 1 })} · {t("common.back_side")}
              </CellLabel>

              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-full bg-grease text-paper flex items-center justify-center font-display text-sm shrink-0">
                  {initial}
                </span>
                <h4 className="font-display text-lg">{t("lessonSheet.example")}</h4>
              </div>

              <ol className="space-y-4">
                <li className="flex gap-3">
                  <NumBadge n={1} />
                  <p className="text-sm leading-relaxed text-ink/80">{pick(lesson.objective)}</p>
                </li>
                {rule && (
                  <li className="flex gap-3">
                    <NumBadge n={2} />
                    <div className="flex-1 border border-dashed border-ink/30 rounded-md px-3 py-2.5">
                      <p className="text-sm leading-relaxed">{pick(rule)}</p>
                    </div>
                  </li>
                )}
                {lesson.tip && (
                  <li className="flex gap-3">
                    <NumBadge n={3} />
                    <p className="text-sm leading-relaxed text-grease-deep">{pick(lesson.tip)}</p>
                  </li>
                )}
              </ol>
            </div>

            {/* ---- card 2 · front ---- */}
            <div className="p-6 sm:p-7 sm:border-r">
              <CellLabel>
                {t("lessonSheet.card", { n: 2 })} · {t("common.front")}
              </CellLabel>

              <h4 className="font-display text-lg text-grease-deep mb-4">
                {t("lessonSheet.practiceExample")}
              </h4>

              {practiceExample ? (
                <p className="font-display text-xl sm:text-2xl leading-snug break-words">
                  {pick(practiceExample.prompt)}
                </p>
              ) : (
                <p className="text-ink/35 italic text-sm">{t("lessonSheet.noExample")}</p>
              )}

              <p className="text-xs text-ink/40 mt-8">{t("lessonSheet.flipHint")}</p>
            </div>

            {/* ---- card 2 · back ---- */}
            <div className="p-6 sm:p-7">
              <CellLabel>
                {t("lessonSheet.card", { n: 2 })} · {t("common.back_side")}
              </CellLabel>

              <h4 className="font-display text-lg mb-4">{t("lessonSheet.scanTitle")}</h4>

              <div className="border-2 border-grease rounded-md w-full max-w-[160px] aspect-square mx-auto p-4 text-grease">
                <QrGlyph seed={index + 1} />
              </div>

              <p className="text-xs text-center text-ink/55 leading-relaxed mt-3 max-w-[220px] mx-auto">
                {t("lessonSheet.scanCaption")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="print:hidden mt-5">
        <Button variant="dark" onClick={onPrintRequest ?? (() => window.print())}>
          {t("lessonSheet.printCta")}
        </Button>
        <p className="text-xs text-ink/45 mt-2.5">{t("cert.printHint")}</p>
      </div>
    </div>
  );
}
