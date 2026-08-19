import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { Eyebrow, cx } from "../ui.jsx";
import Reveal from "./Reveal.jsx";

/* ---------- CounterSection ----------
A slow odometer-style tally: each figure starts from a round base just
below its target (31,500 counts up from 31,000, 4,820 from 4,000, the
two-digit figures from zero) and eases up to the real value over
COUNT_MS — deliberately leisurely, decelerating as it lands. It counts
the first time the row scrolls into view, and re-counts on a replay
interval while the row stays on screen.
--------------------------------- */

const STATS = [
  { key: "printed", n: 4820, suf: "", icon: PrintIcon },
  { key: "shipped", n: 96, suf: "+", icon: BoxIcon },
  { key: "studied", n: 31500, suf: "", icon: RefreshIcon },
  { key: "passed", n: 64, suf: "", icon: RibbonIcon },
];

function PrintIcon(props) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M6.5 3h11" />
    </svg>
  );
}
function BoxIcon(props) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="6" width="15" height="11" rx="2" />
      <path d="M16 10h4l3 3v4h-7" />
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="18" cy="18.5" r="2" />
    </svg>
  );
}
function RefreshIcon(props) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 4v6h6" />
      <path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" />
    </svg>
  );
}
function RibbonIcon(props) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5 7 22l5-2.5L17 22l-1.5-8.5" />
    </svg>
  );
}

/* The count-up itself: a rAF loop interpolates base → value with a cubic
   ease-out, so most of the distance covers early and the last ticks crawl
   in slowly. `active` starts the run, !active parks it at the base. */
const COUNT_MS = 5000;

function baseFor(n) {
  return n >= 1000 ? Math.floor(n / 1000) * 1000 : 0;
}

function AnimatedNumber({ value, suffix, active, reduceMotion, delayMs = 0 }) {
  const base = baseFor(value);
  const [display, setDisplay] = useState(base);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    if (!active) {
      setDisplay(base);
      return;
    }
    let raf;
    const start = performance.now() + delayMs;
    const tick = (now) => {
      const t = Math.max(0, Math.min(1, (now - start) / COUNT_MS));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(base + (value - base) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduceMotion, value, base, delayMs]);

  return (
    // sized to stay inside its column so the figures keep clear of the
    // divider lines between stats
    <span className="flex items-end font-mono font-semibold tracking-tight tabular-nums text-ink text-[clamp(2.5rem,6vw,4rem)] leading-none">
      {display.toLocaleString("en-US")}
      {suffix && <span className="text-[0.4em] leading-none text-grease mb-[0.18em] ml-[0.08em]">{suffix}</span>}
    </span>
  );
}

const REPLAY_MS = 30000;

export default function CounterSection() {
  const { t } = useI18n();
  const rowRef = useRef(null);
  const [active, setActive] = useState(false);

  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (reduceMotion) {
      setActive(true);
      return;
    }
    const el = rowRef.current;
    if (!el) return;
    let timer;
    // park the figures back at their base for a frame, then let the count
    // run again — the double rAF makes sure the reset actually paints first
    const replay = () => {
      setActive(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setActive(true));
      });
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          if (!timer) timer = setInterval(replay, REPLAY_MS);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [reduceMotion]);

  return (
    <section className="relative overflow-hidden border-y border-ink/10 bg-paper min-h-screen flex items-center">
      {/* faint squared-paper grid, just to break up the flat background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(35,32,27,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(35,32,27,.028) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
        }}
      />

      <div className="relative w-full max-w-6xl mx-auto px-5 sm:px-6 py-16 md:py-[86px]">
        {/* Animate-on-scroll: every text block gets its own eased rise-in
            on first sight — the heading first, the body a beat later —
            while the count-ups and the truck keep their own scroll-driven
            entrances. */}
        <div className="flex items-end justify-between gap-7 flex-wrap mb-10 md:mb-[52px]">
          <Reveal>
            <Eyebrow className="mb-3.5">{t("counter.eyebrow")}</Eyebrow>
            <h2 className="font-display text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.03] max-w-[16ch]">
              {t("counter.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-[34ch]">
            <p className="text-sm text-ink/60 text-left sm:text-right m-0">{t("counter.body")}</p>
          </Reveal>
        </div>

        <div ref={rowRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[40px] gap-y-11">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              /* Each stat column eases in with its own stagger, so the four
                 labels/bodies cascade across the row instead of appearing
                 all at once. */
              <Reveal
                key={s.key}
                delay={i * 0.09}
                className={cx(
                  "pl-0 border-l-0 border-ink/10",
                  i % 2 === 1 && "sm:border-l sm:pl-[40px]",
                  i === 0 ? "lg:border-l-0 lg:pl-0" : "lg:border-l lg:pl-[40px]"
                )}
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="grid place-items-center w-[30px] h-[30px] text-chalk shrink-0">
                    <Icon />
                  </span>
                  <span className="font-mono text-[9.5px] font-bold tracking-[0.2em] uppercase text-ink/40">
                    {t(`counter.${s.key}.label`)}
                  </span>
                </div>

                <AnimatedNumber value={s.n} suffix={s.suf} active={active} reduceMotion={reduceMotion} delayMs={i * 150} />

                <h3 className="font-mono text-[15px] font-bold tracking-tight mt-[18px] mb-1.5">
                  {t(`counter.${s.key}.heading`)}
                </h3>
                <p className="text-[13px] text-ink/60 leading-[1.55] max-w-[24ch] m-0">
                  {t(`counter.${s.key}.body`)}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
