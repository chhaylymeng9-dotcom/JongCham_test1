import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "../i18n.jsx";
import { CardThumb } from "../components/Flashcard.jsx";
import {
  DECK_BY_ID,
  cardHasContent,
  cardSizeById,
  priceBuild,
  stockById,
  letteringById,
} from "../data/decks.js";
import { QtyStepper } from "../components/BuilderControls.jsx";
import Reveal from "../components/Reveal.jsx";
import { promoByCode } from "../data/promos.js";
import { Button, Eyebrow, EmptyState, Input, LinkButton } from "../ui.jsx";

/* ---------- Cart ----------
Each line is a full deck build, so it shows what was actually designed:
the format, the finish, and the cards themselves behind a disclosure.
--------------------------------- */

export default function Cart({ items, onUpdateQty, onRemove, onCheckout, onBack, promo, onApplyPromo, onRemovePromo }) {
  const { t, pick } = useI18n();
  const [openId, setOpenId] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const total = items.reduce((sum, item) => sum + priceBuild(item.build).total, 0);
  // A promo code takes a straight percentage off the subtotal; the shell
  // keeps the applied code so checkout honours the same discount.
  const discount = promo ? Math.round(total * promo.pct) / 100 : 0;
  const grand = Math.max(0, total - discount);

  function applyPromo() {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    const found = promoByCode(code);
    if (!found) {
      setPromoError(t("cart.promoInvalid"));
      return;
    }
    setPromoError("");
    setCodeInput("");
    onApplyPromo(found);
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-16 md:py-24">
        <Eyebrow>{t("cart.eyebrow")}</Eyebrow>
        <h1 className="font-display text-3xl md:text-4xl mt-2.5 mb-8">{t("cart.empty")}</h1>
        <EmptyState
          body={t("cart.emptyBody")}
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
        <Eyebrow>{t("cart.eyebrow")}</Eyebrow>
        <h1 className="font-display text-3xl md:text-4xl mt-2.5 mb-8">
          {t("cart.items", { n: items.length })}
        </h1>
      </Reveal>

      <div className="space-y-4">
        {/* Each line eases in with a small stagger down the list. */}
        {items.map((item, i) => {
          const deck = DECK_BY_ID[item.build.deckId];
          const price = priceBuild(item.build);
          const stock = stockById(item.build.style.stock);
          const written = item.build.cards.filter(cardHasContent);
          const open = openId === item.cartId;

          return (
            <Reveal key={item.cartId} delay={Math.min(i * 0.08, 0.24)} className="border border-ink/15 rounded-card overflow-hidden">
              <div className="p-5 flex flex-wrap gap-5">
                {/* stock chip doubles as a colour reminder */}
                <div
                  className="w-16 h-16 rounded-md shrink-0 border border-ink/15 shadow-panel"
                  style={{ background: stock.hex }}
                  aria-hidden="true"
                />

                <div className="flex-1 min-w-[180px]">
                  <h3 className="font-display text-xl leading-snug">{pick(deck.name)}</h3>
                  <p className="text-sm text-ink/60 mt-1">
                    {pick(cardSizeById(item.build.style.size).label)} ·{" "}
                    {pick(stock.label)} · {pick(letteringById(item.build.style.lettering).label)}
                  </p>
                  <p className="font-mono text-xs text-ink/45 mt-1.5 tabular-nums">
                    {t("cart.customCards", { n: written.length })} · ${price.unit.toFixed(2)} ×{" "}
                    {item.build.qty}
                  </p>

                  {written.length > 0 && (
                    <button
                      onClick={() => setOpenId(open ? null : item.cartId)}
                      className="text-xs underline underline-offset-4 text-ink/50 hover:text-ink mt-2.5"
                    >
                      {open ? t("cart.hideCards") : t("cart.viewCards")}
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-end justify-between gap-3">
                  <span className="font-mono text-lg tabular-nums">${price.total.toFixed(2)}</span>
                  <QtyStepper
                    value={item.build.qty}
                    onChange={(qty) => onUpdateQty(item.cartId, qty)}
                  />
                  <LinkButton className="!text-xs" onClick={() => onRemove(item.cartId)}>
                    {t("common.remove")}
                  </LinkButton>
                </div>
              </div>

              {open && (
                <div className="border-t border-ink/10 bg-cardstock/30 px-5 py-4 animate-fade-in">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {written.map((c, i) => (
                      <CardThumb
                        key={c.id}
                        card={c}
                        style={item.build.style}
                        index={i}
                        label={(c.front ?? []).find((l) => l && l.trim()) ?? ""}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Reveal>
          );
        })}
      </div>

      {/* totals */}
      <Reveal className="border border-ink/15 rounded-card mt-6 p-5 space-y-2.5">
        {/* promo code — a percentage off the subtotal; the applied code
            rides up to the shell so checkout can honour it too */}
        {promo ? (
          <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-ink/10">
            <span className="text-sm text-ink/70">{t("cart.promo", { code: promo.code })}</span>
            <span className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-sm tabular-nums text-grease">-${discount.toFixed(2)}</span>
              <LinkButton className="!text-xs" onClick={onRemovePromo}>
                {t("common.remove")}
              </LinkButton>
            </span>
          </div>
        ) : (
          <div className="pb-3.5 border-b border-dashed border-ink/20">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <span className="text-[15px] font-semibold">{t("cart.promoTitle")}</span>
              <LinkButton className="!text-sm !no-underline" onClick={onCheckout}>
                {t("cart.promoVoucher")}
              </LinkButton>
            </div>
            <div className="flex gap-2.5">
              <Input
                placeholder={t("cart.promoPlaceholder")}
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value.toUpperCase());
                  if (promoError) setPromoError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
                autoComplete="off"
                spellCheck={false}
                aria-label={t("cart.promoTitle")}
                className="!bg-cardstock/40 !border-ink/15 !px-4 !py-2.5"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="shrink-0 min-w-[104px] rounded-md border border-ink/15 bg-cardstock/70 px-5 py-2.5 text-sm text-ink/70 shadow-panel transition-colors hover:bg-cardstock hover:text-ink"
              >
                {t("cart.promoApply")}
              </button>
            </div>
            <p className={promoError ? "text-sm text-red-700 mt-2" : "text-sm text-ink/45 mt-2"}>
              {promoError || t("cart.promoHint")}
            </p>
          </div>
        )}

        <div className="flex items-baseline justify-between">
          <span className="label text-ink/50">{t("common.subtotal")}</span>
          <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="label text-ink/50">{t("cart.shipping")}</span>
          <span className="text-sm text-ink/70">{t("cart.shippingFree")}</span>
        </div>
        <div className="h-px bg-ink/10 my-1" />
        <div className="flex items-baseline justify-between">
          <span className="label text-ink/60">{t("common.total")}</span>
          <span className="font-mono text-2xl tabular-nums">${grand.toFixed(2)}</span>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="flex flex-wrap items-center gap-4 mt-7">
        <Button size="lg" onClick={onCheckout}>
          {t("cart.checkout")}
        </Button>
        <LinkButton onClick={onBack}>{t("cart.keepShopping")}</LinkButton>
      </Reveal>
    </div>
  );
}
