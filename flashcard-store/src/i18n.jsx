import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStore, writeStore } from "./storage.js";

/* ---------- i18n ----------
Flat dot-namespaced keys, two locales. t() interpolates {name} style
placeholders and falls back English → key, so a missing translation shows
up as visible text rather than a crash.

Long-form content (lessons, question banks) is NOT stored here — those live
beside their data as { en, km } objects and are unwrapped with pick().
------------------------------- */

export const LANGUAGES = [
  { id: "en", label: "EN", name: "English" },
  { id: "km", label: "ខ្មែរ", name: "ភាសាខ្មែរ" },
];

const STRINGS = {
  // ---------- shell ----------
  "brand.name": { en: "JongCham", km: "ចង់ចាំ" },
  "brand.tagline": {
    en: "Physical flashcards · made to order",
    km: "កាតសិក្សាជាក់ស្តែង · ផលិតតាមការបញ្ជាទិញ",
  },
  "nav.store": { en: "Home", km: "ទំព័រដើម" },
  "nav.about": { en: "About", km: "អំពីយើង" },
  "nav.contact": { en: "Contact", km: "ទំនាក់ទំនង" },
  "nav.orders": { en: "My orders", km: "ការបញ្ជាទិញ" },
  "nav.cart": { en: "Cart", km: "កន្ត្រក" },
  "nav.account": { en: "Account", km: "គណនី" },
  "nav.backToStore": { en: "Back to store", km: "ត្រឡប់ទៅហាង" },
  "nav.menu": { en: "Menu", km: "ម៉ឺនុយ" },
  "nav.language": { en: "Language", km: "ភាសា" },

  // ---------- common ----------
  "common.back": { en: "Back", km: "ត្រឡប់ក្រោយ" },
  "common.continue": { en: "Continue", km: "បន្ត" },
  "common.next": { en: "Next", km: "បន្ទាប់" },
  "common.previous": { en: "Previous", km: "មុន" },
  "common.total": { en: "Total", km: "សរុប" },
  "common.subtotal": { en: "Subtotal", km: "សរុបរង" },
  "common.price": { en: "Price", km: "តម្លៃ" },
  "common.quantity": { en: "Quantity", km: "ចំនួន" },
  "common.remove": { en: "Remove", km: "លុបចេញ" },
  "common.optional": { en: "optional", km: "ស្រេចចិត្ត" },
  "common.print": { en: "Print", km: "បោះពុម្ព" },
  "common.start": { en: "Start", km: "ចាប់ផ្តើម" },
  "common.finish": { en: "Finish", km: "បញ្ចប់" },
  "common.score": { en: "Score", km: "ពិន្ទុ" },
  "common.correct": { en: "Correct", km: "ត្រឹមត្រូវ" },
  "common.incorrect": { en: "Incorrect", km: "មិនត្រឹមត្រូវ" },
  "common.date": { en: "Date", km: "កាលបរិច្ឆេទ" },
  "common.free": { en: "Free", km: "ឥតគិតថ្លៃ" },
  "common.deck": { en: "Deck", km: "សំណុំកាត" },
  "common.card": { en: "Card", km: "កាត" },
  "common.cards": { en: "cards", km: "កាត" },
  "common.front": { en: "Front", km: "ខាងមុខ" },
  "common.back_side": { en: "Back", km: "ខាងក្រោយ" },
  "common.demo": { en: "Demo", km: "សាកល្បង" },
  "common.close": { en: "Close", km: "បិទ" },
  "card.frontEmpty": { en: "Your text here", km: "អត្ថបទរបស់អ្នកនៅទីនេះ" },
  "card.backEmpty": { en: "The answer goes here", km: "ចម្លើយនៅទីនេះ" },
  /* flip hints printed over the template's wave footer art */
  "card.tapReveal": { en: "Tap to reveal the answer", km: "ចុចដើម្បីបើកមើលចម្លើយ" },
  "card.tapBack": { en: "Tap to go back to the question", km: "ចុចដើម្បីត្រឡប់ទៅសំណួរវិញ" },
  "common.questionLabel": { en: "Question", km: "សំណួរ" },
  "common.answerLabel": { en: "Answer", km: "ចម្លើយ" },

  // ---------- hero ----------
  "hero.eyebrow": { en: "Made to order in Phnom Penh", km: "ផលិតតាមបញ្ជាទិញនៅភ្នំពេញ" },
  "hero.title1": { en: "Learn faster,", km: "រៀនលឿនជាង" },
  "hero.title2": { en: "remember", km: "ចងចាំបាន" },
  "hero.title3": { en: "longer.", km: "យូរជាង។" },
  "hero.body": {
    en: "Printed on real uncoated cardstock, cut to pocket size, and laid out card-by-card by you before it goes to press. Every deck comes with online lessons, practice drills and a certification exam.",
    km: "បោះពុម្ពលើក្រដាសក្រាសពិតប្រាកដ កាត់ជាទំហំដាក់ហោប៉ៅ ហើយរចនាម្តងមួយកាតដោយអ្នកមុននឹងបញ្ចូលទៅម៉ាស៊ីនបោះពុម្ព។ រាល់សំណុំកាតមានមេរៀនអនឡាញ លំហាត់អនុវត្ត និងការប្រឡងយកវិញ្ញាបនបត្រ។",
  },
  "hero.cta": { en: "Design your deck", km: "រចនាសំណុំកាតរបស់អ្នក" },
  "hero.ctaSecondary": { en: "See what's included", km: "មើលអ្វីដែលមានភ្ជាប់" },
  "hero.badge1": { en: "Ships in 3 days", km: "ដឹកជញ្ជូនក្នុង ៣ ថ្ងៃ" },
  "hero.badge2": { en: "100lb uncoated stock", km: "ក្រដាសក្រាស ១០០lb" },
  "hero.badge3": { en: "ABA KHQR & cards", km: "ABA KHQR និងកាតធនាគារ" },
  "hero.flipHint": { en: "Tap the card to flip", km: "ចុចលើកាតដើម្បីត្រឡប់" },

  // ---------- value props ----------
  "value.eyebrow": { en: "What you get", km: "អ្វីដែលអ្នកទទួលបាន" },
  "value.title": { en: "A printed deck, and everything around it.", km: "សំណុំកាតបោះពុម្ព និងអ្វីៗទាំងអស់ជុំវិញវា។" },
  "value.1.title": { en: "Design every card", km: "រចនារាល់កាត" },
  "value.1.body": {
    en: "Write both sides of every card, pick your stock colour, lettering and back layout, and watch it update live.",
    km: "សរសេរទាំងសងខាងនៃរាល់កាត ជ្រើសរើសពណ៌ក្រដាស ពុម្ពអក្សរ និងប្លង់ខាងក្រោយ ហើយមើលការផ្លាស់ប្តូរភ្លាមៗ។",
  },
  "value.2.title": { en: "Pay the way you already do", km: "ទូទាត់តាមរបៀបដែលអ្នកធ្លាប់ប្រើ" },
  "value.2.body": {
    en: "ABA KHQR for any Cambodian banking app, or Visa and Mastercard for everyone else.",
    km: "ABA KHQR សម្រាប់កម្មវិធីធនាគារកម្ពុជាណាមួយ ឬកាត Visa និង Mastercard សម្រាប់អតិថិជនផ្សេងទៀត។",
  },
  "value.3.title": { en: "Lessons in your account", km: "មេរៀនក្នុងគណនីរបស់អ្នក" },
  "value.3.body": {
    en: "Scan the code in the box to unlock structured lessons that explain the material behind the cards.",
    km: "ស្កេនកូដក្នុងប្រអប់ដើម្បីបើកមេរៀនរៀបចំជាជំហានៗ ដែលពន្យល់ខ្លឹមសារនៅពីក្រោយកាតនីមួយៗ។",
  },
  "value.4.title": { en: "Practice, then certify", km: "អនុវត្ត រួចយកវិញ្ញាបនបត្រ" },
  "value.4.body": {
    en: "Four drill modes to practise with, and a timed exam that issues a printable certificate when you pass.",
    km: "លំហាត់អនុវត្ត ៤ ប្រភេទ និងការប្រឡងកំណត់ពេល ដែលចេញវិញ្ញាបនបត្រអាចបោះពុម្ពបាននៅពេលអ្នកជាប់។",
  },
  "value.sub": {
    en: "One box, four things working together — design it, pay for it your way, learn from it, and walk out with proof you know the material.",
    km: "ប្រអប់តែមួយ ប៉ុន្តែមានបួនយ៉ាងធ្វើការរួមគ្នា — រចនាវា ទូទាត់តាមរបៀបដែលអ្នកធ្លាប់ រៀនពីវា និងដើរចេញមកវិញជាមួយភស្តុតាងថាអ្នកចេះមេរៀនពិត។",
  },
  "value.1.tag1": { en: "Live preview", km: "មើលជាមុនផ្ទាល់" },
  "value.1.tag2": { en: "4 stocks", km: "ក្រដាស ៤ ប្រភេទ" },
  "value.2.tag1": { en: "No account needed", km: "មិនចាំបាច់មានគណនី" },
  "value.3.tag1": { en: "Unlocks instantly", km: "ដោះសោភ្លាមៗ" },
  "value.4.tag1": { en: "4 drill modes", km: "របៀបហាត់ ៤ ប្រភេទ" },
  "value.4.tag2": { en: "Printable", km: "អាចបោះពុម្ពបាន" },
  "value.fact1": { en: "cards per deck", km: "កាតក្នុងមួយសំណុំ" },
  "value.fact2": { en: "drill modes", km: "របៀបហាត់" },
  "value.fact3num": { en: "3–5 days", km: "3–5 ថ្ងៃ" },
  "value.fact3": { en: "printed & shipped", km: "បោះពុម្ព និងដឹកជញ្ជូន" },
  "value.ship": { en: "Free delivery inside Phnom Penh", km: "ដឹកជញ្ជូនឥតគិតថ្លៃក្នុងភ្នំពេញ" },

  // ---------- counter ----------
  "counter.eyebrow": { en: "The record", km: "កំណត់ត្រា" },
  "counter.title": { en: "Everything we have made, counted.", km: "អ្វីគ្រប់យ៉ាងដែលយើងបានផលិត រាប់ជាលេខ។" },
  "counter.body": {
    en: "Real figures from the Phnom Penh workshop, closed at the end of every month. Nothing rounded up.",
    km: "តួលេខពិតប្រាកដពីសិល្បសាលានៅភ្នំពេញ បិទបញ្ជីរាល់ចុងខែ។ គ្មានការបង្គត់ទេ។",
  },
  "counter.printed.label": { en: "Printed", km: "បោះពុម្ព" },
  "counter.printed.heading": { en: "Cards printed", km: "កាតបានបោះពុម្ព" },
  "counter.printed.body": {
    en: "Made to order — none of it sat in a warehouse first.",
    km: "ផលិតតាមការបញ្ជាទិញ — គ្មានមួយណាដាក់ក្នុងឃ្លាំងជាមុននោះទេ។",
  },
  "counter.shipped.label": { en: "Shipped", km: "បញ្ជូន" },
  "counter.shipped.heading": { en: "Boxes delivered", km: "ប្រអប់បានដឹកជញ្ជូន" },
  "counter.shipped.body": {
    en: "To students, parents and teachers across Cambodia.",
    km: "ទៅកាន់សិស្ស ឪពុកម្តាយ និងគ្រូបង្រៀននៅទូទាំងប្រទេសកម្ពុជា។",
  },
  "counter.studied.label": { en: "Studied", km: "សិក្សា" },
  "counter.studied.heading": { en: "Cards reviewed", km: "កាតបានពិនិត្យឡើងវិញ" },
  "counter.studied.body": {
    en: "The half of the product that comes free with the box.",
    km: "ជាផ្នែកកន្លះនៃផលិតផល ដែលមកជាមួយប្រអប់ដោយឥតគិតថ្លៃ។",
  },
  "counter.passed.label": { en: "Passed", km: "ជាប់" },
  "counter.passed.heading": { en: "Certificates issued", km: "វិញ្ញាបនបត្របានចេញ" },
  "counter.passed.body": {
    en: "Decks finished with a timed exam at 70% or better.",
    km: "សំណុំកាតបានបញ្ចប់ជាមួយការប្រឡងកំណត់ពេលយ៉ាងតិច ៧០%។",
  },
  // ---------- device showcase ----------
  "devices.eyebrow": { en: "No app needed", km: "មិនចាំបាច់មានកម្មវិធី" },
  "devices.title": { en: "Study on whatever's in your hand.", km: "រៀនតាមឧបករណ៍ណាមួយដែលអ្នកមាន។" },
  "devices.body": {
    en: "The code inside your box opens the same lessons, practice drills and exam in any browser — phone or computer, nothing to download.",
    km: "កូដដែលនៅក្នុងប្រអប់របស់អ្នកបើកមេរៀន លំហាត់អនុវត្ត និងការប្រឡងដូចគ្នានៅលើកម្មវិធីរុករកណាមួយ — ទូរស័ព្ទ ឬកុំព្យូទ័រ គ្មានអ្វីត្រូវទាញយកឡើយ។",
  },
  "devices.point1": { en: "Runs in the browser — no app to install", km: "ដំណើរការក្នុងកម្មវិធីរុករក — មិនចាំបាច់ដំឡើងកម្មវិធី" },
  "devices.point2": { en: "Free with the box you bought, no card needed", km: "ឥតគិតថ្លៃជាមួយប្រអប់ដែលអ្នកបានទិញ គ្មានតម្រូវឱ្យប្រើកាតទូទាត់" },
  "devices.downloadOn": { en: "Download on the", km: "ទាញយកនៅលើ" },
  "devices.appStore": { en: "App Store", km: "App Store" },
  "devices.getItOn": { en: "Get it on", km: "ទទួលបាននៅលើ" },
  "devices.googlePlay": { en: "Google Play", km: "Google Play" },

  // ---------- testimonials ----------
  "testimonials.eyebrow": { en: "From the first boxes", km: "ពីប្រអប់ដំបូងៗ" },
  "testimonials.title": { en: "What students say.", km: "អ្វីដែលសិស្សនិយាយ។" },
  "testimonials.summary": { en: "from {n} reviews", km: "ពីមតិវាយតម្លៃ {n}" },
  "testimonials.railLabel": { en: "Student reviews, use arrow keys", km: "មតិសិស្ស, ប្រើគ្រាប់ចុចព្រួញ" },

  // ---------- invite a friend ----------
  "community.title1": { en: "Invite a friend,", km: "អញ្ជើញមិត្តភក្តិ" },
  "community.title2": { en: "no need to revise alone.", km: "លែងត្រូវរៀនតែឯងទៀតហើយ។" },
  "community.body": {
    en: "Every JongCham box grows the study circle — send a friend your invite, swap decks, trade exam tips, and keep each other on streak.",
    km: "រាល់ប្រអប់ JongCham ពង្រីករង្វង់សិក្សា — ផ្ញើការអញ្ជើញទៅមិត្តភក្តិ ផ្លាស់ប្តូរសំណុំកាត ចែករំលែកគន្លឹះប្រឡង និងរៀនជាមួយគ្នារាល់ថ្ងៃ។",
  },
  "community.cta": { en: "Invite a Friend", km: "អញ្ជើញមិត្តភក្តិ" },
  "community.bubble1": { en: "Study with us!", km: "រៀនជាមួយយើង!" },
  "community.bubble2": { en: "Quiz night?", km: "យប់ធ្វើតេស្តវិញ?" },
  "community.bubble3": { en: "Ready?", km: "ត្រៀមរួចហើយទេ?" },
  "community.aria": {
    en: "Illustration of a student inviting friends into the JongCham study circle",
    km: "រូបភាពសិស្សកំពុងអញ្ជើញមិត្តភក្តិចូលរង្វង់សិក្សា JongCham",
  },

  // ---------- deck catalogue ----------
  "decks.eyebrow": { en: "Step 1 — pick a deck", km: "ជំហានទី១ — ជ្រើសរើសសំណុំកាត" },
  "decks.title": { en: "Start from a format.", km: "ចាប់ផ្តើមពីទម្រង់មួយ។" },
  "decks.subtitle": {
    en: "Each format sets the card count, the back layout and the online course that comes with it.",
    km: "ទម្រង់នីមួយៗកំណត់ចំនួនកាត ប្លង់ខាងក្រោយ និងវគ្គសិក្សាអនឡាញដែលភ្ជាប់មកជាមួយ។",
  },
  "decks.selected": { en: "Selected", km: "បានជ្រើសរើស" },
  "decks.select": { en: "Select", km: "ជ្រើសរើស" },
  "decks.includes": { en: "What's included", km: "អ្វីដែលមានភ្ជាប់" },
  "decks.cardCount": { en: "{n} cards", km: "កាត {n} សន្លឹក" },
  "decks.popular": { en: "Most popular", km: "ពេញនិយមបំផុត" },
  "decks.from": { en: "from", km: "ចាប់ពី" },
  "decks.readyNote": {
    en: "Pre-made by us — no design step needed, ships exactly as described.",
    km: "រៀបចំរួចដោយយើង — មិនចាំបាច់រចនាទេ បោះពុម្ពដូចដែលបានពិពណ៌នា។",
  },
  "decks.customNote": {
    en: "Blank canvas — design every card in the builder, then we print and ship.",
    km: "ផ្ទាំងទទេ — រចនាកាតនីមួយៗនៅក្នុងកម្មវិធីរចនា រួចយើងនឹងបោះពុម្ព និងដឹកជញ្ជូន។",
  },
  "decks.viewPhoto": { en: "View packaging photo", km: "មើលរូបភាពប្រអប់" },
  "decks.viewCard": { en: "Preview a card", km: "មើលគំរូកាត" },
  "decks.keepLooking": { en: "Keep looking", km: "បន្តមើលទៀត" },
  "decks.choose": { en: "Choose this set", km: "ជ្រើសរើសសំណុំនេះ" },
  "decks.stat.lessonCount": { en: "{n} lessons", km: "មេរៀន {n}" },

  // ---------- customizer ----------
  "custom.eyebrow": { en: "Step 2 — design it", km: "ជំហានទី២ — រចនាវា" },
  "custom.title": { en: "Lay out your deck, card by card.", km: "រៀបចំសំណុំកាតរបស់អ្នក ម្តងមួយសន្លឹក។" },
  "custom.subtitle": {
    en: "Everything here prints exactly as you see it. Add as many cards as your deck holds.",
    km: "អ្វីៗនៅទីនេះនឹងបោះពុម្ពដូចអ្វីដែលអ្នកឃើញ។ បន្ថែមកាតបានតាមចំណុះនៃសំណុំកាតរបស់អ្នក។",
  },
  "custom.customizeTitle": { en: "Design every card yourself.", km: "រចនារាល់កាតដោយខ្លួនឯង។" },
  "custom.customizeSubtitle": {
    en: "This format is a blank canvas — lay out all of your cards on their own page.",
    km: "ទម្រង់នេះជាផ្ទាំងទទេ — រៀបចំកាតទាំងអស់របស់អ្នកនៅលើទំព័រផ្ទាល់ខ្លួន។",
  },
  "custom.customizeBody": {
    en: "You control every word on every card. Head to the builder to write the front and back, choose a style, and see it update live.",
    km: "អ្នកគ្រប់គ្រងរាល់ពាក្យលើរាល់កាត។ ចូលទៅកាន់កម្មវិធីរចនា ដើម្បីសរសេរខាងមុខ និងខាងក្រោយ ជ្រើសរើសរចនាបថ ហើយមើលការផ្លាស់ប្តូរភ្លាមៗ។",
  },
  "custom.customizeCta": { en: "Start designing →", km: "ចាប់ផ្តើមរចនា →" },
  "custom.howTitle": { en: "How it works", km: "របៀបដំណើរការ" },
  "custom.how1Title": { en: "Design one card free", km: "រចនាកាតទីមួយឥតគិតថ្លៃ" },
  "custom.how1Body": {
    en: "No payment needed to try the builder — write both sides, pick a style, and see exactly how it prints.",
    km: "មិនចាំបាច់បង់ប្រាក់ដើម្បីសាកល្បងកម្មវិធីរចនានោះទេ — សរសេរទាំងសងខាង ជ្រើសរើសរចនាបថ ហើយមើលពីរបៀបដែលវានឹងបោះពុម្ព។",
  },
  "custom.how2Title": { en: "Pay once, unlock the rest", km: "បង់ម្តង ដោះសោកាតដែលនៅសល់" },
  "custom.how2Body": {
    en: "Checkout issues an activation code. Sign in with it under My Account to design every remaining card in the set.",
    km: "ការទូទាត់នឹងចេញកូដដំណើរការ។ ចូលគណនីដោយប្រើកូដនោះ ដើម្បីរចនារាល់កាតដែលនៅសល់ក្នុងសំណុំ។",
  },
  "custom.how3Title": { en: "Ships in 3 days", km: "ដឹកជញ្ជូនក្នុងរយៈពេល ៣ ថ្ងៃ" },
  "custom.how3Body": {
    en: "Once every card is designed, the set goes straight to press — printed and shipped from Phnom Penh.",
    km: "នៅពេលកាតទាំងអស់រចនារួច សំណុំនោះនឹងបញ្ជូនទៅបោះពុម្ពភ្លាម — បោះពុម្ព និងដឹកជញ្ជូនចេញពីភ្នំពេញ។",
  },
  "custom.previewEyebrow": { en: "Step 2 — try it free", km: "ជំហានទី២ — សាកល្បងឥតគិតថ្លៃ" },
  "custom.previewTitle": { en: "Design a free preview card.", km: "រចនាកាតសាកល្បងឥតគិតថ្លៃ។" },
  "custom.previewSubtitle": {
    en: "See exactly how your card prints. The other cards unlock right after checkout.",
    km: "មើលពីរបៀបដែលកាតរបស់អ្នកនឹងបោះពុម្ព។ កាតដែលនៅសល់នឹងបើកភ្លាមបន្ទាប់ពីទូទាត់។",
  },
  "custom.previewNote": {
    en: "Free preview card — the other {n} unlock after checkout.",
    km: "កាតសាកល្បងឥតគិតថ្លៃ — {n} កាតទៀតនឹងបើកបន្ទាប់ពីទូទាត់។",
  },
  "custom.previewButton": { en: "Preview", km: "មើលជាមុន" },
  "custom.previewBlanksNote": {
    en: "This is your one free preview card — head to checkout, then design the rest from My Account.",
    km: "នេះជាកាតសាកល្បងឥតគិតថ្លៃរបស់អ្នក — បន្តទៅការទូទាត់ រួចរចនាកាតដែលនៅសល់នៅក្នុងគណនីរបស់ខ្ញុំ។",
  },
  "custom.cardsTab": { en: "Cards", km: "កាត" },
  "custom.styleTab": { en: "Style", km: "រចនាបថ" },
  "custom.bulkTab": { en: "Bulk add", km: "បញ្ចូលច្រើន" },
  "custom.frontText": { en: "Front text", km: "អត្ថបទខាងមុខ" },
  "custom.backText": { en: "Back text", km: "អត្ថបទខាងក្រោយ" },
  "custom.frontPlaceholder": { en: "e.g. Photosynthesis", km: "ឧ. រស្មីសំយោគ" },
  "custom.backPlaceholder": { en: "e.g. How plants turn light into food", km: "ឧ. របៀបដែលរុក្ខជាតិប្រែពន្លឺជាអាហារ" },
  "custom.linePlaceholder": { en: "Add another line…", km: "បន្ថែមបន្ទាត់មួយទៀត…" },
  "custom.addLine": { en: "Add line", km: "បន្ថែមបន្ទាត់" },
  "custom.removeLine": { en: "Remove line", km: "លុបបន្ទាត់" },
  "custom.frontImage": { en: "Front image (optional)", km: "រូបភាពខាងមុខ (ស្រេចចិត្ត)" },
  "custom.backImage": { en: "Back image (optional)", km: "រូបភាពខាងក្រោយ (ស្រេចចិត្ត)" },
  "custom.addImage": { en: "Add image", km: "បន្ថែមរូបភាព" },
  "custom.changeImage": { en: "Change image", km: "ប្តូររូបភាព" },
  "custom.removeBackground": { en: "Cut background", km: "កាត់ផ្ទៃខាងក្រោយ" },
  "custom.removingBackground": { en: "Cutting… {pct}%", km: "កំពុងកាត់… {pct}%" },
  "custom.bgRemoveError": {
    en: "Couldn't cut the background — try a different photo.",
    km: "មិនអាចកាត់ផ្ទៃខាងក្រោយបានទេ — សូមសាកល្បងរូបភាពផ្សេង។",
  },
  "custom.imageWidth": { en: "Width", km: "ទទឹង" },
  "custom.imageHeight": { en: "Height", km: "កម្ពស់" },
  "custom.dragImageHint": {
    en: "Drag the text or image, and use the corner handles to resize.",
    km: "អូសអត្ថបទ ឬរូបភាព ហើយប្រើចំណុចទាញនៅជ្រុងដើម្បីប្តូរទំហំ។",
  },
  "custom.cardOf": { en: "Card {i} of {n}", km: "កាតទី {i} ក្នុងចំណោម {n}" },
  "custom.addCard": { en: "Add card", km: "បន្ថែមកាត" },
  "custom.duplicate": { en: "Duplicate", km: "ចម្លង" },
  "custom.deleteCard": { en: "Delete card", km: "លុបកាត" },
  "custom.deckFull": { en: "This deck holds {n} cards — that's all of them.", km: "សំណុំកាតនេះផ្ទុកបាន {n} សន្លឹក — គ្រប់ហើយ។" },
  "custom.filled": { en: "{done} of {n} designed", km: "រចនារួច {done} ក្នុងចំណោម {n}" },
  "custom.blanksNote": {
    en: "Cards you leave empty are printed blank — plenty of people want them that way.",
    km: "កាតដែលអ្នកទុកទទេនឹងបោះពុម្ពទទេ — អតិថិជនជាច្រើនចង់បានបែបនេះ។",
  },
  "custom.stock": { en: "Card stock", km: "ពណ៌ក្រដាស" },
  "custom.template": { en: "Card template", km: "ទម្រង់កាត" },
  "custom.templateQuestion": { en: "Question", km: "សំណួរ" },
  "custom.templateAnswer": { en: "Answer", km: "ចម្លើយ" },
  "custom.lettering": { en: "Lettering", km: "ពុម្ពអក្សរ" },
  "custom.textSize": { en: "Text size", km: "ទំហំអក្សរ" },
  "custom.size.sm": { en: "Small", km: "តូច" },
  "custom.size.md": { en: "Medium", km: "មធ្យម" },
  "custom.size.lg": { en: "Large", km: "ធំ" },
  "custom.backLayout": { en: "Back layout", km: "ប្លង់ខាងក្រោយ" },
  "custom.cardSize": { en: "Card size", km: "ទំហំកាត" },
  "custom.corners": { en: "Corners", km: "ជ្រុងកាត" },
  "custom.corner.square": { en: "Square", km: "ជ្រុងស្រួច" },
  "custom.corner.round": { en: "Rounded", km: "ជ្រុងមូល" },
  "custom.numbering": { en: "Print card numbers", km: "បោះពុម្ពលេខរៀងកាត" },
  "custom.numberingOn": { en: "On", km: "បើក" },
  "custom.numberingOff": { en: "Off", km: "បិទ" },
  "custom.notes": { en: "Note boxes", km: "ប្រអប់កំណត់ចំណាំ" },
  "custom.notesHint": {
    en: "A dashed callout you can drag anywhere on the card — a tip, a formula, an extra rule.",
    km: "ប្រអប់បន្ទាត់ដាច់ៗដែលអ្នកអាចអូសទៅដាក់កន្លែងណាមួយលើកាត — គន្លឹះ រូបមន្ត ឬច្បាប់បន្ថែម។",
  },
  "custom.addNote": { en: "Add note box", km: "បន្ថែមប្រអប់កំណត់ចំណាំ" },
  "custom.noteRuled": { en: "Ruled", km: "មានបន្ទាត់" },
  "custom.noteLabel": { en: "Your notes", km: "កំណត់ចំណាំរបស់អ្នក" },
  "custom.noteDefaultText": { en: "Note", km: "កំណត់ចំណាំ" },
  "custom.bulkTitle": { en: "Paste a list", km: "បិទភ្ជាប់បញ្ជី" },
  "custom.bulkHelp": {
    en: "One card per line, front and back separated by a hyphen, equals sign or tab.",
    km: "មួយកាតក្នុងមួយបន្ទាត់ ខាងមុខនិងខាងក្រោយបំបែកដោយសញ្ញា - ឬ = ឬ Tab។",
  },
  "custom.bulkPlaceholder": {
    en: "Photosynthesis = How plants turn light into food\nOsmosis = Water moving toward more solute",
    km: "រស្មីសំយោគ = របៀបដែលរុក្ខជាតិប្រែពន្លឺជាអាហារ\nអូស្មូស = ចលនាទឹកឆ្ពោះទៅរកសូលុយតេខ្ពស់",
  },
  "custom.bulkReplace": { en: "Replace all cards", km: "ជំនួសកាតទាំងអស់" },
  "custom.bulkAppend": { en: "Add to deck", km: "បន្ថែមទៅសំណុំកាត" },
  "custom.bulkParsed": { en: "{n} cards recognised", km: "ស្គាល់បាន {n} កាត" },
  "custom.bulkParsed_one": { en: "1 card recognised", km: "ស្គាល់បាន ១ កាត" },
  "custom.bulkOverflow": { en: "Only the first {n} will fit this deck.", km: "មានតែ {n} ដំបូងប៉ុណ្ណោះដែលដាក់ចូលសំណុំកាតនេះបាន។" },
  "custom.reset": { en: "Start over", km: "ចាប់ផ្តើមឡើងវិញ" },
  "custom.summary": { en: "Your build", km: "ការរចនារបស់អ្នក" },
  "custom.addToCart": { en: "Add deck to cart", km: "បន្ថែមទៅកន្ត្រក" },
  "custom.buyNow": { en: "Pay now", km: "ទូទាត់ឥឡូវ" },
  "custom.added": { en: "Added to cart", km: "បានបន្ថែមទៅកន្ត្រក" },
  "custom.basePrice": { en: "Base deck", km: "តម្លៃមូលដ្ឋាន" },
  "custom.howManyCards": { en: "How many cards?", km: "ចង់បានកាតប៉ុន្មានសន្លឹក?" },
  "custom.perCardPrice": { en: "{n} cards × ${price}", km: "កាត {n} សន្លឹក × ${price}" },
  "custom.sizeUpgrade": { en: "Size upgrade", km: "បង្កើនទំហំ" },
  "custom.finish": { en: "Finish", km: "ការបញ្ចប់លម្អ" },

  // ---------- cart ----------
  "cart.eyebrow": { en: "Your cart", km: "កន្ត្រករបស់អ្នក" },
  "cart.empty": { en: "Nothing here yet", km: "មិនទាន់មានអ្វីទេ" },
  "cart.emptyBody": {
    en: "Design a deck on the store page and add it to your cart.",
    km: "រចនាសំណុំកាតនៅទំព័រហាង រួចបន្ថែមទៅកន្ត្រករបស់អ្នក។",
  },
  "cart.items": { en: "{n} items", km: "{n} ធាតុ" },
  "cart.items_one": { en: "1 item", km: "១ ធាតុ" },
  "cart.checkout": { en: "Proceed to checkout", km: "បន្តទៅការទូទាត់" },
  "cart.keepShopping": { en: "Keep shopping", km: "បន្តទិញទំនិញ" },
  "cart.customCards": { en: "{n} cards written", km: "សរសេររួច {n} កាត" },
  "cart.customCards_one": { en: "1 card written", km: "សរសេររួច ១ កាត" },
  "cart.viewCards": { en: "View cards", km: "មើលកាត" },
  "cart.hideCards": { en: "Hide cards", km: "លាក់កាត" },
  "cart.shipping": { en: "Delivery", km: "ការដឹកជញ្ជូន" },
  "cart.shippingFree": { en: "Free in Phnom Penh", km: "ឥតគិតថ្លៃក្នុងភ្នំពេញ" },
  /* promo code — typed here, honoured again at checkout */
  "cart.promoTitle": { en: "Promo code", km: "កូដបញ្ចុះតម្លៃ" },
  "cart.promoVoucher": { en: "Use a voucher →", km: "ប្រើប័ណ្ណរង្វាន់ →" },
  "cart.promoPlaceholder": { en: "Enter a code", km: "បញ្ចូលកូដ" },
  "cart.promoApply": { en: "Apply", km: "ប្រើ" },
  "cart.promoHint": {
    en: "Codes look like BOX20 or SHIP00.",
    km: "កូដមានលក្ខណៈដូច BOX20 ឬ SHIP00។",
  },
  "cart.promoInvalid": {
    en: "That code isn't valid — check the spelling.",
    km: "កូដនេះមិនត្រឹមត្រូវទេ — សូមពិនិត្យអក្ខរាវិរុទ្ធ។",
  },
  "cart.promo": { en: "Promo · {code}", km: "កូដបញ្ចុះតម្លៃ · {code}" },

  // ---------- checkout ----------
  "checkout.step": { en: "Step {i} of 3", km: "ជំហានទី {i} ក្នុងចំណោម ៣" },
  "checkout.details": { en: "Delivery details", km: "ព័ត៌មានដឹកជញ្ជូន" },
  "checkout.detailsSub": {
    en: "We'll message you to confirm before anything goes to press.",
    km: "យើងនឹងទាក់ទងអ្នកដើម្បីបញ្ជាក់ មុននឹងចាប់ផ្តើមបោះពុម្ព។",
  },
  "checkout.name": { en: "Full name", km: "ឈ្មោះពេញ" },
  "checkout.namePlaceholder": { en: "Your full name", km: "ឈ្មោះពេញរបស់អ្នក" },
  "checkout.phone": { en: "Phone number", km: "លេខទូរស័ព្ទ" },
  "checkout.email": { en: "Email", km: "អ៊ីមែល" },
  "checkout.telegram": { en: "Telegram", km: "តេឡេក្រាម" },
  "checkout.location": { en: "Delivery address", km: "អាសយដ្ឋានដឹកជញ្ជូន" },
  "checkout.locationPlaceholder": { en: "House, street, sangkat, city", km: "ផ្ទះ ផ្លូវ សង្កាត់ ក្រុង" },
  "checkout.notes": { en: "Notes", km: "កំណត់សម្គាល់" },
  "checkout.notesPlaceholder": {
    en: "Landmark, gate code, preferred delivery time…",
    km: "ចំណុចសម្គាល់ លេខច្រកចូល ពេលវេលាដឹកជញ្ជូនដែលចង់បាន…",
  },
  "checkout.continueToPayment": { en: "Continue to payment", km: "បន្តទៅការទូទាត់" },
  "checkout.backToCart": { en: "Back to cart", km: "ត្រឡប់ទៅកន្ត្រក" },
  "checkout.errRequired": {
    en: "Name, phone, email and delivery address are all required.",
    km: "ឈ្មោះ លេខទូរស័ព្ទ អ៊ីមែល និងអាសយដ្ឋានដឹកជញ្ជូន គឺចាំបាច់ទាំងអស់។",
  },
  "checkout.errEmail": { en: "Enter a valid email address.", km: "សូមបញ្ចូលអ៊ីមែលឲ្យបានត្រឹមត្រូវ។" },
  "checkout.errPhone": { en: "Enter a valid phone number.", km: "សូមបញ្ចូលលេខទូរស័ព្ទឲ្យបានត្រឹមត្រូវ។" },

  "checkout.payment": { en: "Payment", km: "ការទូទាត់" },
  "checkout.paymentSub": { en: "Choose how you'd like to pay.", km: "ជ្រើសរើសរបៀបដែលអ្នកចង់ទូទាត់។" },
  "checkout.khqr": { en: "ABA KHQR", km: "ABA KHQR" },
  "checkout.khqrSub": { en: "Any Cambodian banking app", km: "កម្មវិធីធនាគារកម្ពុជាណាមួយ" },
  "checkout.card": { en: "Credit / debit card", km: "កាតឥណទាន / ឥណពន្ធ" },
  "checkout.cardSub": { en: "Visa, Mastercard, UnionPay", km: "Visa, Mastercard, UnionPay" },
  "checkout.khqrScan": { en: "Scan to pay", km: "ស្កេនដើម្បីទូទាត់" },
  "checkout.khqrHelp": {
    en: "Open your banking app, scan this code, and confirm the amount shown below.",
    km: "បើកកម្មវិធីធនាគាររបស់អ្នក ស្កេនកូដនេះ ហើយបញ្ជាក់ចំនួនទឹកប្រាក់ខាងក្រោម។",
  },
  "checkout.khqrRef": { en: "Reference", km: "លេខយោង" },
  "checkout.khqrAmount": { en: "Amount to pay", km: "ចំនួនត្រូវទូទាត់" },
  "checkout.cardNumber": { en: "Card number", km: "លេខកាត" },
  "checkout.cardName": { en: "Name on card", km: "ឈ្មោះលើកាត" },
  "checkout.cardNamePlaceholder": { en: "As printed on the card", km: "ដូចដែលបោះពុម្ពលើកាត" },
  "checkout.expiry": { en: "Expiry", km: "ថ្ងៃផុតកំណត់" },
  "checkout.cvc": { en: "CVC", km: "លេខ CVC" },
  "checkout.errCard": {
    en: "Check the card number — it doesn't look valid.",
    km: "សូមពិនិត្យលេខកាត — វាមើលទៅមិនត្រឹមត្រូវទេ។",
  },
  "checkout.errCardName": { en: "Enter the name printed on the card.", km: "សូមបញ្ចូលឈ្មោះដែលបោះពុម្ពលើកាត។" },
  "checkout.errExpiry": { en: "Enter a valid expiry date (MM/YY).", km: "សូមបញ្ចូលថ្ងៃផុតកំណត់ឲ្យបានត្រឹមត្រូវ (ខែ/ឆ្នាំ)។" },
  "checkout.errCvc": { en: "Enter the 3-digit code on the back.", km: "សូមបញ្ចូលលេខ ៣ ខ្ទង់នៅខាងក្រោយកាត។" },
  "checkout.payNow": { en: "Pay ${amount}", km: "ទូទាត់ ${amount}" },
  "checkout.confirmPaid": { en: "I've completed the payment", km: "ខ្ញុំបានទូទាត់រួចរាល់" },
  "checkout.processing": { en: "Processing…", km: "កំពុងដំណើរការ…" },
  "checkout.demoTitle": { en: "Demonstration checkout", km: "ការទូទាត់សាកល្បង" },
  "checkout.demoBody": {
    en: "No money moves and no card details are stored or sent anywhere — the form validates locally and stops there. Going live needs a payment provider such as ABA PayWay or Stripe connected behind it.",
    km: "គ្មានប្រាក់ត្រូវបានផ្ទេរ ហើយគ្មានព័ត៌មានកាតត្រូវបានរក្សាទុក ឬបញ្ជូនទៅកន្លែងណាទេ — ទម្រង់នេះគ្រាន់តែពិនិត្យក្នុងកម្មវិធីរុករកប៉ុណ្ណោះ។ ដើម្បីដំណើរការពិតប្រាកដ ត្រូវភ្ជាប់សេវាទូទាត់ដូចជា ABA PayWay ឬ Stripe។",
  },
  "checkout.secureNote": { en: "Card details are never stored", km: "ព័ត៌មានកាតមិនត្រូវបានរក្សាទុកឡើយ" },
  "checkout.backToDetails": { en: "Back to details", km: "ត្រឡប់ទៅព័ត៌មាន" },
  "checkout.summary": { en: "Order summary", km: "សេចក្តីសង្ខេបការបញ្ជាទិញ" },

  "checkout.confirmedEyebrow": { en: "Payment received", km: "បានទទួលការទូទាត់" },
  "checkout.confirmedTitle": { en: "Your order is confirmed", km: "ការបញ្ជាទិញរបស់អ្នកត្រូវបានបញ្ជាក់" },
  "checkout.orderId": { en: "Order ID", km: "លេខការបញ្ជាទិញ" },
  "checkout.activationTitle": { en: "Your activation code", km: "កូដដំណើរការរបស់អ្នក" },
  "checkout.activationBody": {
    en: "This code is printed inside your box too. Use it under \"My account\" to unlock the lessons, practice drills and exam for this deck.",
    km: "កូដនេះក៏បោះពុម្ពនៅក្នុងប្រអប់របស់អ្នកផងដែរ។ ប្រើវានៅ «គណនីរបស់ខ្ញុំ» ដើម្បីបើកមេរៀន លំហាត់ និងការប្រឡងសម្រាប់សំណុំកាតនេះ។",
  },
  "checkout.activationBodyCustom": {
    en: "This code is printed inside your box too. Use it under \"My account\" to design the rest of this deck's cards — the one you previewed doesn't reprint.",
    km: "កូដនេះក៏បោះពុម្ពនៅក្នុងប្រអប់របស់អ្នកផងដែរ។ ប្រើវានៅ «គណនីរបស់ខ្ញុំ» ដើម្បីរចនាកាតដែលនៅសល់ក្នុងសំណុំនេះ — កាតដែលអ្នកបានសាកល្បងរចនារួចមិនបោះពុម្ពម្តងទៀតទេ។",
  },
  "checkout.activationBodyMixed": {
    en: "These codes are printed inside your box too. Use them under \"My account\" to design the rest of your Customize Set's cards, or unlock the lessons, practice drills and exam for your other decks.",
    km: "កូដទាំងនេះក៏បោះពុម្ពនៅក្នុងប្រអប់របស់អ្នកផងដែរ។ ប្រើវានៅ «គណនីរបស់ខ្ញុំ» ដើម្បីរចនាកាតដែលនៅសល់ក្នុងសំណុំផ្ទាល់ខ្លួន ឬបើកមេរៀន លំហាត់ និងការប្រឡងសម្រាប់សំណុំកាតផ្សេងទៀត។",
  },
  "checkout.goToAccount": { en: "Open my account", km: "បើកគណនីរបស់ខ្ញុំ" },
  "checkout.designCards": { en: "Design your cards →", km: "រចនាកាតរបស់អ្នក →" },
  "checkout.deliveryEta": {
    en: "Estimated delivery: 3 days. We'll message {phone} before it ships.",
    km: "ការដឹកជញ្ជូនប៉ាន់ស្មាន៖ ៣ ថ្ងៃ។ យើងនឹងផ្ញើសារទៅ {phone} មុនពេលដឹកជញ្ជូន។",
  },

  // ---------- orders ----------
  "orders.eyebrow": { en: "My orders", km: "ការបញ្ជាទិញរបស់ខ្ញុំ" },
  "orders.empty": { en: "No orders yet", km: "មិនទាន់មានការបញ្ជាទិញ" },
  "orders.emptyBody": {
    en: "Orders placed on this device will show up here.",
    km: "ការបញ្ជាទិញដែលធ្វើឡើងលើឧបករណ៍នេះនឹងបង្ហាញនៅទីនេះ។",
  },
  "orders.count": { en: "{n} orders", km: "ការបញ្ជាទិញ {n}" },
  "orders.count_one": { en: "1 order", km: "ការបញ្ជាទិញ ១" },
  "orders.status.printing": { en: "In production", km: "កំពុងផលិត" },
  "orders.status.shipped": { en: "Out for delivery", km: "កំពុងដឹកជញ្ជូន" },
  "orders.status.delivered": { en: "Delivered", km: "បានដឹកជញ្ជូន" },
  "orders.viewInvoice": { en: "View invoice", km: "មើលវិក្កយបត្រ" },
  "orders.hideInvoice": { en: "Hide invoice", km: "លាក់វិក្កយបត្រ" },
  "orders.printInvoice": { en: "Print invoice", km: "បោះពុម្ពវិក្កយបត្រ" },
  "orders.invoice": { en: "Invoice", km: "វិក្កយបត្រ" },
  "orders.billedTo": { en: "Billed to", km: "ចេញវិក្កយបត្រជូន" },
  "orders.deliverTo": { en: "Deliver to", km: "ដឹកជញ្ជូនទៅ" },
  "orders.paymentMethod": { en: "Payment method", km: "មធ្យោបាយទូទាត់" },
  "orders.activationCode": { en: "Activation code", km: "កូដដំណើរការ" },
  "orders.customSubmitted": { en: "✓ Submitted for printing — {date}", km: "✓ បានបញ្ជូនទៅបោះពុម្ព — {date}" },
  "orders.customInProgress": { en: "Still designing — {done} of {n} cards done", km: "កំពុងរចនា — បានធ្វើ {done} ក្នុងចំណោម {n} កាត" },
  "orders.previewAllCards": { en: "Preview all cards", km: "មើលកាតទាំងអស់ជាមុន" },
  "orders.clear": { en: "Clear order history", km: "សម្អាតប្រវត្តិការបញ្ជាទិញ" },
  "orders.clearConfirm": {
    en: "Delete all saved orders on this device? This can't be undone.",
    km: "លុបការបញ្ជាទិញទាំងអស់នៅលើឧបករណ៍នេះ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។",
  },

  // ---------- account: sign in ----------
  "account.eyebrow": { en: "Activate your deck", km: "ដំណើរការសំណុំកាតរបស់អ្នក" },
  "account.signInTitle": { en: "Sign in with your box code", km: "ចូលដោយប្រើកូដក្នុងប្រអប់" },
  "account.signInBody": {
    en: "Scan the QR code inside your box, or type the code printed on the activation card. Each code works on one device at a time.",
    km: "ស្កេនកូដ QR ក្នុងប្រអប់របស់អ្នក ឬវាយបញ្ចូលកូដដែលបោះពុម្ពលើកាតដំណើរការ។ កូដនីមួយៗដំណើរការលើឧបករណ៍តែមួយក្នុងពេលតែមួយ។",
  },
  "account.yourName": { en: "Your name", km: "ឈ្មោះរបស់អ្នក" },
  "account.nameHint": { en: "This goes on your certificate", km: "ឈ្មោះនេះនឹងបង្ហាញលើវិញ្ញាបនបត្ររបស់អ្នក" },
  "account.code": { en: "Activation code", km: "កូដដំណើរការ" },
  "account.unlock": { en: "Unlock my deck", km: "បើកសំណុំកាតរបស់ខ្ញុំ" },
  "account.tryCodes": { en: "Demo codes", km: "កូដសាកល្បង" },
  "account.errCode": {
    en: "We don't recognise that code — check the card inside your box.",
    km: "យើងមិនស្គាល់កូដនេះទេ — សូមពិនិត្យកាតក្នុងប្រអប់របស់អ្នក។",
  },
  "account.errEmail": { en: "Enter the email you used at checkout.", km: "សូមបញ្ចូលអ៊ីមែលដែលអ្នកប្រើពេលទូទាត់។" },
  "account.errName": {
    en: "Enter your name — it goes on your certificate if you pass.",
    km: "សូមបញ្ចូលឈ្មោះរបស់អ្នក — វានឹងបង្ហាញលើវិញ្ញាបនបត្រ បើអ្នកប្រឡងជាប់។",
  },
  "account.errDevice": {
    en: "This code is already active on another device. Each code can only be signed in on one device at a time.",
    km: "កូដនេះកំពុងដំណើរការនៅលើឧបករណ៍ផ្សេងរួចហើយ។ កូដនីមួយៗអាចចូលបានតែលើឧបករណ៍មួយក្នុងពេលតែមួយ។",
  },

  // ---------- account: sign in / create account tabs ----------
  "account.tabSignIn": { en: "Sign in", km: "ចូល" },
  "account.tabCreate": { en: "Create account", km: "បង្កើតគណនី" },
  "account.createEyebrow": { en: "New here?", km: "អ្នកប្រើប្រាស់ថ្មី?" },
  "account.createTitle": { en: "Buy a deck, get an account", km: "ទិញសំណុំកាត ទទួលបានគណនី" },
  "account.createBody": {
    en: "There's no separate sign-up — checkout issues an activation code by email, and that code is what signs you in here.",
    km: "មិនចាំបាច់ចុះឈ្មោះដាច់ដោយឡែកនោះទេ — ការទូទាត់នឹងចេញកូដដំណើរការតាមអ៊ីមែល ហើយកូដនោះហើយប្រើសម្រាប់ចូលគណនីនៅទីនេះ។",
  },
  "account.createCta": { en: "Browse decks", km: "រកមើលសំណុំកាត" },
  "account.createSwap": { en: "Already have a code?", km: "មានកូដរួចហើយ?" },

  // ---------- account: dashboard ----------
  "account.yourDeck": { en: "Your deck", km: "សំណុំកាតរបស់អ្នក" },
  "account.signOut": { en: "Sign out", km: "ចាកចេញ" },
  "account.learner": { en: "Learner", km: "អ្នកសិក្សា" },
  "account.progress": { en: "Course progress", km: "វឌ្ឍនភាពវគ្គសិក្សា" },
  "account.bestScore": { en: "Best exam score", km: "ពិន្ទុប្រឡងល្អបំផុត" },
  "account.notTaken": { en: "Not taken", km: "មិនទាន់ប្រឡង" },
  "account.tab.lessons": { en: "Lessons", km: "មេរៀន" },
  "account.tab.practice": { en: "Practice", km: "លំហាត់" },
  "account.tab.exam": { en: "Exam", km: "ការប្រឡង" },
  "account.tab.certificates": { en: "Certificates", km: "វិញ្ញាបនបត្រ" },
  "account.tab.design": { en: "Design cards", km: "រចនាកាត" },
  "account.capacity": { en: "Deck capacity", km: "ចំណុះសំណុំកាត" },

  // ---------- account: design (Customize Set) ----------
  "design.eyebrow": { en: "Design your cards", km: "រចនាកាតរបស់អ្នក" },
  "design.savedHint": { en: "Saved automatically as you type.", km: "រក្សាទុកដោយស្វ័យប្រវត្តិខណៈអ្នកវាយបញ្ចូល។" },
  "design.allCardsHint": {
    en: "Design all {n} cards ({designed} done) to submit them for printing.",
    km: "រចនាកាតទាំង {n} ({designed} បានធ្វើរួច) ដើម្បីបញ្ជូនទៅបោះពុម្ព។",
  },
  "design.submitButton": { en: "Submit for printing →", km: "បញ្ជូនទៅបោះពុម្ព →" },
  "design.submitConfirm": {
    en: "Submit your deck for printing? Double-check every card first — this is what goes to press.",
    km: "បញ្ជូនសំណុំកាតរបស់អ្នកទៅបោះពុម្ពមែនទេ? សូមពិនិត្យរាល់កាតម្តងទៀតមុនសិន — នេះជាអ្វីដែលនឹងបោះពុម្ព។",
  },
  "design.submittedBanner": {
    en: "✓ Sent to print on {date} — we'll message you before it ships.",
    km: "✓ បានបញ្ជូនទៅបោះពុម្ពនៅថ្ងៃទី {date} — យើងនឹងផ្ញើសារទៅអ្នកមុននឹងដឹកជញ្ជូន។",
  },
  "design.resubmit": { en: "Made more changes? Submit again", km: "បានកែប្រែបន្ថែម? បញ្ជូនម្តងទៀត" },

  // ---------- lessons ----------
  "lesson.eyebrow": { en: "Course", km: "វគ្គសិក្សា" },
  "lesson.count": { en: "{n} lessons", km: "មេរៀន {n}" },
  "lesson.count_one": { en: "1 lesson", km: "មេរៀន ១" },
  "lesson.minutes": { en: "{n} min", km: "{n} នាទី" },
  "lesson.objective": { en: "What you'll learn", km: "អ្វីដែលអ្នកនឹងរៀន" },
  "lesson.keyPoints": { en: "Key points", km: "ចំណុចសំខាន់" },
  "lesson.examples": { en: "Worked examples", km: "ឧទាហរណ៍មានដំណោះស្រាយ" },
  "lesson.tip": { en: "Study tip", km: "គន្លឹះសិក្សា" },
  "lesson.markDone": { en: "Mark as complete", km: "សម្គាល់ថាបានបញ្ចប់" },
  "lesson.completed": { en: "Completed", km: "បានបញ្ចប់" },
  "lesson.nextLesson": { en: "Next lesson", km: "មេរៀនបន្ទាប់" },
  "lesson.backToList": { en: "All lessons", km: "មេរៀនទាំងអស់" },
  "lesson.locked": { en: "No course for this deck", km: "គ្មានវគ្គសិក្សាសម្រាប់សំណុំកាតនេះ" },
  "lesson.lockedBody": {
    en: "This deck doesn't come with a bundled course.",
    km: "សំណុំកាតនេះមិនមានវគ្គសិក្សាភ្ជាប់មកជាមួយទេ។",
  },

  /* LessonStatus (the Lessons tab's list) */
  "lessonStatus.lessonN": { en: "Lesson", km: "មេរៀនទី" },
  "lessonStatus.complete": { en: "Complete", km: "បានបញ្ចប់" },
  "lessonStatus.needsReview": { en: "Needs review", km: "ត្រូវការពិនិត្យឡើងវិញ" },
  "lessonStatus.upNext": { en: "Up next", km: "បន្ទាប់" },
  "lessonStatus.locked": { en: "Locked", km: "បានចាក់សោ" },
  "lessonStatus.min": { en: "min", km: "នាទី" },
  "lessonStatus.done": { en: "done", km: "បានបញ្ចប់" },
  "lessonStatus.lastScore": { en: "Previous score", km: "ពិន្ទុលើកមុន" },
  "lessonStatus.passBar": { en: "70% needed to pass", km: "ត្រូវការ ៧០% ដើម្បីជាប់" },
  "lessonStatus.review": { en: "Review", km: "ពិនិត្យឡើងវិញ" },
  "lessonStatus.practise": { en: "Practise", km: "អនុវត្ត" },
  "lessonStatus.start": { en: "Start", km: "ចាប់ផ្តើម" },
  "lessonStatus.needsPrev": {
    en: "Finish the previous lesson to unlock this one",
    km: "បញ្ចប់មេរៀនមុន ដើម្បីបើកមេរៀននេះ",
  },
  "lessonStatus.examTitle": { en: "Exam", km: "ការប្រឡង" },
  "lessonStatus.examNote": {
    en: "Finish all lessons to take the exam and earn a certificate.",
    km: "បញ្ចប់មេរៀនទាំងអស់ ដើម្បីធ្វើការប្រឡង និងទទួលបានវិញ្ញាបនបត្រ។",
  },
  "lessonStatus.examReady": { en: "Exam unlocked", km: "ការប្រឡងបានបើក" },
  "lessonStatus.examLocked": { en: "Exam locked", km: "ការប្រឡងបានចាក់សោ" },

  /* LessonRead (the reading page) */
  "lessonRead.sections": { en: "sections", km: "ផ្នែក" },
  "lessonRead.read": { en: "Read", km: "អាន" },
  "lessonRead.min": { en: "min", km: "នាទី" },
  "lessonRead.ex": { en: "Exercise", km: "លំហាត់" },
  "lessonRead.q": { en: "questions", km: "សំណួរ" },
  "lessonRead.selfCheck": { en: "Self-check", km: "ឆ្លើយដោយខ្លួនឯង" },
  "lessonRead.selfHint": {
    en: "Try answering in your head first, then tap to check.",
    km: "សាកល្បងឆ្លើយក្នុងចិត្តសិន ទើបចុចមើលចម្លើយ។",
  },
  "lessonRead.ready": { en: "Ready?", km: "រួចរាល់ហើយឬនៅ?" },
  "lessonRead.start": { en: "Start exercise", km: "ចាប់ផ្តើមលំហាត់" },

  // ---------- lesson path ----------
  "lp.unitLesson": { en: "Chapter {u}, Lesson {n}", km: "ជំពូកទី {u}, មេរៀនទី {n}" },
  "lp.reward": { en: "Reward", km: "រង្វាន់" },
  "lp.appleChest": { en: "Apple chest", km: "ប្រអប់ប៉ោម" },
  "lp.unitExam": { en: "Chapter exam", km: "ការប្រឡងជំពូក" },
  "lp.locked": { en: "Locked", km: "បានបិទ" },
  "lp.open": { en: "Open", km: "បើក" },
  "lp.practise": { en: "Practise", km: "អនុវត្ត" },
  "lp.startExam": { en: "Start exam", km: "ចាប់ផ្តើមប្រឡង" },
  "lp.myProfile": { en: "My profile", km: "ប្រវត្តិរូបរបស់ខ្ញុំ" },
  "lp.dailyTasks": { en: "Daily tasks", km: "ភារកិច្ចប្រចាំថ្ងៃ" },
  "lp.vouchers": { en: "Vouchers", km: "ប័ណ្ណរង្វាន់" },
  "lp.learn": { en: "Learn", km: "រៀន" },
  "lp.shop": { en: "Shop", km: "ហាង" },
  "lp.more": { en: "More", km: "ច្រើនទៀត" },
  "lp.leaderboard": { en: "Leaderboard", km: "តារាងចំណាត់ថ្នាក់" },
  "lp.pomoMode": { en: "Pomo mode", km: "របៀបប៉ូម៉ូដូរ៉ូ" },
  "lp.studyPlan": { en: "Study plan", km: "ផែនការសិក្សា" },
  "lp.finish": {
    en: "Your certificate opens when you pass the chapter exam.",
    km: "វិញ្ញាបនបត្ររបស់អ្នកនឹងបើក នៅពេលអ្នកប្រឡងជាប់។",
  },
  "lp.rail.streak": { en: "Streak", km: "ជាប់គ្នា" },
  "lp.rail.apples": { en: "Apples", km: "ប៉ោម" },
  "lp.rail.lessons": { en: "Done", km: "បានរួច" },
  "lp.rail.progress": { en: "Chapter progress", km: "វឌ្ឍនភាពជំពូក" },
  "lp.rail.lessonsOf": { en: "{n} of {total} lessons complete", km: "បានបញ្ចប់ {n} ក្នុង {total} មេរៀន" },
  "lp.rail.nextUp": { en: "Next up", km: "បន្ទាប់" },
  "lp.rail.continue": { en: "Continue", km: "បន្ត" },
  "lp.rail.examReady": { en: "Every lesson is done — the chapter exam is open.", km: "មេរៀនទាំងអស់បានបញ្ចប់ — ការប្រឡងជំពូកបានបើក។" },
  "lp.rail.dailyGoal": { en: "Today's goal", km: "គោលដៅថ្ងៃនេះ" },
  "lp.rail.cards": { en: "{n} / {total} cards", km: "{n} / {total} កាត" },
  "lp.rail.goalMet": { en: "Goal reached — nice work.", km: "សម្រេចគោលដៅ — ល្អមែន!" },
  "lp.rail.goalLeft": { en: "{n} more cards in Practice or Exam.", km: "នៅសល់ {n} កាតទៀត ក្នុងការអនុវត្ត ឬការប្រឡង។" },
  "lp.rail.viewTasks": { en: "Tasks", km: "ភារកិច្ច" },

  // ---------- lesson sheet (print) ----------
  "lessonSheet.eyebrow": { en: "Printable study cards", km: "កាតសិក្សាអាចបោះពុម្ពបាន" },
  "lessonSheet.show": { en: "Show study cards", km: "បង្ហាញកាតសិក្សា" },
  "lessonSheet.hide": { en: "Hide study cards", km: "លាក់កាតសិក្សា" },
  "lessonSheet.printCta": { en: "Print study cards", km: "បោះពុម្ពកាតសិក្សា" },
  "lessonSheet.card": { en: "Card {n}", km: "កាតទី {n}" },
  "lessonSheet.lessonOrdinal": { en: "Lesson {n}", km: "មេរៀនទី {n}" },
  "lessonSheet.example": { en: "Example", km: "ឧទាហរណ៍" },
  "lessonSheet.practiceExample": { en: "Practice example", km: "លំហាត់អនុវត្ត" },
  "lessonSheet.noExample": { en: "No worked example for this lesson.", km: "មេរៀននេះគ្មានឧទាហរណ៍មានដំណោះស្រាយទេ។" },
  "lessonSheet.flipHint": { en: "Flip the card for explanation and practice.", km: "ត្រឡប់កាតដើម្បីមើលការពន្យល់ និងលំហាត់។" },
  "lessonSheet.scanTitle": { en: "Watch the lesson", km: "មើលមេរៀន" },
  "lessonSheet.scanCaption": {
    en: "Scan to watch the full lesson and access additional exercises.",
    km: "ស្កេនដើម្បីមើលមេរៀនពេញ និងចូលប្រើលំហាត់បន្ថែម។",
  },

  // ---------- practice ----------
  "practice.eyebrow": { en: "Practice", km: "លំហាត់អនុវត្ត" },
  "practice.title": { en: "Drill the material.", km: "អនុវត្តខ្លឹមសារ។" },
  "practice.subtitle": {
    en: "No scores are recorded here — practise as often as you like before the exam.",
    km: "គ្មានការកត់ត្រាពិន្ទុនៅទីនេះទេ — អនុវត្តបានតាមចិត្តមុនពេលប្រឡង។",
  },
  "practice.note": {
    en: "Practice never touches your course progress or your best exam score — only the exam does.",
    km: "លំហាត់អនុវត្តមិនប៉ះពាល់ដល់វឌ្ឍនភាពវគ្គសិក្សា ឬពិន្ទុប្រឡងល្អបំផុតរបស់អ្នកទេ — មានតែការប្រឡងទេដែលកត់ត្រា។",
  },
  "practice.mode.lessonSet": { en: "Lesson set", km: "លំហាត់អនុវត្ត" },
  "practice.mode.review": { en: "Flip review", km: "ត្រឡប់មើល" },
  "practice.mode.reviewSub": { en: "Read one side, recall the other", km: "អានម្ខាង នឹកចាំម្ខាងទៀត" },
  "practice.mode.quiz": { en: "Multiple choice", km: "ជម្រើសច្រើន" },
  "practice.mode.quizSub": { en: "Pick the right answer from four", km: "ជ្រើសចម្លើយត្រឹមត្រូវក្នុងចំណោមបួន" },
  "practice.mode.type": { en: "Type the answer", km: "វាយបញ្ចូលចម្លើយ" },
  "practice.mode.typeSub": { en: "Harder — no options to choose from", km: "ពិបាកជាង — គ្មានជម្រើសឲ្យជ្រើស" },
  "practice.mode.match": { en: "Match pairs", km: "ផ្គូផ្គង" },
  "practice.mode.matchSub": { en: "Connect each term to its answer", km: "ភ្ជាប់ពាក្យនីមួយៗទៅចម្លើយរបស់វា" },
  "practice.tapReveal": { en: "Double-tap to reveal", km: "ចុចទ្វេដងដើម្បីបង្ហាញ" },
  "practice.check": { en: "Check", km: "ពិនិត្យ" },
  "practice.showAnswer": { en: "Show answer", km: "បង្ហាញចម្លើយ" },
  "practice.yourAnswer": { en: "Your answer", km: "ចម្លើយរបស់អ្នក" },
  "practice.theAnswer": { en: "The answer was", km: "ចម្លើយត្រឹមត្រូវគឺ" },
  "practice.almost": { en: "Almost — check your spelling.", km: "ជិតត្រូវហើយ — សូមពិនិត្យអក្ខរាវិរុទ្ធ។" },
  "practice.restart": { en: "Start again", km: "ចាប់ផ្តើមម្តងទៀត" },
  "practice.roundDone": { en: "Round complete", km: "បញ្ចប់ជុំ" },
  "practice.roundScore": { en: "You got {score} of {total} right.", km: "អ្នកឆ្លើយត្រូវ {score} ក្នុងចំណោម {total}។" },
  "practice.matchDone": { en: "All pairs matched in {n} tries.", km: "ផ្គូផ្គងគ្រប់គូក្នុង {n} ដង។" },
  "practice.streak": { en: "Streak", km: "ជាប់គ្នា" },
  "practice.remember": { en: "Remember", km: "ចាំបាន" },
  "practice.forgot": { en: "Forgot", km: "ភ្លេច" },
  "practice.remembered": { en: "{n} of {total} remembered", km: "ចាំបាន {n} ក្នុងចំណោម {total}" },
  "practice.forgotCount": { en: "Forgot ×{n}", km: "ភ្លេច ×{n}" },
  "practice.reviewDone": { en: "You remembered all {n} cards.", km: "អ្នកចាំបានកាតទាំង {n}។" },
  "practice.reviewRetries": { en: "{n} needed a retry along the way.", km: "{n} ត្រូវការព្យាយាមម្តងទៀត។" },
  "practice.reviewRetries_one": { en: "1 needed a retry along the way.", km: "1 ត្រូវការព្យាយាមម្តងទៀត។" },
  "practice.studyAgain": { en: "Study again", km: "សិក្សាម្តងទៀត" },
  "practice.iKnowIt": { en: "I know it", km: "ខ្ញុំដឹងហើយ" },

  // ---------- exam ----------
  "exam.eyebrow": { en: "Certification exam", km: "ការប្រឡងយកវិញ្ញាបនបត្រ" },
  "exam.questions": { en: "Questions", km: "សំណួរ" },
  "exam.questionsBreakdown": {
    en: "{mc} multiple choice · {typed} typed",
    km: "{mc} ជម្រើសច្រើន · {typed} វាយបញ្ចូល",
  },
  "exam.perQuestion": { en: "Per question", km: "ក្នុងមួយសំណួរ" },
  "exam.toPass": { en: "To pass", km: "ដើម្បីជាប់" },
  "exam.rules": {
    en: "Each question is timed. When the clock runs out the question is marked incorrect and the exam moves on. Passing issues a printable certificate in your name.",
    km: "សំណួរនីមួយៗមានកំណត់ពេល។ នៅពេលអស់ពេល សំណួរនោះត្រូវបានចាត់ទុកថាខុស ហើយការប្រឡងបន្តទៅមុខ។ ការប្រឡងជាប់នឹងចេញវិញ្ញាបនបត្រក្នុងនាមអ្នក ដែលអាចបោះពុម្ពបាន។",
  },
  "exam.begin": { en: "Begin exam", km: "ចាប់ផ្តើមប្រឡង" },
  "exam.questionOf": { en: "Question {i} of {n}", km: "សំណួរទី {i} ក្នុងចំណោម {n}" },
  "exam.timeUp": { en: "Time's up — marked incorrect.", km: "អស់ពេល — ចាត់ទុកថាខុស។" },
  "exam.seeResults": { en: "See results", km: "មើលលទ្ធផល" },
  "exam.passed": { en: "Exam passed", km: "ប្រឡងជាប់" },
  "exam.failed": { en: "Not passed this time", km: "លើកនេះមិនទាន់ជាប់" },
  "exam.resultScore": { en: "{score} of {total} correct", km: "ត្រូវ {score} ក្នុងចំណោម {total}" },
  "exam.needed": { en: "You need {n} correct to certify.", km: "អ្នកត្រូវការចម្លើយត្រូវ {n} ដើម្បីទទួលវិញ្ញាបនបត្រ។" },
  "exam.retake": { en: "Retake exam", km: "ប្រឡងម្តងទៀត" },
  "exam.mockNotRecorded": { en: "Mock result — not recorded.", km: "លទ្ធផលសាកល្បង — មិនត្រូវបានកត់ត្រា។" },
  "exam.review": { en: "Review your answers", km: "ពិនិត្យចម្លើយរបស់អ្នក" },
  "exam.hideReview": { en: "Hide review", km: "លាក់ការពិនិត្យ" },
  "exam.yourAnswer": { en: "You answered", km: "អ្នកបានឆ្លើយ" },
  "exam.noAnswer": { en: "No answer", km: "គ្មានចម្លើយ" },
  "exam.viewCertificate": { en: "View certificate", km: "មើលវិញ្ញាបនបត្រ" },
  "exam.finishAndSubmit": { en: "Finish & submit", km: "បញ្ចប់ និងដាក់ស្នើ" },
  "exam.submitAnswer": { en: "Submit answer", km: "ដាក់ស្នើចម្លើយ" },
  "exam.typedCorrect": { en: "Correct.", km: "ត្រឹមត្រូវ។" },
  "exam.typedIncorrect": { en: "Not quite — the answer was \"{expected}\".", km: "មិនត្រឹមត្រូវ — ចម្លើយគឺ «{expected}»។" },
  "exam.studyFirst": {
    en: "Work through the lessons and practice drills, then come back.",
    km: "សូមសិក្សាមេរៀន និងធ្វើលំហាត់ រួចត្រឡប់មកវិញ។",
  },

  // ---------- certificate ----------
  "cert.title": { en: "Certificate of Completion", km: "វិញ្ញាបនបត្របញ្ចប់ការសិក្សា" },
  "cert.issuer": { en: "JongCham · card-based learning", km: "ចង់ចាំ · ការសិក្សាតាមកាត" },
  "cert.certifies": { en: "This certifies that", km: "សូមបញ្ជាក់ថា" },
  "cert.completed": { en: "has successfully completed the examination for the", km: "បានប្រឡងជាប់ដោយជោគជ័យសម្រាប់" },
  "cert.deckSuffix": { en: "Deck", km: "សំណុំកាត" },
  "cert.authority": { en: "Issuing authority", km: "អាជ្ញាធរចេញវិញ្ញាបនបត្រ" },
  "cert.id": { en: "Certificate ID", km: "លេខវិញ្ញាបនបត្រ" },
  "cert.printHint": {
    en: "In the print dialog, turn off \"Headers and footers\" for a clean copy.",
    km: "នៅក្នុងប្រអប់បោះពុម្ព សូមបិទ «Headers and footers» ដើម្បីទទួលបានច្បាប់ចម្លងស្អាត។",
  },
  "cert.saveAsPdf": { en: "Print / save as PDF", km: "បោះពុម្ព / រក្សាទុកជា PDF" },
  "cert.none": { en: "No certificates yet", km: "មិនទាន់មានវិញ្ញាបនបត្រ" },
  "cert.noneBody": {
    en: "Pass a deck's exam and the certificate is saved here.",
    km: "ប្រឡងជាប់សំណុំកាតណាមួយ នោះវិញ្ញាបនបត្រនឹងត្រូវរក្សាទុកនៅទីនេះ។",
  },
  "cert.earned": { en: "Earned {date}", km: "ទទួលបានថ្ងៃទី {date}" },

  // ---------- footer ----------
  "footer.tagline": { en: "Printed to order · no minimums", km: "បោះពុម្ពតាមបញ្ជាទិញ · គ្មានចំនួនអប្បបរមា" },
  "footer.contact": { en: "Contact", km: "ទំនាក់ទំនង" },
  "footer.demoNotice": {
    en: "Demonstration storefront — orders and payments are simulated in your browser.",
    km: "ហាងសាកល្បង — ការបញ្ជាទិញនិងការទូទាត់ត្រូវបានក្លែងធ្វើក្នុងកម្មវិធីរុករករបស់អ្នក។",
  },
  "footer.blurb": {
    en: "Printed flashcards for Grade 10–12, made to order. Every box carries a code that opens the same deck online.",
    km: "កាតសិក្សាបោះពុម្ពសម្រាប់ថ្នាក់ទី១០–១២ ផលិតតាមការបញ្ជាទិញ។ រាល់ប្រអប់មានកូដដែលបើកសំណុំកាតដដែលនៅលើអនឡាញ។",
  },
  "footer.workshopLabel": { en: "Workshop", km: "ស្ទូឌីយោ" },
  "footer.shop": { en: "Shop", km: "ទំនិញ" },
  "footer.allSets": { en: "All sets", km: "សំណុំកាតទាំងអស់" },
  "footer.learn": { en: "Learn", km: "រៀន" },
  "footer.howItWorks": { en: "How it works", km: "របៀបដំណើរការ" },
  "footer.insideABox": { en: "Inside a box", km: "អ្វីមាននៅក្នុងប្រអប់" },
  "footer.lessonsAndPractice": { en: "Lessons and practice", km: "មេរៀន និងលំហាត់អនុវត្ត" },
  "footer.examsAndCertificates": { en: "Exams and certificates", km: "ការប្រឡង និងវិញ្ញាបនបត្រ" },
  "footer.help": { en: "Help", km: "ជំនួយ" },
  "footer.activateCode": { en: "Activate a code", km: "ដំណើរការកូដ" },
  "footer.trackOrder": { en: "Track my order", km: "តាមដានការបញ្ជាទិញ" },
  "footer.shippingHelp": { en: "Shipping and delivery", km: "ការដឹកជញ្ជូន" },
  "footer.returnsHelp": { en: "Returns and reprints", km: "ការប្តូរ និងបោះពុម្ពឡើងវិញ" },
  "footer.contactUs": { en: "Contact us", km: "ទាក់ទងយើង" },
  "footer.faq": { en: "FAQ", km: "សំណួរញឹកញាប់" },
  "footer.company": { en: "Company", km: "ក្រុមហ៊ុន" },
  "footer.aboutBrand": { en: "About JongCham", km: "អំពី ចង់ចាំ" },
  "footer.forSchools": { en: "For schools", km: "សម្រាប់សាលារៀន" },
  "footer.bulkTag": { en: "Bulk", km: "ចំនួនច្រើន" },
  "footer.reseller": { en: "Become a reseller", km: "ក្លាយជាអ្នកចែកចាយ" },
  "footer.privacy": { en: "Privacy policy", km: "គោលការណ៍ឯកជនភាព" },
  "footer.terms": { en: "Terms of sale", km: "លក្ខខណ្ឌនៃការលក់" },
  "footer.rights": { en: "© {year} JongCham. Printed in Phnom Penh, Cambodia.", km: "© {year} ចង់ចាំ។ បោះពុម្ពនៅភ្នំពេញ កម្ពុជា។" },

  // ---------- about ----------
  // Ported About page: hero, polaroid captions, story band, values,
  // timeline, numbers band, team and closing CTA. Team names and the
  // timeline years stay in Latin/digits in both languages.
  "about.hero.eyebrow": { en: "About JongCham", km: "អំពី ចង់ចាំ" },
  "about.hero.l1": { en: "We were the kids", km: "យើងគឺជាក្មេងៗ" },
  "about.hero.l2": { en: "rewriting notes at", km: "ដែលសរសេរកំណត់ចំណាំឡើងវិញ" },
  "about.hero.l3": { en: "2am.", km: "នៅម៉ោង ២ យប់។" },
  "about.hero.lede": {
    en: "JongCham started because revising in Cambodia mostly meant photocopied handouts and a highlighter. We wanted the thing we never had — a deck you design yourself, printed properly, with the lessons and drills sitting right behind it.",
    km: "ចង់ចាំ ចាប់ផ្តើមឡើងព្រោះការរៀនត្រៀមប្រឡងនៅកម្ពុជា ភាគច្រើនមានត្រឹមតែឯកសារចម្លង និងប៊ិចសម្គាល់ពណ៌មួយដើម។ យើងចង់បានអ្វីដែលយើងមិនធ្លាប់មាន — សំណុំកាតដែលអ្នករចនាដោយខ្លួនឯង បោះពុម្ពឱ្យបានត្រឹមត្រូវ ដោយមានមេរៀន និងការហ្វឹកហាត់នៅពីក្រោយវា។",
  },
  "about.hero.story": { en: "Read the story", km: "អានរឿងរ៉ាវ" },
  "about.hero.team": { en: "Meet the team", km: "ជួបក្រុមការងារ" },
  "about.cap1": { en: "first draft, 2023", km: "សេចក្តីព្រាងដំបូង ២០២៣" },
  "about.cap2": { en: "deck #1 shipped", km: "សំណុំទី១ បានដឹកចេញ" },
  "about.cap3": { en: "study crew, today", km: "ក្រុមរៀន សព្វថ្ងៃ" },

  "about.story.eyebrow": { en: "The story", km: "រឿងរ៉ាវ" },
  "about.story.title": { en: "It began with one messy stack of index cards.", km: "វាចាប់ផ្តើមពីគំនរកាតដ៏រញ៉េរញ៉ៃមួយ។" },
  "about.story.p1": {
    en: "Two of us were cramming for the same exam, sharing a table and a shoebox of hand-cut cards. They worked — but only for the person who made them. Everything else about revising was scattered: notes in one app, past papers in a group chat, the actual explanation nowhere at all.",
    km: "យើងពីរនាក់កំពុងរៀនត្រៀមសម្រាប់ការប្រឡងតែមួយ ចែកតុគ្នា និងប្រអប់ស្បែកជើងមួយដែលពោរពេញដោយកាតកាត់ដោយដៃ។ វាពិតជាមានប្រយោជន៍ — ប៉ុន្តែសម្រាប់តែអ្នកដែលបង្កើតវាប៉ុណ្ណោះ។ អ្វីផ្សេងទៀតអំពីការរៀនត្រៀមគឺខ្ចាត់ខ្ចាយ៖ កំណត់ចំណាំនៅក្នុង app មួយ វិញ្ញាសាចាស់ៗនៅក្នុង group chat ឯការពន្យល់ពិតប្រាកដវិញ រកគ្មានកន្លែងណាសោះ។",
  },
  "about.story.pull": {
    en: "If the cards are this useful, why is everything around them so broken?",
    km: "បើកាតទាំងនេះមានប្រយោជន៍ម្ល៉េះ ហេតុអ្វីអ្វីៗជុំវិញវា បែរជាខូចម្ល៉េះ?",
  },
  "about.story.p2": {
    en: "So we built the thing around them. You write both sides of every card and pick how it looks, we print it on real stock and post it to you, and the code in the box opens the lessons, the drill modes and the exam in your account. Same material, four different ways to meet it.",
    km: "ដូច្នេះយើងបានកសាងអ្វីដែលនៅជុំវិញវា។ អ្នកសរសេរទាំងសងខាងនៃកាតនីមួយៗ ហើយជ្រើសរើសរូបរាងរបស់វា យើងបោះពុម្ពលើក្រដាសពិតប្រាកដ ហើយដឹកជូនអ្នក ហើយលេខកូដក្នុងប្រអប់នឹងបើកមេរៀន របៀបហ្វឹកហាត់ និងការប្រឡងនៅក្នុងគណនីរបស់អ្នក។ ខ្លឹមសារតែមួយ ប៉ុន្តែអាចជួបវាបានបួនរបៀប។",
  },
  "about.story.p3": {
    en: "We're small, based in Phnom Penh, and every deck that ships still gets checked by a person before it goes in the box.",
    km: "យើងជាក្រុមតូចមួយ នៅភ្នំពេញ ហើយសំណុំកាតនីមួយៗដែលដឹកចេញ នៅតែត្រូវបានពិនិត្យដោយមនុស្ស មុននឹងដាក់ចូលប្រអប់។",
  },
  "about.story.noteTitle": { en: "What we refuse to do", km: "អ្វីដែលយើងមិនព្រមធ្វើ" },
  "about.story.refuse1": { en: "Lock the lessons behind a monthly subscription.", km: "បិទមេរៀននៅពីក្រោយការជាវប្រចាំខែ។" },
  "about.story.refuse2": {
    en: "Sell generic decks nobody on our team would revise from.",
    km: "លក់សំណុំកាតទូទៅ ដែលគ្មាននរណាក្នុងក្រុមយើងចង់យកមករៀន។",
  },
  "about.story.refuse3": { en: "Make you install a separate app just to pay.", km: "បង្ខំឱ្យអ្នកដំឡើង app ផ្សេងទៀត គ្រាន់តែដើម្បីបង់ប្រាក់។" },

  "about.values.eyebrow": { en: "What we believe", km: "អ្វីដែលយើងជឿ" },
  "about.values.title": { en: "Three things we won't compromise on.", km: "រឿងបីយ៉ាងដែលយើងមិនព្រមបន្ធូរបន្ថយ។" },
  "about.value1.title": { en: "Paper still wins", km: "ក្រដាសនៅតែឈ្នះ" },
  "about.value1.body": {
    en: "Writing a card by hand is half the learning. We print, we don't replace — the app exists to support the deck, not swallow it.",
    km: "ការសរសេរកាតដោយដៃ គឺជាពាក់កណ្តាលនៃការរៀនហើយ។ យើងបោះពុម្ព មិនមែនជំនួសទេ — app មានឡើងដើម្បីគាំទ្រសំណុំកាត មិនមែនដើម្បីលេបវាទេ។",
  },
  "about.value2.title": { en: "Built for how you pay", km: "បង្កើតឡើងតាមរបៀបអ្នកបង់ប្រាក់" },
  "about.value2.body": {
    en: "KHQR from any Cambodian banking app, card for everyone else. No foreign wallet, no account you have to make first.",
    km: "KHQR ពី app ធនាគារកម្ពុជាណាក៏បាន កាតសម្រាប់អ្នកផ្សេងទៀត។ មិនចាំបាច់មានកាបូបលុយបរទេស មិនចាំបាច់បង្កើតគណនីមុន។",
  },
  "about.value3.title": { en: "Nobody revises alone", km: "គ្មាននរណារៀនតែម្នាក់ឯង" },
  "about.value3.body": {
    en: "Add friends inside the tool, swap decks, run quiz nights. Streaks only count when you both show up.",
    km: "បន្ថែមមិត្តភក្តិក្នុងឧបករណ៍ ដូរសំណុំកាតគ្នា រៀបចំយប់លេងសំណួរ។ Streak រាប់តែពេលដែលអ្នកទាំងពីរចូលរៀនជាមួយគ្នា។",
  },
  /* the promise strip that fills the space the one-screen values band
     leaves under the three cards */
  "about.values.promiseLabel": { en: "The promise", km: "កតិសន្យា" },
  "about.values.promise": {
    en: "If we ever ship something that breaks one of these three, tell us — we fix it before we print another box.",
    km: "បើយើងដឹកចេញអ្វីដែលបំពានលើកតិកាបីនេះ សូមប្រាប់យើង — យើងនឹងកែវា មុននឹងបោះពុម្ពបរអប់ថ្មីមួយទៀត។",
  },
  "about.values.promiseCta": { en: "Tell us", km: "ប្រាប់យើង" },

  "about.timeline.eyebrow": { en: "How we got here", km: "របៀបដែលយើងមកដល់ទីនេះ" },
  "about.timeline.title": { en: "Four years, one shoebox to a print run.", km: "បួនឆ្នាំ ពីប្រអប់ស្បែកជើងមួយ ទៅការបោះពុម្ព។" },
  "about.timeline.side": {
    en: "Still the same two questions every time: does this actually help someone remember, and would we have wanted it at 17?",
    km: "នៅតែជាសំណួរពីរដដែលៗរាល់ដង៖ តើវាពិតជាជួយឱ្យនរណាម្នាក់ចាំបានមែនទេ? ហើយតើយើងចង់បានវានៅអាយុ ១៧ ឆ្នាំទេ?",
  },
  "about.tl1.title": { en: "The shoebox", km: "ប្រអប់ស្បែកជើង" },
  "about.tl1.body": {
    en: "Two students, hand-cut index cards, one shared exam. It worked well enough that people kept asking to borrow the box.",
    km: "សិស្សពីរនាក់ កាតកាត់ដោយដៃ ការប្រឡងរួមគ្នាមួយ។ វាដំណើរការល្អ រហូតដល់គេសុំខ្ចីប្រអប់នោះមិនដាច់។",
  },
  "about.tl2.title": { en: "First printed run", km: "ការបោះពុម្ពលើកដំបូង" },
  "about.tl2.body": {
    en: "50 decks, one local printer, delivered by motorbike. We learned what card stock survives a backpack.",
    km: "សំណុំកាត ៥០ អ្នកបោះពុម្ពក្នុងស្រុកម្នាក់ ដឹកជញ្ជូនដោយម៉ូតូ។ យើងបានរៀនថាក្រដាសប្រភេទណាធន់នឹងកាបូបស្ពាយ។",
  },
  "about.tl3.title": { en: "The deck builder", km: "ឧបករណ៍បង្កើតសំណុំកាត" },
  "about.tl3.body": {
    en: "Design both sides yourself, live preview, pick your stock and lettering. KHQR checkout landed the same year.",
    km: "រចនាទាំងសងខាងដោយខ្លួនឯង មើលជាមុនផ្ទាល់ៗ ជ្រើសក្រដាស និងអក្សរ។ ការទូទាត់ KHQR ក៏មកដល់ក្នុងឆ្នាំដដែល។",
  },
  "about.tl4.title": { en: "Lessons, drills, certificates — and friends", km: "មេរៀន ការហ្វឹកហាត់ វិញ្ញាបនបត្រ — និងមិត្តភក្តិ" },
  "about.tl4.body": {
    en: "Everything in the box now opens something in your account, and you can add the people you actually study with.",
    km: "អ្វីៗក្នុងប្រអប់ឥឡូវនេះ បើកអ្វីមួយក្នុងគណនីរបស់អ្នក ហើយអ្នកអាចបន្ថែមមិត្តភក្តិ ដែលអ្នករៀនជាមួយពិតប្រាកដ។",
  },

  "about.num1": { en: "cards printed", km: "កាតដែលបានបោះពុម្ព" },
  "about.num2": { en: "students studying", km: "សិស្សកំពុងរៀន" },
  "about.num3": { en: "schools reached", km: "សាលាដែលបានទៅដល់" },
  "about.num4": { en: "average to your door", km: "ជាមធ្យមទៅដល់ផ្ទះអ្នក" },
  "about.num4Suffix": { en: " days", km: " ថ្ងៃ" },

  "about.team.eyebrow": { en: "The team", km: "ក្រុមការងារ" },
  "about.team.title": {
    en: "Small enough that you'll get a real reply.",
    km: "តូចល្មម ដើម្បីឱ្យអ្នកទទួលបានការឆ្លើយតបពិតប្រាកដ។",
  },
  "about.member1.role": { en: "Co-founder, product", km: "សហស្ថាបនិក ផ្នែកផលិតផល" },
  "about.member1.body": {
    en: "Made the first shoebox. Still edits every default deck by hand.",
    km: "បង្កើតប្រអប់ស្បែកជើងដំបូង។ នៅតែកែសម្រួលសំណុំកាតលំនាំដើមទាំងអស់ដោយដៃ។",
  },
  "about.member2.role": { en: "Co-founder, engineering", km: "សហស្ថាបនិក ផ្នែកវិស្វកម្ម" },
  "about.member2.body": {
    en: "Built the deck builder and the KHQR checkout in the same month.",
    km: "បង្កើតឧបករណ៍បង្កើតសំណុំកាត និងការទូទាត់ KHQR ក្នុងខែតែមួយ។",
  },
  "about.member3.role": { en: "Curriculum", km: "កម្មវិធីសិក្សា" },
  "about.member3.body": {
    en: "Turns syllabus chapters into lessons that fit on the back of a card.",
    km: "ប្រែក្លាយជំពូកកម្មវិធីសិក្សា ទៅជាមេរៀនដែលសមនឹងខ្នងកាតមួយសន្លឹក។",
  },
  "about.member4.role": { en: "Print & delivery", km: "បោះពុម្ព និងដឹកជញ្ជូន" },
  "about.member4.body": {
    en: "Checks every box before it ships. Knows every printer in Phnom Penh.",
    km: "ពិនិត្យប្រអប់នីមួយៗមុននឹងដឹកចេញ។ ស្គាល់អ្នកបោះពុម្ពគ្រប់រូបក្នុងភ្នំពេញ។",
  },

  "about.cta.title": { en: "Make the deck you wish you'd had.", km: "បង្កើតសំណុំកាត ដែលអ្នកធ្លាប់ចង់បាន។" },
  "about.cta.body": {
    en: "Write both sides, pick your stock, and we'll print it and post it. The lessons and drills are waiting in your account.",
    km: "សរសេរទាំងសងខាង ជ្រើសក្រដាស ហើយយើងនឹងបោះពុម្ព និងដឹកជូន។ មេរៀន និងការហ្វឹកហាត់ កំពុងរង់ចាំក្នុងគណនីរបស់អ្នក។",
  },
  "about.cta.build": { en: "Build your deck", km: "បង្កើតសំណុំកាតរបស់អ្នក" },
  "about.cta.talk": { en: "Talk to us", km: "និយាយជាមួយយើង" },

  // ---------- contact ----------
  "contact.eyebrow": { en: "Contact", km: "ទំនាក់ទំនង" },
  "contact.title": { en: "Get in touch", km: "ទាក់ទងមកយើង" },
  "contact.body": {
    en: "Questions about an order, a deck, or the account side — send a note and we'll get back to you.",
    km: "មានសំណួរអំពីការបញ្ជាទិញ សំណុំកាត ឬគណនីរបស់អ្នក — សូមផ្ញើសារមកយើង ហើយយើងនឹងឆ្លើយតបទៅអ្នក។",
  },
  "contact.message": { en: "Message", km: "សារ" },
  "contact.send": { en: "Send message", km: "ផ្ញើសារ" },
  "contact.sentTitle": { en: "Message received", km: "បានទទួលសារ" },
  "contact.sentBody": {
    en: "Thanks, {name} — in a live store this would reach our inbox. This demo doesn't send real email, so nothing was actually delivered.",
    km: "សូមអរគុណ {name} — នៅក្នុងហាងពិតប្រាកដ សារនេះនឹងទៅដល់ប្រអប់សំបុត្ររបស់យើង។ ការសាកល្បងនេះមិនផ្ញើអ៊ីមែលពិតទេ ដូច្នេះមិនមានអ្វីត្រូវបានផ្ញើពិតប្រាកដឡើយ។",
  },
  "contact.sendTitle": { en: "Send a message", km: "ផ្ញើសារមកយើង" },
  "contact.stepHint": { en: "Takes a minute", km: "ចំណាយពេលមួយភ្លែត" },
  "contact.stepDone": { en: "Done", km: "រួចរាល់" },
  "contact.topic.order": { en: "My order", km: "ការបញ្ជាទិញរបស់ខ្ញុំ" },
  "contact.topic.code": { en: "Deck code", km: "កូដសំណុំកាត" },
  "contact.topic.account": { en: "Account", km: "គណនី" },
  "contact.topic.bulk": { en: "Schools and bulk", km: "សាលារៀន និងការបញ្ជាទិញច្រើន" },
  "contact.topic.other": { en: "Something else", km: "រឿងផ្សេងទៀត" },
  "contact.orderNumber": { en: "Order number", km: "លេខការបញ្ជាទិញ" },
  "contact.orderNumberHint": { en: "Optional — it speeds things up", km: "មិនចាំបាច់ — ជួយឲ្យលឿនជាង" },
  "contact.placeholder.order": { en: "What is wrong with the order?", km: "តើមានបញ្ហាអ្វីជាមួយការបញ្ជាទិញ?" },
  "contact.placeholder.code": {
    en: "Which code is not working? Type it here.",
    km: "កូដមួយណាដែលមិនដំណើរការ? សូមវាយវាទីនេះ។",
  },
  "contact.placeholder.account": { en: "What happens when you try?", km: "តើមានអ្វីកើតឡើងនៅពេលអ្នកសាកល្បង?" },
  "contact.placeholder.bulk": {
    en: "How many boxes, which subjects, and when do you need them?",
    km: "តើត្រូវការប៉ុន្មានប្រអប់ មុខវិជ្ជាអ្វីខ្លះ និងនៅពេលណា?",
  },
  "contact.placeholder.other": { en: "What can we help with?", km: "តើយើងអាចជួយអ្វីបាន?" },
  "contact.errName": { en: "Please tell us your name.", km: "សូមប្រាប់ឈ្មោះរបស់អ្នក។" },
  "contact.errMessage": { en: "Please write a short message.", km: "សូមសរសេរសារខ្លីមួយ។" },
  "contact.privacyNote": {
    en: "We use your email only to reply. No newsletter, no sharing.",
    km: "យើងប្រើអ៊ីមែលរបស់អ្នកសម្រាប់ឆ្លើយតបប៉ុណ្ណោះ។ គ្មានព្រឹត្តិបត្រព័ត៌មាន គ្មានការចែករំលែក។",
  },
  "contact.sending": { en: "Sending…", km: "កំពុងផ្ញើ…" },
  "contact.sendAnother": { en: "Send another message", km: "ផ្ញើសារមួយទៀត" },
  "contact.reachUs": { en: "Reach us directly", km: "ទាក់ទងផ្ទាល់" },
  "contact.telegramHint": { en: "Fastest for order questions", km: "លឿនបំផុតសម្រាប់សំណួរអំពីការបញ្ជាទិញ" },
  "contact.workshop": { en: "Workshop", km: "ស្ទូឌីយោ" },
  "contact.workshopHint": {
    en: "Chbar Ampov, Phnom Penh — printing and pickup by appointment",
    km: "ចំការអំពៅ ភ្នំពេញ — បោះពុម្ព និងមករើកយកតាមការណាត់ជួប",
  },
  "contact.instagram": { en: "Instagram", km: "អ៊ីនស្តាក្រាម" },
  "contact.hours": { en: "Opening hours", km: "ម៉ោងបើកបម្រើ" },
  "contact.openNow": { en: "Open now", km: "កំពុងបើក" },
  "contact.closedNow": { en: "Closed now — we reply next morning", km: "បិទហើយ — យើងនឹងឆ្លើយតបនៅព្រឹកបន្ទាប់" },
  "contact.weekdays": { en: "Monday – Friday", km: "ច័ន្ទ – សុក្រ" },
  "contact.saturday": { en: "Saturday", km: "សៅរ៍" },
  "contact.sunday": { en: "Sunday", km: "អាទិត្យ" },
  "contact.closed": { en: "Closed", km: "បិទ" },
  "contact.hoursNote": {
    en: "All times Phnom Penh (ICT). Messages sent at night are answered the next working morning.",
    km: "ម៉ោងទាំងអស់តាមម៉ោងភ្នំពេញ (ICT)។ សារផ្ញើនៅពេលយប់ នឹងត្រូវឆ្លើយតបនៅព្រឹកថ្ងៃធ្វើការបន្ទាប់។",
  },
};

const LangContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = readStore("lang", null);
    return saved === "km" || saved === "en" ? saved : "km";
  });

  useEffect(() => {
    writeStore("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key, vars) => {
      // A `_one` sibling key is used when the count is exactly 1. Khmer has
      // no plural inflection, so its two forms are usually identical.
      const entry = (vars?.n === 1 && STRINGS[`${key}_one`]) || STRINGS[key];
      let str = entry ? entry[lang] ?? entry.en : key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replaceAll(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [lang]
  );

  // Unwraps a { en, km } content object from the data files.
  const pick = useCallback((obj) => (obj == null ? "" : obj[lang] ?? obj.en ?? ""), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, pick }), [lang, t, pick]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}
