import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "../i18n.jsx";
import dashboardPreview from "../assets/laptop.png";
import { Eyebrow } from "../ui.jsx";
import Reveal from "./Reveal.jsx";

/* ---------- DeviceShowcase ----------
A laptop mockup built from gradients rather than a stock photo — the
screen itself is a real crop of the signed-in dashboard, not a mock-up, so
what it promises is what the app actually looks like. The copy sticks to
what's true of a single-device, no-signup deck: it runs in any browser and
comes free with the box, but it does NOT claim cross-device sync — a code
is locked to the one device it's activated on (see Account.jsx's
one-device rule), so "same streak on every device" would be a lie.

The App Store / Google Play badges are decorative placeholders (href="#")
— there's no real iOS/Android app behind them, same as a few other
not-yet-real links already in the footer.
--------------------------------- */

const POINTS = ["devices.point1", "devices.point2"];

function CheckMini({ className }) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.6-1.9-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.85-1.7.02-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.55 1.3-.05 1.8-.83 3.4-.83 1.6 0 2 .83 3.4.8 1.4-.02 2.3-1.25 3.1-2.47.98-1.4 1.4-2.8 1.4-2.87-.03-.02-2.7-1.03-2.7-4.1ZM14 5.2c.7-.85 1.2-2.03 1.05-3.2-1.02.04-2.25.68-2.97 1.53-.65.75-1.22 1.95-1.07 3.1 1.14.1 2.3-.58 3-1.43Z" />
    </svg>
  );
}

function PlayMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#34A853" d="M3.6 2.2 14 12.05 3.6 21.9c-.37-.28-.6-.76-.6-1.4V3.6c0-.64.23-1.12.6-1.4Z" />
      <path fill="#FBBC04" d="M17.9 8.5 14 12.05 3.6 2.2c.3-.23.75-.28 1.25 0L17.9 8.5Z" />
      <path fill="#EA4335" d="M17.9 15.6 4.85 21.9c-.5.28-.95.23-1.25 0L14 12.05l3.9 3.55Z" />
      <path fill="#4285F4" d="M21.1 10.9c.85.48.85 1.74 0 2.22l-3.2 1.55L14 12.05 17.9 8.5l3.2 2.4Z" />
    </svg>
  );
}

export default function DeviceShowcase() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  return (
    /* One full viewport, content vertically centred — same one-screen
       rhythm as the counter and reviews bands. */
    <section className="bg-paper text-ink overflow-hidden min-h-screen flex items-center">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-6 py-20 md:py-28 grid md:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
        {/* Each text block gets its own eased, staggered rise-in — the
            heading first, then body, points and badges a beat apart. */}
        <div>
          <Reveal>
            <Eyebrow>{t("devices.eyebrow")}</Eyebrow>
            <h2 className="font-sans font-bold text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.04] tracking-tight mt-4 mb-6 text-ink">
              {t("devices.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[17px] text-ink/70 leading-relaxed max-w-md mb-8">{t("devices.body")}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="space-y-3.5">
              {POINTS.map((key) => (
                <li key={key} className="flex gap-3 text-sm text-ink/75 leading-relaxed">
                  <CheckMini className="mt-1 w-[15px] h-[15px] text-grease shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.34}>
            {/* Placeholder badges only — this store has no real iOS/Android
                app, so these don't link anywhere (same as the footer's other
                not-yet-real links). */}
            <div className="flex flex-wrap gap-2.5 mt-8">
            <a href="#" className="flex items-center gap-2.5 h-[52px] px-4 rounded-xl bg-ink text-paper hover:bg-ink/85 transition-colors">
              <AppleMark />
              <span className="leading-tight">
                <span className="block text-[10px] text-paper/60">{t("devices.downloadOn")}</span>
                <span className="block text-sm font-semibold">{t("devices.appStore")}</span>
              </span>
            </a>
            <a href="#" className="flex items-center gap-2.5 h-[52px] px-4 rounded-xl bg-ink text-paper hover:bg-ink/85 transition-colors">
              <PlayMark />
              <span className="leading-tight">
                <span className="block text-[10px] text-paper/60">{t("devices.getItOn")}</span>
                <span className="block text-sm font-semibold">{t("devices.googlePlay")}</span>
              </span>
            </a>
            </div>
          </Reveal>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="mx-auto max-w-[560px] cursor-pointer"
            style={{ transformOrigin: "50% 100%" }}
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.035, y: -6, transition: { duration: 0.35, ease: [0.2, 0.7, 0.3, 1] } }}
          >
            {/* lid */}
            <div
              className="relative rounded-t-2xl rounded-b-md p-3 pb-3.5"
              style={{
                background: "linear-gradient(155deg,#3A3A3D 0%,#232326 42%,#2C2C30 100%)",
                boxShadow: "0 34px 70px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.12)",
              }}
            >
              <span className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-black" />
              <div className="relative rounded-md overflow-hidden aspect-video bg-paper">
                <img src={dashboardPreview} alt="The JongCham account dashboard" className="w-full h-full object-cover object-top" />
                {/* glass reflection */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(112deg, rgba(255,255,255,.16) 0 22%, rgba(255,255,255,.04) 30%, transparent 46%)" }}
                />
              </div>
            </div>
            {/* hinge / base */}
            <div
              className="h-[11px] rounded-b"
              style={{ background: "linear-gradient(#3A3A3D 0 22%, #26262A 22% 100%)" }}
            />
            {/* the deck the laptop rests on, seen edge-on */}
            <div
              className="mx-auto h-4 relative"
              style={{
                width: "112%",
                marginLeft: "-6%",
                background: "linear-gradient(#C6C6CB 0 32%, #9A9AA0 32% 62%, #7C7C83 62% 100%)",
                borderRadius: "3px 3px 12px 12px",
                boxShadow: "0 16px 30px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.5)",
              }}
            />
            <div className="mx-auto w-[78%] h-6 rounded-full mt-1.5" style={{ background: "rgba(0,0,0,.5)", filter: "blur(16px)" }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
