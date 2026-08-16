/* ---------- product catalogue ----------
Deck formats, the options a customer can change, and the pricing rules
that turn a build into a number. Everything a card looks like on screen
is derived from this file, so the preview and the print spec can't drift
apart.
--------------------------------- */
import mathPackaging from "../assets/math-packaging.png";
import historyPackaging from "../assets/history-packaging.png";
import grammarPackaging from "../assets/grammar-packaging.png";
import customPackaging from "../assets/custom-packaging.png";
import physicsPackaging from "../assets/physics-packaging.png";
import chemistryPackaging from "../assets/chemistry-packaging.png";

export const CARD_STOCKS = [
  { id: "cardstock", label: { en: "Cardstock", km: "ក្រដាសក្រែម" }, hex: "#F1E9D2", ink: "#23201B" },
  { id: "manila", label: { en: "Manila", km: "ម៉ានីឡា" }, hex: "#D9C08C", ink: "#23201B" },
  { id: "chalk", label: { en: "Chalkboard", km: "ក្តារខៀន" }, hex: "#2F4538", ink: "#F1E9D2" },
  { id: "coral", label: { en: "Grease pencil", km: "ខ្មៅដៃក្រហម" }, hex: "#D65F42", ink: "#FCFAF4" },
  { id: "bone", label: { en: "Bone white", km: "ស ឆ្អឹង" }, hex: "#FCFAF4", ink: "#23201B" },
];

export const LETTERING = [
  { id: "typewriter", label: { en: "Typewriter", km: "អង្គុលីលេខ" }, family: "'Special Elite', 'Noto Serif Khmer', serif" },
  { id: "sans", label: { en: "Clean sans", km: "អក្សរស្អាត" }, family: "'IBM Plex Sans', 'Noto Sans Khmer', sans-serif" },
  { id: "mono", label: { en: "Marker mono", km: "អក្សរម៉ូណូ" }, family: "'IBM Plex Mono', 'Noto Sans Khmer', monospace" },
  { id: "siemreap", label: { en: "Siem Reap", km: "សៀមរាប" }, family: "'Siemreap', 'Noto Serif Khmer', serif" },
];

export const TEXT_SIZES = [
  { id: "sm", labelKey: "custom.size.sm", scale: 0.82 },
  { id: "md", labelKey: "custom.size.md", scale: 1 },
  { id: "lg", labelKey: "custom.size.lg", scale: 1.24 },
];

export const BACK_LAYOUTS = [
  { id: "blank", label: { en: "Blank", km: "ទទេ" } },
  { id: "ruled", label: { en: "Ruled", km: "មានបន្ទាត់" } },
  { id: "grid", label: { en: "Grid", km: "ក្រឡាចត្រង្គ" } },
  { id: "dotted", label: { en: "Dot grid", km: "ចំណុច" } },
];

// ISO 216 paper sizes, printed landscape (long edge as width) — every A
// size shares the same 1:√2 ratio, so stepping up a size never distorts.
export const CARD_SIZES = [
  {
    id: "a7",
    label: { en: "A7", km: "A7" },
    dims: { en: '4.1 × 2.9"', km: "១០.៥ × ៧.៤ សម" },
    ratio: 105 / 74,
    surcharge: 0,
  },
  {
    id: "a6",
    label: { en: "A6", km: "A6" },
    dims: { en: '5.8 × 4.1"', km: "១៤.៨ × ១០.៥ សម" },
    ratio: 148 / 105,
    surcharge: 3,
  },
  {
    id: "a5",
    label: { en: "A5", km: "A5" },
    dims: { en: '8.3 × 5.8"', km: "២១.០ × ១៤.៨ សម" },
    ratio: 210 / 148,
    surcharge: 6,
  },
];

export const CORNERS = [
  { id: "square", labelKey: "custom.corner.square", radius: "3px" },
  { id: "round", labelKey: "custom.corner.round", radius: "14px" },
];

export const DECKS = [
  {
    id: "grammar",
    tag: "01",
    subject: "grammar",
    name: { en: "Grammar Primer", km: "កាតវេយ្យាករណ៍" },
    blurb: {
      en: "50 cards with a ruled back. Built for English grammar — parts of speech, tenses and agreement.",
      km: "កាត ៥០ សន្លឹក មានបន្ទាត់ខាងក្រោយ។ សាងឡើងសម្រាប់វេយ្យាករណ៍អង់គ្លេស — ភាគសម្តី កាលកិរិយាស័ព្ទ និងការឆប់គ្នារវាងប្រធានបទនិងកិរិយាស័ព្ទ។",
    },
    price: 14,
    capacity: 50,
    lessonCount: 4,
    grade: { en: "Grade 10–12", km: "ថ្នាក់ទី ១០-១២" },
    packagingImage: grammarPackaging,
    defaults: { size: "a7", backLayout: "ruled", stock: "cardstock" },
    popular: true,
    features: [
      { en: "4 structured lessons on English grammar", km: "មេរៀនរៀបចំ ៤ អំពីវេយ្យាករណ៍អង់គ្លេស" },
      { en: "4 practice modes, unlimited attempts", km: "លំហាត់ ៤ ប្រភេទ ធ្វើបានគ្មានកំណត់" },
      { en: "Timed exam → printable certificate", km: "ប្រឡងកំណត់ពេល → វិញ្ញាបនបត្រអាចបោះពុម្ព" },
    ],
  },
  {
    id: "math",
    tag: "02",
    subject: "math",
    name: { en: "Math Fundamentals", km: "គណិតវិទ្យាមូលដ្ឋាន" },
    blurb: {
      en: "50 cards with a light grid on the back — room to show your working.",
      km: "កាត ៥០ សន្លឹក មានក្រឡាចត្រង្គស្តើងខាងក្រោយ — មានកន្លែងសរសេររបៀបគិត។",
    },
    price: 14,
    capacity: 50,
    lessonCount: 4,
    grade: { en: "Grade 10–12", km: "ថ្នាក់ទី ១០-១២" },
    packagingImage: mathPackaging,
    defaults: { size: "a7", backLayout: "grid", stock: "cardstock" },
    features: [
      { en: "4 lessons on mental arithmetic strategy", km: "មេរៀន ៤ អំពីយុទ្ធសាស្ត្រគណនាក្នុងចិត្ត" },
      { en: "Unlimited generated practice problems", km: "លំហាត់បង្កើតដោយស្វ័យប្រវត្តិគ្មានកំណត់" },
      { en: "Timed exam → printable certificate", km: "ប្រឡងកំណត់ពេល → វិញ្ញាបនបត្រអាចបោះពុម្ព" },
    ],
  },
  {
    id: "history",
    tag: "03",
    subject: "history",
    name: { en: "History Set", km: "សំណុំប្រវត្តិសាស្ត្រ" },
    blurb: {
      en: "50 cards with a dot grid on the back. Khmer-language question set included.",
      km: "កាត ៥០ សន្លឹក មានក្រឡាចំណុចខាងក្រោយ។ មានសំណុំសំណួរជាភាសាខ្មែរភ្ជាប់មកជាមួយ។",
    },
    price: 14,
    capacity: 50,
    lessonCount: 4,
    grade: { en: "Grade 10–12", km: "ថ្នាក់ទី ១០-១២" },
    packagingImage: historyPackaging,
    defaults: { size: "a7", backLayout: "dotted", stock: "manila" },
    features: [
      { en: "4 lessons in Khmer on Cambodian history", km: "មេរៀន ៤ ជាភាសាខ្មែរ អំពីប្រវត្តិសាស្ត្រកម្ពុជា" },
      { en: "Khmer practice and exam question bank", km: "ធនាគារសំណួរលំហាត់ និងប្រឡងជាភាសាខ្មែរ" },
      { en: "Timed exam → printable certificate", km: "ប្រឡងកំណត់ពេល → វិញ្ញាបនបត្រអាចបោះពុម្ព" },
    ],
  },
  {
    id: "chemistry",
    tag: "04",
    subject: "chemistry",
    name: { en: "Chemistry Set", km: "សំណុំគីមីវិទ្យា" },
    blurb: {
      en: "50 cards with a light grid on the back — room to balance an equation or sketch a structure.",
      km: "កាត ៥០ សន្លឹក មានក្រឡាចត្រង្គស្តើងខាងក្រោយ — មានកន្លែងសម្រួលសមីការ ឬគូររចនាសម្ព័ន្ធ។",
    },
    price: 14,
    capacity: 50,
    lessonCount: 4,
    grade: { en: "Grade 10–12", km: "ថ្នាក់ទី ១០-១២" },
    packagingImage: chemistryPackaging,
    defaults: { size: "a7", backLayout: "grid", stock: "cardstock" },
    features: [
      { en: "4 lessons on reactions, equations and molecular structure", km: "មេរៀន ៤ អំពីប្រតិកម្ម សមីការ និងរចនាសម្ព័ន្ធម៉ូលេគុល" },
      { en: "4 practice modes, unlimited attempts", km: "លំហាត់ ៤ ប្រភេទ ធ្វើបានគ្មានកំណត់" },
      { en: "Timed exam → printable certificate", km: "ប្រឡងកំណត់ពេល → វិញ្ញាបនបត្រអាចបោះពុម្ព" },
    ],
  },
  {
    id: "physics",
    tag: "05",
    subject: "physics",
    name: { en: "Physics Basics", km: "មូលដ្ឋានរូបវិទ្យា" },
    blurb: {
      en: "50 cards with a light grid on the back — room for a formula or a quick diagram.",
      km: "កាត ៥០ សន្លឹក មានក្រឡាចត្រង្គស្តើងខាងក្រោយ — មានកន្លែងសរសេររូបមន្ត ឬគូររូបភាពរហ័ស។",
    },
    price: 14,
    capacity: 50,
    lessonCount: 4,
    grade: { en: "Grade 10–12", km: "ថ្នាក់ទី ១០-១២" },
    packagingImage: physicsPackaging,
    defaults: { size: "a7", backLayout: "grid", stock: "cardstock" },
    features: [
      { en: "4 lessons on motion, forces, energy and circuits", km: "មេរៀន ៤ អំពីចលនា កម្លាំង ថាមពល និងសៀគ្វីអគ្គិសនី" },
      { en: "4 practice modes, unlimited attempts", km: "លំហាត់ ៤ ប្រភេទ ធ្វើបានគ្មានកំណត់" },
      { en: "Timed exam → printable certificate", km: "ប្រឡងកំណត់ពេល → វិញ្ញាបនបត្រអាចបោះពុម្ព" },
    ],
  },
  {
    id: "custom",
    tag: "06",
    subject: "blank",
    customizable: true,
    name: { en: "Customize Set", km: "សំណុំកាតផ្ទាល់ខ្លួន" },
    blurb: {
      en: "Fully blank cards, uncoated both sides — you choose how many. Design every card yourself, no preset course.",
      km: "កាតទទេទាំងស្រុង មិនរំអិលទាំងសងខាង — អ្នកជ្រើសរើសចំនួន។ រចនារាល់កាតដោយខ្លួនឯង គ្មានវគ្គសិក្សាកំណត់ជាមុន។",
    },
    price: 12,
    // Priced per card instead of a flat deck price — the customer picks how
    // many they want (defaultCardCount to start), up to capacity as a ceiling.
    perCard: 0.25,
    defaultCardCount: 20,
    capacity: 300,
    packagingImage: customPackaging,
    // The Customize Set previews in the blue indigo frame instead of the
    // house maroon, so the blank-card pitch reads as its own thing.
    defaults: { size: "a6", backLayout: "blank", stock: "bone", template: "indigo" },
    features: [
      { en: "No preset course — the deck is yours", km: "គ្មានវគ្គសិក្សាកំណត់ជាមុន — សំណុំកាតជារបស់អ្នក" },
      { en: "Full control over every card's front and back", km: "គ្រប់គ្រងពេញលេញលើខាងមុខ និងខាងក្រោយរាល់កាត" },
      { en: "Cheapest per card", km: "តម្លៃក្នុងមួយកាតថោកបំផុត" },
    ],
  },
];

export const DECK_BY_ID = Object.fromEntries(DECKS.map((d) => [d.id, d]));

// Tints the placeholder mark for decks with no packaging photo yet — same
// palette used for deck "spines" and swatches wherever a deck needs an
// accent colour without its photo (Store.jsx, ReviewsRail, mydecks.css).
export const DECK_COLOR = {
  grammar: "#2C4032",
  math: "#8C5A46",
  history: "#9A7B32",
  blank: "#5E7A86",
  physics: "#3B5B8C",
  chemistry: "#5B3B8C",
};

/* ---------- lookups ---------- */
export const stockById = (id) => CARD_STOCKS.find((s) => s.id === id) ?? CARD_STOCKS[0];
export const letteringById = (id) => LETTERING.find((l) => l.id === id) ?? LETTERING[0];
export const textSizeById = (id) => TEXT_SIZES.find((s) => s.id === id) ?? TEXT_SIZES[1];
export const cardSizeById = (id) => CARD_SIZES.find((s) => s.id === id) ?? CARD_SIZES[0];
export const cornerById = (id) => CORNERS.find((c) => c.id === id) ?? CORNERS[0];

/* ---------- pricing ----------
Base deck price + a surcharge for stepping up from the format's default
card size. Quantity multiplies the lot. A deck priced `perCard` (the
Customize Set) has no flat base — the customer's chosen card count sets
the price instead.
--------------------------------- */
export function priceBuild(build) {
  const deck = DECK_BY_ID[build.deckId];
  if (!deck) return { base: 0, sizeUpgrade: 0, unit: 0, total: 0 };

  const chosen = cardSizeById(build.style.size).surcharge;
  const included = cardSizeById(deck.defaults.size).surcharge;
  const sizeUpgrade = Math.max(0, chosen - included);
  const base = deck.perCard ? deck.perCard * (build.cardCount || deck.defaultCardCount || 1) : deck.price;
  const unit = base + sizeUpgrade;

  return { base, sizeUpgrade, unit, total: unit * (build.qty || 1) };
}

/* ---------- a fresh build ----------
A card side is a list of lines rather than one block of text — one line
prints plain and centred, more than one prints as a numbered list. That
covers both a single term/definition card and a multi-question study
card from the same shape. ------------------------------------------- */
export function makeBuild(deckId) {
  const deck = DECK_BY_ID[deckId] ?? DECKS[0];
  return {
    deckId: deck.id,
    qty: 1,
    cardCount: deck.defaultCardCount ?? deck.capacity,
    style: {
      stock: deck.defaults.stock,
      lettering: "sans",
      textSize: "md",
      size: deck.defaults.size,
      backLayout: deck.defaults.backLayout,
      corners: "round",
      numbered: true,
      noteTheme: "burgundy",
      template: deck.defaults.template ?? "maroon",
    },
    cards: [{ id: crypto.randomUUID(), front: [""], back: [""], frontImage: null, backImage: null }],
  };
}

export function cardHasContent(card) {
  return cardSideHasContent(card, "front") || cardSideHasContent(card, "back");
}

export function cardSideHasContent(card, side) {
  const lines = side === "front" ? card.front : card.back;
  const image = side === "front" ? card.frontImage : card.backImage;
  return (lines ?? []).some((l) => l.trim()) || Boolean(image);
}

/* ---------- card rendering ----------
Turns a back-layout id into the CSS that draws it, tinted to whatever ink
colour the chosen stock uses so it stays legible on dark stocks.
--------------------------------- */
export function inkRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

// Colour choices for the "Your Notes" callout — a small palette borrowed
// from the showcase cards' own themes, so a customer's note box can match
// the same navy/burgundy/forest look instead of only the brand's orange.
export const NOTE_THEMES = [
  { id: "navy", label: { en: "Navy", km: "ខៀវចាស់" }, primary: "#1C3A63", primaryDark: "#152B4D" },
  { id: "burgundy", label: { en: "Burgundy", km: "ក្រហមចាស់" }, primary: "#6B1F2E", primaryDark: "#4A1420" },
  { id: "forest", label: { en: "Forest", km: "បៃតងព្រៃ" }, primary: "#1F4D3B", primaryDark: "#16362B" },
];
export const noteThemeById = (id) => NOTE_THEMES.find((n) => n.id === id) ?? NOTE_THEMES[0];

// Whole-card templates — the themed frame ported from the supplied
// flashcard component: a deep-coloured 5px frame around a light paper
// panel, gradient header/footer bars, a QUESTION/ANSWER tag and the wave
// footer illustration. The eight palette fields mirror the component's
// --fc-* variables one-to-one, so re-theming is just swapping an entry.
export const CARD_TEMPLATES = [
  { id: "plain", label: { en: "Plain", km: "ធម្មតា" } },
  {
    id: "maroon",
    label: { en: "Maroon", km: "ក្រហមចាស់" },
    deep: "#5A1F2A", deep2: "#7E2B38", gold: "#C9922F", gold2: "#E7C065",
    paper: "#FBF7EE", ink: "#2A1B1E", soft: "#7A6660", wave: "#5A1F2A",
  },
  {
    id: "indigo",
    label: { en: "Indigo", km: "ខៀវចាស់" },
    deep: "#1F3A5F", deep2: "#2E5687", gold: "#C9922F", gold2: "#E7C065",
    paper: "#F7F9FC", ink: "#16233A", soft: "#5E6E86", wave: "#2E5687",
  },
  {
    id: "sumi",
    label: { en: "Sumi", km: "ខ្មៅ" },
    deep: "#22201C", deep2: "#3A3630", gold: "#B99150", gold2: "#DDBA79",
    paper: "#F7F4EC", ink: "#1B1916", soft: "#6E695F", wave: "#22201C",
  },
  {
    id: "matcha",
    label: { en: "Matcha", km: "បៃតងតែ" },
    deep: "#2C5340", deep2: "#3F7357", gold: "#C9922F", gold2: "#E3BE6E",
    paper: "#F6F8F2", ink: "#1C2A22", soft: "#5F7166", wave: "#2C5340",
  },
  {
    id: "sakura",
    label: { en: "Sakura", km: "ផ្កាឈូក" },
    deep: "#8C3A54", deep2: "#B0576F", gold: "#D8A34B", gold2: "#EFCB80",
    paper: "#FDF6F5", ink: "#3A1F27", soft: "#8A6B72", wave: "#8C3A54",
  },
];
export const templateById = (id) => CARD_TEMPLATES.find((t) => t.id === id) ?? CARD_TEMPLATES[0];

export function backLayoutStyle(layoutId, inkHex) {
  const line = inkRgba(inkHex, 0.18);
  const faint = inkRgba(inkHex, 0.13);

  switch (layoutId) {
    case "ruled":
      return {
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 21px, ${line} 21px 22px)`,
        backgroundPosition: "0 8px",
      };
    case "grid":
      return {
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 15px, ${faint} 15px 16px), repeating-linear-gradient(to right, transparent 0 15px, ${faint} 15px 16px)`,
      };
    case "dotted":
      return {
        backgroundImage: `radial-gradient(${inkRgba(inkHex, 0.28)} 1px, transparent 1px)`,
        backgroundSize: "14px 14px",
      };
    default:
      return {};
  }
}
