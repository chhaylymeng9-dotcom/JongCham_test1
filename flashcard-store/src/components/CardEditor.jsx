import { useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { CardThumb } from "./Flashcard.jsx";
import { Button, cx } from "../ui.jsx";

// Capped so a photo pasted in doesn't blow up localStorage — this is a
// browser-only demo, there's no server to hold the original upload.
const IMAGE_MAX_DIM = 900;
const IMAGE_QUALITY = 0.85;

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, IMAGE_MAX_DIM / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Loaded on demand — it pulls in an ONNX segmentation model (tens of MB on
// first use, cached by the browser after), so it must never sit in the
// main bundle for people who never touch the image tools.
async function cutBackground(dataUrl, onProgress) {
  const { removeBackground } = await import("@imgly/background-removal");
  const blob = await removeBackground(dataUrl, {
    model: "isnet_quint8",
    progress: (key, current, total) => onProgress?.(total ? Math.round((current / total) * 100) : null),
  });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function ImagePicker({ label, value, onChange }) {
  const { t } = useI18n();
  const inputRef = useRef(null);
  const [bgProgress, setBgProgress] = useState(null); // null = idle, 0-100 while working
  const [bgError, setBgError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBgError("");
    onChange(await readImageFile(file));
  }

  async function handleCutBackground() {
    if (!value) return;
    setBgError("");
    setBgProgress(0);
    try {
      onChange(await cutBackground(value, setBgProgress));
    } catch {
      setBgError(t("custom.bgRemoveError"));
    } finally {
      setBgProgress(null);
    }
  }

  return (
    <div>
      <span className="label text-cardstock/60">{label}</span>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {value && (
          <img
            src={value}
            alt=""
            className="w-12 h-12 rounded-md object-cover border border-cardstock/25"
            style={{ background: "repeating-conic-gradient(#00000022 0% 25%, transparent 0% 50%) 50%/10px 10px" }}
          />
        )}
        <Button variant="outline-light" size="sm" type="button" onClick={() => inputRef.current?.click()}>
          {value ? t("custom.changeImage") : t("custom.addImage")}
        </Button>
        {value && (
          <>
            <Button
              variant="outline-light"
              size="sm"
              type="button"
              onClick={handleCutBackground}
              disabled={bgProgress !== null}
            >
              {bgProgress !== null ? t("custom.removingBackground", { pct: bgProgress }) : t("custom.removeBackground")}
            </Button>
            <Button variant="outline-light" size="sm" type="button" onClick={() => onChange(null)}>
              {t("common.remove")}
            </Button>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {bgError && <p className="text-xs text-grease mt-1.5">{bgError}</p>}
      {value && <p className="text-xs text-cardstock/45 mt-2">{t("custom.dragImageHint")}</p>}
    </div>
  );
}

/* ---------- Card editor ----------
The card-strip-plus-line-list editor and the paste-a-list importer, shared
between the pre-purchase "design a free preview card" page (capacity 1,
no bulk tab) and the post-purchase "design your deck" account page
(full deck capacity, all three tabs).
--------------------------------- */

const MAX_LINES = 6;
const FRONT_LIMIT = 100;
const BACK_LIMIT = 140;

/* A repeatable list of one-line inputs — one line prints plain, several
   print as a numbered list on the card. */
function LineList({ lines, limit, placeholder, morePlaceholder, onChange }) {
  const { t } = useI18n();
  const items = lines.length ? lines : [""];

  function setLine(i, value) {
    const next = items.slice();
    next[i] = value.slice(0, limit);
    onChange(next);
  }
  function addLine() {
    if (items.length >= MAX_LINES) return;
    onChange([...items, ""]);
  }
  function removeLine(i) {
    const next = items.filter((_, idx) => idx !== i);
    onChange(next.length ? next : [""]);
  }

  return (
    <div className="space-y-2">
      {items.map((line, i) => (
        <div key={i} className="flex items-center gap-2">
          {items.length > 1 && (
            <span className="label text-cardstock/40 w-4 shrink-0 text-right">{i + 1}</span>
          )}
          <input
            value={line}
            onChange={(e) => setLine(i, e.target.value)}
            placeholder={i === 0 ? placeholder : morePlaceholder}
            className="flex-1 min-w-0 rounded-md bg-cardstock text-ink px-3 py-2 text-sm
                       placeholder:text-ink/35 border border-transparent
                       focus:outline-none focus:ring-2 focus:ring-grease"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeLine(i)}
              aria-label={t("custom.removeLine")}
              className="shrink-0 w-7 h-7 rounded-full text-cardstock/50 hover:text-cardstock hover:bg-cardstock/10 transition-colors"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {items.length < MAX_LINES && (
        <button
          type="button"
          onClick={addLine}
          className="text-xs text-cardstock/60 hover:text-cardstock underline underline-offset-4"
        >
          + {t("custom.addLine")}
        </button>
      )}
    </div>
  );
}

export function CardsTab({
  build,
  deck,
  card,
  activeCard,
  designed,
  onSelect,
  onUpdate,
  onAdd,
  onDuplicate,
  onDelete,
}) {
  const { t } = useI18n();
  const full = build.cards.length >= deck.capacity;

  return (
    <div className="space-y-6">
      {/* card strip */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="label text-cardstock/60">
            {t("custom.cardOf", { i: activeCard + 1, n: build.cards.length })}
          </span>
          <span className="font-mono text-[11px] text-cardstock/50">
            {t("custom.filled", { done: designed, n: deck.capacity })}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
          {build.cards.map((c, i) => (
            <CardThumb
              key={c.id}
              card={c}
              style={build.style}
              index={i}
              active={i === activeCard}
              onClick={() => onSelect(i)}
              label={(c.front ?? []).find((l) => l && l.trim()) || `${t("common.card")} ${i + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => onAdd()}
            disabled={full}
            className={cx(
              "shrink-0 w-[86px] h-[62px] rounded-md border-2 border-dashed text-2xl leading-none",
              "border-cardstock/30 text-cardstock/50 transition-colors",
              full ? "opacity-30 cursor-not-allowed" : "hover:border-cardstock/70 hover:text-cardstock"
            )}
            aria-label={t("custom.addCard")}
          >
            +
          </button>
        </div>

        {full && <p className="text-xs text-cardstock/50 mt-1">{t("custom.deckFull", { n: deck.capacity })}</p>}
      </div>

      {/* editor */}
      <div className="space-y-5">
        <div>
          <span className="label text-cardstock/60">{t("custom.frontText")}</span>
          <div className="mt-2">
            <LineList
              lines={card?.front ?? [""]}
              limit={FRONT_LIMIT}
              placeholder={t("custom.frontPlaceholder")}
              morePlaceholder={t("custom.linePlaceholder")}
              onChange={(front) => onUpdate({ front })}
            />
          </div>
          <div className="mt-3">
            <ImagePicker
              label={t("custom.frontImage")}
              value={card?.frontImage ?? null}
              onChange={(frontImage) => onUpdate({ frontImage })}
            />
          </div>
        </div>

        <div>
          <span className="label text-cardstock/60">{t("custom.backText")}</span>
          <div className="mt-2">
            <LineList
              lines={card?.back ?? [""]}
              limit={BACK_LIMIT}
              placeholder={t("custom.backPlaceholder")}
              morePlaceholder={t("custom.linePlaceholder")}
              onChange={(back) => onUpdate({ back })}
            />
          </div>
          <div className="mt-3">
            <ImagePicker
              label={t("custom.backImage")}
              value={card?.backImage ?? null}
              onChange={(backImage) => onUpdate({ backImage })}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline-light" size="sm" onClick={() => onAdd()} disabled={full}>
            + {t("custom.addCard")}
          </Button>
          <Button variant="outline-light" size="sm" onClick={onDuplicate} disabled={full}>
            {t("custom.duplicate")}
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            onClick={onDelete}
            className="!border-grease/50 !text-grease"
          >
            {t("custom.deleteCard")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Accepts "front = back", "front - back" or a tab between the two.
function parseBulk(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(.*?)\s*(?:\t|=|—|–|\s-\s)\s*(.*)$/);
      return m
        ? { front: [m[1].trim().slice(0, FRONT_LIMIT)], back: [m[2].trim().slice(0, BACK_LIMIT)] }
        : { front: [line.slice(0, FRONT_LIMIT)], back: [] };
    })
    .filter((c) => c.front.length || c.back.length);
}

export function BulkTab({ capacity, onApply }) {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const rows = useMemo(() => parseBulk(text), [text]);
  const overflow = rows.length > capacity;

  return (
    <div className="space-y-4">
      <div>
        <span className="label block mb-2 text-cardstock/65">{t("custom.bulkTitle")}</span>
        <p className="text-xs text-cardstock/60 leading-relaxed mb-3">{t("custom.bulkHelp")}</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder={t("custom.bulkPlaceholder")}
          className="w-full rounded-md bg-cardstock text-ink px-3 py-2.5 text-sm font-mono leading-relaxed
                     placeholder:text-ink/30 border border-transparent
                     focus:outline-none focus:ring-2 focus:ring-grease"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-cardstock/60">
          {t("custom.bulkParsed", { n: rows.length })}
        </span>
        {overflow && (
          <span className="text-xs text-grease">{t("custom.bulkOverflow", { n: capacity })}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={!rows.length} onClick={() => onApply(rows, "append")}>
          {t("custom.bulkAppend")}
        </Button>
        <Button
          size="sm"
          variant="outline-light"
          disabled={!rows.length}
          onClick={() => onApply(rows, "replace")}
        >
          {t("custom.bulkReplace")}
        </Button>
      </div>
    </div>
  );
}
