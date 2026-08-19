import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "../i18n.jsx";
import Flashcard from "../components/Flashcard.jsx";
import HistoryQuizCard from "../components/HistoryQuizCard.jsx";
import GrammarQuizCard from "../components/GrammarQuizCard.jsx";
import MathQuizCard from "../components/MathQuizCard.jsx";
import { QtyStepper } from "../components/BuilderControls.jsx";
import { DECKS, DECK_BY_ID, DECK_COLOR, cardHasContent, makeBuild, priceBuild } from "../data/decks.js";
import { Badge, Button, Eyebrow, SectionHeading, cx } from "../ui.jsx";
import ReviewsRail from "../components/ReviewsRail.jsx";
import DeviceShowcase from "../components/DeviceShowcase.jsx";
import CounterSection from "../components/CounterSection.jsx";
import WhatYouGetSection from "../components/WhatYouGetSection.jsx";
import Reveal from "../components/Reveal.jsx";
import CommunitySection from "../components/CommunitySection.jsx";
import HeroMascot from "../components/HeroMascot.jsx";
// Reviewer photos for the testimonials rail — they live next to the
// TESTIMONIALS copy they belong to; the rail falls back to a deck-coloured
// initial circle for any entry without one.
import avatarJungkook from "../assets/review-1.jpg";
import avatarNuthnuth from "../assets/review-2.jpg";
import avatarSusu from "../assets/review-3.jpg";
import avatarSokngim from "../assets/review-4.jpg";
import avatarMing from "../assets/review-5.jpg";

/* ---------- Store ----------
Hero → what's included → pick a format → cart.
Decks 01–03 (grammar, math, history) are pre-made by the company — no
customizing step at all, just pick one and add it to cart as-is. The
Customize Set pitch is a permanent section after the reviews rail; picking
the Customize Set makes that section's preview go live, and its CTA hands
off to the card builder on its own page rather than showing it inline.
--------------------------------- */

// Decks with a one-off showcase card (styled differently from the plain
// Flashcard) pop that card up the moment they're picked, so the deck's
// actual look is never more than a click away.
const SHOWCASE_CARDS = { history: HistoryQuizCard, grammar: GrammarQuizCard, math: MathQuizCard };

// Shown in the Customize Set teaser until the customer writes their own
// card, so the preview reads like a filled example instead of a blank box —
// styled like the Math Fundamentals showcase card, notes box included.
const EXAMPLE_CARD = {
  front: ["You can customize flashcard as you want"],
  back: ["Put the answer here"],
  backNotes: [{ id: "example-note", text: "", ruled: false, box: { x: 0.5, y: 0.83, w: 84, h: 22 } }],
};

// The customize pitch is a permanent section — it always renders after the
// reviews rail whether the Customize Set is picked or not — so its copy and
// preview anchor to the customizable deck itself instead of whichever
// format happens to be selected.
const CUSTOM_DECK = DECKS.find((d) => d.customizable);
const CUSTOM_DEFAULT_STYLE = makeBuild(CUSTOM_DECK.id).style;

// Early buyers, quoted with their rating out of 5 — kept short so the rail
// stays scannable rather than reading like a wall of reviews. Each entry
// carries its reviewer's photo; the rail falls back to an initial circle
// if one is ever missing.
const TESTIMONIALS = [
  {
    name: "Jungkok",
    avatar: avatarJungkook,
    role: { en: "Grade 12 · Phnom Penh", km: "ថ្នាក់ទី១២ · ភ្នំពេញ" },
    rating: 5,
    deckId: "grammar",
    quote: {
      en: "The explanation on the back is the part that helped. I stopped memorising and started understanding.",
      km: "ការពន្យល់នៅផ្នែកខាងក្រោយគឺជាចំណុចដែលជួយខ្ញុំ។ ខ្ញុំឈប់ចងចាំតាមទម្លាប់ ហើយចាប់ផ្តើមយល់ដឹងជាមួយវិញ។",
    },
  },
  {
    name: "Nuthnuth",
    avatar: avatarNuthnuth,
    role: { en: "Parent · Battambang", km: "មាតាបិតា · បាត់ដំបង" },
    rating: 5,
    deckId: "math",
    quote: {
      en: "I bought the box for my daughter and the app came free. I did not expect that at this price.",
      km: "ខ្ញុំបានទិញប្រអប់នេះឱ្យកូនស្រី ហើយកម្មវិធីមកជាមួយដោយឥតគិតថ្លៃ។ ខ្ញុំមិនបានរំពឹងថានឹងទទួលបានបែបនេះក្នុងតម្លៃនេះទេ។",
    },
  },
  {
    name: "Susu",
    avatar: avatarSusu,
    role: { en: "Teacher · Siem Reap", km: "គ្រូបង្រៀន · សៀមរាប" },
    rating: 4,
    deckId: "history",
    quote: {
      en: "Cards feel good in the hand and take pencil well. Delivery took three days as promised.",
      km: "កាតកាន់មានអារម្មណ៍ល្អនៅក្នុងដៃ ហើយសរសេរខ្មៅដៃបានស្រួល។ ការដឹកជញ្ជូនចំណាយពេលបីថ្ងៃដូចការសន្យា។",
    },
  },
  {
    name: "Sokngim",
    avatar: avatarSokngim,
    role: { en: "Grade 11 · Kampot", km: "ថ្នាក់ទី១១ · កំពត" },
    rating: 5,
    deckId: "physics",
    quote: {
      en: "The review keeps bringing back the cards I get wrong. I used to skip those and pretend I knew them.",
      km: "លំហាត់ត្រួតពិនិត្យតែងតែយកកាតដែលខ្ញុំឆ្លើយខុសមកឡើងវិញ។ ពីមុនខ្ញុំតែងតែរំលងកាតទាំងនោះ ហើយធ្វើពុតជាដឹងចម្លើយ។",
    },
  },
  {
    name: "Ming",
    avatar: avatarMing,
    role: { en: "University student · Phnom Penh", km: "និស្សិត · ភ្នំពេញ" },
    rating: 5,
    deckId: "custom",
    quote: {
      en: "I made my own deck for pharmacology. The guide lines on the blank cards are better than a plain white card.",
      km: "ខ្ញុំបានធ្វើសំណុំកាតផ្ទាល់ខ្លួនសម្រាប់មុខវិជ្ជាឱសថសាស្ត្រ។ បន្ទាត់នាំផ្លូវនៅលើកាតទទេប្រសើរជាងកាតសខ្លាឥតបន្ទាត់។",
    },
  },
];
function CheckMini({ className }) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function ExpandIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H3v6M15 21h6v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function ChevronIcon({ flip }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/* Hero entrance choreography: the text column's pieces rise in one after
   another (stagger) while the flip card answers with a slightly delayed
   scale-in of its own — so the hero assembles itself instead of appearing
   all at once. Everything collapses to a static layout under reduced
   motion (initial={false} at the call sites). */
const HERO_STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
};
const HERO_ITEM = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.7, 0.3, 1] } },
};

export default function Store({ build, setBuild, onAddToCart, onBuyNow, onGoToCart, onGoToCustomize, onGoToAccount }) {
  const { t, pick } = useI18n();
  const [activeCard, setActiveCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [previewDeckId, setPreviewDeckId] = useState(null);
  const [previewFlipped, setPreviewFlipped] = useState(false);
  const [lightboxId, setLightboxId] = useState(null);
  const builderRef = useRef(null);
  const heroCardRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const deck = DECK_BY_ID[build.deckId];
  // Nothing selected (the customer toggled the card off again) → no buy bar
  // and no price; the page rests until a format is picked.
  const price = useMemo(() => (deck ? priceBuild(build) : null), [build, deck]);
  const card = build.cards[Math.min(activeCard, build.cards.length - 1)];

  function selectDeck(deckId) {
    const next = DECK_BY_ID[deckId];
    setBuild((b) => ({
      ...b,
      deckId,
      // Format-driven choices follow the new deck; personal styling is kept.
      style: {
        ...b.style,
        stock: next.defaults.stock,
        size: next.defaults.size,
        backLayout: next.defaults.backLayout,
      },
      // The Customize Set starts from a genuinely blank card rather than
      // whatever demo content was sitting in the hero preview — pre-made
      // decks don't offer card editing, so their preview is decorative and
      // can keep whatever was there.
      cards: next.customizable ? makeBuild(deckId).cards : b.cards.slice(0, next.capacity),
    }));
    setActiveCard(0);
  }

  // The whole deck card is a toggle: first click picks the format, a second
  // click on the same card lets it go again — deckId drops to null and the
  // buy bar below rests until something is picked.
  function toggleDeck(deckId) {
    if (build.deckId === deckId) setBuild((b) => ({ ...b, deckId: null }));
    else selectDeck(deckId);
  }

  // The eye button on a deck card is a look, not a commitment — it shows the
  // interactive showcase card where one exists, or falls back to the
  // packaging photo lightbox for decks that don't have one (physics, custom).
  function openCardPreview(deckId) {
    if (deckId in SHOWCASE_CARDS) {
      setPreviewFlipped(false);
      setPreviewDeckId(deckId);
    } else {
      setLightboxId(deckId);
    }
  }

  // Escape closes the popup, and the page behind it stops scrolling while open.
  useEffect(() => {
    if (!previewDeckId) return;
    const onKey = (e) => e.key === "Escape" && setPreviewDeckId(null);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [previewDeckId]);

  // Packaging-photo lightbox — only decks with a real photo take part, so
  // this stays empty (and unreachable, since nothing opens it) until a deck
  // actually has a packagingImage.
  const photoDecks = DECKS.filter((d) => d.packagingImage);
  const lightboxDeck = photoDecks.find((d) => d.id === lightboxId) ?? null;

  function stepLightbox(delta) {
    if (photoDecks.length === 0) return;
    const i = photoDecks.findIndex((d) => d.id === lightboxId);
    setLightboxId(photoDecks[(i + delta + photoDecks.length) % photoDecks.length].id);
  }

  useEffect(() => {
    if (!lightboxId) return;
    function onKey(e) {
      if (e.key === "Escape") setLightboxId(null);
      else if (e.key === "ArrowRight") stepLightbox(1);
      else if (e.key === "ArrowLeft") stepLightbox(-1);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxId]);

  // A subtle hero parallax: the flashcard preview drifts upward a little
  // slower than the page scrolls, so it visually separates from the text
  // column as you scroll past — classic differential-speed parallax.
  // Purely decorative and capped small; off entirely under reduced motion.
  useEffect(() => {
    const card = heroCardRef.current;
    if (!card) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    function place() {
      // positive offset: the card lags a little behind the normal scroll
      // (rather than exiting faster than it), reading as gently anchored
      // rather than rushed
      const y = Math.max(0, Math.min(window.scrollY, 500));
      card.style.transform = `translateY(${y * 0.08}px)`;
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(place);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    place();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleAdd() {
    // Only the build travels — price is always recomputed from it, so a cart
    // line can never disagree with the product it describes.
    onAddToCart({ cartId: crypto.randomUUID(), build: structuredClone(build) });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2600);
  }

  function handleBuyNow() {
    onBuyNow({ cartId: crypto.randomUUID(), build: structuredClone(build) });
  }

  function scrollToBuilder() {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {/* ---------- hero ---------- */}
      {/* Holds one screen exactly: the sticky header sits in flow above it
          and is 82px tall, so that comes off the viewport. `svh` rather
          than `vh` or `dvh` — the small viewport is the one that is always
          there, so the hero never hides under a phone's toolbar and never
          resizes as that toolbar comes and goes. */}
      <section className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-6 pb-16 md:pt-12 md:pb-24 min-h-[calc(100svh-82px)] overflow-x-clip grid md:grid-cols-[1fr_1.18fr] gap-10 lg:gap-16 items-center">
        <motion.div
          className="relative"
          variants={HERO_STAGGER}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
        >
          <motion.div variants={HERO_ITEM}>
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          </motion.div>
          <motion.h1
            variants={HERO_ITEM}
            /* Bold modern sans instead of the typewriter display face —
               same treatment as the DeviceShowcase heading. 700 is loaded
               for both IBM Plex Sans and its Noto Sans Khmer fallback. */
            className="font-sans font-bold text-[2.6rem] sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight mt-4 mb-6"
          >
            {t("hero.title1")}
            <br />
            {t("hero.title2")}
            <br />
            <span className="text-grease">{t("hero.title3")}</span>
          </motion.h1>
          <motion.p variants={HERO_ITEM} className="text-[15px] leading-relaxed text-ink/75 max-w-lg mb-8">
            {t("hero.body")}
          </motion.p>

          <motion.div variants={HERO_ITEM} className="flex flex-wrap gap-3 mb-8">
            <Button size="lg" onClick={scrollToBuilder}>
              {t("hero.cta")}
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToBuilder}>
              {t("hero.ctaSecondary")}
            </Button>
          </motion.div>

          <motion.div variants={HERO_ITEM} className="flex flex-wrap gap-2">
            <Badge>{t("hero.badge1")}</Badge>
            <Badge>{t("hero.badge2")}</Badge>
            <Badge>{t("hero.badge3")}</Badge>
          </motion.div>
        </motion.div>

        {/* `hp-bleed` runs this column out to the right edge of the screen
            so the panda has the whole width to cross; the section clips
            rather than scrolls. It has to sit on the grid item itself —
            put it on the flex child below and the child, being centred
            rather than stretched, collapses to nothing. */}
        <div className="relative flex flex-col items-center gap-4 hp-bleed">
          {/* Entrance lives on this outer wrapper while the scroll-parallax
              transform writes to the inner ref'd div — two elements, so the
              two transforms never fight over the same style. */}
          <motion.div
            className="w-full"
            initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.96, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.75, delay: 0.4, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <div ref={heroCardRef} className="w-full">
              {/* The hero is the mascot rather than a sample card — the deck
                  grid below still drives pricing, features and cart, and the
                  real card previews live in the showcase further down. */}
              {/* the mascot's speech bubble is the shortcut to signing in */}
              <HeroMascot onSayClick={onGoToAccount} />
            </div>
          </motion.div>
        </div>

        {/* Scroll cue — settles in once the entrance finishes, then keeps
            bobbing until the visitor takes the hint. */}
        <div aria-hidden="true" className="absolute bottom-1 left-1/2 -translate-x-1/2 hidden md:block">
          <motion.div
            className="text-ink/50"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? { opacity: 0.5 } : { opacity: 0.5, y: [0, 6, 0] }}
            transition={
              reduceMotion
                ? { duration: 0.4, delay: 1.2 }
                : {
                    opacity: { duration: 0.5, delay: 1.3 },
                    y: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.3 },
                  }
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </div>
      </section>

      <CounterSection />

      {/* ---------- what's included ----------
          The animated "what you get" band (flipping card, KHQR scan,
          unlocking lessons, cert ring) — ported from a supplied mockup
          and self-contained in its own component + scoped css. */}
      <WhatYouGetSection />

      {/* ---------- step 1: pick a format ---------- */}
      <section ref={builderRef} className="max-w-6xl mx-auto px-5 sm:px-6 py-16 md:py-20 scroll-mt-4">
        <Reveal>
          <SectionHeading
            eyebrow={t("decks.eyebrow")}
            title={t("decks.title")}
            subtitle={t("decks.subtitle")}
          />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {DECKS.map((d, i) => {
            const active = d.id === build.deckId;
            const canPreview = d.id in SHOWCASE_CARDS || Boolean(d.packagingImage);
            return (
              /* Animate-on-scroll: each card rises in when the grid scrolls
                 into view, staggered across the row (% 3 restarts the wave
                 on every new row). The hover lift moved to a framer
                 whileHover because the reveal's inline transform would
                 override Tailwind's class-based translate on this element. */
              <motion.div
                key={d.id}
                className={cx(
                  "group relative rounded-[20px] border overflow-hidden transition-all duration-200 h-full flex flex-col bg-paper cursor-pointer",
                  active
                    ? "border-ink shadow-panel ring-2 ring-ink/15"
                    : "border-ink/12 hover:border-ink/25 hover:shadow-panel"
                )}
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: [0.2, 0.7, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                onClick={() => toggleDeck(d.id)}
              >
                {/* ---- packaging photo, staged on a soft light with a floor shadow ----
                    The photo itself is decorative, but the whole card now
                    toggles selection on click — pick on the first click,
                    un-pick on the second. The little buttons inside (choose,
                    preview eye, photo expand) all stopPropagation so they
                    keep their own jobs. */}
                <div
                  // Pure white to match the packaging photos' own flat white
                  // background exactly — they carry their own contact shadow
                  // now, so there's no seam even where object-contain letterboxes.
                  className="relative aspect-square bg-white overflow-hidden"
                >
                  {d.packagingImage ? (
                    <img
                      src={d.packagingImage}
                      alt={`${pick(d.name)} packaging`}
                      // Absolutely positioned (not a grid item) so the percentage
                      // width/height resolve against this button's own definite
                      // box — as a grid item with place-items-center, browsers
                      // size it against its intrinsic aspect ratio instead and
                      // the photo overflows/gets clipped by overflow-hidden.
                      className="absolute inset-0 z-10 w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <span
                        className="relative z-10 w-16 h-16 rounded-full grid place-items-center text-white font-display text-2xl"
                        style={{ background: DECK_COLOR[d.subject] ?? "#5E7A86" }}
                      >
                        {pick(d.name).trim().charAt(0)}
                      </span>
                    </div>
                  )}

                  {d.popular && (
                    <span className="absolute top-3 left-3 z-20 font-mono text-[9px] font-bold tracking-wider uppercase bg-ink text-white rounded-full px-2.5 py-1.5">
                      {t("decks.popular")}
                    </span>
                  )}
                  {active ? (
                    <span className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full bg-ink text-white grid place-items-center shadow">
                      <CheckMini />
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 z-20 font-mono text-[11px] font-bold text-ink/30">{d.tag}</span>
                  )}
                  {d.packagingImage && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxId(d.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          setLightboxId(d.id);
                        }
                      }}
                      aria-label={t("decks.viewPhoto")}
                      className="absolute z-20 bottom-3 right-3 w-9 h-9 rounded-[11px] grid place-items-center bg-white/95 border border-ink/10 text-ink shadow-sm hover:bg-white transition-all opacity-0 translate-y-1.5 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100"
                    >
                      <ExpandIcon />
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1 text-left">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="font-display text-xl leading-snug flex-1">{pick(d.name)}</h3>
                    <span className="font-mono text-sm whitespace-nowrap">
                      {d.perCard ? `${t("decks.from")} $${d.perCard * d.defaultCardCount}` : `$${d.price}`}
                    </span>
                  </div>
                  <p className="text-sm text-ink/70 leading-relaxed mb-4 min-h-[2.9em]">{pick(d.blurb)}</p>

                  <p className="font-mono text-[11px] tracking-wide text-ink/45 py-3 mb-4 border-y border-ink/10">
                    {[
                      t("decks.cardCount", { n: d.capacity }),
                      d.lessonCount ? t("decks.stat.lessonCount", { n: d.lessonCount }) : null,
                      d.grade ? pick(d.grade) : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <div className="mt-auto flex items-center gap-2.5">
                    <Button
                      variant={active ? "primary" : "dark"}
                      size="lg"
                      full
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDeck(d.id);
                      }}
                      aria-pressed={active}
                    >
                      {active ? `✓ ${t("decks.selected")}` : t("decks.choose")}
                    </Button>
                    {canPreview && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCardPreview(d.id);
                        }}
                        aria-label={t("decks.viewCard")}
                        className="shrink-0 px-4 py-3 rounded-2xl border border-ink/15 bg-ink/[0.04] text-ink/60 hover:border-ink/35 hover:bg-ink/[0.08] hover:text-ink transition-colors"
                      >
                        <EyeIcon />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* The buy bar follows every format: pre-made decks ship as designed,
            the Customize Set just swaps in its own note. It gets the same
            IntersectionObserver reveal as everything else on the page. */}
        {deck && (
        <Reveal className="mt-6 border border-ink/15 rounded-card p-5 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="font-display text-lg leading-snug">{pick(deck.name)}</p>
            <p className="text-sm text-ink/60 mt-1">
              {deck?.customizable ? t("decks.customNote") : t("decks.readyNote")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <QtyStepper value={build.qty} onChange={(qty) => setBuild((b) => ({ ...b, qty }))} />
            <span className="font-mono text-lg tabular-nums">${price.total.toFixed(2)}</span>
            <Button variant="outline" onClick={handleAdd}>
              {t("custom.addToCart")}
            </Button>
            <Button onClick={handleBuyNow}>{t("custom.buyNow")}</Button>
          </div>
          {justAdded && (
            <div className="w-full flex items-center justify-between gap-3 text-sm animate-fade-in pt-1">
              <span className="text-chalk">✓ {t("custom.added")}</span>
              <button onClick={onGoToCart} className="underline underline-offset-4 text-ink/60 hover:text-ink">
                {t("nav.cart")}
              </button>
            </div>
          )}
        </Reveal>
        )}
      </section>

      {/* ---------- community ---------- */}
      <CommunitySection />

      {/* ---------- testimonials ---------- */}
      <ReviewsRail reviews={TESTIMONIALS} />

      {/* ---------- customize pitch — always on, right after reviews ----------
          light paper band with the bold sans heading (the About-page look);
          the card preview's front reads white against it */}
      <section className="bg-paper text-ink">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 md:py-20">
          {/* The heading rises in on scroll just like the text below it. */}
          <Reveal>
            <SectionHeading
              sans
              eyebrow={t("custom.eyebrow")}
              title={t("custom.customizeTitle")}
              subtitle={t("custom.customizeSubtitle")}
            />
          </Reveal>

          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 mt-10 items-start">
            {/* Each text block gets its own IntersectionObserver reveal,
                staggered a touch so the column reads top-to-bottom. */}
            <div>
              <Reveal>
                <p className="text-ink/70 leading-relaxed max-w-md mb-7">
                  {t("custom.customizeBody")}
                </p>
              </Reveal>

              <Reveal delay={0.12}>
                <ul className="max-w-md space-y-2.5 mb-8 pt-6 border-t border-ink/15">
                  {CUSTOM_DECK.features.map((f, i) => (
                    <li key={i} className="text-sm text-ink/70 flex gap-2.5 leading-relaxed">
                      <span className="text-grease shrink-0">·</span>
                      {pick(f)}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="max-w-md mb-8 pt-6 border-t border-ink/15">
                  <span className="label text-ink/50 block mb-4">{t("custom.howTitle")}</span>
                  <ol className="space-y-4">
                    {[
                      ["custom.how1Title", "custom.how1Body"],
                      ["custom.how2Title", "custom.how2Body"],
                      ["custom.how3Title", "custom.how3Body"],
                    ].map(([titleKey, bodyKey], i) => (
                      <li key={titleKey} className="flex gap-3.5">
                        <span className="font-mono text-xs text-grease shrink-0 mt-0.5">0{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-ink">{t(titleKey)}</p>
                          <p className="text-xs text-ink/60 leading-relaxed mt-1">{t(bodyKey)}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>

              <Reveal delay={0.36}>
                <Button
                  size="lg"
                  onClick={() => {
                    // The builder needs a customizable build to work in — if
                    // nothing (or a pre-made deck) is selected, hop onto the
                    // Customize Set first.
                    if (!deck?.customizable) selectDeck(CUSTOM_DECK.id);
                    onGoToCustomize();
                  }}
                >
                  {t("custom.customizeCta")}
                </Button>
              </Reveal>
            </div>
            <Reveal className="mx-auto w-full max-w-[380px]" delay={0.15}>
              {(() => {
                // The preview goes live only while the Customize Set is the
                // picked format — otherwise (or before anything is written)
                // it shows the filled example card.
                const live = deck?.customizable && card && cardHasContent(card);
                return (
                  <Flashcard
                    front={live ? card.front : EXAMPLE_CARD.front}
                    back={live ? card.back : EXAMPLE_CARD.back}
                    frontImage={live ? card.frontImage : null}
                    backImage={live ? card.backImage : null}
                    frontImageBox={live ? card.frontImageBox : null}
                    backImageBox={live ? card.backImageBox : null}
                    frontLineBoxes={live ? card.frontLineBoxes : null}
                    backLineBoxes={live ? card.backLineBoxes : null}
                    frontNotes={live ? card.frontNotes : null}
                    backNotes={live ? card.backNotes : EXAMPLE_CARD.backNotes}
                    cardLabel={pick(CUSTOM_DECK.name)}
                    style={deck?.customizable ? build.style : CUSTOM_DEFAULT_STYLE}
                    flipped={flipped}
                    onFlip={() => setFlipped((f) => !f)}
                    index={deck?.customizable ? activeCard : 0}
                    total={deck?.customizable ? build.cards.length : 1}
                    aspectRatio="10 / 16.5"
                  />
                );
              })()}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- study on any device ---------- */}
      <DeviceShowcase />

      {/* ---------- showcase decks: popup preview ---------- */}
      {previewDeckId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-5"
          onClick={() => setPreviewDeckId(null)}
        >
          <div
            className="relative w-full max-w-[380px] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
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
            {(() => {
              const ShowcaseCard = SHOWCASE_CARDS[previewDeckId];
              return (
                <ShowcaseCard
                  flipped={previewFlipped}
                  onFlip={() => {
                    // Tapping the card to look at it doubles as picking it —
                    // one less step than flip-then-close-then-choose.
                    setPreviewFlipped((f) => !f);
                    selectDeck(previewDeckId);
                  }}
                />
              );
            })()}
            <p className="label text-center text-cardstock/70 mt-4">{t("hero.flipHint")}</p>
          </div>
        </div>
      )}

      {/* ---------- packaging photo lightbox ---------- */}
      {lightboxDeck && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 backdrop-blur-sm p-6"
          role="dialog"
          aria-modal="true"
          aria-label={t("decks.viewPhoto")}
          onClick={() => setLightboxId(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxId(null)}
            aria-label={t("common.close")}
            className="absolute top-5 right-6 z-10 w-10 h-10 rounded-xl bg-white/10 text-white grid place-items-center hover:bg-white/20 transition-colors"
          >
            <CloseIcon />
          </button>

          {photoDecks.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepLightbox(-1);
                }}
                aria-label={t("common.previous")}
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20 transition-colors"
              >
                <ChevronIcon flip />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepLightbox(1);
                }}
                aria-label={t("common.next")}
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20 transition-colors"
              >
                <ChevronIcon />
              </button>
            </>
          )}

          <figure
            className="relative max-w-[560px] w-full max-h-[88vh] flex flex-col gap-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxDeck.packagingImage}
              alt={`${pick(lightboxDeck.name)} packaging`}
              className="w-full max-h-[72vh] object-contain rounded-2xl bg-white shadow-2xl"
            />
            <figcaption className="flex items-center gap-3 text-cardstock">
              <b className="font-display text-base">{pick(lightboxDeck.name)}</b>
              <span className="text-sm text-cardstock/60">{t("decks.cardCount", { n: lightboxDeck.capacity })}</span>
            </figcaption>
          </figure>
        </div>
      )}

    </>
  );
}
