import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "../i18n.jsx";
import { Button, Eyebrow, Field, LinkButton, TextArea, cx } from "../ui.jsx";

const emailOk = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

const TOPICS = ["order", "code", "account", "bulk", "other"];

/* ---------- Contact ----------
The form validates and "sends" honestly like Checkout's payment step does —
there's no backend to actually deliver it to, so submitting just shows a
confirmation state rather than pretending mail went anywhere. The topic
chips only change the message placeholder and whether the order-number
field shows; nothing about validation depends on which one is picked.
--------------------------------- */

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3Z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13" />
      <path d="M22 2l-7 20-4-9-9-4Z" />
    </svg>
  );
}
function TickIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}
// Mon–Fri 8–18, Sat 9–15, Sun closed, read off the visitor's own clock —
// same simplification the rest of the demo uses rather than a real
// Phnom-Penh-timezone conversion.
function isOpenNow() {
  const d = new Date();
  const day = d.getDay();
  const h = d.getHours() + d.getMinutes() / 60;
  if (day >= 1 && day <= 5) return h >= 8 && h < 18;
  if (day === 6) return h >= 9 && h < 15;
  return false;
}

function Line({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 border-t border-ink/10 first:border-0">
      <span className="w-8 h-8 shrink-0 rounded-[11px] grid place-items-center bg-cardstock/40 border border-ink/10 text-chalk">
        {icon}
      </span>
      <div className="min-w-0">
        <b className="block text-sm font-semibold mb-0.5">{label}</b>
        {children}
      </div>
    </div>
  );
}

function HoursRow({ label, value }) {
  return (
    <div className="flex justify-between text-xs py-1.5 text-ink/55">
      <span>{label}</span>
      <b className="text-ink font-medium">{value}</b>
    </div>
  );
}

export default function Contact() {
  const { t } = useI18n();
  const [topic, setTopic] = useState("order");
  const [form, setForm] = useState({ name: "", email: "", order: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const open = isOpenNow();

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = t("contact.errName");
    if (!emailOk(form.email)) next.email = t("checkout.errEmail");
    if (form.message.trim().length < 5) next.message = t("contact.errMessage");
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 700);
  }

  function reset() {
    setForm({ name: "", email: "", order: "", message: "" });
    setErrors({});
    setSent(false);
    setTopic("order");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[960px] mx-auto px-5 sm:px-6 py-16 md:py-20"
    >
      <div className="max-w-[52ch] mb-8">
        <Eyebrow>{t("contact.eyebrow")}</Eyebrow>
        <h1 className="font-display text-3xl md:text-4xl mt-2.5 mb-3 leading-tight">{t("contact.title")}</h1>
        <p className="text-ink/70 leading-relaxed">{t("contact.body")}</p>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-5 items-start">
        {/* ---------- form card ---------- */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="border border-ink/15 rounded-card bg-paper overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-ink/10 flex items-center gap-3">
            <h2 className="font-display text-base flex-1">{t("contact.sendTitle")}</h2>
            <span className="label text-ink/40">{sent ? t("contact.stepDone") : t("contact.stepHint")}</span>
          </div>

          {sent ? (
            <div className="px-6 py-12 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-chalk text-cardstock mb-4">
                <TickIcon />
              </span>
              <h3 className="font-display text-xl mb-2">{t("contact.sentTitle")}</h3>
              <p className="text-sm text-ink/60 max-w-[36ch] mx-auto mb-6 leading-relaxed">
                {t("contact.sentBody", { name: form.name.trim().split(/\s+/)[0] })}
              </p>
              <LinkButton type="button" onClick={reset}>
                {t("contact.sendAnother")}
              </LinkButton>
            </div>
          ) : (
            <form onSubmit={submit} className="px-6 py-6">
              <div className="flex flex-wrap gap-2 mb-5">
                {TOPICS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTopic(id)}
                    aria-pressed={topic === id}
                    className={cx(
                      "h-9 px-3.5 rounded-full border text-sm font-medium transition-colors",
                      // The picked topic fills solid ink-black, the same
                      // selection treatment the deck cards use — the old
                      // chalk-green fill read as a third accent on a page
                      // that otherwise stays ink on paper.
                      topic === id
                        ? "bg-ink border-ink text-paper"
                        : "border-ink/15 text-ink/60 bg-cardstock/25 hover:border-ink/35 hover:text-ink"
                    )}
                  >
                    {t(`contact.topic.${id}`)}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field
                  label={t("checkout.name")}
                  required
                  error={errors.name}
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
                <Field
                  label={t("checkout.email")}
                  required
                  type="email"
                  error={errors.email}
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </div>

              {topic === "order" && (
                <Field
                  label={t("contact.orderNumber")}
                  hint={t("contact.orderNumberHint")}
                  placeholder="JC-10428"
                  value={form.order}
                  onChange={(e) => setField("order", e.target.value)}
                  className="mb-4"
                />
              )}

              <Field label={t("contact.message")} required error={errors.message}>
                <TextArea
                  rows={5}
                  maxLength={600}
                  placeholder={t(`contact.placeholder.${topic}`)}
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                />
              </Field>
              <p className="text-right font-mono text-[11px] text-ink/35 mt-1.5 mb-5">{form.message.length} / 600</p>

              <div className="flex flex-wrap items-center gap-4 pt-5 border-t border-ink/10">
                <Button type="submit" variant="dark" disabled={sending}>
                  {sending ? t("contact.sending") : t("contact.send")}
                  {!sending && <SendIcon />}
                </Button>
                <p className="text-xs text-ink/50 flex-1 min-w-[150px]">{t("contact.privacyNote")}</p>
              </div>
            </form>
          )}
        </motion.section>

        {/* ---------- side ---------- */}
        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3.5"
        >
          <div className="border border-ink/15 rounded-card bg-paper p-5">
            <Eyebrow className="mb-3">{t("contact.reachUs")}</Eyebrow>
            <Line icon={<MailIcon />} label={t("checkout.email")}>
              <a href="mailto:Jongcham@gmial.com" className="text-sm text-ink/70 hover:text-ink hover:underline underline-offset-4 break-all">
                Jongcham@gmial.com
              </a>
            </Line>
            <Line icon={<TelegramIcon />} label={t("checkout.telegram")}>
              <a href="#" className="text-sm text-ink/70 hover:text-ink hover:underline underline-offset-4">
                @Jongcham
              </a>
              <span className="block text-xs text-ink/45 mt-0.5">{t("contact.telegramHint")}</span>
            </Line>
            <Line icon={<InstagramIcon />} label={t("contact.instagram")}>
              <a href="#" className="text-sm text-ink/70 hover:text-ink hover:underline underline-offset-4">
                Jong_cham.Store
              </a>
            </Line>
            <Line icon={<PinIcon />} label={t("contact.workshop")}>
              <span className="text-xs text-ink/55 leading-relaxed">{t("contact.workshopHint")}</span>
            </Line>
          </div>

          {/* Light paper card — the old chalk-green panel inverted to the
              same hairline-bordered card as the "reach us" block above it,
              so the whole side column stays quiet ink-on-paper. */}
          <div className="rounded-card border border-ink/15 bg-paper p-5">
            <span className="label text-ink/40 block mb-3">{t("contact.hours")}</span>
            <div className="flex items-center gap-2 mb-3">
              <span className={cx("w-2 h-2 rounded-full", open ? "bg-moss" : "bg-manila")} />
              <b className="font-mono text-sm">{open ? t("contact.openNow") : t("contact.closedNow")}</b>
            </div>
            <HoursRow label={t("contact.weekdays")} value="8:00 – 18:00" />
            <HoursRow label={t("contact.saturday")} value="9:00 – 15:00" />
            <HoursRow label={t("contact.sunday")} value={t("contact.closed")} />
            <p className="text-xs text-ink/45 mt-3 pt-3 border-t border-ink/10 leading-relaxed">
              {t("contact.hoursNote")}
            </p>
          </div>

        </motion.aside>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-xs text-ink/40 mt-10 border-t border-ink/10 pt-6"
      >
        {t("footer.demoNotice")}
      </motion.p>
    </motion.div>
  );
}
