import { useEffect, useState } from "react";
import { useI18n } from "../i18n.jsx";
import Flashcard from "../components/Flashcard.jsx";
import { DECK_BY_ID } from "../data/decks.js";
import { clearInvoices, getCustomDesign, getInvoices } from "../storage.js";
import Reveal from "../components/Reveal.jsx";
import { Badge, Button, EmptyState, Eyebrow, LinkButton, cx } from "../ui.jsx";

/* ---------- Orders ----------
Reads back the invoices written at checkout. Fulfilment status is derived
from the order date rather than stored, since there's no backend moving
anything along — the ages below stand in for a real status field.
--------------------------------- */

// Older invoices (saved before a schema tweak) can be missing a numeric
// field — fall back to 0 instead of crashing the whole page on render.
function money(n) {
  return (Number(n) || 0).toFixed(2);
}

function statusFor(dateIso) {
  const days = (Date.now() - new Date(dateIso).getTime()) / 86_400_000;
  if (days < 1.5) return { key: "printing", tone: "accent" };
  if (days < 3) return { key: "shipped", tone: "dark" };
  return { key: "delivered", tone: "success" };
}

export default function Orders({ onBack }) {
  const { t, pick } = useI18n();
  const [invoices, setInvoices] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [previewDeckId, setPreviewDeckId] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewFlipped, setPreviewFlipped] = useState(false);

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  function openDeckPreview(deckId) {
    setPreviewIndex(0);
    setPreviewFlipped(false);
    setPreviewDeckId(deckId);
  }

  function handleClear() {
    if (!window.confirm(t("orders.clearConfirm"))) return;
    clearInvoices();
    setInvoices([]);
  }

  if (invoices.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-16 md:py-24">
        <Eyebrow>{t("orders.eyebrow")}</Eyebrow>
        <h1 className="font-display text-3xl md:text-4xl mt-2.5 mb-8">{t("orders.empty")}</h1>
        <EmptyState
          body={t("orders.emptyBody")}
          action={
            <Button variant="dark" onClick={onBack}>
              {t("nav.backToStore")}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 py-16 md:py-20">
      <Reveal>
        <Eyebrow>{t("orders.eyebrow")}</Eyebrow>
        <h1 className="font-display text-3xl md:text-4xl mt-2.5 mb-8">
          {t("orders.count", { n: invoices.length })}
        </h1>
      </Reveal>

      <div className="space-y-4">
        {/* Each order card eases in with a small stagger down the list. */}
        {invoices.map((inv, i) => {
          const status = statusFor(inv.date);
          const open = openId === inv.orderId;
          return (
            <Reveal key={inv.orderId} delay={Math.min(i * 0.08, 0.24)} className="border border-ink/15 rounded-card overflow-hidden">
              <button
                onClick={() => setOpenId(open ? null : inv.orderId)}
                aria-expanded={open}
                className="w-full flex flex-wrap items-center justify-between gap-4 p-5 text-left hover:bg-ink/[0.02] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm">#{inv.orderId}</span>
                    <Badge tone={status.tone}>{t(`orders.status.${status.key}`)}</Badge>
                  </div>
                  <p className="text-xs text-ink/55 mt-1.5">
                    {new Date(inv.date).toLocaleString()} ·{" "}
                    {(inv.items || []).map((i) => pick(i.deckName)).join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono tabular-nums">${money(inv.total)}</span>
                  <span className={cx("text-ink/40 transition-transform", open && "rotate-180")}>▾</span>
                </div>
              </button>

              {open && (
                <div className="border-t border-ink/10 animate-fade-in">
                  <Invoice inv={inv} onPreviewDeck={openDeckPreview} />
                  <div className="px-5 pb-5 print:hidden">
                    <Button variant="dark" size="sm" onClick={() => window.print()}>
                      {t("orders.printInvoice")}
                    </Button>
                  </div>
                </div>
              )}
            </Reveal>
          );
        })}
      </div>

      <Reveal className="flex flex-wrap items-center gap-5 mt-8">
        <LinkButton onClick={onBack}>← {t("nav.backToStore")}</LinkButton>
        <LinkButton className="!text-red-700 !opacity-70" onClick={handleClear}>
          {t("orders.clear")}
        </LinkButton>
      </Reveal>

      {previewDeckId &&
        (() => {
          const design = getCustomDesign(previewDeckId);
          const deck = DECK_BY_ID[previewDeckId];
          if (!design?.cards?.length) return null;
          const i = Math.min(previewIndex, design.cards.length - 1);
          const card = design.cards[i];
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-5"
              onClick={() => setPreviewDeckId(null)}
            >
              <div className="relative w-full max-w-[380px]" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setPreviewDeckId(null)}
                  aria-label={t("common.close")}
                  className="absolute -top-4 -right-4 z-10 w-9 h-9 rounded-full bg-paper text-ink shadow-panel border border-ink/10 flex items-center justify-center hover:bg-cardstock transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>

                <Flashcard
                  front={card.front}
                  back={card.back}
                  frontImage={card.frontImage}
                  backImage={card.backImage}
                  frontLineBoxes={card.frontLineBoxes}
                  backLineBoxes={card.backLineBoxes}
                  frontNotes={card.frontNotes}
                  backNotes={card.backNotes}
                  cardLabel={pick(deck.name)}
                  style={design.style}
                  flipped={previewFlipped}
                  onFlip={() => setPreviewFlipped((f) => !f)}
                  index={i}
                  total={design.cards.length}
                  aspectRatio="10 / 16.5"
                />

                <div className="flex items-center justify-between gap-4 mt-4">
                  <button
                    onClick={() => {
                      setPreviewFlipped(false);
                      setPreviewIndex((n) => Math.max(0, n - 1));
                    }}
                    disabled={i === 0}
                    className="label text-cardstock/80 disabled:opacity-30 hover:opacity-70 transition-opacity"
                  >
                    ← {t("common.previous")}
                  </button>
                  <span className="label text-cardstock/60">
                    {i + 1} / {design.cards.length}
                  </span>
                  <button
                    onClick={() => {
                      setPreviewFlipped(false);
                      setPreviewIndex((n) => Math.min(design.cards.length - 1, n + 1));
                    }}
                    disabled={i === design.cards.length - 1}
                    className="label text-cardstock/80 disabled:opacity-30 hover:opacity-70 transition-opacity"
                  >
                    {t("common.next")} →
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

/* The expanded body doubles as the print layout. */
function Invoice({ inv, onPreviewDeck }) {
  const { t, pick } = useI18n();

  return (
    <div className="print-area bg-paper px-5 py-6">
      <div className="flex items-start justify-between gap-6 mb-6 pb-5 border-b border-ink/15">
        <div>
          <p className="font-display text-xl">{t("brand.name")}</p>
          <p className="label text-ink/45 mt-1">{t("footer.tagline")}</p>
        </div>
        <div className="text-right">
          <p className="label text-ink/45">{t("orders.invoice")}</p>
          <p className="font-mono text-lg">#{inv.orderId}</p>
          <p className="text-xs text-ink/55 mt-0.5">{new Date(inv.date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6 text-sm">
        <div>
          <p className="label text-ink/45 mb-1.5">{t("orders.billedTo")}</p>
          <p className="font-medium">{inv.name}</p>
          <p className="text-ink/70">{inv.email}</p>
          <p className="text-ink/70">{inv.phone}</p>
          {inv.telegram && <p className="text-ink/70">{inv.telegram}</p>}
        </div>
        <div>
          <p className="label text-ink/45 mb-1.5">{t("orders.deliverTo")}</p>
          <p className="text-ink/80 leading-relaxed">{inv.location}</p>
          {inv.notes && <p className="text-ink/55 text-xs mt-1.5 italic">{inv.notes}</p>}
        </div>
      </div>

      <table className="w-full text-sm mb-5">
        <thead>
          <tr className="border-b border-ink/15">
            <th className="label text-ink/45 text-left pb-2 font-normal">{t("common.deck")}</th>
            <th className="label text-ink/45 text-right pb-2 font-normal">{t("common.quantity")}</th>
            <th className="label text-ink/45 text-right pb-2 font-normal">{t("common.price")}</th>
          </tr>
        </thead>
        <tbody>
          {(inv.items || []).map((item, i) => (
            <tr key={i} className="border-b border-ink/10">
              <td className="py-2.5">
                <span className="font-medium">{pick(item.deckName)}</span>
                {item.cardsWritten > 0 && (
                  <span className="block text-xs text-ink/50">
                    {t("cart.customCards", { n: item.cardsWritten })}
                  </span>
                )}
              </td>
              <td className="py-2.5 text-right font-mono tabular-nums">{item.qty}</td>
              <td className="py-2.5 text-right font-mono tabular-nums">${money(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {(inv.items || [])
        .filter((item) => DECK_BY_ID[item.deckId]?.customizable)
        .map((item) => {
          const design = getCustomDesign(item.deckId);
          const deck = DECK_BY_ID[item.deckId];
          const capacity = design?.cards?.length ?? 0;
          const done = design?.cards?.filter((c) => (c.front?.some((l) => l.trim()) || c.back?.some((l) => l.trim()))).length ?? 0;
          return (
            <div key={item.deckId} className="flex items-center justify-between gap-4 flex-wrap border border-ink/10 rounded-card px-4 py-3 mb-5 print:hidden">
              <div>
                <p className="text-sm font-medium">{pick(deck.name)}</p>
                <p className="text-xs text-ink/55 mt-0.5">
                  {design?.submitted
                    ? t("orders.customSubmitted", { date: new Date(design.submittedAt).toLocaleDateString() })
                    : t("orders.customInProgress", { done, n: capacity })}
                </p>
              </div>
              {design?.submitted && (
                <Button variant="outline" size="sm" onClick={() => onPreviewDeck?.(item.deckId)}>
                  {t("orders.previewAllCards")}
                </Button>
              )}
            </div>
          );
        })}

      <div className="flex justify-end mb-6">
        <div className="w-full max-w-[240px] space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-ink/60">{t("cart.shipping")}</span>
            <span className="text-ink/70">{t("cart.shippingFree")}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-ink/15">
            <span className="label text-ink/60">{t("common.total")}</span>
            <span className="font-mono text-lg tabular-nums">${money(inv.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm border-t border-ink/15 pt-5">
        <div>
          <p className="label text-ink/45 mb-1">{t("orders.paymentMethod")}</p>
          <p>{inv.payMethod === "khqr" ? t("checkout.khqr") : inv.cardBrand || t("checkout.card")}</p>
        </div>
        {inv.codes?.length > 0 && (
          <div>
            <p className="label text-ink/45 mb-1">{t("orders.activationCode")}</p>
            {inv.codes.map((c) => (
              <p key={c.code} className="font-mono tracking-wider">
                {c.code}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
