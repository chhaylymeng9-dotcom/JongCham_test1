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

/* A simple two-layer horizon behind the truck's road — far/near mountain
   ridges plus a scatter of pine trees, all bottom-anchored to the same
   ground line the truck's wheels sit on. Stretches to fill the road
   strip's actual width (preserveAspectRatio="none") since these are flat
   iconographic shapes, not photography — a little horizontal stretch
   reads fine at this style level. */
function Landscape() {
  const trees = [70, 210, 340, 470, 610, 760, 900, 1010, 1150];
  return (
    <svg viewBox="0 0 1200 90" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <path
        d="M0 90 L90 28 L170 60 L260 18 L360 62 L460 26 L560 58 L640 34 L720 60 L820 22 L920 58 L1020 30 L1120 60 L1200 40 L1200 90 Z"
        fill="#AEC2A6"
        opacity=".55"
      />
      <path
        d="M0 90 L60 52 L140 78 L230 44 L330 80 L430 50 L540 82 L650 46 L760 80 L870 50 L980 78 L1090 48 L1200 72 L1200 90 Z"
        fill="#8FA986"
        opacity=".6"
      />
      {trees.map((x, i) => {
        const style = i % 3;
        return (
          <g key={x} transform={`translate(${x} 90) scale(${0.8 + style * 0.15})`}>
            <rect x="-2" y="-14" width="4" height="14" fill="#6B5A3F" />
            {style === 2 ? (
              // round, bushy — a little variety among the conifers
              <>
                <circle cx="0" cy="-29" r="14" fill="#4E7F52" />
                <circle cx="-8" cy="-23" r="10" fill="#3F6B48" />
                <circle cx="8" cy="-23" r="10" fill="#5C8F5F" />
              </>
            ) : (
              <>
                <path d="M0 -46 L14 -20 L-14 -20 Z" fill="#3F6B48" />
                <path d="M0 -36 L11 -14 L-11 -14 Z" fill="#4E7F52" />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* The sun — a plain sibling of the road strip, not nested inside its
   clipped/overflow-hidden box, so it's free to climb well above the
   mountains into open sky as you scroll instead of being boxed in at
   the horizon. Starts resting just behind the ridge line and rises on
   the same scroll progress that drives the truck. */
function Sun({ sunRef }) {
  return (
    <div
      ref={sunRef}
      className="pointer-events-none absolute left-1/2 bottom-0"
      style={{ transform: "translateX(-50%)" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" width="170" height="170">
        <defs>
          <radialGradient id="ctr-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F6D98B" stopOpacity=".9" />
            <stop offset="55%" stopColor="#F0C878" stopOpacity=".4" />
            <stop offset="100%" stopColor="#F0C878" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#ctr-sun-glow)" />
        <circle cx="100" cy="100" r="34" fill="#F7DE9C" />
      </svg>
    </div>
  );
}

/* The delivery truck: three printed boxes on a flatbed, drawn once and
   driven purely by transform so the SVG itself never re-renders. */
function Truck() {
  return (
    <svg viewBox="0 0 186 84" width="186" height="84">
      <g className="ctr-truck-body">
        {/* the load: three printed boxes stacked on the flatbed */}
        <g>
          <rect x="16" y="16" width="30" height="34" rx="3" fill="#3D7A3F" />
          <rect x="16" y="16" width="30" height="8" rx="3" fill="#4E9151" />
          <rect x="21" y="29" width="20" height="4" rx="2" fill="#EAF2EA" opacity=".85" />

          <rect x="48" y="10" width="32" height="40" rx="3" fill="#1E3A73" />
          <rect x="48" y="10" width="32" height="9" rx="3" fill="#2A4E92" />
          <rect x="54" y="25" width="20" height="4" rx="2" fill="#E7ECF6" opacity=".85" />

          <rect x="82" y="20" width="28" height="30" rx="3" fill="#8C5A46" />
          <rect x="82" y="20" width="28" height="8" rx="3" fill="#A56D55" />
          <rect x="87" y="32" width="18" height="4" rx="2" fill="#F4EBE5" opacity=".85" />
        </g>

        {/* flatbed */}
        <rect x="10" y="50" width="106" height="9" rx="2.5" fill="#7A5B42" />
        <rect x="10" y="50" width="106" height="3" rx="1.5" fill="#96724F" />

        {/* cab */}
        <path d="M118 22 h26 c3 0 5 1.4 6.4 3.6 L162 44 c1.6 2.4 2.4 4.6 2.4 7 v8 h-46.4 Z" fill="#B8433F" />
        <path d="M118 22 h26 c3 0 5 1.4 6.4 3.6 L156 34 h-38 Z" fill="#C9524D" />
        {/* window */}
        <path d="M124 28 h17 l10 13 h-27 Z" fill="#CFE3EC" />
        <path d="M124 28 h6 v13 h-6 Z" fill="#B9D5E2" opacity=".8" />
        {/* door line and handle */}
        <path d="M132 41 v18" stroke="#9A322F" strokeWidth="1.6" opacity=".7" />
        <rect x="122" y="46" width="7" height="2.6" rx="1.3" fill="#F0D9D7" opacity=".8" />
        {/* bumper + headlight */}
        <rect x="160" y="52" width="8" height="8" rx="2" fill="#F2D98C" />
        <rect x="116" y="59" width="52" height="5" rx="2.5" fill="#8A2F2C" />
        {/* exhaust */}
        <rect x="112" y="14" width="5" height="26" rx="2.5" fill="#7C7A72" />
      </g>

      {/* chassis */}
      <rect x="8" y="59" width="152" height="6" rx="3" fill="#2E2A24" />

      {/* wheels: tyre, rim, hub */}
      <g>
        <circle cx="40" cy="66" r="15" fill="#25211C" />
        <circle className="ctr-truck-wheel" cx="40" cy="66" r="8.5" fill="#C9C3B6" />
        <g className="ctr-truck-wheel">
          <circle cx="40" cy="66" r="8.5" fill="none" stroke="#9A9488" strokeWidth="1" />
          <path
            d="M40 58.5 v15M32.5 66 h15M34.7 60.7 l10.6 10.6M45.3 60.7 l-10.6 10.6"
            stroke="#9A9488"
            strokeWidth="1.4"
          />
        </g>
        <circle cx="40" cy="66" r="3" fill="#6E695F" />

        <circle cx="132" cy="66" r="15" fill="#25211C" />
        <circle className="ctr-truck-wheel" cx="132" cy="66" r="8.5" fill="#C9C3B6" />
        <g className="ctr-truck-wheel">
          <circle cx="132" cy="66" r="8.5" fill="none" stroke="#9A9488" strokeWidth="1" />
          <path
            d="M132 58.5 v15M124.5 66 h15M126.7 60.7 l10.6 10.6M137.3 60.7 l-10.6 10.6"
            stroke="#9A9488"
            strokeWidth="1.4"
          />
        </g>
        <circle cx="132" cy="66" r="3" fill="#6E695F" />
      </g>
    </svg>
  );
}

const REPLAY_MS = 30000;

export default function CounterSection() {
  const { t } = useI18n();
  const rowRef = useRef(null);
  const roadRef = useRef(null);
  const truckRef = useRef(null);
  const sunRef = useRef(null);
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

  // The truck and sun follow scroll position, but eased rather than
  // snapped directly to it — a fast flick of the wheel sets a new target,
  // and a rAF loop lets both glide toward it a fraction of the way every
  // frame, so scrolling fast never makes them jump instantly to the new
  // spot the way a plain scroll-listener assignment would.
  useEffect(() => {
    const road = roadRef.current;
    const truck = truckRef.current;
    if (!road || !truck) return;

    if (reduceMotion) {
      // No easing, no motion — jump straight to the scroll-matched spot.
      function placeInstant() {
        const r = road.getBoundingClientRect();
        const vh = window.innerHeight;
        let p = (vh - r.top) / (vh * 0.72);
        p = Math.max(0, Math.min(1, p));
        const span = road.clientWidth - truck.offsetWidth;
        truck.style.transform = `translateX(${-120 + p * (span + 120)}px)`;
        if (sunRef.current) sunRef.current.style.transform = `translateX(-50%) translateY(${-220 * p}px)`;
      }
      window.addEventListener("scroll", placeInstant, { passive: true });
      window.addEventListener("resize", placeInstant);
      placeInstant();
      return () => {
        window.removeEventListener("scroll", placeInstant);
        window.removeEventListener("resize", placeInstant);
      };
    }

    let targetX = -120;
    let currentX = -120;
    let targetSunY = 0;
    let currentSunY = 0;
    let lastX = -120;
    let puffAt = 0;
    let rafId;

    function computeTargets() {
      const r = road.getBoundingClientRect();
      const vh = window.innerHeight;

      // progress: 0 when the road first appears at the bottom, 1 by the
      // time it has travelled most of the way up the screen
      let p = (vh - r.top) / (vh * 0.72);
      p = Math.max(0, Math.min(1, p));

      const span = road.clientWidth - truck.offsetWidth;
      targetX = -120 + p * (span + 120);
      targetSunY = -220 * p;
    }

    function tick() {
      // ease a fraction of the remaining distance closed each frame —
      // ~60fps compounding means this settles in a few hundred ms
      // regardless of whether the target jumped from one big scroll or
      // crept there over many small ones.
      currentX += (targetX - currentX) * 0.1;
      currentSunY += (targetSunY - currentSunY) * 0.08;

      truck.style.transform = `translateX(${currentX}px)`;
      if (sunRef.current) {
        sunRef.current.style.transform = `translateX(-50%) translateY(${currentSunY}px)`;
      }

      const moving = Math.abs(currentX - lastX) > 0.15;
      truck.classList.toggle("ctr-rolling", moving);

      if (moving && performance.now() - puffAt > 260) {
        puffAt = performance.now();
        const puff = document.createElement("span");
        puff.className = "ctr-puff";
        puff.style.left = Math.max(0, currentX + 6) + "px";
        road.appendChild(puff);
        setTimeout(() => puff.remove(), 820);
      }

      lastX = currentX;
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("scroll", computeTargets, { passive: true });
    window.addEventListener("resize", computeTargets);
    computeTargets();
    currentX = targetX;
    currentSunY = targetSunY;
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", computeTargets);
      window.removeEventListener("resize", computeTargets);
      cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  return (
    <section className="relative overflow-hidden border-y border-ink/10 bg-paper min-h-screen flex items-center">
      <style>{`
        .ctr-truck-wheel { transform-origin: center; transform-box: fill-box; }
        .ctr-rolling .ctr-truck-wheel { animation: ctr-spin .55s linear infinite; }
        .ctr-rolling .ctr-truck-body { animation: ctr-bob .5s ease-in-out infinite; }
        @keyframes ctr-spin { to { transform: rotate(360deg); } }
        @keyframes ctr-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.2px); } }
        .ctr-puff {
          position: absolute; bottom: 12px; width: 16px; height: 16px; border-radius: 50%;
          background: #D5CFC1; opacity: .5; animation: ctr-puffout .8s ease-out forwards;
        }
        @keyframes ctr-puffout {
          0% { transform: scale(.5) translateX(0); opacity: .5; }
          100% { transform: scale(2) translateX(-34px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ctr-rolling .ctr-truck-wheel, .ctr-rolling .ctr-truck-body { animation: none; }
          .ctr-puff { display: none; }
        }
      `}</style>
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
        <div className="relative mb-6">
          <Sun sunRef={sunRef} />
          <div ref={roadRef} className="relative h-[90px] overflow-hidden">
            <Landscape />
            <span
              ref={truckRef}
              className="absolute bottom-0 left-0 w-[186px] block"
              style={{ transform: "translateX(-120px)", filter: "drop-shadow(0 8px 14px rgba(28,26,21,.18))" }}
            >
              <Truck />
            </span>
          </div>
        </div>

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
