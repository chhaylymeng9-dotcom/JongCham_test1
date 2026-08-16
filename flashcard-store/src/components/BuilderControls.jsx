import { useI18n } from "../i18n.jsx";
import {
  BACK_LAYOUTS,
  CARD_SIZES,
  CARD_STOCKS,
  CARD_TEMPLATES,
  CORNERS,
  LETTERING,
  NOTE_THEMES,
  TEXT_SIZES,
  cardSizeById,
} from "../data/decks.js";
import { OptionRow, cx } from "../ui.jsx";

/* ---------- Builder controls ----------
Pieces shared between the Store page's simplified "pick a finish" step and
the full Customize page's editor — kept in one place so a stock swatch or
a quantity stepper never drifts between the two.
--------------------------------- */

export function SummaryRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="opacity-70">{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}

export function QtyStepper({ value, onChange, tone = "ink", min = 1, max = 99 }) {
  const light = tone === "light";
  const btn = cx(
    "w-9 h-9 text-base leading-none transition-colors disabled:opacity-30",
    light ? "text-cardstock hover:bg-cardstock/10" : "text-ink hover:bg-ink/5"
  );
  return (
    <div
      className={cx(
        "inline-flex items-center border rounded-full overflow-hidden",
        light ? "border-cardstock/30" : "border-ink/25"
      )}
    >
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="−">
        −
      </button>
      <span className="w-10 text-center font-mono text-sm tabular-nums">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="+">
        +
      </button>
    </div>
  );
}

export function StyleTab({ style, deck, onChange, frontNotes, backNotes, onAddNote, onNoteChange, onNoteDelete }) {
  const { t, pick } = useI18n();

  return (
    <div className="space-y-7">
      {/* stock swatches get their own control — colour is the point */}
      <div>
        <span className="label block mb-2.5 text-cardstock/65">{t("custom.stock")}</span>
        <div className="flex flex-wrap gap-3">
          {CARD_STOCKS.map((s) => {
            const active = style.stock === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange({ stock: s.id })}
                aria-pressed={active}
                title={pick(s.label)}
                className="group flex flex-col items-center gap-1.5"
              >
                <span
                  className={cx(
                    "w-11 h-11 rounded-full transition-transform",
                    active ? "scale-110" : "group-hover:-translate-y-0.5"
                  )}
                  style={{
                    background: s.hex,
                    // A light ring keeps dark stocks visible against the
                    // chalkboard panel they sit on.
                    boxShadow: "0 0 0 1.5px rgba(241,233,210,0.6)",
                    outline: active ? "2px solid #D65F42" : "none",
                    outlineOffset: "4px",
                  }}
                />
                <span
                  className={cx(
                    "text-[10px] transition-opacity",
                    active ? "text-cardstock" : "text-cardstock/50"
                  )}
                >
                  {pick(s.label)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* whole-card template — a themed header/footer frame around the
          customer's own text, or "Plain" for just the stock colour */}
      <div>
        <span className="label block mb-2.5 text-cardstock/65">{t("custom.template")}</span>
        <div className="flex flex-wrap gap-3">
          {CARD_TEMPLATES.map((tpl) => {
            const active = (style.template ?? "plain") === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onChange({ template: tpl.id })}
                aria-pressed={active}
                title={pick(tpl.label)}
                className="group flex flex-col items-center gap-1.5"
              >
                <span
                  className={cx(
                    "w-11 h-11 rounded-full transition-transform flex items-center justify-center",
                    active ? "scale-110" : "group-hover:-translate-y-0.5"
                  )}
                  style={{
                    background: tpl.deep ?? "#FBF3E4",
                    boxShadow: "0 0 0 1.5px rgba(241,233,210,0.6)",
                    outline: active ? "2px solid #D65F42" : "none",
                    outlineOffset: "4px",
                  }}
                >
                  {!tpl.deep && <span className="w-6 h-px bg-cardstock/40 rotate-45" />}
                </span>
                <span className={cx("text-[10px] transition-opacity", active ? "text-cardstock" : "text-cardstock/50")}>
                  {pick(tpl.label)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <OptionRow
        tone="light"
        label={t("custom.lettering")}
        value={style.lettering}
        onChange={(v) => onChange({ lettering: v })}
        options={LETTERING.map((l) => ({ id: l.id, label: pick(l.label), style: { fontFamily: l.family } }))}
      />

      <OptionRow
        tone="light"
        label={t("custom.textSize")}
        value={style.textSize}
        onChange={(v) => onChange({ textSize: v })}
        options={TEXT_SIZES.map((s) => ({ id: s.id, label: t(s.labelKey) }))}
      />

      <OptionRow
        tone="light"
        label={t("custom.backLayout")}
        value={style.backLayout}
        onChange={(v) => onChange({ backLayout: v })}
        options={BACK_LAYOUTS.map((l) => ({ id: l.id, label: pick(l.label) }))}
      />

      <div>
        <span className="label block mb-2.5 text-cardstock/65">{t("custom.cardSize")}</span>
        <div className="grid sm:grid-cols-3 gap-2">
          {CARD_SIZES.map((s) => {
            const active = style.size === s.id;
            const included = s.surcharge <= cardSizeById(deck.defaults.size).surcharge;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange({ size: s.id })}
                aria-pressed={active}
                className={cx(
                  "border rounded-card px-4 py-3 text-left transition-colors",
                  active
                    ? "border-grease bg-grease/15"
                    : "border-cardstock/25 hover:border-cardstock/55"
                )}
              >
                <p className="text-sm font-medium">{pick(s.label)}</p>
                <p className="font-mono text-[11px] text-cardstock/55 mt-0.5">{pick(s.dims)}</p>
                <p className="text-[11px] text-cardstock/70 mt-1">
                  {included ? t("common.free") : `+$${s.surcharge}`}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <OptionRow
          tone="light"
          label={t("custom.corners")}
          value={style.corners}
          onChange={(v) => onChange({ corners: v })}
          options={CORNERS.map((c) => ({ id: c.id, label: t(c.labelKey) }))}
        />
        <OptionRow
          tone="light"
          label={t("custom.numbering")}
          value={style.numbered ? "on" : "off"}
          onChange={(v) => onChange({ numbered: v === "on" })}
          options={[
            { id: "on", label: t("custom.numberingOn") },
            { id: "off", label: t("custom.numberingOff") },
          ]}
        />
      </div>

      {onAddNote && (
        <div>
          <span className="label block mb-2.5 text-cardstock/65">{t("custom.notes")}</span>
          <p className="text-xs text-cardstock/50 mb-4 leading-relaxed">{t("custom.notesHint")}</p>

          <div className="flex flex-wrap gap-3 mb-5">
            {NOTE_THEMES.map((theme) => {
              const active = (style.noteTheme ?? "navy") === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onChange({ noteTheme: theme.id })}
                  aria-pressed={active}
                  title={pick(theme.label)}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span
                    className={cx(
                      "w-9 h-9 rounded-full transition-transform",
                      active ? "scale-110" : "group-hover:-translate-y-0.5"
                    )}
                    style={{
                      background: theme.primary,
                      boxShadow: "0 0 0 1.5px rgba(241,233,210,0.6)",
                      outline: active ? "2px solid #D65F42" : "none",
                      outlineOffset: "4px",
                    }}
                  />
                  <span className={cx("text-[10px] transition-opacity", active ? "text-cardstock" : "text-cardstock/50")}>
                    {pick(theme.label)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-5">
            <NoteSideEditor
              label={t("common.front")}
              notes={frontNotes}
              onAdd={() => onAddNote("front")}
              onNoteChange={(id, patch) => onNoteChange("front", id, patch)}
              onNoteDelete={(id) => onNoteDelete("front", id)}
            />
            <NoteSideEditor
              label={t("common.back_side")}
              notes={backNotes}
              onAdd={() => onAddNote("back")}
              onNoteChange={(id, patch) => onNoteChange("back", id, patch)}
              onNoteDelete={(id) => onNoteDelete("back", id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function NoteSideEditor({ label, notes, onAdd, onNoteChange, onNoteDelete }) {
  const { t } = useI18n();
  return (
    <div>
      <span className="text-xs font-medium text-cardstock/75 block mb-2">{label}</span>

      {notes?.length > 0 && (
        <div className="space-y-2 mb-2.5">
          {notes.map((note) => (
            <div key={note.id} className="flex items-center gap-2">
              <input
                value={note.text}
                onChange={(e) => onNoteChange(note.id, { text: e.target.value })}
                className="flex-1 min-w-0 rounded-md bg-cardstock text-ink px-3 py-2 text-sm
                           border border-transparent focus:outline-none focus:ring-2 focus:ring-grease"
              />
              <label className="flex items-center gap-1.5 shrink-0 text-[11px] text-cardstock/60 select-none">
                <input
                  type="checkbox"
                  checked={Boolean(note.ruled)}
                  onChange={(e) => onNoteChange(note.id, { ruled: e.target.checked })}
                />
                {t("custom.noteRuled")}
              </label>
              <button
                type="button"
                onClick={() => onNoteDelete(note.id)}
                aria-label={t("common.remove")}
                className="shrink-0 w-7 h-7 rounded-full text-cardstock/50 hover:text-cardstock hover:bg-cardstock/10 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="text-xs text-cardstock/60 hover:text-cardstock underline underline-offset-4"
      >
        + {t("custom.addNote")}
      </button>
    </div>
  );
}
