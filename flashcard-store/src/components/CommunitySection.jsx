import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useI18n } from "../i18n.jsx";
import Reveal from "./Reveal.jsx";
import hostAvatar from "../assets/community/host.jpg";
import memberTeal from "../assets/community/member-teal.jpg";
import memberGreen from "../assets/community/member-green.jpg";
import memberBlue from "../assets/community/member-blue.jpg";
import memberOrange from "../assets/community/member-orange.jpg";
import memberBlack from "../assets/community/member-black.jpg";

/* ---------- CommunitySection ----------
The "invite a friend" band that sits just above the reviews panel: a big
heading with the same sparkle accent the panel uses, a grey body paragraph
and a dark pill CTA on the left; on the right a light blue mat where the
host anchors the middle of a study circle — fellow students ring them in
white circles, thin lines tie everyone back to the middle, and social
chips drift gently overhead and a speech bubble pops up every 2s, cycling
through three spots/messages. The faces are the
bundled cartoon illustrations (src/assets/community); the host gets a
hand-drawn headphone overlay so they read as "on the call". The
"Invite a Friend" pill is a placeholder link (href="#") — the invite
flow isn't live yet, same deal as the app-store badges further down.
--------------------------------- */

/* Three radiating dashes — the same little "ta-da" mark the reviews panel
   puts next to its heading. */
function Sparkle({ className }) {
  return (
    <svg className={className} width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M7 17 3 21" />
      <path d="M11 10 7 5" />
      <path d="M19 7 18 2" />
    </svg>
  );
}

/* Brand glyphs for the floating social chips. They size themselves as a
   percentage of the chip circle, so the chips can grow without the icon
   falling out of proportion. */
function TikTokMark() {
  return (
    <svg className="w-[52%] h-[52%]" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#010101"
        d="M16.6 5.82A4.28 4.28 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.12V9.75a5.77 5.77 0 0 0-.78-.05 5.7 5.7 0 1 0 5.7 5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.2-1.48Z"
      />
    </svg>
  );
}
function InstagramMark() {
  return (
    <svg className="w-[58%] h-[58%]" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="#E4405F" stroke="none" />
    </svg>
  );
}
function TwitchMark() {
  return (
    <svg className="w-[55%] h-[55%]" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#9146FF"
        d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"
      />
    </svg>
  );
}

/* Headphones drawn over the host portrait — a band arcing over the hair
   and two cups at the ears — so the middle avatar reads as "hosting the
   call" like the reference. Coordinates are in % of the square crop the
   portrait is clipped to (object-position keeps the face centred). */
function Headphones() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M27 64 C 27 14, 73 14, 73 64" stroke="#2E2A24" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <rect x="21.5" y="55" width="10" height="19" rx="5" fill="#2E2A24" />
      <rect x="68.5" y="55" width="10" height="19" rx="5" fill="#2E2A24" />
    </svg>
  );
}

/* Where the five students sit around the host, in % of the mat — the
   connecting lines below point at these same coordinates. */
const MEMBERS = [
  { img: memberTeal, left: 24, top: 19, size: 17 },
  { img: memberGreen, left: 77, top: 16, size: 15 },
  { img: memberBlue, left: 88, top: 55, size: 15 },
  { img: memberOrange, left: 70, top: 86, size: 16 },
  { img: memberBlack, left: 28, top: 86, size: 15 },
];

/* The three speech-bubble spots + messages (positions in % of the mat).
   One bubble pops up every 2s, cycling through these in order. */
const BUBBLES = [
  { key: "community.bubble1", left: "39%", top: "13%" },
  { key: "community.bubble2", left: "65%", top: "34%" },
  { key: "community.bubble3", left: "41%", top: "74%" },
];

/* Gentle bob for the floating chips — under reduced motion everything
   simply sits still. The positioning wrapper keeps its Tailwind
   centering transforms; only this inner element is animated, so framer's
   inline transform never clobbers the -translate-x/y-1/2 classes. */
function Float({ reduceMotion, duration = 5, delay = 0, className, children }) {
  return (
    <motion.div
      className={className}
      animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
      transition={reduceMotion ? undefined : { duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export default function CommunitySection() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  // which speech bubble is popped up right now — advances every 2s
  const [bubble, setBubble] = useState(0);
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setBubble((i) => (i + 1) % BUBBLES.length), 2000);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    /* Hugs its content instead of claiming a full viewport — a full-screen
       band here plus the reviews band's own one-screen centering stacked
       two halves of dead space between the two sections. */
    <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16 md:py-20">
      <div className="w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* ---------- left: the pitch ---------- */}
        {/* Each text block gets its own eased rise-in with a small stagger,
            so the heading, body and CTA cascade in instead of arriving as
            one slab. */}
        <div className="relative">
          <Reveal className="relative">
            <Sparkle className="absolute -top-7 -left-2 text-grease" />
            <h2 className="font-display text-[clamp(2.2rem,4.8vw,3.4rem)] leading-[1.06] tracking-tight">
              <span className="block">{t("community.title1")}</span>
              <span className="block">{t("community.title2")}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base md:text-[17px] text-ink/65 leading-relaxed max-w-md mt-6">{t("community.body")}</p>
          </Reveal>
          <Reveal delay={0.24}>
            {/* Placeholder pill — the invite flow isn't live yet, same as
                the app-store badges further down the page. */}
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-full bg-ink text-paper px-8 py-3.5 text-sm font-semibold mt-8 hover:bg-ink/85 transition-colors"
            >
              {t("community.cta")}
              <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 8h19" />
                <path d="M16 2.5 21.5 8 16 13.5" />
              </svg>
            </a>
          </Reveal>
        </div>

        {/* ---------- right: the circle illustration ---------- */}
        <Reveal delay={0.15}>
          <div
            role="img"
            aria-label={t("community.aria")}
            className="relative mx-auto aspect-square w-full max-w-[520px] rounded-[2.5rem] overflow-hidden"
            style={{ background: "linear-gradient(160deg, #EDF2FB 0%, #E1EAF8 55%, #D7E3F5 100%)" }}
          >
            {/* thin lines tying every member back to the host — drawn
                first so the white circles sit on top of them */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <g stroke="#C3D0E6" strokeWidth="0.45" strokeLinecap="round">
                {MEMBERS.map((m, i) => (
                  <line key={i} x1="50" y1="50" x2={m.left} y2={m.top} />
                ))}
              </g>
            </svg>

            {/* the host at the middle, big white ring, headphones on */}
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-[2%] shadow-[0_18px_40px_rgba(31,42,68,0.14)]"
              style={{ left: "50%", top: "50%", width: "40%" }}
            >
              <Float reduceMotion={reduceMotion} duration={6}>
                <span className="relative block">
                  <img
                    src={hostAvatar}
                    alt=""
                    className="block w-full aspect-square object-cover rounded-full"
                    style={{ objectPosition: "50% 30%" }}
                  />
                  <Headphones />
                </span>
              </Float>
            </span>

            {/* the five students ringing them */}
            {MEMBERS.map((m, i) => (
              <span
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-[1%] shadow-[0_10px_24px_rgba(31,42,68,0.12)]"
                style={{ left: `${m.left}%`, top: `${m.top}%`, width: `${m.size}%` }}
              >
                <Float reduceMotion={reduceMotion} duration={4.5 + (i % 3)} delay={0.4 * i}>
                  <img
                    src={m.img}
                    alt=""
                    className="block w-full aspect-square object-cover rounded-full"
                    style={{ objectPosition: "50% 40%" }}
                  />
                </Float>
              </span>
            ))}

            {/* floating social chips — the platforms we hang out on */}
            <span className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center w-[13%] aspect-square rounded-full bg-white shadow-[0_10px_22px_rgba(31,42,68,0.14)]" style={{ left: "57%", top: "8%" }}>
              <Float reduceMotion={reduceMotion} duration={4.4} delay={0.2} className="w-full h-full grid place-items-center">
                <TwitchMark />
              </Float>
            </span>
            <span className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center w-[13%] aspect-square rounded-full bg-white shadow-[0_10px_22px_rgba(31,42,68,0.14)]" style={{ left: "8%", top: "32%" }}>
              <Float reduceMotion={reduceMotion} duration={5.2} delay={0.9} className="w-full h-full grid place-items-center">
                <InstagramMark />
              </Float>
            </span>
            <span className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center w-[13%] aspect-square rounded-full bg-white shadow-[0_10px_22px_rgba(31,42,68,0.14)]" style={{ left: "92%", top: "74%" }}>
              <Float reduceMotion={reduceMotion} duration={4.8} delay={1.5} className="w-full h-full grid place-items-center">
                <TikTokMark />
              </Float>
            </span>

            {/* little dark speech bubbles — one pops up every 2s and cycles
                through the three spots/messages (spring in, hold, spring
                out). Reduced motion parks all three instead. The positioning
                wrapper keeps the centering transforms; the inner motion span
                does the pop so framer's inline transform never clobbers the
                -translate-x/y-1/2 classes. */}
            {reduceMotion ? (
              BUBBLES.map((b) => (
                <span key={b.key} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: b.left, top: b.top }}>
                  <span className="block rounded-full bg-ink text-paper text-[13px] font-medium px-4 py-2 whitespace-nowrap shadow-md">
                    {t(b.key)}
                  </span>
                </span>
              ))
            ) : (
              <AnimatePresence>
                {BUBBLES.map(
                  (b, i) =>
                    i === bubble && (
                      <span key={b.key} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: b.left, top: b.top }}>
                        <motion.span
                          className="block"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 550, damping: 26 }}
                        >
                          <span className="block rounded-full bg-ink text-paper text-[13px] font-medium px-4 py-2 whitespace-nowrap shadow-md">
                            {t(b.key)}
                          </span>
                        </motion.span>
                      </span>
                    )
                )}
              </AnimatePresence>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
