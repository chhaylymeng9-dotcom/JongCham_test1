import { useMemo, useState } from "react";
import { useI18n } from "../i18n.jsx";
import Flashcard from "../components/Flashcard.jsx";
import { CardsTab } from "../components/CardEditor.jsx";
import { QtyStepper, StyleTab, SummaryRow } from "../components/BuilderControls.jsx";
import { DECK_BY_ID, cardHasContent, cardSideHasContent, cardSizeById, priceBuild } from "../data/decks.js";
import { Button, Eyebrow, SectionHeading } from "../ui.jsx";

/* ---------- Customize ----------
The pre-purchase preview builder, on its own page. Only reached from decks
flagged `customizable` — pre-made decks (grammar, math, history) skip this
entirely since their course content is already set.

Only ONE card can be designed here — it's a free "try before you buy"
preview. The rest of the deck (up to its full capacity) is designed after
checkout, from My Account, once the customer actually owns it.
--------------------------------- */

const PREVIEW_CAPACITY = 1;

export default function Customize({ build, setBuild, onAddToCart, onBuyNow, onGoToCart, onBack }) {
  const { t, pick } = useI18n();
  const [activeCard, setActiveCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tab, setTab] = useState("cards");
  const [justAdded, setJustAdded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const deck = DECK_BY_ID[build.deckId];
  // The editor only ever sees a 1-card capacity, regardless of the deck's
  // real (post-purchase) capacity.
  const previewDeck = useMemo(() => ({ ...deck, capacity: PREVIEW_CAPACITY }), [deck]);
  const price = useMemo(() => priceBuild(build), [build]);
  const designed = build.cards.filter(cardHasContent).length;
  const card = build.cards[Math.min(activeCard, build.cards.length - 1)];

  function patchStyle(patch) {
    setBuild((b) => ({ ...b, style: { ...b.style, ...patch } }));
  }

  function updateCard(patch) {
    setBuild((b) => ({
      ...b,
      cards: b.cards.map((c, i) => (i === activeCard ? { ...c, ...patch } : c)),
    }));
  }

  function addCard(seed = { front: [""], back: [""], frontImage: null, backImage: null }) {
    if (build.cards.length >= PREVIEW_CAPACITY) return;
    setBuild((b) => ({ ...b, cards: [...b.cards, { id: crypto.randomUUID(), ...seed }] }));
    setActiveCard(build.cards.length);
    setFlipped(false);
  }

  function duplicateCard() {
    if (build.cards.length >= PREVIEW_CAPACITY) return;
    const copy = { ...card, id: crypto.randomUUID() };
    setBuild((b) => ({
      ...b,
      cards: [...b.cards.slice(0, activeCard + 1), copy, ...b.cards.slice(activeCard + 1)],
    }));
    setActiveCard(activeCard + 1);
  }

  function deleteCard() {
    updateCard({ front: [""], back: [""], frontImage: null, backImage: null });
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

  function handleAdd() {
    onAddToCart({ cartId: crypto.randomUUID(), build: structuredClone(build) });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2600);
  }

  function handleBuyNow() {
    onBuyNow({ cartId: crypto.randomUUID(), build: structuredClone(build) });
  }

  return (
    <section className="bg-chalk text-cardstock min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 md:py-16">
        <button
          onClick={onBack}
          className="text-sm underline underline-offset-4 decoration-cardstock/30 text-cardstock/60 hover:opacity-100 hover:text-cardstock transition-colors mb-6 inline-block"
        >
          ← {t("nav.backToStore")}
        </button>

        <SectionHeading
          tone="light"
          eyebrow={t("custom.previewEyebrow")}
          title={t("custom.previewTitle")}
          subtitle={t("custom.previewSubtitle")}
        />

        <div className="grid lg:grid-cols-[1fr_1.45fr] gap-8 lg:gap-12 mt-10">
          {/* ---- editor ---- */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cardstock/15 pb-3 mb-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "cards", label: t("custom.cardsTab") },
                  { id: "style", label: t("custom.styleTab") },
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setTab(tb.id)}
                    aria-pressed={tab === tb.id}
                    className={
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors " +
                      (tab === tb.id
                        ? "bg-cardstock border-cardstock text-chalk"
                        : "border-cardstock/25 text-cardstock/80 hover:border-cardstock/60")
                    }
                  >
                    {tb.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPreviewOpen(true)}
                className="rounded-full border border-cardstock/25 px-4 py-1.5 text-sm font-medium text-cardstock/80 hover:border-cardstock/60 transition-colors"
              >
                {t("custom.previewButton")}
              </button>
            </div>

            {tab === "cards" && (
              <>
                <CardsTab
                  build={build}
                  deck={previewDeck}
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
                <p className="text-xs text-cardstock/50 leading-relaxed mt-4">
                  {t("custom.previewBlanksNote")}
                </p>
              </>
            )}

            {tab === "style" && (
              <StyleTab
                style={build.style}
                deck={deck}
                onChange={patchStyle}
                frontNotes={card?.frontNotes}
                backNotes={card?.backNotes}
                onAddNote={addNote}
                onNoteChange={changeNote}
                onNoteDelete={deleteNote}
              />
            )}
          </div>

          {/* ---- preview + price ---- */}
          <div className="lg:sticky lg:top-6 lg:self-start space-y-5">
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
                style={build.style}
                flipped={flipped}
                onFlip={() => setFlipped((f) => !f)}
                index={activeCard}
                total={build.cards.length}
                aspectRatio="10 / 16.5"
              />
            </div>
            <p className="label text-cardstock/45 text-center">
              {card && cardSideHasContent(card, flipped ? "back" : "front")
                ? t("custom.dragImageHint")
                : t("hero.flipHint")}
            </p>

            <div className="border border-cardstock/20 rounded-card bg-chalk-deep p-5">
              <Eyebrow tone="light">{t("custom.summary")}</Eyebrow>
              <p className="font-display text-xl mt-2 mb-4">{pick(deck.name)}</p>

              <div className="grid sm:grid-cols-2 sm:gap-x-6 gap-y-4">
                {/* ---- left: configuration ---- */}
                <div className="space-y-4">
                  {deck.perCard && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="label text-cardstock/60">{t("custom.howManyCards")}</span>
                      <QtyStepper
                        value={build.cardCount ?? deck.defaultCardCount}
                        onChange={(cardCount) => setBuild((b) => ({ ...b, cardCount }))}
                        min={5}
                        max={deck.capacity}
                        tone="light"
                      />
                    </div>
                  )}

                  <div className="space-y-1 text-cardstock/85">
                    <SummaryRow
                      label={
                        deck.perCard
                          ? t("custom.perCardPrice", {
                              n: build.cardCount ?? deck.defaultCardCount,
                              price: deck.perCard.toFixed(2),
                            })
                          : t("custom.basePrice")
                      }
                      value={`$${price.base.toFixed(2)}`}
                    />
                    {price.sizeUpgrade > 0 && (
                      <SummaryRow
                        label={`${t("custom.sizeUpgrade")} · ${pick(cardSizeById(build.style.size).label)}`}
                        value={`+$${price.sizeUpgrade.toFixed(2)}`}
                      />
                    )}
                  </div>

                  <p className="text-xs text-cardstock/60 leading-relaxed">
                    {t("custom.previewNote", { n: (build.cardCount ?? deck.capacity) - PREVIEW_CAPACITY })}
                  </p>
                </div>

                {/* ---- right: quantity, total ---- */}
                <div className="space-y-4 pt-4 border-t border-cardstock/15 sm:pt-0 sm:border-t-0 sm:border-l sm:pl-6 sm:border-cardstock/15">
                  <div className="flex items-center justify-between gap-4">
                    <span className="label text-cardstock/60">{t("common.quantity")}</span>
                    <QtyStepper
                      value={build.qty}
                      onChange={(qty) => setBuild((b) => ({ ...b, qty }))}
                      tone="light"
                    />
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <span className="label text-cardstock/60">{t("common.total")}</span>
                    <span className="font-mono text-2xl tabular-nums">${price.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* ---- checkout actions: full width below both columns ---- */}
              <div className="flex gap-2.5 mt-5">
                <Button variant="outline-light" className="flex-1" onClick={handleAdd}>
                  {t("custom.addToCart")}
                </Button>
                <Button className="flex-1" onClick={handleBuyNow}>
                  {t("custom.buyNow")}
                </Button>
              </div>

              {justAdded && (
                <div className="mt-3 flex items-center justify-between gap-3 text-sm animate-fade-in">
                  <span className="text-cardstock/80">✓ {t("custom.added")}</span>
                  <button onClick={onGoToCart} className="underline underline-offset-4 hover:opacity-80">
                    {t("nav.cart")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---- preview modal ---- */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-5"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative w-full max-w-[380px] animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              aria-label={t("common.close")}
              className="absolute -top-4 -right-4 z-10 w-9 h-9 rounded-full bg-paper text-ink shadow-panel border border-ink/10 flex items-center justify-center hover:bg-cardstock transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <Flashcard
              front={card?.front}
              back={card?.back}
              frontImage={card?.frontImage}
              backImage={card?.backImage}
              frontImageBox={card?.frontImageBox}
              backImageBox={card?.backImageBox}
              frontLineBoxes={card?.frontLineBoxes}
              backLineBoxes={card?.backLineBoxes}
              frontNotes={card?.frontNotes}
              backNotes={card?.backNotes}
              cardLabel={pick(deck.name)}
              style={build.style}
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
              index={activeCard}
              total={build.cards.length}
              aspectRatio="10 / 16.5"
            />
            <p className="label text-center text-cardstock/70 mt-4">{t("hero.flipHint")}</p>
          </div>
        </div>
      )}
    </section>
  );
}
