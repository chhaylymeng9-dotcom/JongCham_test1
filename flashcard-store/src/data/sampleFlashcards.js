/* Sample deck for previewing FlashcardStudy. Swap for real data — the
component only cares about the { id, term, pinyin, translation, audioUrl }
shape. audioUrl is left out here since there's no audio backend in this
demo; the speaker button just disables itself when it's missing. */
export const SAMPLE_DECK = [
  { id: 1, term: "爱", pinyin: "ài", translation: "love" },
  { id: 2, term: "你好", pinyin: "nǐ hǎo", translation: "hello" },
  { id: 3, term: "谢谢", pinyin: "xièxie", translation: "thank you" },
  { id: 4, term: "朋友", pinyin: "péngyou", translation: "friend" },
  { id: 5, term: "学习", pinyin: "xuéxí", translation: "to study" },
  { id: 6, term: "水", pinyin: "shuǐ", translation: "water" },
  { id: 7, term: "时间", pinyin: "shíjiān", translation: "time" },
  { id: 8, term: "家", pinyin: "jiā", translation: "home / family" },
  { id: 9, term: "快乐", pinyin: "kuàilè", translation: "happy" },
  { id: 10, term: "工作", pinyin: "gōngzuò", translation: "work" },
  { id: 11, term: "猫", pinyin: "māo", translation: "cat" },
  { id: 12, term: "书", pinyin: "shū", translation: "book" },
];
