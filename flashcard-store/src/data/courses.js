/* ---------- the course shop's catalogue ----------
What the Shop page (account/Shop.jsx) offers, in order. This is the shop
window, not the truth about content: `deckId` links an entry to a real
deck in decks.js, and lessons come from COURSES in lessons.js.

An entry with no curriculum behind it is marked `soon: true` and cannot be
bought. That is not decoration — buying a deck with no lessons used to
leave the course empty and crash the dashboard's Lessons tab (see the note
in LessonPath.jsx's COURSE_SUBJECTS). Write the lessons, drop the flag.

Prices are in stars, the in-app currency (storage.js), not money. The
real-money path to a deck is still the store's cart and a printed box.
--------------------------------- */

export const COURSE_GROUPS = [
  { id: "all", label: { en: "All courses", km: "វគ្គសិក្សាទាំងអស់" } },
  { id: "school", label: { en: "School subjects", km: "មុខវិជ្ជាសាលា" } },
  { id: "test", label: { en: "Language tests", km: "ការប្រឡងភាសា" } },
];

export const SHOP_COURSES = [
  {
    k: "math",
    deckId: "math",
    group: "school",
    icon: "math",
    c1: "#D69A6E",
    c2: "#8C5A46",
    price: 300,
    learners: "9.4k",
    name: { en: "Math", km: "គណិតវិទ្យា" },
    blurb: {
      en: "Mental arithmetic, fractions, percentages and word problems — twenty lessons from making ten to turning a question into a sum.",
      km: "គណនាក្នុងចិត្ត ប្រភាគ ភាគរយ និងលំហាត់ជាអត្ថបទ — មេរៀនម្ភៃ ចាប់ពីការបង្កើតដប់ រហូតដល់ការប្តូរសំណួរទៅជាការគណនា។",
    },
  },
  {
    k: "grammar",
    deckId: "grammar",
    group: "school",
    icon: "english",
    c1: "#5FA96D",
    c2: "#2C4032",
    price: 300,
    learners: "11.2k",
    name: { en: "English", km: "ភាសាអង់គ្លេស" },
    blurb: {
      en: "Sentences that hold together: subjects and verbs, agreement, tenses and the punctuation that changes meaning.",
      km: "ប្រយោគដែលរឹងមាំ៖ ប្រធានបទនិងកិរិយាស័ព្ទ ការឆប់គ្នា កាល និងវណ្ណយុត្តិដែលប្តូរអត្ថន័យ។",
    },
  },
  {
    k: "history",
    deckId: "history",
    group: "school",
    icon: "history",
    c1: "#D6B96E",
    c2: "#9A7B32",
    price: 300,
    learners: "5.8k",
    name: { en: "History", km: "ប្រវត្តិវិទ្យា" },
    blurb: {
      en: "Cambodian history in the order it happened, with the dates and names an exam actually asks for.",
      km: "ប្រវត្តិសាស្ត្រកម្ពុជាតាមលំដាប់ដែលកើតឡើង ជាមួយកាលបរិច្ឆេទនិងឈ្មោះដែលការប្រឡងសួរពិតប្រាកដ។",
    },
  },
  {
    k: "physics",
    deckId: "physics",
    group: "school",
    icon: "physics",
    c1: "#6F97D6",
    c2: "#3B5B8C",
    price: 300,
    learners: "4.6k",
    name: { en: "Physics", km: "រូបវិទ្យា" },
    blurb: {
      en: "Forces, motion and energy — the handful of ideas the rest of the syllabus keeps leaning on.",
      km: "កម្លាំង ចលនា និងថាមពល — គំនិតមួយចំនួនតូចដែលមេរៀនផ្សេងទៀតតែងតែពឹងផ្អែក។",
    },
  },
  {
    k: "khmer",
    group: "school",
    icon: "khmer",
    c1: "#E0A85C",
    c2: "#A2632B",
    price: 300,
    learners: "21.2k",
    soon: true,
    name: { en: "Khmer", km: "ភាសាខ្មែរ" },
    blurb: {
      en: "Khmer spelling, grammar and literature, taught in Khmer.",
      km: "អក្ខរាវិរុទ្ធ វេយ្យាករណ៍ និងអក្សរសាស្ត្រខ្មែរ បង្រៀនជាភាសាខ្មែរ។",
    },
  },
  {
    k: "chemistry",
    deckId: "chemistry",
    group: "school",
    icon: "chem",
    c1: "#7FD0C8",
    c2: "#2E8079",
    price: 300,
    learners: "6.7k",
    soon: true,
    name: { en: "Chemistry", km: "គីមីវិទ្យា" },
    blurb: {
      en: "Bonding, reactions and the mole — the printed deck exists; the course is being written.",
      km: "ចំណង ប្រតិកម្ម និងម៉ូល — សំណុំកាតបោះពុម្ពមានរួចហើយ; វគ្គសិក្សាកំពុងសរសេរ។",
    },
  },
  {
    k: "ielts",
    group: "test",
    icon: "ielts",
    c1: "#88C4E8",
    c2: "#2E6E9E",
    price: 500,
    learners: "9.6k",
    soon: true,
    name: { en: "IELTS", km: "IELTS" },
    blurb: {
      en: "Band-by-band preparation for all four papers, with model answers.",
      km: "ការត្រៀមតាមកម្រិតពិន្ទុ សម្រាប់ជំនាញទាំងបួន ជាមួយចម្លើយគំរូ។",
    },
  },
  {
    k: "toefl",
    group: "test",
    icon: "toefl",
    c1: "#F0A96B",
    c2: "#C0672A",
    price: 500,
    learners: "3.8k",
    soon: true,
    name: { en: "TOEFL", km: "TOEFL" },
    blurb: {
      en: "Academic English for the computer-based test, section by section.",
      km: "ភាសាអង់គ្លេសសិក្សា សម្រាប់ការប្រឡងតាមកុំព្យូទ័រ តាមផ្នែកម្តងមួយៗ។",
    },
  },
  {
    k: "hsk",
    group: "test",
    icon: "hsk",
    c1: "#EE8B86",
    c2: "#B2322F",
    price: 500,
    learners: "4.4k",
    soon: true,
    name: { en: "HSK", km: "HSK" },
    blurb: {
      en: "Mandarin from HSK 1 upward: characters, tones and the set vocabulary lists.",
      km: "ភាសាចិនចាប់ពី HSK ១ ឡើងទៅ៖ តួអក្សរ សំនៀង និងបញ្ជីវាក្យសព្ទកំណត់។",
    },
  },
];

export const COURSE_BY_KEY = Object.fromEntries(SHOP_COURSES.map((c) => [c.k, c]));
