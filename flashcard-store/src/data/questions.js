/* ---------- question banks ----------
One item shape for every subject and every practice mode:

  { id, front, back, typed? }

  front  — the cue (a term, a question)
  back   — the response
  typed  — optional override for "type the answer" mode, where the useful
           direction is often reversed and the accepted spellings need
           listing explicitly

Maths items are generated on demand rather than stored, so the bank is
effectively unlimited.
--------------------------------- */

import { getDueItemIds } from "../storage.js";

const GRAMMAR_BANK = [
  {
    id: "sva-she-goes",
    front: {
      en: "Choose the correct verb: She ___ to school every day.",
      km: "ជ្រើសរើសកិរិយាស័ព្ទត្រឹមត្រូវ៖ She ___ to school every day.",
    },
    back: { en: "goes", km: "goes" },
    typed: { accept: ["goes"] },
  },
  {
    id: "sva-dogs-bark",
    front: {
      en: "Choose the correct verb: The dogs ___ loudly at night.",
      km: "ជ្រើសរើសកិរិយាស័ព្ទត្រឹមត្រូវ៖ The dogs ___ loudly at night.",
    },
    back: { en: "bark", km: "bark" },
    typed: { accept: ["bark"] },
  },
  {
    id: "sva-box",
    front: {
      en: "Choose the correct verb: The box of apples ___ on the table.",
      km: "ជ្រើសរើសកិរិយាស័ព្ទត្រឹមត្រូវ៖ The box of apples ___ on the table.",
    },
    back: { en: "is", km: "is" },
    typed: { accept: ["is"] },
  },
  {
    id: "tense-past-go",
    front: { en: "Yesterday, I ___ (go) to the market.", km: "Yesterday, I ___ (go) to the market." },
    back: { en: "went", km: "went" },
    typed: { accept: ["went"] },
  },
  {
    id: "tense-past-see",
    front: { en: "What is the past tense of \"see\"?", km: "តើអតីតកាលនៃ «see» គឺជាអ្វី?" },
    back: { en: "saw", km: "saw" },
    typed: { accept: ["saw"] },
  },
  {
    id: "tense-past-eat",
    front: { en: "What is the past tense of \"eat\"?", km: "តើអតីតកាលនៃ «eat» គឺជាអ្វី?" },
    back: { en: "ate", km: "ate" },
    typed: { accept: ["ate"] },
  },
  {
    id: "tense-future",
    front: {
      en: "Tomorrow, she ___ (visit) her grandmother.",
      km: "Tomorrow, she ___ (visit) her grandmother.",
    },
    back: { en: "will visit", km: "will visit" },
    typed: { accept: ["will visit"] },
  },
  {
    id: "article-an",
    front: {
      en: "Choose the correct article: I saw ___ elephant at the zoo.",
      km: "ជ្រើសរើសមុននាមត្រឹមត្រូវ៖ I saw ___ elephant at the zoo.",
    },
    back: { en: "an", km: "an" },
    typed: { accept: ["an"] },
  },
  {
    id: "article-the",
    front: {
      en: "Choose the correct article: ___ sun rises in the east.",
      km: "ជ្រើសរើសមុននាមត្រឹមត្រូវ៖ ___ sun rises in the east.",
    },
    back: { en: "The", km: "The" },
    typed: { accept: ["the"] },
  },
  {
    id: "pronoun-its",
    front: {
      en: "Choose the correct word: The cat licked ___ paw.",
      km: "ជ្រើសរើសសព្ទត្រឹមត្រូវ៖ The cat licked ___ paw.",
    },
    back: { en: "its", km: "its" },
    typed: { accept: ["its"] },
  },
  {
    id: "prep-in",
    front: {
      en: "Choose the correct preposition: She was born ___ 1998.",
      km: "ជ្រើសរើសបុព្វបទត្រឹមត្រូវ៖ She was born ___ 1998.",
    },
    back: { en: "in", km: "in" },
    typed: { accept: ["in"] },
  },
  {
    id: "prep-on",
    front: {
      en: "Choose the correct preposition: The meeting is ___ Monday.",
      km: "ជ្រើសរើសបុព្វបទត្រឹមត្រូវ៖ The meeting is ___ Monday.",
    },
    back: { en: "on", km: "on" },
    typed: { accept: ["on"] },
  },
  {
    id: "noun-plural-child",
    front: { en: "What is the plural of \"child\"?", km: "តើពហុវចនៈនៃ «child» គឺជាអ្វី?" },
    back: { en: "children", km: "children" },
    typed: { accept: ["children"] },
  },
  {
    id: "adj-comparative-good",
    front: { en: "What is the comparative form of \"good\"?", km: "តើទម្រង់ប្រៀបធៀបនៃ «good» គឺជាអ្វី?" },
    back: { en: "better", km: "better" },
    typed: { accept: ["better"] },
  },
  {
    id: "adverb-quick",
    front: { en: "Turn the adjective \"quick\" into an adverb.", km: "ប្តូរគុណនាម «quick» ទៅជាគុណកិរិយា។" },
    back: { en: "quickly", km: "quickly" },
    typed: { accept: ["quickly"] },
  },
  {
    id: "conjunction-so",
    front: {
      en: "Which conjunction fits: \"I was tired, ___ I went home.\"",
      km: "ជ្រើសរើសឈ្នាប់ភ្ជាប់ត្រឹមត្រូវ៖ «I was tired, ___ I went home.»",
    },
    back: { en: "so", km: "so" },
    typed: { accept: ["so"] },
  },
];

const HISTORY_BANK = [
  {
    id: "ww1",
    front: {
      en: "In what year did the First World War break out?",
      km: "តើសង្គ្រាមលោកលើកទី១ បានផ្ទុះឡើងនៅឆ្នាំណា?",
    },
    back: { en: "1914 (it ran to 1918).", km: "ឆ្នាំ១៩១៤ (១៩១៤–១៩១៨)។" },
    typed: { accept: ["1914"] },
  },
  {
    id: "un",
    front: {
      en: "On what date was the United Nations founded?",
      km: "តើអង្គការសហប្រជាជាតិ ត្រូវបានបង្កើតឡើងនៅថ្ងៃខែឆ្នាំណា?",
    },
    back: { en: "24 October 1945.", km: "ថ្ងៃទី២៤ តុលា ១៩៤៥។" },
    typed: { accept: ["1945", "24 october 1945", "24/10/1945"] },
  },
  {
    id: "protectorate",
    front: {
      en: "In what year did Cambodia become a French protectorate?",
      km: "តើកម្ពុជាបានធ្លាក់ក្រោមអាណាព្យាបាលរបស់បារាំងនៅឆ្នាំណា?",
    },
    back: { en: "1863.", km: "ឆ្នាំ១៨៦៣។" },
    typed: { accept: ["1863"] },
  },
  {
    id: "independence",
    front: {
      en: "On what date did Cambodia gain full independence from France?",
      km: "តើកម្ពុជាទទួលបានឯករាជ្យពេញលេញពីបារាំងនៅថ្ងៃខែឆ្នាំណា?",
    },
    back: { en: "9 November 1953.", km: "ថ្ងៃទី៩ វិច្ឆិកា ១៩៥៣។" },
    typed: { accept: ["1953", "9 november 1953", "9/11/1953"] },
  },
  {
    id: "dk",
    front: {
      en: "What years did Democratic Kampuchea last?",
      km: "តើសម័យកម្ពុជាប្រជាធិបតេយ្យ មានរយៈពេលចាប់ពីឆ្នាំណាដល់ឆ្នាំណា?",
    },
    back: { en: "1975 to 1979.", km: "ពីឆ្នាំ១៩៧៥ ដល់ឆ្នាំ១៩៧៩។" },
    typed: { accept: ["1975-1979", "1975 to 1979", "1975 1979", "1975–1979"] },
  },
  {
    id: "indochina",
    front: {
      en: "In what year was Cambodia incorporated into French Indochina?",
      km: "តើកម្ពុជាត្រូវបានបញ្ចូលទៅក្នុងឥណ្ឌូចិនបារាំងនៅឆ្នាំណា?",
    },
    back: { en: "1887.", km: "ឆ្នាំ១៨៨៧។" },
    typed: { accept: ["1887"] },
  },
  {
    id: "paris",
    front: {
      en: "In what year were the Paris Peace Agreements on Cambodia signed?",
      km: "តើកិច្ចព្រមព្រៀងសន្តិភាពទីក្រុងប៉ារីសស្តីពីកម្ពុជា ត្រូវបានចុះហត្ថលេខានៅឆ្នាំណា?",
    },
    back: { en: "1991.", km: "ឆ្នាំ១៩៩១។" },
    typed: { accept: ["1991"] },
  },
  {
    id: "untac",
    front: {
      en: "In what year were the UN-supervised elections held in Cambodia?",
      km: "តើការបោះឆ្នោតក្រោមការត្រួតពិនិត្យរបស់ អ.ស.ប នៅកម្ពុជា បានធ្វើឡើងនៅឆ្នាំណា?",
    },
    back: { en: "1993.", km: "ឆ្នាំ១៩៩៣។" },
    typed: { accept: ["1993"] },
  },
  {
    id: "ww2",
    front: {
      en: "In what year did the Second World War end?",
      km: "តើសង្គ្រាមលោកលើកទី២ បានបញ្ចប់នៅឆ្នាំណា?",
    },
    back: { en: "1945.", km: "ឆ្នាំ១៩៤៥។" },
    typed: { accept: ["1945"] },
  },
  {
    id: "asean",
    front: {
      en: "In what year did Cambodia join ASEAN?",
      km: "តើកម្ពុជាបានចូលជាសមាជិកអាស៊ាននៅឆ្នាំណា?",
    },
    back: { en: "1999.", km: "ឆ្នាំ១៩៩៩។" },
    typed: { accept: ["1999"] },
  },
  {
    id: "angkorwat",
    front: {
      en: "Which king began the construction of Angkor Wat?",
      km: "តើស្តេចណាដែលបានចាប់ផ្តើមសាងសង់ប្រាសាទអង្គរវត្ត?",
    },
    back: { en: "King Suryavarman II, in the 12th century.", km: "ព្រះបាទសូរ្យវរ្ម័នទី២ នៅសតវត្សទី១២។" },
    typed: { accept: ["suryavarman ii", "suryavarman 2", "សូរ្យវរ្ម័នទី២"] },
  },
  {
    id: "angkorthom",
    front: {
      en: "Which king built Angkor Thom and the Bayon?",
      km: "តើស្តេចណាដែលបានសាងសង់អង្គរធំ និងប្រាសាទបាយ័ន?",
    },
    back: { en: "King Jayavarman VII.", km: "ព្រះបាទជ័យវរ្ម័នទី៧។" },
    typed: { accept: ["jayavarman vii", "jayavarman 7", "ជ័យវរ្ម័នទី៧"] },
  },
  {
    id: "khmerempire",
    front: {
      en: "In what year is the founding of the Khmer Empire dated?",
      km: "តើការបង្កើតចក្រភពខ្មែរ ត្រូវបានកំណត់នៅឆ្នាំណា?",
    },
    back: { en: "802, under Jayavarman II.", km: "ឆ្នាំ៨០២ ក្រោមព្រះបាទជ័យវរ្ម័នទី២។" },
    typed: { accept: ["802"] },
  },
  {
    id: "monument",
    front: {
      en: "What date is Cambodia's Independence Day each year?",
      km: "តើទិវាឯករាជ្យជាតិកម្ពុជា ត្រូវនឹងថ្ងៃខែណាជារៀងរាល់ឆ្នាំ?",
    },
    back: { en: "9 November.", km: "ថ្ងៃទី៩ វិច្ឆិកា។" },
    typed: { accept: ["9 november", "november 9", "9/11"] },
  },
];

const PHYSICS_BANK = [
  {
    id: "speed-formula",
    front: { en: "What is the formula for speed?", km: "តើរូបមន្តរកល្បឿនគឺជាអ្វី?" },
    back: { en: "speed = distance ÷ time", km: "speed = distance ÷ time" },
    typed: { accept: ["speed = distance / time", "distance/time", "distance divided by time"] },
  },
  {
    id: "speed-calc-1",
    front: { en: "A car travels 150 km in 3 hours. What is its speed?", km: "ឡានធ្វើដំណើរ ១៥០ គីឡូម៉ែត្រ ក្នុង ៣ ម៉ោង។ តើល្បឿនប៉ុន្មាន?" },
    back: { en: "50 km/h", km: "50 km/h" },
    typed: { accept: ["50", "50 km/h", "50km/h"] },
  },
  {
    id: "avg-speed",
    front: { en: "How do you calculate average speed for a whole trip?", km: "តើគណនាល្បឿនមធ្យមសម្រាប់ដំណើរទាំងមូលដោយរបៀបណា?" },
    back: { en: "total distance ÷ total time", km: "total distance ÷ total time" },
    typed: { accept: ["total distance / total time", "distance over time"] },
  },
  {
    id: "newton-first",
    front: { en: "What does Newton's first law describe?", km: "តើច្បាប់ទី១របស់ញូតុនពិពណ៌នាអំពីអ្វី?" },
    back: { en: "Inertia — an object keeps its state of motion unless a force acts on it.", km: "អចលភាព — វត្ថុរក្សាស្ថានភាពចលនារបស់វា លុះត្រាតែមានកម្លាំងប៉ះពាល់។" },
    typed: { accept: ["inertia"] },
  },
  {
    id: "newton-second",
    front: { en: "What is the formula for Newton's second law?", km: "តើរូបមន្តច្បាប់ទី២របស់ញូតុនគឺជាអ្វី?" },
    back: { en: "F = m × a", km: "F = m × a" },
    typed: { accept: ["f = m x a", "f=ma", "force = mass x acceleration"] },
  },
  {
    id: "newton-third",
    front: { en: "What does Newton's third law state?", km: "តើច្បាប់ទី៣របស់ញូតុនចែងអំពីអ្វី?" },
    back: { en: "Every action has an equal and opposite reaction.", km: "សកម្មភាពគ្រប់មួយមានប្រតិកម្មស្មើគ្នា និងផ្ទុយទិស។" },
    typed: { accept: ["equal and opposite reaction"] },
  },
  {
    id: "force-calc",
    front: { en: "A 2 kg object accelerates at 3 m/s². What force acts on it?", km: "វត្ថុ ២ គីឡូក្រាម មានសំទុះ ៣ m/s²។ តើកម្លាំងអ្វី?" },
    back: { en: "6 newtons", km: "6 newtons" },
    typed: { accept: ["6", "6 n", "6 newtons"] },
  },
  {
    id: "work-formula",
    front: { en: "What is the formula for work?", km: "តើរូបមន្តរកការងារគឺជាអ្វី?" },
    back: { en: "work = force × distance", km: "work = force × distance" },
    typed: { accept: ["work = force x distance", "force x distance"] },
  },
  {
    id: "work-calc",
    front: { en: "A force of 20 N moves a box 5 m. How much work is done?", km: "កម្លាំង ២០ នូតុន ធ្វើឲ្យប្រអប់ផ្លាស់ទី ៥ ម៉ែត្រ។ តើមានការងារប៉ុន្មាន?" },
    back: { en: "100 joules", km: "100 joules" },
    typed: { accept: ["100", "100 j", "100 joules"] },
  },
  {
    id: "power-formula",
    front: { en: "What is the formula for power?", km: "តើរូបមន្តរកកម្លាំងអំណាចគឺជាអ្វី?" },
    back: { en: "power = work ÷ time", km: "power = work ÷ time" },
    typed: { accept: ["power = work / time", "work / time", "work over time"] },
  },
  {
    id: "work-zero",
    front: { en: "Why does holding a heavy bag still do zero work in physics?", km: "ហេតុអ្វីការកាន់កាបូបធ្ងន់ដោយមិនកម្រើក ធ្វើការងារស្មើសូន្យ?" },
    back: { en: "Because nothing moves — work needs motion in the direction of the force.", km: "ព្រោះគ្មានអ្វីផ្លាស់ទី — ការងារត្រូវការចលនាតាមទិសកម្លាំង។" },
    typed: { accept: ["nothing moves", "no motion"] },
  },
  {
    id: "ohms-law",
    front: { en: "What is Ohm's law?", km: "តើច្បាប់អូមគឺជាអ្វី?" },
    back: { en: "V = I × R", km: "V = I × R" },
    typed: { accept: ["v = i x r", "v=ir", "voltage = current x resistance"] },
  },
  {
    id: "current-calc",
    front: { en: "A circuit has a 12 V battery and 4 Ω resistance. What is the current?", km: "សៀគ្វីមានថ្ម ១២ វ៉ុល និងភាពទប់ទល់ ៤ អូម។ តើចរន្តប៉ុន្មាន?" },
    back: { en: "3 amps", km: "3 amps" },
    typed: { accept: ["3", "3 a", "3 amps"] },
  },
  {
    id: "series-circuit",
    front: { en: "In a series circuit, what happens if one bulb breaks?", km: "ក្នុងសៀគ្វីជាប់ខ្សែសង្វាក់ បើអំពូលមួយដាច់ តើមានអ្វីកើតឡើង?" },
    back: { en: "The whole loop stops — the same current flows through every component.", km: "រង្វិលជុំទាំងមូលឈប់ — ចរន្តដូចគ្នាហូរកាត់សមាសធាតុទាំងអស់។" },
    typed: { accept: ["it stops", "whole circuit stops", "everything stops"] },
  },
  {
    id: "parallel-circuit",
    front: { en: "In a parallel circuit, what happens if one bulb breaks?", km: "ក្នុងសៀគ្វីប៉ារ៉ាឡែល បើអំពូលមួយដាច់ តើមានអ្វីកើតឡើង?" },
    back: { en: "The other branches keep working — each branch gets the full voltage.", km: "សាខាផ្សេងទៀតបន្តដំណើរការ — សាខានីមួយៗទទួលបានវ៉ុលពេញ។" },
    typed: { accept: ["the rest keep working", "others still work"] },
  },
  {
    id: "unit-force",
    front: { en: "What is the SI unit of force?", km: "តើឯកតា SI នៃកម្លាំងគឺជាអ្វី?" },
    back: { en: "newton (N)", km: "newton (N)" },
    typed: { accept: ["newton", "newtons", "n"] },
  },
];

/* ---------- maths ----------
Generated rather than stored. Difficulty scales the operand range so the
exam can be a step harder than practice.
--------------------------------- */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function makeMathItems(count, difficulty = 1) {
  const max = difficulty > 1 ? 15 : 12;
  const items = [];
  const seen = new Set();

  let guard = 0;
  while (items.length < count && guard++ < count * 40) {
    const ops = difficulty > 1 ? ["+", "−", "×", "×"] : ["+", "−", "×"];
    const op = ops[randInt(0, ops.length - 1)];
    let a = randInt(2, max);
    let b = randInt(2, max);
    if (op === "−" && b > a) [a, b] = [b, a]; // keep results non-negative
    const key = `${a}${op}${b}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const result = op === "+" ? a + b : op === "−" ? a - b : a * b;
    const text = `${a} ${op} ${b}`;
    items.push({
      id: key,
      front: { en: `${text} = ?`, km: `${text} = ?` },
      back: { en: String(result), km: String(result) },
      typed: { accept: [String(result)] },
      numeric: result,
    });
  }
  return items;
}

/* ---------- access ---------- */
const FLAT_BANKS = { grammar: GRAMMAR_BANK, history: HISTORY_BANK, physics: PHYSICS_BANK };

// deckId is optional — when given (and the subject has a fixed bank),
// items due for spaced-repetition review are drawn first, then topped up
// with whatever else is left, so "due today" actually shapes what a
// practice/exam session serves rather than just being a counter on Home.
export function bankFor(subject, count = 12, difficulty = 1, deckId = null) {
  if (subject === "math") return makeMathItems(count, difficulty);
  const pool = FLAT_BANKS[subject] ?? [];
  if (!deckId) return shuffle(pool).slice(0, count);

  const dueIds = new Set(getDueItemIds(deckId, pool.map((it) => it.id)));
  const due = shuffle(pool.filter((it) => dueIds.has(it.id)));
  const rest = shuffle(pool.filter((it) => !dueIds.has(it.id)));
  return [...due, ...rest].slice(0, count);
}

export function bankSize(subject) {
  if (subject === "math") return Infinity;
  return FLAT_BANKS[subject]?.length ?? 0;
}

// math's bank is generated fresh on every draw (see makeMathItems), so its
// items have no stable identity to schedule spaced-repetition reviews
// against — only subjects with one of the fixed banks above qualify.
export function hasFixedBank(subject) {
  return Boolean(FLAT_BANKS[subject]);
}

export function bankItemIds(subject) {
  return (FLAT_BANKS[subject] ?? []).map((item) => item.id);
}

export function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ---------- multiple choice ----------
Distractors are drawn from other items' answers so every option is
plausible. Maths gets near-miss numbers instead, which is a much better
test than three random integers.
--------------------------------- */

// Builds options for an already-chosen set of items, rather than drawing
// its own — lets the exam draw one unique batch and split it across modes
// without the multiple-choice half and the typed half risking overlap.
export function buildChoicesForItems(items, subject) {
  if (subject === "math") {
    return items.map((item) => {
      const near = new Set();
      const offsets = [1, -1, 2, -2, 10, -10];
      for (const d of shuffle(offsets)) {
        const v = item.numeric + d;
        if (v !== item.numeric && v >= 0) near.add(String(v));
        if (near.size === 3) break;
      }
      const options = shuffle([item.back.en, ...near]).map((v) => ({ en: v, km: v }));
      return { item, options, correct: item.back };
    });
  }

  const pool = FLAT_BANKS[subject] ?? GRAMMAR_BANK;
  return items.map((item) => {
    const distractors = shuffle(pool.filter((x) => x.id !== item.id))
      .slice(0, 3)
      .map((x) => x.back);
    return { item, options: shuffle([item.back, ...distractors]), correct: item.back };
  });
}

export function buildChoiceQuestions(subject, count, difficulty = 1, deckId = null) {
  return buildChoicesForItems(bankFor(subject, count, difficulty, deckId), subject);
}

/* ---------- typed answer checking ---------- */

const KHMER_DIGITS = "០១២៣៤៥៦៧៨៩";

export function normalizeAnswer(str) {
  return String(str ?? "")
    .trim()
    .toLowerCase()
    // Khmer numerals answer the same question as Arabic ones.
    .replace(/[០-៩]/g, (d) => String(KHMER_DIGITS.indexOf(d)))
    .replace(/[.,!?;:"'`៖។]/g, "")
    .replace(/\s+/g, " ");
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length || !b.length) return Math.max(a.length, b.length);
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = row;
  }
  return prev[b.length];
}

/* Returns "correct" | "close" | "wrong". "close" is a single typo away —
   worth telling the learner rather than just marking it wrong. */
export function checkTyped(input, item, subject) {
  const given = normalizeAnswer(input);
  if (!given) return "wrong";

  // Only the expected side counts — otherwise typing the question back
  // would be marked correct.
  const expected = typedExpected(item);
  const accepted = [...(item.typed?.accept ?? []), expected?.en, expected?.km]
    .filter(Boolean)
    .map(normalizeAnswer);

  if (accepted.includes(given)) return "correct";
  // Long answers get a proportional tolerance, short ones a single edit.
  for (const target of accepted) {
    const tolerance = target.length > 12 ? 2 : 1;
    if (levenshtein(given, target) <= tolerance) return "close";
  }
  return "wrong";
}

/* The prompt shown in "type the answer" mode: the question on the front,
   checked against the answer on the back. */
export function typedPrompt(item) {
  return item.front;
}

export function typedExpected(item) {
  return item.back;
}
