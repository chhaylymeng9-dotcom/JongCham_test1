import { useEffect, useState } from "react";
import { useI18n } from "../i18n.jsx";
import Flashcard from "../components/Flashcard.jsx";
import { CardsTab, BulkTab } from "../components/CardEditor.jsx";
import { StyleTab } from "../components/BuilderControls.jsx";
import { cardHasContent, cardSideHasContent, makeBuild } from "../data/decks.js";
import { getCustomDesign, setCustomDesign } from "../storage.js";
import { Eyebrow, Panel, cx } from "../ui.jsx";

/* ---------- Design ----------
The full card-by-card builder, unlocked once a Customize Set purchase is
signed in. Unlike the pre-purchase preview (capped at one card), this one
runs up to the deck's real capacity and autosaves to this device as the
customer types — there's no cart step left to pass through.
--------------------------------- */

export default function Design({ deckId, deck }) {
  const { t, pick } = useI18n();
  const [state, setState] = useState(() => {
    const saved = getCustomDesign(deckId);
    if (saved && Array.isArray(saved.cards) && saved.cards.length > 0) return saved;
    const b = makeBuild(deckId);
    return { cards: b.cards, style: b.style };
  });
  const [activeCard, setActiveCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tab, setTab] = useState("cards");

  useEffect(() => {
    setCustomDesign(deckId, state);
  }, [deckId, state]);

  const designed = state.cards.filter(cardHasContent).length;
  const card = state.cards[Math.min(activeCard, state.cards.length - 1)];
  const readyToPrint = state.cards.length >= deck.capacity && designed >= deck.capacity;

  function submitForPrint() {
    if (!window.confirm(t("design.submitConfirm"))) return;
    setState((s) => ({ ...s, submitted: true, submittedAt: new Date().toISOString() }));
  }

  function patchStyle(patch) {
    setState((s) => ({ ...s, style: { ...s.style, ...patch } }));
  }

  function updateCard(patch) {
    setState((s) => ({
      ...s,
      cards: s.cards.map((c, i) => (i === activeCard ? { ...c, ...patch } : c)),
    }));
  }

  function addCard(seed = { front: [""], back: [""], frontImage: null, backImage: null }) {
    if (state.cards.length >= deck.capacity) return;
    setState((s) => ({ ...s, cards: [...s.cards, { id: crypto.randomUUID(), ...seed }] }));
    setActiveCard(state.cards.length);
    setFlipped(false);
  }

  function duplicateCard() {
    if (state.cards.length >= deck.capacity) return;
    const copy = { ...card, id: crypto.randomUUID() };
    setState((s) => ({
      ...s,
      cards: [...s.cards.slice(0, activeCard + 1), copy, ...s.cards.slice(activeCard + 1)],
    }));
    setActiveCard(activeCard + 1);
  }

  function deleteCard() {
    if (state.cards.length === 1) {
      updateCard({ front: [""], back: [""], frontImage: null, backImage: null });
      return;
    }
    setState((s) => ({ ...s, cards: s.cards.filter((_, i) => i !== activeCard) }));
    setActiveCard((i) => Math.max(0, i - 1));
  }

  function notesKeyFor(side) {
    return side === "front" ? "frontNotes" : "backNotes";
  }
  function addNote(side) {
    const key = notesKeyFor(side);
    const note = { id: crypto.randomUUID(), text: t("custom.noteDefaultText"), ruled: false };
    updateCard({ [key]: [...(card?.[key] ?? []), note] });
  }
  function changeNote(side, id, patch) {
    const key = notesKeyFor(side);
    updateCard({ [key]: (card?.[key] ?? []).map((n) => (n.id === id ? { ...n, ...patch } : n)) });
  }
  function deleteNote(side, id) {
    const key = notesKeyFor(side);
    updateCard({ [key]: (card?.[key] ?? []).filter((n) => n.id !== id) });
  }

  function applyBulk(rows, mode) {
    setState((s) => {
      const incoming = rows.map((r) => ({ id: crypto.randomUUID(), ...r }));
      const merged =
        mode === "replace" ? incoming : [...s.cards.filter(cardHasContent), ...incoming];
      return { ...s, cards: merged.slice(0, deck.capacity) };
    });
    setActiveCard(0);
    setTab("cards");
  }

  const tabs = [
    { id: "cards", label: t("custom.cardsTab"), badge: state.cards.length },
    { id: "style", label: t("custom.styleTab") },
    { id: "bulk", label: t("custom.bulkTab") },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <Eyebrow>{t("design.eyebrow")}</Eyebrow>
          <h2 className="font-display text-2xl mt-2">{t("custom.title")}</h2>
        </div>
        <span className="text-xs text-ink/45">{t("design.savedHint")}</span>
      </div>

      <Panel tone="dark" className="p-6 sm:p-8">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12">
          {/* ---- editor ---- */}
          <div>
            <div className="flex flex-wrap gap-2 border-b border-cardstock/15 pb-3 mb-6">
              {tabs.map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setTab(tb.id)}
                  aria-pressed={tab === tb.id}
                  className={cx(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    tab === tb.id
                      ? "bg-cardstock border-cardstock text-chalk"
                      : "border-cardstock/25 text-cardstock/80 hover:border-cardstock/60"
                  )}
                >
                  {tb.label}
                  {tb.badge != null && <span className="ml-2 font-mono text-[11px] opacity-60">{tb.badge}</span>}
                </button>
              ))}
            </div>

            {tab === "cards" && (
              <CardsTab
                build={state}
                deck={deck}
                card={card}
                activeCard={activeCard}
                designed={designed}
                onSelect={(i) => {
                  setActiveCard(i);
                  setFlipped(false);
                }}
                onUpdate={updateCard}
                onAdd={addCard}
                onDuplicate={duplicateCard}
                onDelete={deleteCard}
              />
            )}

            {tab === "style" && (
              <StyleTab
                style={state.style}
                deck={deck}
                onChange={patchStyle}
                frontNotes={card?.frontNotes}
                backNotes={card?.backNotes}
                onAddNote={addNote}
                onNoteChange={changeNote}
                onNoteDelete={deleteNote}
              />
            )}

            {tab === "bulk" && <BulkTab capacity={deck.capacity} onApply={applyBulk} />}
          </div>

          {/* ---- preview ---- */}
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            <div className="mx-auto w-full max-w-[460px]">
              <Flashcard
                front={card?.front}
                back={card?.back}
                frontImage={card?.frontImage}
                backImage={card?.backImage}
                frontImageBox={card?.frontImageBox}
                backImageBox={card?.backImageBox}
                onImageBoxChange={(side, box) =>
                  updateCard(side === "front" ? { frontImageBox: box } : { backImageBox: box })
                }
                frontLineBoxes={card?.frontLineBoxes}
                backLineBoxes={card?.backLineBoxes}
                onLineBoxChange={(side, i, box) => {
                  const key = side === "front" ? "frontLineBoxes" : "backLineBoxes";
                  updateCard({ [key]: { ...(card?.[key] ?? {}), [i]: box } });
                }}
                frontNotes={card?.frontNotes}
                backNotes={card?.backNotes}
                onNoteBoxChange={(side, id, box) => {
                  const key = side === "front" ? "frontNotes" : "backNotes";
                  const list = card?.[key] ?? [];
                  updateCard({ [key]: list.map((n) => (n.id === id ? { ...n, box } : n)) });
                }}
                imagesEditable
                cardLabel={pick(deck.name)}
                style={state.style}
                flipped={flipped}
                onFlip={() => setFlipped((f) => !f)}
                index={activeCard}
                total={state.cards.length}
                aspectRatio="10 / 16.5"
              />
            </div>
            <p className="label text-cardstock/45 text-center">
              {card && cardSideHasContent(card, flipped ? "back" : "front")
                ? t("custom.dragImageHint")
                : t("hero.flipHint")}
            </p>

            {/* ---- send the finished deck to the printer ---- */}
            <div className="border-t border-cardstock/15 pt-4">
              {state.submitted ? (
                <div className="rounded-card bg-cardstock/10 px-4 py-3">
                  <p className="text-sm text-cardstock">
                    {t("design.submittedBanner", { date: new Date(state.submittedAt).toLocaleDateString() })}
                  </p>
                  {readyToPrint && (
                    <button
                      onClick={submitForPrint}
                      className="text-xs text-cardstock/60 hover:text-cardstock underline underline-offset-4 mt-2"
                    >
                      {t("design.resubmit")}
                    </button>
                  )}
                </div>
              ) : readyToPrint ? (
                <button
                  onClick={submitForPrint}
                  className="w-full rounded-full bg-grease hover:bg-grease-deep text-paper font-medium py-3 transition-colors"
                >
                  {t("design.submitButton")}
                </button>
              ) : (
                <p className="label text-cardstock/45 text-center">
                  {t("design.allCardsHint", { n: deck.capacity, designed })}
                </p>
              )}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
