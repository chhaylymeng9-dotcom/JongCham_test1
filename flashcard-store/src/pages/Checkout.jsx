import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../i18n.jsx";
import paymentQR from "../assets/payment-qr.png";
import { DECK_BY_ID, cardHasContent, priceBuild } from "../data/decks.js";
import { REWARDS } from "../data/rewards.js";
import { issueCode } from "../data/codes.js";
import { detectBrand, expiryValid, formatCardNumber, luhnValid } from "../data/cardValidation.js";
import { findVoucher, getDeviceId, markVoucherUsed, saveInvoice, setActivationLock, setSession } from "../storage.js";
import { QtyStepper } from "../components/BuilderControls.jsx";
import Reveal from "../components/Reveal.jsx";
import { Alert, Badge, Button, Eyebrow, Field, Input, LinkButton, Panel, Spinner, TextArea, cx } from "../ui.jsx";

/* ---------- Checkout ----------
details → payment → confirmed.

Payment is deliberately a simulation. The card form validates properly
(Luhn, expiry, CVC, brand detection — see data/cardValidation.js, shared
with the Plans upgrade flow) because a form that accepts nonsense teaches
customers nothing, but no card data leaves this component and none of it
is written to storage — the invoice records the method and brand only.
Going live means posting to a provider such as ABA PayWay or Stripe from
a server, never from here.
--------------------------------- */

function makeOrderId() {
  return Math.floor(10000 + Math.random() * 89999);
}

/* ---------- voucher redemption ----------
A voucher's `kind` decides what it can discount, and only one line in
the cart pays for it — "one box per order" in the reward catalogue is
literal, not decorative:
  - "print"  → the Customize Set line only (percent off its unit price).
  - "pct"/"free" → the cheapest non-Customize-Set line (percent off, or
    that line's unit price waived entirely).
  - "ship"   → nothing to discount here; delivery is already free in
    this demo (see OrderSummary's "Free" line), so it's rejected with an
    honest reason rather than silently doing nothing.
--------------------------------- */
function voucherDiscount(reward, items) {
  const custom = items.filter((it) => DECK_BY_ID[it.build.deckId]?.customizable);
  const boxes = items.filter((it) => !DECK_BY_ID[it.build.deckId]?.customizable);
  const cheapest = (list) => list.reduce((a, b) => (priceBuild(a.build).unit <= priceBuild(b.build).unit ? a : b));
  const pct = () => parseInt(reward.val, 10) / 100;

  if (reward.kind === "ship") {
    return { amount: 0, error: "Delivery to Phnom Penh is already free — there's nothing for this voucher to discount." };
  }
  if (reward.kind === "print") {
    if (custom.length === 0) return { amount: 0, error: "Add a Customize Set deck to your cart to use this voucher." };
    const item = cheapest(custom);
    return { amount: Math.round(priceBuild(item.build).unit * pct() * 100) / 100 };
  }
  if (boxes.length === 0) return { amount: 0, error: "Add a subject box to your cart to use this voucher." };
  const item = cheapest(boxes);
  const unit = priceBuild(item.build).unit;
  return { amount: reward.kind === "free" ? unit : Math.round(unit * pct() * 100) / 100 };
}

/* ---------- page ---------- */

export default function Checkout({ items, onBack, onPaid, onComplete, onGoToAccount, onUpdateQty, onRemove }) {
  const { t, pick } = useI18n();
  const [stage, setStage] = useState("details");
  const [orderId] = useState(makeOrderId);
  // What was actually bought, frozen at payment time. The live cart empties
  // the moment the order is placed, so the receipt can't read from it.
  const [placed, setPlaced] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    telegram: "",
    location: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const [payMethod, setPayMethod] = useState("khqr");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [cardErrors, setCardErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [issued, setIssued] = useState([]);

  const [voucherInput, setVoucherInput] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [voucher, setVoucher] = useState(null); // { code, reward, amount }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + priceBuild(item.build).total, 0),
    [items]
  );
  const discount = voucher?.amount ?? 0;
  const total = Math.max(0, subtotal - discount);
  const reference = useMemo(() => `IC${orderId}`, [orderId]);
  const digits = card.number.replace(/\D/g, "");
  const brand = detectBrand(digits);

  // If the cart changes underneath an applied voucher (an item removed,
  // qty changed) re-check it's still eligible rather than silently
  // keeping a discount that no longer makes sense.
  useEffect(() => {
    if (!voucher) return;
    const { amount, error } = voucherDiscount(voucher.reward, items);
    if (error) {
      setVoucher(null);
      setVoucherError(`${voucher.code} no longer applies: ${error}`);
    } else if (amount !== voucher.amount) {
      setVoucher((v) => (v ? { ...v, amount } : v));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function applyVoucher() {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;
    const record = findVoucher(code);
    const reward = record && REWARDS.find((r) => r.id === record.rewardId);
    if (!record || !reward) {
      setVoucherError("That code isn't valid, or it's already been used.");
      return;
    }
    const { amount, error } = voucherDiscount(reward, items);
    if (error) {
      setVoucherError(error);
      return;
    }
    setVoucher({ code, reward, amount });
    setVoucherError("");
    setVoucherInput("");
  }

  function removeVoucher() {
    setVoucher(null);
    setVoucherError("");
  }

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function submitDetails(e) {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = t("checkout.errRequired");
    if (!form.location.trim()) next.location = t("checkout.errRequired");
    if (!/^[\d\s+()-]{8,}$/.test(form.phone.trim())) next.phone = t("checkout.errPhone");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = t("checkout.errEmail");

    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setStage("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateCard() {
    const next = {};
    if (!luhnValid(digits) || (brand && !brand.lengths.includes(digits.length))) {
      next.number = t("checkout.errCard");
    }
    if (!card.name.trim()) next.name = t("checkout.errCardName");
    if (!expiryValid(card.expiry)) next.expiry = t("checkout.errExpiry");
    if (card.cvc.length < (brand?.cvc ?? 3)) next.cvc = t("checkout.errCvc");
    setCardErrors(next);
    return Object.keys(next).length === 0;
  }

  function pay() {
    if (payMethod === "card" && !validateCard()) return;

    setProcessing(true);
    // Stands in for the round-trip to a payment provider.
    setTimeout(() => {
      const codes = [];
      const seen = new Set();
      for (const item of items) {
        if (seen.has(item.build.deckId)) continue;
        seen.add(item.build.deckId);
        codes.push({ deckId: item.build.deckId, code: issueCode(item.build.deckId, item.build.cardCount) });
      }

      const receiptLines = items.map((item) => {
        const deck = DECK_BY_ID[item.build.deckId];
        return {
          key: item.cartId,
          name: deck.name,
          qty: item.build.qty,
          total: priceBuild(item.build).total,
        };
      });

      saveInvoice({
        orderId,
        date: new Date().toISOString(),
        ...form,
        payMethod,
        // Brand only — no card digits are recorded anywhere.
        cardBrand: payMethod === "card" ? brand?.label ?? "Card" : null,
        items: items.map((item) => {
          const deck = DECK_BY_ID[item.build.deckId];
          const price = priceBuild(item.build);
          return {
            deckId: deck.id,
            deckName: deck.name,
            qty: item.build.qty,
            unit: price.unit,
            total: price.total,
            cardsWritten: item.build.cards.filter(cardHasContent).length,
            style: item.build.style,
          };
        }),
        subtotal,
        voucherCode: voucher?.code ?? null,
        discount,
        total,
        codes,
      });

      if (voucher) markVoucherUsed(voucher.code);

      // A Customize Set order is only half-finished until the rest of the
      // cards are designed — sign the customer straight into that deck so
      // "design the rest" is one click instead of re-typing the code.
      const customItem = items.find((item) => DECK_BY_ID[item.build.deckId]?.customizable);
      const customCode = customItem && codes.find((c) => c.deckId === customItem.build.deckId);
      if (customCode) {
        const deck = DECK_BY_ID[customCode.deckId];
        setActivationLock(customCode.code, getDeviceId());
        setSession({
          auth: "code",
          code: customCode.code,
          deckId: customCode.deckId,
          subject: deck.subject,
          capacity: customItem.build.cardCount ?? deck.capacity,
          name: form.name.trim(),
          email: form.email.trim(),
        });
      }

      setIssued(codes);
      setPlaced({ lines: receiptLines, subtotal, voucherCode: voucher?.code ?? null, discount, total });
      setProcessing(false);
      setStage("confirmed");
      onPaid?.(); // the order exists now — empty the cart
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1300);
  }

  /* ---------- confirmed ---------- */
  if (stage === "confirmed") {
    const hasCustomizable = issued.some(({ deckId }) => DECK_BY_ID[deckId]?.customizable);
    const hasCourseDeck = issued.some(({ deckId }) => !DECK_BY_ID[deckId]?.customizable);
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-16 md:py-20">
        <Reveal className="text-center mb-10">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-chalk text-cardstock font-display text-2xl mb-5">
            ✓
          </span>
          <Eyebrow className="!text-center">{t("checkout.confirmedEyebrow")}</Eyebrow>
          <h1 className="font-display text-3xl md:text-4xl mt-2.5">{t("checkout.confirmedTitle")}</h1>
        </Reveal>

        {/* activation codes are the reason this page matters — lead with them */}
        <Panel tone="accent" className="p-6 mb-6">
          <Eyebrow>{t("checkout.activationTitle")}</Eyebrow>
          <div className="flex flex-wrap gap-3 my-4">
            {issued.map(({ code, deckId }) => (
              <div key={code} className="border border-grease/40 rounded-card bg-paper px-4 py-3">
                <p className="font-mono text-lg tracking-wider">{code}</p>
                <p className="text-xs text-ink/55 mt-0.5">{pick(DECK_BY_ID[deckId].name)}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink/70 leading-relaxed">
            {hasCustomizable && hasCourseDeck
              ? t("checkout.activationBodyMixed")
              : hasCustomizable
              ? t("checkout.activationBodyCustom")
              : t("checkout.activationBody")}
          </p>
          <Button variant="dark" className="mt-4" onClick={onGoToAccount}>
            {hasCustomizable && !hasCourseDeck ? t("checkout.designCards") : t("checkout.goToAccount")}
          </Button>
        </Panel>

        <Panel className="p-6 divide-y divide-ink/10">
          <Row label={t("checkout.orderId")} value={`#${orderId}`} strong />
          {placed?.lines.map((line) => (
            <Row
              key={line.key}
              label={`${pick(line.name)} × ${line.qty}`}
              value={`$${line.total.toFixed(2)}`}
            />
          ))}
          {placed?.discount > 0 && <Row label={`Voucher · ${placed.voucherCode}`} value={`-$${placed.discount.toFixed(2)}`} />}
          <Row label={t("checkout.name")} value={form.name} />
          <Row label={t("checkout.phone")} value={form.phone} />
          <Row label={t("checkout.email")} value={form.email} />
          <Row label={t("checkout.location")} value={form.location} />
          <Row
            label={t("orders.paymentMethod")}
            value={payMethod === "khqr" ? t("checkout.khqr") : `${brand?.label ?? "Card"}`}
          />
          <Row label={t("common.total")} value={`$${(placed?.total ?? total).toFixed(2)}`} strong />
        </Panel>

        <Alert tone="info" className="mt-6">
          {t("checkout.deliveryEta", { phone: form.phone || "" })}
        </Alert>

        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <Button variant="dark" onClick={onComplete}>
            {t("nav.orders")}
          </Button>
        </div>
      </div>
    );
  }

  /* ---------- payment ---------- */
  if (stage === "payment") {
    return (
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-16 md:py-20">
        <Reveal>
          <Eyebrow>{t("checkout.step", { i: 2 })}</Eyebrow>
          <h1 className="font-display text-3xl md:text-4xl mt-2.5 mb-2">{t("checkout.payment")}</h1>
          <p className="text-[15px] text-ink/70 mb-9">{t("checkout.paymentSub")}</p>
        </Reveal>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12">
          <div>
            {/* method selection */}
            <div className="grid sm:grid-cols-2 gap-3 mb-7">
              <MethodCard
                active={payMethod === "khqr"}
                onClick={() => setPayMethod("khqr")}
                title={t("checkout.khqr")}
                sub={t("checkout.khqrSub")}
                mark={<KhqrMark />}
              />
              <MethodCard
                active={payMethod === "card"}
                onClick={() => setPayMethod("card")}
                title={t("checkout.card")}
                sub={t("checkout.cardSub")}
                mark={<CardMark />}
              />
            </div>

            {payMethod === "khqr" ? (
              <Panel className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="border border-ink/15 rounded-card p-2.5 bg-paper shrink-0">
                    <img
                      src={paymentQR}
                      alt={t("checkout.khqrScan")}
                      className="w-[230px] h-auto object-contain"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-display text-xl mb-2">{t("checkout.khqrScan")}</h3>
                    <p className="text-sm text-ink/70 leading-relaxed mb-5">{t("checkout.khqrHelp")}</p>
                    <div className="space-y-2.5">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="label text-ink/45">{t("checkout.khqrAmount")}</span>
                        <span className="font-mono text-xl tabular-nums">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="label text-ink/45">{t("checkout.khqrRef")}</span>
                        <span className="font-mono text-sm">{reference}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            ) : (
              <Panel className="p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h3 className="font-display text-xl">{t("checkout.card")}</h3>
                  {brand && <Badge tone="dark">{brand.label}</Badge>}
                </div>

                <div className="space-y-4">
                  <Field
                    label={t("checkout.cardNumber")}
                    required
                    error={cardErrors.number}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    value={card.number}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 19);
                      setCard((c) => ({ ...c, number: formatCardNumber(raw, detectBrand(raw)) }));
                      setCardErrors((x) => ({ ...x, number: undefined }));
                    }}
                  />
                  <Field
                    label={t("checkout.cardName")}
                    required
                    error={cardErrors.name}
                    autoComplete="cc-name"
                    placeholder={t("checkout.cardNamePlaceholder")}
                    value={card.name}
                    onChange={(e) => {
                      setCard((c) => ({ ...c, name: e.target.value }));
                      setCardErrors((x) => ({ ...x, name: undefined }));
                    }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label={t("checkout.expiry")}
                      required
                      error={cardErrors.expiry}
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setCard((c) => ({
                          ...c,
                          expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d,
                        }));
                        setCardErrors((x) => ({ ...x, expiry: undefined }));
                      }}
                    />
                    <Field
                      label={t("checkout.cvc")}
                      required
                      error={cardErrors.cvc}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder={brand?.cvc === 4 ? "1234" : "123"}
                      value={card.cvc}
                      onChange={(e) => {
                        setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }));
                        setCardErrors((x) => ({ ...x, cvc: undefined }));
                      }}
                    />
                  </div>
                </div>

                <p className="flex items-center gap-2 text-xs text-ink/50 mt-5">
                  <LockIcon />
                  {t("checkout.secureNote")}
                </p>
              </Panel>
            )}

            <Alert tone="warn" title={t("checkout.demoTitle")} className="mt-5">
              {t("checkout.demoBody")}
            </Alert>

            <div className="flex flex-wrap items-center gap-4 mt-7">
              <Button size="lg" onClick={pay} disabled={processing}>
                {processing ? (
                  <>
                    <Spinner /> {t("checkout.processing")}
                  </>
                ) : payMethod === "khqr" ? (
                  t("checkout.confirmPaid")
                ) : (
                  t("checkout.payNow", { amount: total.toFixed(2) })
                )}
              </Button>
              <LinkButton onClick={() => setStage("details")} disabled={processing}>
                ← {t("checkout.backToDetails")}
              </LinkButton>
            </div>
          </div>

          <OrderSummary
            items={items}
            subtotal={subtotal}
            total={total}
            onUpdateQty={onUpdateQty}
            onRemove={onRemove}
            voucher={voucher}
            voucherInput={voucherInput}
            voucherError={voucherError}
            onVoucherInputChange={setVoucherInput}
            onApplyVoucher={applyVoucher}
            onRemoveVoucher={removeVoucher}
          />
        </div>
      </div>
    );
  }

  /* ---------- details ---------- */
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-16 md:py-20">
      <Reveal>
        <Eyebrow>{t("checkout.step", { i: 1 })}</Eyebrow>
        <h1 className="font-display text-3xl md:text-4xl mt-2.5 mb-2">{t("checkout.details")}</h1>
        <p className="text-[15px] text-ink/70 mb-9">{t("checkout.detailsSub")}</p>
      </Reveal>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12">
        <form onSubmit={submitDetails} noValidate className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field
              label={t("checkout.name")}
              required
              error={errors.name}
              autoComplete="name"
              placeholder={t("checkout.namePlaceholder")}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
            <Field
              label={t("checkout.phone")}
              required
              error={errors.phone}
              inputMode="tel"
              autoComplete="tel"
              placeholder="012 345 678"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
            <Field
              label={t("checkout.email")}
              required
              error={errors.email}
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
            <Field
              label={`${t("checkout.telegram")} (${t("common.optional")})`}
              placeholder="@username"
              value={form.telegram}
              onChange={(e) => setField("telegram", e.target.value)}
            />
          </div>

          <Field
            label={t("checkout.location")}
            required
            error={errors.location}
            autoComplete="street-address"
            placeholder={t("checkout.locationPlaceholder")}
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
          />

          <Field label={`${t("checkout.notes")} (${t("common.optional")})`}>
            <TextArea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder={t("checkout.notesPlaceholder")}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button type="submit" size="lg">
              {t("checkout.continueToPayment")}
            </Button>
            <LinkButton type="button" onClick={onBack}>
              ← {t("checkout.backToCart")}
            </LinkButton>
          </div>
        </form>

        <OrderSummary
          items={items}
          subtotal={subtotal}
          total={total}
          onUpdateQty={onUpdateQty}
          onRemove={onRemove}
          voucher={voucher}
          voucherInput={voucherInput}
          voucherError={voucherError}
          onVoucherInputChange={setVoucherInput}
          onApplyVoucher={applyVoucher}
          onRemoveVoucher={removeVoucher}
        />
      </div>
    </div>
  );
}

/* ---------- pieces ---------- */

function OrderSummary({
  items,
  subtotal,
  total,
  onUpdateQty,
  onRemove,
  voucher,
  voucherInput,
  voucherError,
  onVoucherInputChange,
  onApplyVoucher,
  onRemoveVoucher,
}) {
  const { t, pick } = useI18n();
  const editable = Boolean(onUpdateQty && onRemove);
  const hasVoucherUI = Boolean(onApplyVoucher);
  return (
    <Panel tone="cardstock" className="p-5 lg:sticky lg:top-6 lg:self-start h-fit">
      <Eyebrow>{t("checkout.summary")}</Eyebrow>
      <div className="mt-4 space-y-4">
        {items.map((item) => {
          const deck = DECK_BY_ID[item.build.deckId];
          const price = priceBuild(item.build);
          const written = item.build.cards.filter(cardHasContent).length;
          return (
            <div key={item.cartId} className="flex justify-between gap-4 text-sm">
              <div className="min-w-0">
                <p className="font-medium">{pick(deck.name)}</p>
                <p className="text-xs text-ink/55 mt-0.5">
                  {t("cart.customCards", { n: written })}
                </p>
                {editable && (
                  <div className="flex items-center gap-3 mt-2">
                    <QtyStepper value={item.build.qty} onChange={(qty) => onUpdateQty(item.cartId, qty)} />
                    <LinkButton className="!text-xs" onClick={() => onRemove(item.cartId)}>
                      {t("common.remove")}
                    </LinkButton>
                  </div>
                )}
              </div>
              <span className="font-mono tabular-nums shrink-0">${price.total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      {hasVoucherUI && (
        <>
          <div className="h-px bg-ink/10 my-4" />
          {voucher ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0">
                <span className="font-mono text-xs tracking-wide text-ink/60 block">{voucher.code}</span>
                <span className="text-ink/70">{voucher.reward.title}</span>
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono tabular-nums text-grease">-${voucher.amount.toFixed(2)}</span>
                <LinkButton className="!text-xs" onClick={onRemoveVoucher}>
                  {t("common.remove")}
                </LinkButton>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <Input
                  placeholder="Voucher code"
                  value={voucherInput}
                  onChange={(e) => onVoucherInputChange(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onApplyVoucher())}
                  autoComplete="off"
                  spellCheck={false}
                  className="!py-2 text-sm"
                />
                <Button type="button" variant="outline" size="sm" onClick={onApplyVoucher}>
                  Apply
                </Button>
              </div>
              {voucherError && <p className="text-xs text-red-700 mt-1.5">{voucherError}</p>}
            </div>
          )}
        </>
      )}

      <div className="h-px bg-ink/10 my-4" />
      <div className="flex justify-between text-sm mb-2">
        <span className="text-ink/60">{t("cart.shipping")}</span>
        <span className="text-ink/70">{t("cart.shippingFree")}</span>
      </div>
      {voucher && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-ink/60">Subtotal</span>
          <span className="text-ink/70 font-mono tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
      )}
      <div className="flex items-baseline justify-between">
        <span className="label text-ink/60">{t("common.total")}</span>
        <span className="font-mono text-xl tabular-nums">${total.toFixed(2)}</span>
      </div>
    </Panel>
  );
}

function MethodCard({ active, onClick, title, sub, mark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "border rounded-card p-4 text-left transition-all flex items-start gap-3.5",
        active ? "border-grease bg-grease/[0.06] shadow-panel" : "border-ink/20 hover:border-ink/40"
      )}
    >
      <span className="shrink-0 mt-0.5">{mark}</span>
      <span className="min-w-0">
        <span className="block font-medium text-sm">{title}</span>
        <span className="block text-xs text-ink/55 mt-0.5">{sub}</span>
      </span>
      <span
        className={cx(
          "ml-auto shrink-0 w-4 h-4 rounded-full border mt-0.5",
          active ? "border-grease bg-grease" : "border-ink/30"
        )}
      />
    </button>
  );
}

/* Neutral marks rather than reproductions of any bank's logo. */
function KhqrMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" rx="1.5" fill="none" stroke="#2F4538" strokeWidth="2" />
      <rect x="14" y="1" width="9" height="9" rx="1.5" fill="none" stroke="#2F4538" strokeWidth="2" />
      <rect x="1" y="14" width="9" height="9" rx="1.5" fill="none" stroke="#2F4538" strokeWidth="2" />
      <rect x="14" y="14" width="4" height="4" fill="#D65F42" />
      <rect x="19.5" y="19.5" width="3.5" height="3.5" fill="#D65F42" />
    </svg>
  );
}

function CardMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2.5" fill="none" stroke="#2F4538" strokeWidth="2" />
      <rect x="1" y="8" width="22" height="3" fill="#2F4538" />
      <rect x="4" y="14.5" width="7" height="2" rx="1" fill="#D65F42" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5 first:pt-0 last:pb-0">
      <span className="label text-ink/45 shrink-0">{label}</span>
      <span className={cx("text-right break-words", strong ? "font-mono text-base" : "text-sm text-ink/85")}>
        {value}
      </span>
    </div>
  );
}
