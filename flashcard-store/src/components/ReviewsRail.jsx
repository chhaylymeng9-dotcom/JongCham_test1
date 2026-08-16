import { useMemo } from "react";
import { useI18n } from "../i18n.jsx";
import { DECK_COLOR } from "../data/decks.js";
import { Eyebrow, cx } from "../ui.jsx";
import Reveal from "./Reveal.jsx";

/* ---------- ReviewsRail ----------
A rounded showcase panel styled after a community wall: big heading with a
little sparkle accent on the left, and an infinite carousel of review cards
that drifts sideways on its own. The track holds two identical copies of the
review row and a keyframe slides it exactly one copy-width (-50% of the
track) per loop, so the wrap point is invisible and the drift never ends.
Hovering or keyboard-focusing the rail pauses the drift so a card can
actually be read; under reduced motion the marquee is dropped entirely and
the rail becomes a plain manually-scrollable row instead.
--------------------------------- */

const STAR_COLOR = "#E8A33D";

function Stars({ rating, size = 14, className }) {
  return (
    <span className={cx("inline-flex gap-0.5", className)} style={{ color: STAR_COLOR }} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" fill={n <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.5l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.5Z"
          />
        </svg>
      ))}
    </span>
  );
}

/* Three radiating dashes, like a little "ta-da" mark next to the heading. */
function Sparkle({ className }) {
  return (
    <svg className={className} width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M7 17 3 21" />
      <path d="M11 10 7 5" />
      <path d="M19 7 18 2" />
    </svg>
  );
}

/* Thin freehand squiggle that wanders across the panel's spare top-right
   corner — pure decoration, same energy as the reference's connecting
   line between floating avatars. */
function Squiggle({ className }) {
  return (
    <svg className={className} viewBox="0 0 220 90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M4 82 C 58 74, 84 46, 116 50 C 148 54, 158 30, 186 22 C 198 18.5, 208 14, 214 8" />
      <circle cx="214" cy="8" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* One review card. Fixed widths (not percentages) because the marquee
   track sizes to its content — percentage basis would be circular there. */
function ReviewCard({ review, pick }) {
  const color = DECK_COLOR[review.deckId] ?? DECK_COLOR.blank;
  return (
    <figure className="flex-none w-[300px] sm:w-[380px] pr-6 sm:pr-10">
      <span className="font-sans text-5xl font-semibold leading-[0.6] block mb-5 text-grease" aria-hidden="true">
        &ldquo;
      </span>

      <blockquote className="text-base md:text-[17px] leading-relaxed text-ink/75 m-0 min-h-[4.5em]">
        &ldquo;{pick(review.quote)}&rdquo;
      </blockquote>

      <figcaption className="flex items-center gap-3 mt-6">
        {/* The reviewer's photo when the testimonial ships with one;
            otherwise the deck-coloured initial circle. */}
        {review.avatar ? (
          <img src={review.avatar} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
        ) : (
          <span
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-display text-base shrink-0"
            style={{ background: color }}
          >
            {review.name.charAt(0)}
          </span>
        )}
        <span className="min-w-0">
          <b className="block font-sans font-semibold text-sm not-italic leading-snug truncate">{review.name}</b>
          <span className="block text-xs text-ink/50 truncate">{pick(review.role)}</span>
        </span>
      </figcaption>
      <Stars rating={review.rating} size={15} className="mt-3" />
    </figure>
  );
}

export default function ReviewsRail({ reviews }) {
  const { t, pick } = useI18n();

  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const avg = useMemo(() => (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1), [reviews]);

  return (
    /* One full viewport, panel vertically centred — same one-screen
       rhythm as the counter and what's-included bands. */
    <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16 md:py-20 min-h-screen flex items-center">
      <style>{`
        @keyframes rv-marquee { to { transform: translateX(-50%); } }
        .rv-track { animation: rv-marquee var(--rv-seconds, 60s) linear infinite; }
        .rv-rail:hover .rv-track,
        .rv-rail:focus-within .rv-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .rv-track { animation: none; } }
      `}</style>
      <Reveal className="relative w-full overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-panel px-6 sm:px-10 md:px-14 py-12 md:py-16">
        <Squiggle className="absolute top-9 right-10 w-40 md:w-52 text-ink/15 hidden sm:block" />

        <div className="mb-10 md:mb-12">
          {/* The heading copy gets its own eased rise-in a beat after the
              panel itself settles in. */}
          <Reveal className="relative" delay={0.12}>
            <Sparkle className="absolute -top-6 -left-6 text-grease" />
            <Eyebrow>{t("testimonials.eyebrow")}</Eyebrow>
            <h2 className="font-display text-3xl md:text-[2.6rem] leading-tight mt-2.5 max-w-[16ch]">
              {t("testimonials.title")}
            </h2>
            <div className="flex items-center gap-2.5 mt-4">
              <Stars rating={Math.round(avg)} size={15} />
              <span className="font-display text-lg leading-none">{avg}</span>
              <span className="text-sm text-ink/50">{t("testimonials.summary", { n: reviews.length })}</span>
            </div>
          </Reveal>
        </div>

        <div className={cx("rv-rail relative", prefersReduced ? "overflow-x-auto" : "overflow-hidden")}>
          {/* The edge fades blend into the section's paper background. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 z-10 bg-gradient-to-r from-paper to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 z-10 bg-gradient-to-l from-paper to-transparent" />

          {/* Two identical copies back to back; the keyframe slides exactly
             one copy-width (-50% of the track) per loop so the wrap is
             seamless. 10s per review keeps the drift at a reading-friendly
             pace however many cards there are. The second copy is
             decorative (aria-hidden) — screen readers get each review once. */}
          <div
            className={cx("flex", !prefersReduced && "rv-track w-max")}
            style={prefersReduced ? undefined : { "--rv-seconds": `${reviews.length * 10}s` }}
          >
            <div className="flex">
              {reviews.map((review) => (
                <ReviewCard key={review.name} review={review} pick={pick} />
              ))}
            </div>
            {!prefersReduced && (
              <div className="flex" aria-hidden="true">
                {reviews.map((review) => (
                  <ReviewCard key={review.name} review={review} pick={pick} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
