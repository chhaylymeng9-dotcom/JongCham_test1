import { useId } from "react";
import { useI18n } from "../i18n.jsx";
import {
  backLayoutStyle,
  cardSizeById,
  cornerById,
  inkRgba,
  letteringById,
  noteThemeById,
  stockById,
  templateById,
  textSizeById,
} from "../data/decks.js";
import { cx } from "../ui.jsx";

/* ---------- Flashcard ----------
The single source of truth for what a card looks like. The store preview,
the cart thumbnails and the print spec all render through this, so what a
customer approves is what gets made.

A side is a list of lines, not one block of text: one line prints as a
labelled Question/Answer paragraph, more than one prints as a numbered
list — and each line is its own free-positioned box, the same way an
uploaded photo is, so a new line gets its own box to drag into place
rather than being locked to a shared block.
--------------------------------- */

// x/y are a box's centre, w/h its size — all as a fraction (x/y) or
// percentage (w/h) of the card, so a box prints exactly where it's left.
export const DEFAULT_IMAGE_BOX = { x: 0.5, y: 0.66, w: 46, h: 46 };
export const DEFAULT_TEXT_BOX = { x: 0.5, y: 0.58, w: 88, h: 68 };
export const DEFAULT_NOTE_BOX = { x: 0.5, y: 0.5, w: 55, h: 22 };

// A fresh line's box, staggered so several new lines don't all land on top
// of each other — roughly where the old stacked list used to put them.
function defaultLineBox(rank, total) {
  if (total <= 1) return DEFAULT_TEXT_BOX;
  const band = 0.68 / total;
  return { x: 0.5, y: 0.24 + band * (rank + 0.5), w: 88, h: band * 100 * 0.82 };
}

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

// Corner handles resize on both axes; edge handles resize on one.
const RESIZE_HANDLES = [
  { id: "nw", left: 0, top: 0, cursor: "nwse-resize", shape: "corner" },
  { id: "n", left: 0.5, top: 0, cursor: "ns-resize", shape: "h" },
  { id: "ne", left: 1, top: 0, cursor: "nesw-resize", shape: "corner" },
  { id: "e", left: 1, top: 0.5, cursor: "ew-resize", shape: "v" },
  { id: "se", left: 1, top: 1, cursor: "nwse-resize", shape: "corner" },
  { id: "s", left: 0.5, top: 1, cursor: "ns-resize", shape: "h" },
  { id: "sw", left: 0, top: 1, cursor: "nesw-resize", shape: "corner" },
  { id: "w", left: 0, top: 0.5, cursor: "ew-resize", shape: "v" },
];
const MIN_BOX_PX = 28;

/* fixed pieces of the themed frame ported from the supplied component:
   the paper-grain noise tile, and the serif the question/answer text
   reads in (Lora, loaded in index.html with a Khmer serif fallback) */
const CHROME_GRAIN =
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/><feColorMatrix type='saturate' values='0'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='.22'/></svg>")`;
const CHROME_SERIF = "'Lora', 'Noto Serif Khmer', Georgia, serif";

/* the wave illustration that closes the themed panel — two gradient
   swells with curl scribbles, foam lines and spray dots. Gradient ids are
   scoped by useId so several cards on a page never share colours. */
function ChromeWaves({ wave, paper }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const a = `wgA${uid}`, b = `wgB${uid}`;
  return (
    <svg viewBox="0 0 400 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="block w-full h-auto">
      <defs>
        <linearGradient id={a} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={wave} stopOpacity=".16" />
          <stop offset="100%" stopColor={wave} stopOpacity=".34" />
        </linearGradient>
        <linearGradient id={b} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={wave} stopOpacity=".26" />
          <stop offset="100%" stopColor={wave} stopOpacity=".5" />
        </linearGradient>
      </defs>
      <path fill={`url(#${a})`} d="M0,96 C34,70 62,66 88,80 C112,93 128,88 142,72 C160,52 190,50 208,70 C226,90 250,92 268,76 C290,56 322,58 342,80 C358,98 378,102 400,88 L400,150 L0,150 Z" />
      <g fill="none" stroke={wave} strokeOpacity=".3" strokeWidth="1.6" strokeLinecap="round">
        <path d="M84,84 c-9,-7 -20,-4 -21,6 c-1,8 8,12 13,7 c4,-4 1,-9 -3,-8" />
        <path d="M206,74 c-9,-8 -21,-5 -22,5 c-1,9 9,13 14,8 c4,-4 0,-10 -4,-8" />
        <path d="M338,84 c-9,-7 -20,-4 -21,6 c-1,8 8,12 13,7 c4,-4 1,-9 -3,-8" />
      </g>
      <path fill={`url(#${b})`} d="M0,124 C30,106 58,104 82,116 C106,128 126,124 144,110 C166,93 196,94 214,112 C232,130 258,132 278,118 C302,101 334,104 354,122 C368,134 384,136 400,128 L400,150 L0,150 Z" />
      <g fill="none" stroke={paper} strokeOpacity=".55" strokeWidth="1.4" strokeLinecap="round">
        <path d="M14,126 C36,112 58,111 78,120" />
        <path d="M118,120 C132,110 150,106 166,110" />
        <path d="M226,124 C244,134 264,132 280,122" />
        <path d="M320,112 C338,110 354,118 366,128" />
      </g>
      <g fill="none" stroke={wave} strokeOpacity=".42" strokeWidth="1.8" strokeLinecap="round">
        <path d="M78,120 c-10,-8 -23,-4 -24,7 c-1,10 10,14 16,9 c5,-4 1,-11 -4,-9" />
        <path d="M212,114 c-10,-9 -24,-5 -25,6 c-1,10 11,15 17,9 c5,-4 0,-11 -5,-9" />
        <path d="M352,122 c-10,-8 -23,-4 -24,7 c-1,10 10,14 16,9 c5,-4 1,-11 -4,-9" />
      </g>
      <g fill={paper} fillOpacity=".6">
        <circle cx="66" cy="106" r="1.5" /><circle cx="96" cy="100" r="1.2" /><circle cx="150" cy="98" r="1.4" />
        <circle cx="200" cy="96" r="1.2" /><circle cx="252" cy="104" r="1.5" /><circle cx="300" cy="98" r="1.2" />
        <circle cx="344" cy="106" r="1.4" />
      </g>
    </svg>
  );
}

export default function Flashcard({
  front,
  back,
  frontImage,
  backImage,
  frontImageBox,
  backImageBox,
  onImageBoxChange,
  frontLineBoxes,
  backLineBoxes,
  onLineBoxChange,
  frontNotes,
  backNotes,
  onNoteBoxChange,
  imagesEditable = false,
  cardLabel,
  style,
  flipped = false,
  onFlip,
  index,
  total,
  className,
  interactive = true,
  // Overrides the print-accurate aspect ratio for display-only previews
  // (e.g. a marketing teaser) — the real builder never passes this, so
  // what a customer designs still matches what gets printed.
  aspectRatio,
}) {
  const { t } = useI18n();
  const stock = stockById(style.stock);
  const size = cardSizeById(style.size);
  const family = letteringById(style.lettering).family;
  const scale = textSizeById(style.textSize).scale;
  const noteTheme = noteThemeById(style.noteTheme);
  const radius = cornerById(style.corners).radius;
  // "plain" is the default — no chrome, just the card's own stock colour.
  // Any other template wraps the content in a themed header/footer frame.
  const chrome = style.template && style.template !== "plain" ? templateById(style.template) : null;

  // The front always reads on clean bone white with dark ink, whatever
  // stock the set uses — the chosen stock colour shows on the back.
  const FRONT_FACE = stockById("bone");
  const faceBaseFor = (side) => {
    const face = side === "front" ? FRONT_FACE : stock;
    return {
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      // the themed frame paints the whole face deep; the light paper panel
      // sits 5px inside it, so the template colour reads as frame and bars
      background: chrome ? chrome.deep : face.hex,
      color: chrome ? chrome.ink : face.ink,
      borderRadius: radius,
      border: chrome
        ? "none"
        : `1px solid ${face.id === "bone" ? "rgba(35,32,27,0.18)" : "rgba(35,32,27,0.12)"}`,
    };
  };

  // Drag moves a box to wherever the pointer is, in card-fraction
  // coordinates, so it prints exactly where it was dropped.
  function startBoxDrag(e, box, onChange) {
    if (!imagesEditable) return;
    e.stopPropagation();
    e.preventDefault();
    const faceEl = e.currentTarget.closest("[data-face-root]");
    const rect = faceEl.getBoundingClientRect();
    const pointerId = e.pointerId;
    e.currentTarget.setPointerCapture(pointerId);

    function move(ev) {
      const x = clamp((ev.clientX - rect.left) / rect.width, 0.06, 0.94);
      const y = clamp((ev.clientY - rect.top) / rect.height, 0.06, 0.94);
      onChange({ ...box, x, y });
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  // Corner/edge handles, Canva-style: the opposite side of the box stays
  // anchored while the dragged side follows the pointer.
  function startBoxResize(e, box, defaultBox, handleId, onChange) {
    if (!imagesEditable) return;
    e.stopPropagation();
    e.preventDefault();
    const faceEl = e.currentTarget.closest("[data-face-root]");
    const rect = faceEl.getBoundingClientRect();
    const rectW = rect.width;
    const rectH = rect.height;

    const w0 = ((box.w ?? defaultBox.w) / 100) * rectW;
    const h0 = ((box.h ?? defaultBox.h) / 100) * rectH;
    const cx0 = box.x * rectW;
    const cy0 = box.y * rectH;
    const start = { left: cx0 - w0 / 2, right: cx0 + w0 / 2, top: cy0 - h0 / 2, bottom: cy0 + h0 / 2 };
    const xEdge = handleId.includes("w") ? "l" : handleId.includes("e") ? "r" : null;
    const yEdge = handleId.includes("n") ? "t" : handleId.includes("s") ? "b" : null;
    const pointerId = e.pointerId;
    e.currentTarget.setPointerCapture(pointerId);

    function move(ev) {
      const px = ev.clientX - rect.left;
      const py = ev.clientY - rect.top;
      let { left, right, top, bottom } = start;
      if (xEdge === "l") left = clamp(px, 0, start.right - MIN_BOX_PX);
      if (xEdge === "r") right = clamp(px, start.left + MIN_BOX_PX, rectW);
      if (yEdge === "t") top = clamp(py, 0, start.bottom - MIN_BOX_PX);
      if (yEdge === "b") bottom = clamp(py, start.top + MIN_BOX_PX, rectH);

      onChange({
        ...box,
        x: (left + right) / 2 / rectW,
        y: (top + bottom) / 2 / rectH,
        w: ((right - left) / rectW) * 100,
        h: ((bottom - top) / rectH) * 100,
      });
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  // The outline + 8 handles overlaid on a box while it's being edited.
  const BoxHandles = ({ box, defaultBox, onChange }) => (
    <>
      <div className="absolute inset-0 border border-black/70 pointer-events-none" />
      {RESIZE_HANDLES.map((h) => (
        <div
          key={h.id}
          onPointerDown={(e) => startBoxResize(e, box, defaultBox, h.id, onChange)}
          style={{
            position: "absolute",
            left: `${h.left * 100}%`,
            top: `${h.top * 100}%`,
            transform: "translate(-50%, -50%)",
            cursor: h.cursor,
            touchAction: "none",
          }}
          className={cx(
            "bg-white border-2 border-grease shadow-sm",
            h.shape === "corner" && "w-3 h-3 rounded-full",
            h.shape === "h" && "w-5 h-2.5 rounded-full",
            h.shape === "v" && "w-2.5 h-5 rounded-full"
          )}
        />
      ))}
    </>
  );

  const Face = ({
    side,
    lines,
    placeholder,
    layout,
    image,
    imageBox,
    lineBoxes,
    onThisLineBoxChange,
    notes,
    onThisNoteBoxChange,
  }) => {
    const filledEntries = (lines ?? [])
      .map((text, i) => ({ text, i }))
      .filter((e) => e.text && e.text.trim());
    const numbered = filledEntries.length > 1;
    const qLabel = side === "front" ? t("common.questionLabel") : t("common.answerLabel");
    const iBox = imageBox ?? DEFAULT_IMAGE_BOX;
    // Lines only become free-floating boxes once editing, or once the
    // customer has actually moved one — otherwise it's the same plain,
    // static layout every simple card has always used.
    const hasCustomLineBox = filledEntries.some((e) => lineBoxes?.[e.i]);
    const linesAreBoxed = filledEntries.length > 0 && (imagesEditable || hasCustomLineBox);

    const lineLabel = (text, rank) =>
      numbered ? (
        <div className="flex gap-2.5 items-baseline">
          <span className="font-mono opacity-45 shrink-0" style={{ fontSize: `${0.85 * scale}rem` }}>
            {rank + 1})
          </span>
          <span className="break-words" style={{ fontFamily: family, fontSize: `${0.98 * scale}rem`, lineHeight: 1.42 }}>
            {text}
          </span>
        </div>
      ) : (
        <p
          className="text-left break-words"
          style={{ fontFamily: family, fontSize: `${(side === "front" ? 1.05 : 0.98) * scale}rem`, lineHeight: 1.55 }}
        >
          <span className="font-semibold">{qLabel}: </span>
          {text}
        </p>
      );

    // the paper panel rounds 4px tighter than the frame around it
    const innerRadius = `${Math.max(0, (parseInt(radius, 10) || 0) - 4)}px`;
    // footer pagination dots — capped at eight like the component, and lit
    // up to the current card rather than marking one active dot
    const dotCount = Math.max(1, Math.min(total || 1, 8));
    const litDots = index != null ? Math.min(index + 1, dotCount) : 1;
    const pad2 = (n) => String(n).padStart(2, "0");

    return (
      <div
        data-face-root={side}
        style={{
          ...faceBaseFor(side),
          ...(side === "back" ? { transform: "rotateY(180deg)" } : null),
        }}
        className={cx(
          "absolute inset-0 flex flex-col shadow-panel overflow-hidden",
          chrome ? "p-[5px]" : "p-5 sm:p-7"
        )}
      >
        {chrome ? (
          /* the themed frame, ported from the supplied component: deep
             frame → light paper panel → bar / tag / body / waves / foot */
          <div
            className="relative flex-1 min-h-0 flex flex-col overflow-hidden"
            style={{
              background: chrome.paper,
              borderRadius: innerRadius,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: 0.5, mixBlendMode: "multiply", backgroundImage: CHROME_GRAIN }}
            />

            {/* header bar — set name with its gold dot, counter pill */}
            <div
              className="relative flex-none flex items-center justify-between gap-3"
              style={{
                padding: "13px 16px",
                background: `linear-gradient(100deg, ${chrome.deep} 0%, ${chrome.deep2} 62%, ${chrome.deep} 100%)`,
                color: "#F6E9D8",
              }}
            >
              <span
                className="font-display text-[12.5px] flex items-center gap-2 min-w-0"
                style={{ letterSpacing: "0.05em" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: chrome.gold2, boxShadow: `0 0 0 3px ${inkRgba(chrome.gold2, 0.2)}` }}
                />
                <span className="truncate">
                  {cardLabel || (side === "front" ? t("common.front") : t("common.back_side"))}
                </span>
              </span>
              {index != null && (
                <span
                  className="flex-none font-mono text-[11.5px] font-bold rounded-full"
                  style={{
                    letterSpacing: "0.08em",
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    padding: "4px 10px",
                  }}
                >
                  {pad2(index + 1)} / {total ?? 1}
                </span>
              )}
              {/* thin gold rule closing the bar */}
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 bottom-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${chrome.gold}, transparent)`, opacity: 0.75 }}
              />
            </div>

            {/* QUESTION / ANSWER tag between fading rules */}
            <div
              className="relative z-[2] flex-none flex items-center gap-3"
              style={{ padding: "22px 30px 0" }}
            >
              <span
                className="flex-1 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${
                    side === "back" ? inkRgba(chrome.gold, 0.45) : inkRgba(chrome.wave, 0.3)
                  })`,
                }}
              />
              <span
                className="flex-none font-display text-[10.5px] uppercase rounded-full whitespace-nowrap"
                style={
                  side === "back"
                    ? { background: chrome.gold, color: "#2A1B1E", letterSpacing: "0.22em", padding: "7px 15px", boxShadow: `0 3px 10px ${inkRgba(chrome.gold, 0.35)}` }
                    : { background: chrome.deep, color: "#F6E9D8", letterSpacing: "0.22em", padding: "7px 15px", boxShadow: `0 3px 10px ${inkRgba(chrome.deep, 0.3)}` }
                }
              >
                {side === "front" ? t("custom.templateQuestion") : t("custom.templateAnswer")}
              </span>
              <span
                className="flex-1 h-px"
                style={{
                  background: `linear-gradient(90deg, ${
                    side === "back" ? inkRgba(chrome.gold, 0.45) : inkRgba(chrome.wave, 0.3)
                  }, transparent)`,
                }}
              />
            </div>

            {/* body — the first line reads as the big serif statement, any
                further lines as the smaller soft sub-note */}
            {!linesAreBoxed && (
              <div
                className="relative z-[2] flex-1 min-h-0 flex flex-col items-center justify-center text-center overflow-y-auto"
                style={{ padding: "20px 34px 10px" }}
              >
                {filledEntries.length === 0 ? (
                  <p className="leading-snug italic" style={{ color: chrome.soft, fontSize: `${0.95 * scale}rem` }}>
                    {placeholder}
                  </p>
                ) : (
                  <>
                    <p
                      className="break-words"
                      style={{
                        fontFamily: CHROME_SERIF,
                        fontWeight: 500,
                        fontSize: `${(side === "front" ? 1.5 : 1.375) * scale}rem`,
                        lineHeight: side === "front" ? 1.45 : 1.5,
                        color: chrome.ink,
                      }}
                    >
                      {filledEntries[0].text}
                    </p>
                    {filledEntries.slice(1).map(({ text, i }) => (
                      <p
                        key={i}
                        className="break-words"
                        style={{ color: chrome.soft, fontSize: `${0.84 * scale}rem`, lineHeight: 1.6, maxWidth: "30ch", marginTop: 14 }}
                      >
                        {text}
                      </p>
                    ))}
                  </>
                )}
              </div>
            )}
            {linesAreBoxed && <div className="flex-1 min-h-0" />}

            {/* wave illustration hugging the panel bottom */}
            <div className="absolute left-0 right-0 bottom-0 z-[1] leading-none pointer-events-none">
              <ChromeWaves wave={chrome.wave} paper={chrome.paper} />
            </div>

            {/* flip hint */}
            <div
              className="relative z-[2] flex-none text-center text-[11.5px]"
              style={{ color: chrome.soft, opacity: 0.85, padding: "0 24px 16px" }}
            >
              {side === "front" ? t("card.tapReveal") : t("card.tapBack")}
            </div>

            {/* progress + footbar */}
            <div className="flex-none relative z-[3]">
              <div className="h-[5px]" style={{ background: inkRgba(chrome.wave, 0.16) }}>
                {index != null && total > 0 && (
                  <span
                    className="block h-full"
                    style={{
                      width: `${((index + 1) / total) * 100}%`,
                      borderRadius: "0 99px 99px 0",
                      background: `linear-gradient(90deg, ${chrome.gold}, ${chrome.gold2})`,
                    }}
                  />
                )}
              </div>
              <div
                className="flex items-center justify-between font-mono text-[10px] uppercase"
                style={{
                  padding: "10px 16px",
                  letterSpacing: "0.14em",
                  color: "rgba(246,233,216,0.72)",
                  background: `linear-gradient(100deg, ${chrome.deep} 0%, ${chrome.deep2} 55%, ${chrome.deep} 100%)`,
                }}
              >
                <span>{t("brand.name")}</span>
                <span className="flex gap-1">
                  {Array.from({ length: dotCount }).map((_, i) => (
                    <span
                      key={i}
                      className="w-[5px] h-[5px] rounded-full"
                      style={{ background: i < litDots ? chrome.gold2 : "rgba(246,233,216,0.3)" }}
                    />
                  ))}
                </span>
                <span>{index != null ? `CARD ${pad2(index + 1)}` : ""}</span>
              </div>
            </div>

            {/* back layouts draw on their own layer inside the panel */}
            {layout && (
              <div
                aria-hidden="true"
                className="absolute inset-4 pointer-events-none"
                style={backLayoutStyle(layout, chrome.ink)}
              />
            )}
          </div>
        ) : (
          <>
            {/* plain header row — the card's own stock, no frame */}
            <div className="relative flex items-center justify-between shrink-0">
              <span className="text-[10px] truncate label opacity-45">
                {cardLabel || (side === "front" ? t("common.front") : t("common.back_side"))}
              </span>
              {style.numbered && index != null && (
                <span className="font-mono text-[10px] tabular-nums shrink-0 ml-2 opacity-40">
                  {pad2(index + 1)}
                  {total ? `/${total}` : ""}
                </span>
              )}
            </div>

            {/* back layouts are drawn on their own layer so text never sits on a rule */}
            {layout && (
              <div
                aria-hidden="true"
                className="absolute inset-4 pointer-events-none"
                style={backLayoutStyle(layout, stock.ink)}
              />
            )}

            {/* static layout — every card starts out this way */}
            {!linesAreBoxed && (
              <div className="relative flex-1 min-h-0 flex flex-col justify-center py-2">
                {filledEntries.length === 0 ? (
                  <p
                    className="text-center leading-snug opacity-35 italic"
                    style={{ fontFamily: family, fontSize: `${(side === "front" ? 1.2 : 1.05) * scale}rem`, lineHeight: 1.35 }}
                  >
                    {placeholder}
                  </p>
                ) : numbered ? (
                  <ol className="space-y-2.5 text-left overflow-y-auto max-h-full">
                    {filledEntries.map(({ text, i }, rank) => (
                      <li key={i}>{lineLabel(text, rank)}</li>
                    ))}
                  </ol>
                ) : (
                  lineLabel(filledEntries[0].text, 0)
                )}
              </div>
            )}
            {linesAreBoxed && <div className="flex-1 min-h-0" />}
          </>
        )}

        {/* each line free-positioned, its own box — new lines get their own */}
        {linesAreBoxed &&
          filledEntries.map(({ text, i }, rank) => {
            const box = lineBoxes?.[i] ?? defaultLineBox(rank, filledEntries.length);
            return (
              <div
                key={i}
                onPointerDown={(e) => startBoxDrag(e, box, (b) => onThisLineBoxChange?.(i, b))}
                style={{
                  position: "absolute",
                  left: `${box.x * 100}%`,
                  top: `${box.y * 100}%`,
                  width: `${box.w}%`,
                  height: `${box.h}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={cx(
                  "flex flex-col justify-center overflow-hidden",
                  imagesEditable && "cursor-grab active:cursor-grabbing touch-none"
                )}
              >
                {lineLabel(text, rank)}
                {imagesEditable && (
                  <BoxHandles
                    box={box}
                    defaultBox={DEFAULT_TEXT_BOX}
                    onChange={(b) => onThisLineBoxChange?.(i, b)}
                  />
                )}
              </div>
            );
          })}

        {/* note callouts — added from the Style tab, dragged into place */}
        {(notes ?? []).map((note) => {
          const box = note.box ?? DEFAULT_NOTE_BOX;
          return (
            <div
              key={note.id}
              onPointerDown={(e) => startBoxDrag(e, box, (b) => onThisNoteBoxChange?.(note.id, b))}
              style={{
                position: "absolute",
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
                transform: "translate(-50%, -50%)",
              }}
              className={cx(imagesEditable && "cursor-grab active:cursor-grabbing touch-none")}
            >
              <span
                className="absolute -top-3.5 left-2.5 z-10 rounded-md text-paper px-3 py-1 text-[10px] font-display font-bold uppercase whitespace-nowrap"
                style={{
                  background: noteTheme.primaryDark,
                  letterSpacing: "1.2px",
                  boxShadow: `0 3px 8px ${inkRgba(noteTheme.primaryDark, 0.4)}`,
                }}
              >
                {t("custom.noteLabel")}
              </span>
              <div
                className="w-full h-full rounded-2xl px-3.5 pt-5 pb-2.5 flex items-center justify-center text-center overflow-hidden"
                style={{
                  border: `2px solid ${noteTheme.primary}`,
                  boxShadow: `0 10px 24px -10px ${inkRgba(noteTheme.primary, 0.3)}`,
                  ...(note.ruled ? backLayoutStyle("ruled", stock.ink) : undefined),
                }}
              >
                <span
                  className="break-words"
                  style={{
                    fontFamily: family,
                    fontSize: `${0.9 * scale}rem`,
                    lineHeight: 1.4,
                    // notes sit on the paper panel when a template is on,
                    // so they read in the theme ink, not the stock ink
                    color: chrome ? chrome.ink : side === "front" ? FRONT_FACE.ink : stock.ink,
                  }}
                >
                  {note.text}
                </span>
              </div>
              {imagesEditable && (
                <BoxHandles
                  box={box}
                  defaultBox={DEFAULT_NOTE_BOX}
                  onChange={(b) => onThisNoteBoxChange?.(note.id, b)}
                />
              )}
            </div>
          );
        })}

        {/* free-positioned image, draggable in the editor — printed wherever it's dropped */}
        {image && (
          <div
            onPointerDown={(e) => startBoxDrag(e, iBox, (b) => onImageBoxChange?.(side, b))}
            style={{
              position: "absolute",
              left: `${iBox.x * 100}%`,
              top: `${iBox.y * 100}%`,
              width: `${iBox.w ?? DEFAULT_IMAGE_BOX.w}%`,
              height: `${iBox.h ?? DEFAULT_IMAGE_BOX.h}%`,
              transform: "translate(-50%, -50%)",
            }}
            className={cx(imagesEditable && "cursor-grab active:cursor-grabbing touch-none")}
          >
            <img
              src={image}
              alt=""
              draggable={false}
              className="w-full h-full block rounded-md object-fill pointer-events-none"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.18))" }}
            />
            {imagesEditable && (
              <BoxHandles
                box={iBox}
                defaultBox={DEFAULT_IMAGE_BOX}
                onChange={(b) => onImageBoxChange?.(side, b)}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      type={interactive ? "button" : undefined}
      onClick={interactive ? onFlip : undefined}
      aria-label={interactive ? t("hero.flipHint") : undefined}
      style={{ perspective: "1400px", aspectRatio: aspectRatio ?? String(size.ratio) }}
      className={cx(
        "block w-full text-left select-none",
        interactive && "cursor-pointer group",
        className
      )}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(.4,.2,.2,1)]"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <Face
          side="front"
          lines={front}
          placeholder={t("card.frontEmpty")}
          layout={null}
          image={frontImage}
          imageBox={frontImageBox}
          lineBoxes={frontLineBoxes}
          onThisLineBoxChange={(i, b) => onLineBoxChange?.("front", i, b)}
          notes={frontNotes}
          onThisNoteBoxChange={(id, b) => onNoteBoxChange?.("front", id, b)}
        />
        <Face
          side="back"
          lines={back}
          placeholder={t("card.backEmpty")}
          layout={style.backLayout}
          image={backImage}
          imageBox={backImageBox}
          lineBoxes={backLineBoxes}
          onThisLineBoxChange={(i, b) => onLineBoxChange?.("back", i, b)}
          notes={backNotes}
          onThisNoteBoxChange={(id, b) => onNoteBoxChange?.("back", id, b)}
        />
      </div>
    </Tag>
  );
}

/* A small, non-interactive thumbnail for lists — cart lines, card pickers. */
export function CardThumb({ card, style, index, active, onClick, label }) {
  const family = letteringById(style.lettering).family;
  // thumbs miniaturise the front face, which prints on bone white
  const face = stockById("bone");
  const chrome = style.template && style.template !== "plain" ? templateById(style.template) : null;
  const frontLines = (card.front ?? []).filter((l) => l && l.trim());
  const backLines = (card.back ?? []).filter((l) => l && l.trim());
  const filled = frontLines.length > 0 || backLines.length > 0 || card.frontImage || card.backImage;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      title={label}
      className={cx(
        "relative shrink-0 w-[86px] h-[62px] rounded-md border-2 p-2 text-left overflow-hidden transition-all",
        active ? "border-ink shadow-panel -translate-y-0.5" : "border-transparent hover:-translate-y-0.5"
      )}
      style={{ background: face.hex, color: face.ink }}
    >
      {/* the themed frame's header bar, miniaturised */}
      {chrome && <span className="absolute inset-x-0 top-0 h-3" style={{ background: chrome.deep }} />}
      <span
        className={cx(
          "absolute right-1.5 font-mono text-[9px] tabular-nums",
          chrome ? "top-[3px] text-[#F6E9D8] opacity-90" : "top-1 opacity-40"
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      {card.frontImage && (
        <img src={card.frontImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
      )}
      <p
        className={cx(
          "relative text-[10px] leading-tight line-clamp-3 pr-3",
          chrome && "mt-2",
          !filled && "opacity-35 italic",
          card.frontImage && "text-white drop-shadow"
        )}
        style={{ fontFamily: family }}
      >
        {frontLines[0] || "—"}
        {frontLines.length > 1 && <span className="opacity-50"> +{frontLines.length - 1}</span>}
      </p>
    </button>
  );
}
