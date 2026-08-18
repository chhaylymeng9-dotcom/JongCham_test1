/* ---------- course content ----------
One course per deck subject. Every string is a { en, km } pair unwrapped
by pick() at render time.

Lesson shape:
  id, minutes, title, objective, sections[{ heading, body[] }],
  keyPoints[], examples[{ prompt, solution }], tip
--------------------------------- */

const GRAMMAR = [
  {
    id: "g1",
    minutes: 6,
    title: { en: "Find the subject and the verb", km: "រកប្រធានបទ និងកិរិយាស័ព្ទ" },
    objective: {
      en: "Learn to spot the two words every complete sentence needs, and catch fragments before they cost you marks.",
      km: "រៀនរកពាក្យពីរដែលរាល់ប្រយោគពេញលេញត្រូវការ ហើយចាប់បានប្រយោគមិនពេញលេញ មុននឹងវាធ្វើឲ្យអ្នកបាត់បង់ពិន្ទុ។",
    },
    sections: [
      {
        heading: { en: "Every sentence hides two jobs", km: "រាល់ប្រយោគមានតួនាទីពីរ" },
        body: [
          {
            en: "The subject is who or what the sentence is about. The verb is what that subject does, or the state it's in. \"The dog barked\" has both: a subject (the dog) and a verb (barked). Strip either one away and the sentence stops working.",
            km: "ប្រធានបទ គឺជានរណា ឬអ្វីដែលប្រយោគនិយាយអំពី។ កិរិយាស័ព្ទ គឺជាអ្វីដែលប្រធានបទនោះធ្វើ ឬស្ថានភាពដែលវាស្ថិតនៅ។ ប្រយោគ «The dog barked» មានទាំងពីរ៖ ប្រធានបទ (the dog) និងកិរិយាស័ព្ទ (barked)។ បើដកមួយណាមួយចេញ ប្រយោគនោះលែងដំណើរការទៀត។",
          },
          {
            en: "Longer sentences hide the same core. \"The old dog next door barked loudly all night\" still boils down to \"dog barked\" — everything else just adds detail around it.",
            km: "ប្រយោគវែងជាងនេះ ក៏នៅតែមានស្នូលដូចគ្នា។ ប្រយោគ «The old dog next door barked loudly all night» នៅតែសង្ខេបទៅជា «dog barked» — អ្វីៗផ្សេងទៀតគ្រាន់តែបន្ថែមព័ត៌មានលម្អិតជុំវិញវាប៉ុណ្ណោះ។",
          },
        ],
      },
      {
        heading: { en: "Spotting a fragment", km: "ការចាប់ប្រយោគមិនពេញលេញ" },
        body: [
          {
            en: "A fragment is missing its subject, its verb, or both — and reads as a piece of a sentence rather than a whole one. \"Running down the street.\" has a verb form but no subject doing the running. \"Because it was raining.\" has both a subject and a verb, but the word \"because\" leaves it hanging, waiting for a main clause to attach to.",
            km: "ប្រយោគមិនពេញលេញ គឺបាត់ប្រធានបទ កិរិយាស័ព្ទ ឬទាំងពីរ — ហើយអានទៅដូចជាចំណិតនៃប្រយោគ មិនមែនប្រយោគពេញលេញទេ។ «Running down the street.» មានទម្រង់កិរិយាស័ព្ទ ប៉ុន្តែគ្មានប្រធានបទណាដែលធ្វើសកម្មភាពនោះទេ។ «Because it was raining.» មានទាំងប្រធានបទនិងកិរិយាស័ព្ទ ប៉ុន្តែពាក្យ «because» ធ្វើឲ្យវានៅសល់ ចាំចង្អុលទៅប្រយោគចម្បងណាមួយទៀត។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "A complete sentence needs a subject and a verb.", km: "ប្រយោគពេញលេញត្រូវការប្រធានបទ និងកិរិយាស័ព្ទ។" },
      { en: "Strip the description away to find the core: who did what.", km: "ដកចោលការពិពណ៌នា ដើម្បីរកស្នូល៖ នរណាធ្វើអ្វី។" },
      { en: "Words like \"because\", \"although\" and \"since\" can't start a sentence alone.", km: "ពាក្យដូចជា «because», «although» និង «since» មិនអាចចាប់ផ្តើមប្រយោគតែឯងបានទេ។" },
    ],
    examples: [
      {
        prompt: { en: "Is this a complete sentence? \"Although she studied all night.\"", km: "តើនេះជាប្រយោគពេញលេញឬទេ? «Although she studied all night.»" },
        solution: {
          en: "No — it's a fragment. \"Although\" promises a second half that never arrives. Fix: \"Although she studied all night, she still felt nervous.\"",
          km: "ទេ — វាជាប្រយោគមិនពេញលេញ។ «Although» សន្យានឹងផ្នែកទីពីរ ដែលមិនដែលមកដល់ទេ។ ការកែ៖ «Although she studied all night, she still felt nervous.»",
        },
      },
    ],
    tip: {
      en: "Read a sentence out loud on its own. If it sounds like it's waiting for something else, it probably is.",
      km: "អានប្រយោគនោះឲ្យឮដោយឯកឯង។ បើវាស្តាប់ទៅដូចជានៅចាំអ្វីមួយទៀត ភាគច្រើនវាពិតជាកំពុងចាំមែន។",
    },
  },
  {
    id: "g2",
    minutes: 7,
    title: { en: "Subject-verb agreement", km: "ការឆប់គ្នារវាងប្រធានបទ និងកិរិយាស័ព្ទ" },
    objective: {
      en: "Match a verb's form to its subject, including the cases that trip most people up.",
      km: "ផ្គូផ្គងទម្រង់កិរិយាស័ព្ទទៅនឹងប្រធានបទ រួមទាំងករណីលំបាកដែលធ្វើឲ្យមនុស្សភាគច្រើនច្រឡំ។",
    },
    sections: [
      {
        heading: { en: "Singular subject, singular verb", km: "ប្រធានបទឯកវចនៈ កិរិយាស័ព្ទឯកវចនៈ" },
        body: [
          {
            en: "In the simple present, a singular subject (he, she, it, or a single name) takes a verb ending in -s: \"She walks.\" A plural subject drops the -s: \"They walk.\" It feels backwards compared to plural nouns, which is exactly why it's worth a dedicated lesson.",
            km: "ក្នុងសម័យបច្ចុប្បន្នធម្មតា ប្រធានបទឯកវចនៈ (he, she, it ឬឈ្មោះតែមួយ) ត្រូវការកិរិយាស័ព្ទបញ្ចប់ដោយ -s៖ «She walks.» ប្រធានបទពហុវចនៈវិញ ដកចេញ -s៖ «They walk.» វាមានអារម្មណ៍ដូចជាផ្ទុយពីនាមពហុវចនៈ ដែលនេះហើយជាមូលហេតុសមនឹងមានមេរៀនផ្ទាល់ខ្លួន។",
          },
        ],
      },
      {
        heading: { en: "What sits between doesn't count", km: "អ្វីដែលនៅចន្លោះមិនប៉ះពាល់ទេ" },
        body: [
          {
            en: "A phrase between the subject and verb doesn't change the number: \"The box of apples is on the table\" — \"box\" is singular, so the verb agrees with \"box\", not with \"apples\". Compound subjects joined by \"and\" are plural (\"Tom and Ana are here\"), but when joined by \"or\", the verb agrees with the subject closest to it (\"Neither the teacher nor the students were ready\").",
            km: "ឃ្លាដែលនៅចន្លោះប្រធានបទ និងកិរិយាស័ព្ទ មិនប្តូរចំនួនទេ៖ «The box of apples is on the table» — «box» ជាឯកវចនៈ ដូច្នេះកិរិយាស័ព្ទឆប់តាម «box» មិនមែន «apples» ទេ។ ប្រធានបទផ្សំដោយ «and» ជាពហុវចនៈ (\"Tom and Ana are here\") ប៉ុន្តែពេលផ្សំដោយ «or» កិរិយាស័ព្ទឆប់តាមប្រធានបទដែលនៅជិតបំផុត (\"Neither the teacher nor the students were ready\")។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Present tense: he/she/it + verb-s; they/we/you + verb.", km: "សម័យបច្ចុប្បន្ន៖ he/she/it + verb-s; they/we/you + verb។" },
      { en: "Ignore the phrase between subject and verb when checking agreement.", km: "កុំរាប់បញ្ចូលឃ្លាដែលនៅចន្លោះប្រធានបទ និងកិរិយាស័ព្ទ ពេលពិនិត្យការឆប់គ្នា។" },
      { en: "\"And\" makes a plural subject; \"or\"/\"nor\" agrees with the nearer one.", km: "«And» ធ្វើឲ្យប្រធានបទជាពហុវចនៈ; «or»/«nor» ឆប់តាមប្រធានបទដែលនៅជិត។" },
    ],
    examples: [
      {
        prompt: { en: "Choose the correct verb: \"The list of names (is / are) on the wall.\"", km: "ជ្រើសកិរិយាស័ព្ទត្រឹមត្រូវ៖ «The list of names (is / are) on the wall.»" },
        solution: {
          en: "\"Is.\" The subject is \"list\" (singular) — \"of names\" is just a phrase describing it.",
          km: "«Is.» ប្រធានបទគឺ «list» (ឯកវចនៈ) — «of names» គ្រាន់តែជាឃ្លាពិពណ៌នាវាប៉ុណ្ណោះ។",
        },
      },
    ],
    tip: {
      en: "Cross out any phrase that starts with \"of\", \"with\", \"along with\" or \"as well as\" before you check agreement — it isn't the real subject.",
      km: "គូសចោលឃ្លាណាដែលចាប់ផ្តើមដោយ «of», «with», «along with» ឬ «as well as» មុននឹងពិនិត្យការឆប់គ្នា — វាមិនមែនប្រធានបទពិតទេ។",
    },
  },
  {
    id: "g3",
    minutes: 7,
    title: { en: "Placing an action in time", km: "កំណត់ពេលវេលានៃសកម្មភាព" },
    objective: {
      en: "Choose the right simple tense for past, present and future actions, and use regular and irregular verb forms correctly.",
      km: "ជ្រើសរើសសម័យកិរិយាស័ព្ទត្រឹមត្រូវសម្រាប់សកម្មភាពអតីត បច្ចុប្បន្ន និងអនាគត ព្រមទាំងប្រើទម្រង់កិរិយាស័ព្ទទៀងទាត់ និងមិនទៀងទាត់ឲ្យបានត្រឹមត្រូវ។",
    },
    sections: [
      {
        heading: { en: "Three simple tenses", km: "សម័យកិរិយាស័ព្ទធម្មតាបី" },
        body: [
          {
            en: "Present simple describes habits and facts: \"She walks to school.\" Past simple describes a finished action: \"She walked to school.\" Future simple describes what hasn't happened yet: \"She will walk to school.\" The whole system rests on knowing which of these three moments you're describing before you pick a verb form.",
            km: "សម័យបច្ចុប្បន្នធម្មតា ពិពណ៌នាទម្លាប់ និងការពិត៖ «She walks to school.» សម័យអតីតកាលធម្មតា ពិពណ៌នាសកម្មភាពដែលបានចប់ហើយ៖ «She walked to school.» សម័យអនាគតកាលធម្មតា ពិពណ៌នាអ្វីដែលមិនទាន់កើតឡើង៖ «She will walk to school.» ប្រព័ន្ធទាំងមូលអាស្រ័យលើការដឹងថា ក្នុងចំណោមកាលៈទេសៈបីនេះ អ្នកកំពុងពិពណ៌នាមួយណា មុននឹងជ្រើសរើសទម្រង់កិរិយាស័ព្ទ។",
          },
        ],
      },
      {
        heading: { en: "Regular vs irregular past tense", km: "អតីតកាលទៀងទាត់ និងមិនទៀងទាត់" },
        body: [
          {
            en: "Most verbs are regular: add -ed to make the past tense (\"walk\" → \"walked\", \"study\" → \"studied\"). A core set of common verbs is irregular and simply has to be learned: \"go\" → \"went\", \"see\" → \"saw\", \"eat\" → \"ate\", \"have\" → \"had\". Guessing an -ed ending onto an irregular verb (\"goed\", \"eated\") is one of the most common errors in written English.",
            km: "កិរិយាស័ព្ទភាគច្រើនជាទម្រង់ទៀងទាត់៖ បន្ថែម -ed ដើម្បីធ្វើអតីតកាល («walk» → «walked», «study» → «studied»)។ កិរិយាស័ព្ទសំខាន់ៗមួយចំនួនជាទម្រង់មិនទៀងទាត់ ហើយត្រូវទន្ទេញចាំដោយផ្ទាល់៖ «go» → «went», «see» → «saw», «eat» → «ate», «have» → «had»។ ការទាយបន្ថែម -ed ទៅលើកិរិយាស័ព្ទមិនទៀងទាត់ («goed», «eated») គឺជាកំហុសមួយក្នុងចំណោមកំហុសទូទៅបំផុតក្នុងភាសាអង់គ្លេសសរសេរ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Present simple = habits/facts; past simple = finished; future simple = not yet.", km: "បច្ចុប្បន្នធម្មតា = ទម្លាប់/ការពិត; អតីតកាលធម្មតា = បានចប់; អនាគតកាលធម្មតា = មិនទាន់កើត។" },
      { en: "Regular past tense adds -ed.", km: "អតីតកាលទៀងទាត់ បន្ថែម -ed។" },
      { en: "Irregular verbs have their own past form and must be memorised.", km: "កិរិយាស័ព្ទមិនទៀងទាត់ មានទម្រង់អតីតកាលផ្ទាល់ខ្លួន ហើយត្រូវទន្ទេញចាំ។" },
    ],
    examples: [
      { prompt: { en: "Fill in the blank: \"Yesterday, I ___ (go) to the market.\"", km: "បំពេញចន្លោះ៖ «Yesterday, I ___ (go) to the market.»" }, solution: { en: "\"went\" — \"go\" is irregular, not \"goed\".", km: "«went» — «go» ជាកិរិយាស័ព្ទមិនទៀងទាត់ មិនមែន «goed» ទេ។" } },
      {
        prompt: { en: "What is present simple?", km: "តើ present simple គឺជាអ្វី?" },
        solution: {
          en: "A tense used for habits, routines, facts, and things that are always or generally true. Form: Subject + Verb (+s/es for he/she/it) + Object. Example: \"She works at a hospital.\" \"They play football.\"",
          km: "សម័យកិរិយាស័ព្ទប្រើសម្រាប់ទម្លាប់ ការធ្វើប្រចាំ ការពិត និងអ្វីៗដែលពិតជានិច្ច។ រចនាសម្ព័ន្ធ៖ ប្រធានបទ + កិរិយាស័ព្ទ (+s/es សម្រាប់ he/she/it) + កម្មបទ។ ឧទាហរណ៍៖ «She works at a hospital.» «They play football.»",
        },
      },
    ],
    tip: {
      en: "Write your irregular verbs on their own small stack of cards — three forms per card (go / went / gone) — and drill that stack separately from everything else.",
      km: "សរសេរកិរិយាស័ព្ទមិនទៀងទាត់លើគំនរកាតដាច់ដោយឡែករបស់វា — បីទម្រង់ក្នុងមួយកាត (go / went / gone) — ហើយអនុវត្តគំនរនោះដាច់ដោយឡែកពីអ្វីៗផ្សេងទៀត។",
    },
  },
  {
    id: "g4",
    minutes: 7,
    title: { en: "Commas, run-ons and splices", km: "សញ្ញាក្បៀស ប្រយោគជាប់គ្នា និងការភ្ជាប់ខុស" },
    objective: {
      en: "Use commas and periods to separate ideas correctly — the single biggest source of lost marks in written English.",
      km: "ប្រើសញ្ញាក្បៀស និងសញ្ញាចុចឲ្យបានត្រឹមត្រូវក្នុងការបំបែកគំនិត — ជាប្រភពកំហុសធំបំផុតមួយដែលបាត់បង់ពិន្ទុក្នុងភាសាអង់គ្លេសសរសេរ។",
    },
    sections: [
      {
        heading: { en: "The run-on and the comma splice", km: "ប្រយោគជាប់គ្នា និងការភ្ជាប់ខុសដោយសញ្ញាក្បៀស" },
        body: [
          {
            en: "A run-on jams two complete sentences together with nothing between them: \"I was tired I went home.\" A comma splice makes almost the same mistake, but with a comma standing in where a stronger break is needed: \"I was tired, I went home.\" Both are fixed the same three ways: split into two sentences with a period, join with a semicolon, or add a conjunction after the comma (\"I was tired, so I went home\").",
            km: "ប្រយោគជាប់គ្នា គឺជាការបញ្ចូលប្រយោគពេញលេញពីរចូលគ្នាដោយគ្មានអ្វីនៅចន្លោះ៖ «I was tired I went home.» ការភ្ជាប់ខុសដោយសញ្ញាក្បៀស ស្ទើរតែជាកំហុសដូចគ្នា ប៉ុន្តែប្រើសញ្ញាក្បៀសនៅកន្លែងដែលត្រូវការការឈប់ខ្លាំងជាងនេះ៖ «I was tired, I went home.» ទាំងពីរកែបានតាមវិធីបីដូចគ្នា៖ បំបែកជាពីរប្រយោគដោយសញ្ញាចុច ភ្ជាប់ដោយសញ្ញាចំណុចក្បៀស (;) ឬបន្ថែមឈ្នាប់ភ្ជាប់ក្រោយសញ្ញាក្បៀស («I was tired, so I went home»)។",
          },
        ],
      },
      {
        heading: { en: "Commas that separate, not join", km: "សញ្ញាក្បៀសសម្រាប់បំបែក មិនមែនភ្ជាប់ទេ" },
        body: [
          {
            en: "Commas do plenty of safe work: separating items in a list (\"apples, pears, and grapes\"), setting off an introductory phrase (\"After the storm, we went outside\"), and framing extra information that could be removed without changing the sentence's meaning (\"My brother, who lives in Siem Reap, is visiting\"). None of these join two complete sentences on their own — that's the one job a comma alone can't do.",
            km: "សញ្ញាក្បៀសមានការងារជាច្រើនដែលមានសុវត្ថិភាព៖ បំបែកធាតុក្នុងបញ្ជីមួយ («apples, pears, and grapes»)  កំណត់ព្រំដែនឃ្លាចាប់ផ្តើមប្រយោគ («After the storm, we went outside»)  និងព័ទ្ធព័ត៌មានបន្ថែមដែលអាចដកចេញបានដោយមិនប្តូរអត្ថន័យប្រយោគ («My brother, who lives in Siem Reap, is visiting»)។ គ្មានករណីណាមួយក្នុងចំណោមនេះភ្ជាប់ប្រយោគពេញលេញពីរដោយខ្លួនឯងទេ — នោះជាការងារតែមួយគត់ដែលសញ្ញាក្បៀសតែឯងធ្វើមិនបាន។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "A comma alone can't join two complete sentences.", km: "សញ្ញាក្បៀសតែឯង មិនអាចភ្ជាប់ប្រយោគពេញលេញពីរបានទេ។" },
      { en: "Fix run-ons with a period, a semicolon, or comma + conjunction.", km: "កែប្រយោគជាប់គ្នាដោយ សញ្ញាចុច សញ្ញាចំណុចក្បៀស ឬ សញ្ញាក្បៀស + ឈ្នាប់ភ្ជាប់។" },
      { en: "Commas separate list items and set off extra information.", km: "សញ្ញាក្បៀសបំបែកធាតុក្នុងបញ្ជី និងកំណត់ព្រំដែនព័ត៌មានបន្ថែម។" },
    ],
    examples: [
      {
        prompt: { en: "Fix this: \"The rain stopped, we went for a walk.\"", km: "កែប្រយោគនេះ៖ «The rain stopped, we went for a walk.»" },
        solution: {
          en: "\"The rain stopped, so we went for a walk.\" (or split into two sentences with a period)",
          km: "«The rain stopped, so we went for a walk.» (ឬបំបែកជាពីរប្រយោគដោយសញ្ញាចុច)",
        },
      },
    ],
    tip: {
      en: "If you can replace the comma with a period and both halves still stand alone as full sentences, the comma alone is not enough — it needs a conjunction or a semicolon.",
      km: "បើអ្នកអាចជំនួសសញ្ញាក្បៀសដោយសញ្ញាចុច ហើយផ្នែកទាំងពីរនៅតែឈរជាប្រយោគពេញលេញដោយឯកឯង នោះសញ្ញាក្បៀសតែឯងមិនគ្រប់គ្រាន់ទេ — វាត្រូវការឈ្នាប់ភ្ជាប់ ឬសញ្ញាចំណុចក្បៀស។",
    },
  },
];

const MATH = [
  {
    id: "m1",
    minutes: 6,
    title: { en: "Make ten, then adjust", km: "បង្កើតដប់ រួចកែតម្រូវ" },
    objective: {
      en: "Add and subtract in your head by routing every sum through the nearest ten.",
      km: "បូកនិងដកក្នុងចិត្ត ដោយឆ្លងកាត់លេខដប់ដែលនៅជិតបំផុត។",
    },
    sections: [
      {
        heading: { en: "Why ten", km: "ហេតុអ្វីបានជាដប់" },
        body: [
          {
            en: "Our number system is built on tens, so any sum that lands on a ten is nearly free. 8 + 7 is awkward; 8 + 2 + 5 is not. Move two across from the seven, and the problem becomes 10 + 5.",
            km: "ប្រព័ន្ធលេខរបស់យើងសាងឡើងលើគោលដប់ ដូច្នេះផលបូកណាដែលធ្លាក់លើលេខដប់ គឺស្ទើរតែឥតបានចំណាយកម្លាំង។ ៨ + ៧ គឺពិបាកបន្តិច; ៨ + ២ + ៥ វិញមិនពិបាកទេ។ ផ្លាស់ ២ ពី ៧ មក នោះលំហាត់ក្លាយជា ១០ + ៥។",
          },
        ],
      },
      {
        heading: { en: "The same trick, subtracting", km: "ល្បិចដដែល សម្រាប់ការដក" },
        body: [
          {
            en: "For 43 − 8, drop to 40 first (that's 3), then take the remaining 5: 35. Two easy steps beat one hard one, every time.",
            km: "សម្រាប់ ៤៣ − ៨ ចុះមក ៤០ សិន (គឺ ៣) រួចដកនៅសល់ ៥ ទៀត៖ ៣៥។ ជំហានងាយពីរ ល្អជាងជំហានពិបាកមួយ គ្រប់ពេលវេលា។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Route every addition through the nearest ten.", km: "នាំរាល់ការបូកឆ្លងកាត់លេខដប់ដែលនៅជិតបំផុត។" },
      { en: "Subtract to the ten first, then take the rest.", km: "ដកមកដល់លេខដប់សិន រួចដកចំនួននៅសល់។" },
      { en: "Two easy steps beat one hard step.", km: "ជំហានងាយពីរ ល្អជាងជំហានពិបាកមួយ។" },
    ],
    examples: [
      { prompt: { en: "9 + 6", km: "៩ + ៦" }, solution: { en: "9 + 1 = 10, then + 5 = 15.", km: "៩ + ១ = ១០ រួច + ៥ = ១៥។" } },
      { prompt: { en: "52 − 7", km: "៥២ − ៧" }, solution: { en: "52 − 2 = 50, then − 5 = 45.", km: "៥២ − ២ = ៥០ រួច − ៥ = ៤៥។" } },
    ],
    tip: {
      en: "Say the intermediate ten out loud while you practise. Once it's automatic you can drop it.",
      km: "និយាយលេខដប់កណ្តាលឲ្យឮពេលអ្នកអនុវត្ត។ ពេលវាក្លាយជាស្វ័យប្រវត្តិ អ្នកអាចលែងនិយាយបាន។",
    },
  },
  {
    id: "m2",
    minutes: 7,
    title: { en: "The times table has patterns", km: "តារាងគុណមានលំនាំ" },
    objective: {
      en: "Cut what you have to memorise roughly in half by using structure instead of brute force.",
      km: "កាត់បន្ថយអ្វីដែលត្រូវទន្ទេញប្រហែលពាក់កណ្តាល ដោយប្រើរចនាសម្ព័ន្ធជំនួសការទន្ទេញដោយកម្លាំង។",
    },
    sections: [
      {
        heading: { en: "Half the table is free", km: "ពាក់កណ្តាលនៃតារាងគឺឥតគិតថ្លៃ" },
        body: [
          {
            en: "7 × 8 and 8 × 7 are the same fact. That symmetry alone halves the table. The ×1, ×2, ×5 and ×10 rows are trivial, and ×9 has a pattern: the digits of every answer add to nine.",
            km: "៧ × ៨ និង ៨ × ៧ គឺជាការពិតដដែល។ ភាពស៊ីមេទ្រីនេះតែម្នាក់ឯង កាត់បន្ថយតារាងពាក់កណ្តាល។ ជួរ ×១, ×២, ×៥ និង ×១០ គឺងាយស្រួល ហើយ ×៩ មានលំនាំ៖ ខ្ទង់លេខនៃចម្លើយនីមួយៗបូកគ្នាបានប្រាំបួន។",
          },
          {
            en: "What's actually left to memorise is a small, awkward core: 6×7, 6×8, 7×8, 7×9 and a handful of neighbours. Those deserve their own pile.",
            km: "អ្វីដែលនៅសល់ត្រូវទន្ទេញពិតប្រាកដ គឺជាស្នូលតូចមួយដែលពិបាកបន្តិច៖ ៦×៧, ៦×៨, ៧×៨, ៧×៩ និងមួយចំនួនតូចនៅជិតៗ។ ទាំងនោះសមនឹងមានគំនររបស់វាផ្ទាល់។",
          },
        ],
      },
      {
        heading: { en: "Build from an anchor", km: "សាងសង់ចេញពីចំណុចយោង" },
        body: [
          {
            en: "Don't know 7 × 6? You know 7 × 5 = 35. Add one more seven: 42. Anchoring on the ×5 and ×10 rows gets you to any fact in one step.",
            km: "មិនចាំ ៧ × ៦ ទេ? អ្នកដឹងថា ៧ × ៥ = ៣៥។ បន្ថែម ៧ មួយទៀត៖ ៤២។ ការយោងលើជួរ ×៥ និង ×១០ នាំអ្នកទៅដល់ការពិតណាមួយក្នុងជំហានតែមួយ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "a × b = b × a — half the table is duplicates.", km: "a × b = b × a — ពាក់កណ្តាលនៃតារាងគឺស្ទួន។" },
      { en: "Anchor on ×5 and ×10, then step up or down.", km: "យោងលើ ×៥ និង ×១០ រួចឡើង ឬចុះ។" },
      { en: "The digits of every ×9 answer sum to 9.", km: "ខ្ទង់លេខនៃចម្លើយ ×៩ ទាំងអស់បូកគ្នាបាន ៩។" },
    ],
    examples: [
      { prompt: { en: "8 × 6", km: "៨ × ៦" }, solution: { en: "8 × 5 = 40, plus one more 8 = 48.", km: "៨ × ៥ = ៤០ បូក ៨ មួយទៀត = ៤៨។" } },
      { prompt: { en: "9 × 7", km: "៩ × ៧" }, solution: { en: "10 × 7 = 70, minus one 7 = 63. (6 + 3 = 9 ✓)", km: "១០ × ៧ = ៧០ ដក ៧ មួយ = ៦៣។ (៦ + ៣ = ៩ ✓)" } },
    ],
    tip: {
      en: "Write only the awkward core onto cards. Copying facts you already know wastes the deck.",
      km: "សរសេរតែស្នូលពិបាកទៅលើកាត។ ការចម្លងការពិតដែលអ្នកចេះស្រាប់ គឺខ្ជះខ្ជាយសំណុំកាត។",
    },
  },
  {
    id: "m3",
    minutes: 6,
    title: { en: "Estimate before you calculate", km: "ប៉ាន់ស្មានមុននឹងគណនា" },
    objective: {
      en: "Catch wrong answers in one second by knowing roughly what the answer must be.",
      km: "ចាប់បានចម្លើយខុសក្នុងមួយវិនាទី ដោយដឹងជាមុនថាចម្លើយគួរតែប្រហែលប៉ុន្មាន។",
    },
    sections: [
      {
        heading: { en: "A guardrail, not a shortcut", km: "របងការពារ មិនមែនផ្លូវកាត់" },
        body: [
          {
            en: "Round both numbers to something easy first. 47 × 6 is near 50 × 6 = 300, so an answer of 82 or 2,820 is obviously wrong before you've checked a single digit. Under exam time pressure this catches more mistakes than rechecking your working does.",
            km: "បង្គត់លេខទាំងពីរទៅជាលេខងាយសិន។ ៤៧ × ៦ ជិត ៥០ × ៦ = ៣០០ ដូច្នេះចម្លើយ ៨២ ឬ ២,៨២០ គឺខុសច្បាស់ មុននឹងអ្នកពិនិត្យខ្ទង់ណាមួយផង។ ក្រោមសម្ពាធពេលវេលាប្រឡង វិធីនេះចាប់កំហុសបានច្រើនជាងការពិនិត្យរបៀបគិតឡើងវិញ។",
          },
        ],
      },
      {
        heading: { en: "Know which way you rounded", km: "ដឹងថាអ្នកបង្គត់ទៅទិសណា" },
        body: [
          {
            en: "If you rounded up, the true answer is below your estimate. 47 × 6 must be a bit under 300 — and 282 fits. That one extra thought turns a rough guess into a real check.",
            km: "បើអ្នកបង្គត់ឡើងលើ ចម្លើយពិតត្រូវតែតូចជាងការប៉ាន់ស្មានរបស់អ្នក។ ៤៧ × ៦ ត្រូវតែតិចជាង ៣០០ បន្តិច — ហើយ ២៨២ គឺត្រូវ។ គំនិតបន្ថែមមួយនោះ ប្រែការទាយប្រហាក់ប្រហែលទៅជាការត្រួតពិនិត្យពិតប្រាកដ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Round first, calculate second, compare third.", km: "បង្គត់មុន គណនាទីពីរ ប្រៀបធៀបទីបី។" },
      { en: "Rounded up → true answer is lower, and vice versa.", km: "បង្គត់ឡើង → ចម្លើយពិតទាបជាង និងផ្ទុយមកវិញ។" },
      { en: "An estimate catches order-of-magnitude errors instantly.", km: "ការប៉ាន់ស្មានចាប់បានកំហុសខុសខ្ទង់ភ្លាមៗ។" },
    ],
    examples: [
      {
        prompt: { en: "Is 19 × 21 = 399 plausible?", km: "តើ ១៩ × ២១ = ៣៩៩ សមហេតុផលទេ?" },
        solution: { en: "20 × 20 = 400, and the two roundings nearly cancel. 399 is exactly right.", km: "២០ × ២០ = ៤០០ ហើយការបង្គត់ទាំងពីរស្ទើរតែលុបគ្នា។ ៣៩៩ គឺត្រឹមត្រូវទាំងស្រុង។" },
      },
    ],
    tip: {
      en: "On the exam, estimate before you look at the options. It rules out two of the four instantly.",
      km: "នៅពេលប្រឡង ប៉ាន់ស្មានមុននឹងមើលជម្រើស។ វាកាត់ចោលពីរក្នុងចំណោមបួនភ្លាមៗ។",
    },
  },
  {
    id: "m4",
    minutes: 7,
    title: { en: "Signs and order of operations", km: "សញ្ញា និងលំដាប់នៃប្រមាណវិធី" },
    objective: {
      en: "Stop losing marks to the two things that cause most careless arithmetic errors.",
      km: "ឈប់បាត់បង់ពិន្ទុដោយសាររឿងពីរយ៉ាងដែលបង្កកំហុសគណនាដោយធ្វេសប្រហែសច្រើនបំផុត។",
    },
    sections: [
      {
        heading: { en: "Subtraction is adding a negative", km: "ការដកគឺការបូកចំនួនអវិជ្ជមាន" },
        body: [
          {
            en: "5 − 8 trips people up because they read it as \"take 8 from 5, which doesn't work\". Read it as 5 + (−8) instead and it's just a walk along the number line: start at 5, move 8 left, land on −3.",
            km: "៥ − ៨ ធ្វើឲ្យមនុស្សច្រឡំ ព្រោះពួកគេអានថា «យក ៨ ចេញពី ៥ ដែលមិនអាចធ្វើបាន»។ សូមអានវាជា ៥ + (−៨) វិញ នោះវាគ្រាន់តែជាការដើរតាមបន្ទាត់លេខ៖ ចាប់ផ្តើមនៅ ៥ ផ្លាស់ទៅឆ្វេង ៨ ជំហាន ធ្លាក់នៅ −៣។",
          },
        ],
      },
      {
        heading: { en: "Multiplication before addition, always", km: "គុណមុនបូក ជានិច្ច" },
        body: [
          {
            en: "2 + 3 × 4 is 14, not 20. The rule isn't arbitrary: 3 × 4 is a single quantity that happens to be written as a product, so it has to be resolved before it can be added to anything. Brackets exist precisely to override this when you mean otherwise.",
            km: "២ + ៣ × ៤ គឺ ១៤ មិនមែន ២០ ទេ។ ច្បាប់នេះមិនមែនតាមអំពើចិត្តទេ៖ ៣ × ៤ គឺជាបរិមាណតែមួយដែលសរសេរជាផលគុណ ដូច្នេះវាត្រូវតែគណនាឲ្យរួចមុននឹងបូកជាមួយអ្វីផ្សេង។ វង់ក្រចកមានវត្តមានយ៉ាងជាក់លាក់ដើម្បីផ្លាស់ប្តូរលំដាប់នេះ ពេលអ្នកចង់បានន័យផ្សេង។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Rewrite a − b as a + (−b) and the sign errors stop.", km: "សរសេរ a − b ជា a + (−b) នោះកំហុសសញ្ញានឹងឈប់។" },
      { en: "Brackets → multiply/divide → add/subtract.", km: "វង់ក្រចក → គុណ/ចែក → បូក/ដក។" },
      { en: "Two negatives multiplied give a positive.", km: "ចំនួនអវិជ្ជមានពីរគុណគ្នា ផ្តល់លទ្ធផលវិជ្ជមាន។" },
    ],
    examples: [
      { prompt: { en: "10 − 4 × 2", km: "១០ − ៤ × ២" }, solution: { en: "Multiply first: 10 − 8 = 2. (Not 12.)", km: "គុណមុន៖ ១០ − ៨ = ២។ (មិនមែន ១២ ទេ។)" } },
      { prompt: { en: "−6 × −3", km: "−៦ × −៣" }, solution: { en: "18 — two negatives make a positive.", km: "១៨ — អវិជ្ជមានពីរផ្តល់វិជ្ជមាន។" } },
    ],
    tip: {
      en: "When a question mixes operations, bracket the multiplication yourself before solving. It costs a second and removes the trap.",
      km: "ពេលសំណួរលាយប្រមាណវិធីច្រើន សូមដាក់វង់ក្រចកលើផ្នែកគុណដោយខ្លួនឯងមុននឹងដោះស្រាយ។ វាចំណាយពេលមួយវិនាទី ហើយលុបបំបាត់អន្ទាក់។",
    },
  },
  {
    id: "m5",
    minutes: 6,
    title: { en: "What each digit is worth", km: "តម្លៃនៃខ្ទង់លេខនីមួយៗ" },
    objective: {
      en: "Read any number by its columns, so big numbers stop feeling like a wall of digits.",
      km: "អានលេខណាមួយតាមជួរឈររបស់វា ដើម្បីកុំឲ្យលេខធំមើលទៅដូចជាជញ្ជាំងខ្ទង់លេខ។",
    },
    sections: [
      {
        heading: { en: "Every column is ten of the one beside it", km: "ជួរឈរនីមួយៗ ស្មើដប់ដងនៃជួរនៅខាងស្តាំ" },
        body: [
          {
            en: "In 4,206 the 4 is not four — it is four thousands. Step left and each column is worth ten times more; step right and it is worth ten times less. That single rule is the whole of place value.",
            km: "ក្នុងលេខ ៤,២០៦ លេខ ៤ មិនមែនស្មើបួនទេ — វាគឺបួនពាន់។ ផ្លាស់ទៅឆ្វេង ជួរឈរនីមួយៗមានតម្លៃដប់ដងច្រើនជាង; ផ្លាស់ទៅស្តាំ វាមានតម្លៃដប់ដងតិចជាង។ ក្បួនតែមួយនេះ គឺជាខ្លឹមសារទាំងមូលនៃតម្លៃទីតាំង។",
          },
          {
            en: "The zero is doing real work: it holds a column open. 406 and 46 differ only by a zero, and by 360.",
            km: "លេខសូន្យមានតួនាទីពិតប្រាកដ៖ វារក្សាជួរឈរឲ្យនៅបើក។ ៤០៦ និង ៤៦ ខុសគ្នាត្រឹមលេខសូន្យមួយ ហើយខុសគ្នា ៣៦០។",
          },
        ],
      },
      {
        heading: { en: "Rounding is just choosing a column", km: "ការបង្គត់ គ្រាន់តែជាការជ្រើសជួរឈរ" },
        body: [
          {
            en: "To round 4,206 to the nearest hundred, look at the column to the right of hundreds. It is 0, so the hundreds stay: 4,200. Five or more rounds up, four or less stays.",
            km: "ដើម្បីបង្គត់ ៤,២០៦ ទៅរយជិតបំផុត សូមមើលជួរឈរនៅខាងស្តាំនៃខ្ទង់រយ។ វាគឺ ០ ដូច្នេះខ្ទង់រយនៅដដែល៖ ៤,២០០។ ប្រាំឡើងទៅបង្គត់ឡើង បួនចុះមកនៅដដែល។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Each column left is ten times the one before it.", km: "ជួរឈរខាងឆ្វេងនីមួយៗ ស្មើដប់ដងនៃជួរមុន។" },
      { en: "A zero holds a column open — it is not nothing.", km: "លេខសូន្យរក្សាជួរឈរឲ្យនៅបើក — វាមិនមែនគ្មានន័យទេ។" },
      { en: "To round, look only at the digit one column to the right.", km: "ដើម្បីបង្គត់ សូមមើលតែខ្ទង់លេខមួយជួរនៅខាងស្តាំ។" },
    ],
    examples: [
      { prompt: { en: "What is the 7 worth in 3,714?", km: "តើលេខ ៧ ក្នុង ៣,៧១៤ មានតម្លៃប៉ុន្មាន?" }, solution: { en: "Seven hundreds — 700.", km: "ប្រាំពីររយ — ៧០០។" } },
      { prompt: { en: "Round 3,714 to the nearest thousand.", km: "បង្គត់ ៣,៧១៤ ទៅពាន់ជិតបំផុត។" }, solution: { en: "The hundreds digit is 7, so round up: 4,000.", km: "ខ្ទង់រយគឺ ៧ ដូច្នេះបង្គត់ឡើង៖ ៤,០០០។" } },
    ],
    tip: {
      en: "Say a long number out loud in columns — \"four thousand, two hundred and six\". Reading it right is half of using it right.",
      km: "អានលេខវែងឲ្យឮតាមជួរឈរ — «បួនពាន់ ពីររយ ប្រាំមួយ»។ ការអានឲ្យត្រូវ គឺពាក់កណ្តាលនៃការប្រើឲ្យត្រូវ។",
    },
  },
  {
    id: "m6",
    minutes: 6,
    title: { en: "Doubling and halving", km: "ការគុណនឹងពីរ និងការចែកនឹងពីរ" },
    objective: {
      en: "Turn hard multiplications into easy ones by moving a factor of two across.",
      km: "ប្តូរការគុណពិបាកឲ្យទៅជាងាយ ដោយផ្លាស់កត្តាពីរពីម្ខាងទៅម្ខាង។",
    },
    sections: [
      {
        heading: { en: "Halve one side, double the other", km: "ចែកម្ខាងនឹងពីរ គុណម្ខាងទៀតនឹងពីរ" },
        body: [
          {
            en: "16 × 25 looks unpleasant. Halve the 16 and double the 25: 8 × 50. Do it again: 4 × 100 = 400. The answer never changes, because you took a two out of one factor and put it into the other.",
            km: "១៦ × ២៥ មើលទៅពិបាក។ ចែក ១៦ នឹងពីរ ហើយគុណ ២៥ នឹងពីរ៖ ៨ × ៥០។ ធ្វើម្តងទៀត៖ ៤ × ១០០ = ៤០០។ ចម្លើយមិនប្តូរទេ ព្រោះអ្នកដកពីរចេញពីកត្តាមួយ រួចដាក់ចូលកត្តាមួយទៀត។",
          },
        ],
      },
      {
        heading: { en: "Doubling is the cheapest step you own", km: "ការគុណនឹងពីរ គឺជាជំហានថោកបំផុតដែលអ្នកមាន" },
        body: [
          {
            en: "Most people can double anything under a hundred without thinking. Chain it: to find 8 × 37, double 37 three times — 74, 148, 296. No table needed.",
            km: "មនុស្សភាគច្រើនអាចគុណលេខក្រោមមួយរយនឹងពីរបានដោយមិនបាច់គិត។ តភ្ជាប់វា៖ ដើម្បីរក ៨ × ៣៧ សូមគុណ ៣៧ នឹងពីរបីដង — ៧៤, ១៤៨, ២៩៦។ មិនបាច់ប្រើតារាងគុណទេ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Halving one factor and doubling the other keeps the product.", km: "ចែកកត្តាមួយនឹងពីរ ហើយគុណកត្តាមួយទៀតនឹងពីរ ផលគុណនៅដដែល។" },
      { en: "×4 is double-double; ×8 is double three times.", km: "×៤ គឺគុណពីរដងជាប់គ្នា; ×៨ គឺគុណពីរបីដង។" },
      { en: "Aim for a round number — 50, 100, 25 — then stop.", km: "តម្រង់ទៅរកលេខមូល — ៥០, ១០០, ២៥ — រួចឈប់។" },
    ],
    examples: [
      { prompt: { en: "14 × 50", km: "១៤ × ៥០" }, solution: { en: "7 × 100 = 700.", km: "៧ × ១០០ = ៧០០។" } },
      { prompt: { en: "4 × 65", km: "៤ × ៦៥" }, solution: { en: "Double 65 = 130, double again = 260.", km: "៦៥ គុណពីរ = ១៣០ គុណពីរម្តងទៀត = ២៦០។" } },
    ],
    tip: {
      en: "If a factor is even and the other ends in 5, this trick almost always pays.",
      km: "បើកត្តាមួយជាលេខគូ ហើយកត្តាមួយទៀតបញ្ចប់ដោយ ៥ ល្បិចនេះស្ទើរតែតែងតែមានប្រយោជន៍។",
    },
  },
  {
    id: "m7",
    minutes: 5,
    title: { en: "Multiplying by 10, 100 and 1000", km: "ការគុណនឹង ១០, ១០០ និង ១០០០" },
    objective: {
      en: "Move the digits, not the decimal point — and never lose a zero again.",
      km: "ផ្លាស់ខ្ទង់លេខ មិនមែនផ្លាស់សញ្ញាក្បៀស — ហើយកុំបាត់សូន្យទៀត។",
    },
    sections: [
      {
        heading: { en: "Why the zeros appear", km: "ហេតុអ្វីបានជាសូន្យលេចឡើង" },
        body: [
          {
            en: "Multiplying by ten pushes every digit one column to the left, because every digit becomes worth ten times more. The zero that shows up is just the empty units column.",
            km: "ការគុណនឹងដប់ រុញខ្ទង់លេខទាំងអស់ទៅឆ្វេងមួយជួរ ព្រោះខ្ទង់លេខនីមួយៗមានតម្លៃដប់ដងច្រើនជាង។ សូន្យដែលលេចឡើង គ្រាន់តែជាជួរឯកតាទទេប៉ុណ្ណោះ។",
          },
        ],
      },
      {
        heading: { en: "Decimals follow the same rule", km: "ទសភាគក៏ធ្វើតាមក្បួនដដែល" },
        body: [
          {
            en: "3.4 × 100 shifts two columns left: 340. Dividing shifts the other way — 3.4 ÷ 100 = 0.034. Count the zeros, count the columns.",
            km: "៣.៤ × ១០០ រុញទៅឆ្វេងពីរជួរ៖ ៣៤០។ ការចែករុញទៅផ្លូវផ្ទុយ — ៣.៤ ÷ ១០០ = ០.០៣៤។ រាប់សូន្យ រាប់ជួរឈរ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "One zero, one column; three zeros, three columns.", km: "សូន្យមួយ ជួរមួយ; សូន្យបី ជួរបី។" },
      { en: "Multiplying moves left, dividing moves right.", km: "ការគុណផ្លាស់ទៅឆ្វេង ការចែកផ្លាស់ទៅស្តាំ។" },
      { en: "×20 is ×2 then ×10 — split the round part off.", km: "×២០ គឺ ×២ រួច ×១០ — បំបែកផ្នែកមូលចេញ។" },
    ],
    examples: [
      { prompt: { en: "62 × 300", km: "៦២ × ៣០០" }, solution: { en: "62 × 3 = 186, then two columns left: 18,600.", km: "៦២ × ៣ = ១៨៦ រួចផ្លាស់ទៅឆ្វេងពីរជួរ៖ ១៨,៦០០។" } },
      { prompt: { en: "0.7 × 1000", km: "០.៧ × ១០០០" }, solution: { en: "Three columns left: 700.", km: "ផ្លាស់ទៅឆ្វេងបីជួរ៖ ៧០០។" } },
    ],
    tip: {
      en: "Strip the zeros off first, do the small multiplication, then put them back. Fewer digits, fewer slips.",
      km: "ដកសូន្យចេញសិន គុណលេខតូច រួចដាក់សូន្យត្រឡប់វិញ។ ខ្ទង់លេខតិច កំហុសតិច។",
    },
  },
  {
    id: "m8",
    minutes: 8,
    title: { en: "Split the number, then multiply", km: "បំបែកលេខ រួចគុណ" },
    objective: {
      en: "Multiply any two-digit numbers by breaking them into parts you already know.",
      km: "គុណលេខពីរខ្ទង់ណាមួយ ដោយបំបែកវាទៅជាផ្នែកដែលអ្នកចេះស្រាប់។",
    },
    sections: [
      {
        heading: { en: "23 × 7 is 20 × 7 plus 3 × 7", km: "២៣ × ៧ គឺ ២០ × ៧ បូក ៣ × ៧" },
        body: [
          {
            en: "Nothing in multiplication says you must take the number whole. Split 23 into 20 and 3, multiply each by 7, add: 140 + 21 = 161. This is exactly what long multiplication does on paper, only you can see it.",
            km: "គ្មានអ្វីក្នុងការគុណតម្រូវឲ្យអ្នកយកលេខទាំងមូលទេ។ បំបែក ២៣ ជា ២០ និង ៣ គុណនីមួយៗនឹង ៧ រួចបូក៖ ១៤០ + ២១ = ១៦១។ នេះជាអ្វីដែលការគុណវែងលើក្រដាសធ្វើ តែអ្នកមើលឃើញវា។",
          },
        ],
      },
      {
        heading: { en: "Both numbers can split", km: "លេខទាំងពីរអាចបំបែកបាន" },
        body: [
          {
            en: "For 23 × 14, split both: (20 + 3) × (10 + 4) gives 200 + 80 + 30 + 12 = 322. Four small products, no carrying.",
            km: "សម្រាប់ ២៣ × ១៤ សូមបំបែកទាំងពីរ៖ (២០ + ៣) × (១០ + ៤) បាន ២០០ + ៨០ + ៣០ + ១២ = ៣២២។ ផលគុណតូចបួន គ្មានការត្រៀមទុក។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Split into tens and units, multiply each, add.", km: "បំបែកជាខ្ទង់ដប់ និងឯកតា គុណនីមួយៗ រួចបូក។" },
      { en: "Subtracting can be easier: 19 × 6 is 20 × 6 − 6.", km: "ការដកអាចងាយជាង៖ ១៩ × ៦ គឺ ២០ × ៦ − ៦។" },
      { en: "Long multiplication is this method, written down.", km: "ការគុណវែង គឺជាវិធីនេះ ដែលសរសេរចុះ។" },
    ],
    examples: [
      { prompt: { en: "34 × 6", km: "៣៤ × ៦" }, solution: { en: "30 × 6 = 180, 4 × 6 = 24, total 204.", km: "៣០ × ៦ = ១៨០, ៤ × ៦ = ២៤, សរុប ២០៤។" } },
      { prompt: { en: "29 × 5", km: "២៩ × ៥" }, solution: { en: "30 × 5 = 150, minus one 5 = 145.", km: "៣០ × ៥ = ១៥០ ដក ៥ មួយ = ១៤៥។" } },
    ],
    tip: {
      en: "Round up to the friendly number and subtract the difference — it is usually fewer steps than splitting.",
      km: "បង្គត់ឡើងទៅលេខងាយ រួចដកផលសល់ — ជាធម្មតាវាមានជំហានតិចជាងការបំបែក។",
    },
  },
  {
    id: "m9",
    minutes: 7,
    title: { en: "Division, and what a remainder means", km: "ការចែក និងអត្ថន័យនៃសំណល់" },
    objective: {
      en: "Read a division question correctly and know what to do with what is left over.",
      km: "អានសំណួរចែកឲ្យត្រូវ ហើយដឹងថាត្រូវធ្វើអ្វីជាមួយចំនួនដែលនៅសល់។",
    },
    sections: [
      {
        heading: { en: "Two questions wear the same symbol", km: "សំណួរពីរប្រភេទ ប្រើសញ្ញាដដែល" },
        body: [
          {
            en: "20 ÷ 4 can mean \"share 20 between 4\" (each gets 5) or \"how many fours fit in 20?\" (five of them). Same arithmetic, different picture — and word problems use both.",
            km: "២០ ÷ ៤ អាចមានន័យថា «ចែក ២០ ជូន ៤ នាក់» (ម្នាក់បាន ៥) ឬ «មានប៉ុន្មានក្រុមនៃ ៤ ក្នុង ២០?» (មានប្រាំ)។ គណិតដដែល តែរូបភាពខុសគ្នា — ហើយលំហាត់ជាអត្ថបទប្រើទាំងពីរ។",
          },
        ],
      },
      {
        heading: { en: "The remainder is an instruction", km: "សំណល់គឺជាការណែនាំ" },
        body: [
          {
            en: "38 pens into boxes of 5 gives 7 boxes remainder 3. Whether the answer is 7 or 8 depends on the question: seven full boxes, but eight boxes if every pen must be packed.",
            km: "ប៊ិច ៣៨ ដាក់ក្នុងប្រអប់មួយៗ ៥ បាន ៧ ប្រអប់ សល់ ៣។ ចម្លើយជា ៧ ឬ ៨ គឺអាស្រ័យលើសំណួរ៖ ប្រអប់ពេញ ៧ ប៉ុន្តែ ៨ ប្រអប់ បើត្រូវដាក់ប៊ិចទាំងអស់។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Sharing and grouping are the same sum, different story.", km: "ការចែក និងការដាក់ជាក្រុម គឺជាលំហាត់ដដែល តែរឿងខុសគ្នា។" },
      { en: "Check a division by multiplying back.", km: "ពិនិត្យការចែក ដោយគុណត្រឡប់វិញ។" },
      { en: "Decide from the question whether to round the remainder up.", km: "សម្រេចពីសំណួរថា ត្រូវបង្គត់សំណល់ឡើងឬអត់។" },
    ],
    examples: [
      { prompt: { en: "91 ÷ 7", km: "៩១ ÷ ៧" }, solution: { en: "70 is ten sevens, 21 is three more: 13.", km: "៧០ គឺ ៧ ដប់ដង, ២១ គឺបីទៀត៖ ១៣។" } },
      { prompt: { en: "50 students, buses of 12. How many buses?", km: "សិស្ស ៥០ នាក់ ឡានក្រុងមួយផ្ទុក ១២។ ត្រូវការឡានប៉ុន្មាន?" }, solution: { en: "50 ÷ 12 = 4 remainder 2, so 5 buses.", km: "៥០ ÷ ១២ = ៤ សល់ ២ ដូច្នេះត្រូវការ ៥ ឡាន។" } },
    ],
    tip: {
      en: "Build up in easy chunks — tens of the divisor first — instead of guessing the whole answer at once.",
      km: "សាងសង់ជាកញ្ចប់ងាយៗ — ដប់ដងនៃតួចែកសិន — ជំនួសការទាយចម្លើយទាំងមូលក្នុងពេលតែមួយ។",
    },
  },
  {
    id: "m10",
    minutes: 6,
    title: { en: "Tests for dividing exactly", km: "ការសាកល្បងចែកដាច់" },
    objective: {
      en: "Know in seconds whether a number divides by 2, 3, 4, 5, 6, 9 or 10.",
      km: "ដឹងក្នុងរយៈពេលប៉ុន្មានវិនាទី ថាតើលេខមួយចែកដាច់នឹង ២, ៣, ៤, ៥, ៦, ៩ ឬ ១០ ឬអត់។",
    },
    sections: [
      {
        heading: { en: "The tests worth knowing", km: "ការសាកល្បងដែលគួរចេះ" },
        body: [
          {
            en: "By 2: the last digit is even. By 5: it ends in 0 or 5. By 10: it ends in 0. By 4: the last two digits divide by 4. By 3: the digits add to a multiple of 3. By 9: they add to a multiple of 9. By 6: it passes both the 2 and 3 tests.",
            km: "នឹង ២៖ ខ្ទង់ចុងក្រោយជាលេខគូ។ នឹង ៥៖ បញ្ចប់ដោយ ០ ឬ ៥។ នឹង ១០៖ បញ្ចប់ដោយ ០។ នឹង ៤៖ ខ្ទង់ពីរចុងក្រោយចែកដាច់នឹង ៤។ នឹង ៣៖ ខ្ទង់លេខបូកគ្នាបានពហុគុណនៃ ៣។ នឹង ៩៖ បូកគ្នាបានពហុគុណនៃ ៩។ នឹង ៦៖ ជាប់ទាំងការសាកល្បង ២ និង ៣។",
          },
        ],
      },
      {
        heading: { en: "Where you actually use them", km: "កន្លែងដែលអ្នកប្រើវាពិតប្រាកដ" },
        body: [
          {
            en: "Simplifying a fraction is the main one: to cut 138/174 down you need a shared factor, and the digit-sum test finds 3 in both instantly.",
            km: "ការសម្រួលប្រភាគគឺជាការប្រើសំខាន់៖ ដើម្បីកាត់បន្ថយ ១៣៨/១៧៤ អ្នកត្រូវការកត្តារួម ហើយការសាកល្បងបូកខ្ទង់លេខរក ៣ ឃើញភ្លាមក្នុងលេខទាំងពីរ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Digit sum divisible by 3 or 9 → so is the number.", km: "ផលបូកខ្ទង់លេខចែកដាច់នឹង ៣ ឬ ៩ → លេខនោះក៏ចែកដាច់ដែរ។" },
      { en: "For 4, only the last two digits matter.", km: "សម្រាប់ ៤ មានតែខ្ទង់ពីរចុងក្រោយដែលសំខាន់។" },
      { en: "6 = passes 2 and 3 together.", km: "៦ = ជាប់ទាំង ២ និង ៣ ជាមួយគ្នា។" },
    ],
    examples: [
      { prompt: { en: "Does 3 divide 4,713?", km: "តើ ៣ ចែកដាច់ ៤,៧១៣ ឬទេ?" }, solution: { en: "4+7+1+3 = 15, and 15 divides by 3 — yes.", km: "៤+៧+១+៣ = ១៥ ហើយ ១៥ ចែកដាច់នឹង ៣ — បាទ/ចាស។" } },
      { prompt: { en: "Simplify 24/36.", km: "សម្រួល ២៤/៣៦។" }, solution: { en: "Both pass the 12 test: 2/3.", km: "ទាំងពីរចែកដាច់នឹង ១២៖ ២/៣។" } },
    ],
    tip: {
      en: "Test 2 and 3 before anything else — between them they clear most fractions you meet.",
      km: "សាកល្បង ២ និង ៣ មុនគេ — ទាំងពីរនេះដោះស្រាយប្រភាគភាគច្រើនដែលអ្នកជួប។",
    },
  },
  {
    id: "m11",
    minutes: 7,
    title: { en: "Factors, multiples and primes", km: "កត្តា ពហុគុណ និងចំនួនបឋម" },
    objective: {
      en: "Tell these three apart and use factor pairs to break any number down.",
      km: "បែងចែកបីនេះឲ្យដាច់ ហើយប្រើគូកត្តាដើម្បីបំបែកលេខណាមួយ។",
    },
    sections: [
      {
        heading: { en: "Factors go in, multiples go out", km: "កត្តាចូលក្នុង ពហុគុណចេញក្រៅ" },
        body: [
          {
            en: "Factors of 12 are the numbers that divide it: 1, 2, 3, 4, 6, 12. Multiples of 12 are what you get by multiplying it: 12, 24, 36 and on forever. Factors are a short list; multiples never end.",
            km: "កត្តានៃ ១២ គឺលេខដែលចែកដាច់វា៖ ១, ២, ៣, ៤, ៦, ១២។ ពហុគុណនៃ ១២ គឺអ្វីដែលអ្នកបានពីការគុណវា៖ ១២, ២៤, ៣៦ និងបន្តទៅមិនចប់។ កត្តាជាបញ្ជីខ្លី; ពហុគុណមិនចេះចប់។",
          },
        ],
      },
      {
        heading: { en: "Find factors in pairs", km: "រកកត្តាជាគូ" },
        body: [
          {
            en: "Walk up from 1 and record both partners: 1×24, 2×12, 3×8, 4×6. Stop when the pair meets in the middle — you have them all. A prime has only the boring pair, 1 and itself.",
            km: "ដើរឡើងពី ១ ហើយកត់ត្រាដៃគូទាំងពីរ៖ ១×២៤, ២×១២, ៣×៨, ៤×៦។ ឈប់ពេលគូជួបគ្នានៅកណ្តាល — អ្នកបានទាំងអស់ហើយ។ ចំនួនបឋមមានតែគូធម្មតា គឺ ១ និងខ្លួនវា។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Factors divide the number; multiples come from it.", km: "កត្តាចែកលេខនោះ; ពហុគុណកើតចេញពីវា។" },
      { en: "List factors in pairs so you miss none.", km: "រាយកត្តាជាគូ ដើម្បីកុំឲ្យខកខាន។" },
      { en: "A prime has exactly two factors. 1 is not prime.", km: "ចំនួនបឋមមានកត្តាពិតប្រាកដពីរ។ ១ មិនមែនជាចំនួនបឋមទេ។" },
    ],
    examples: [
      { prompt: { en: "List the factors of 18.", km: "រាយកត្តានៃ ១៨។" }, solution: { en: "1×18, 2×9, 3×6 → 1, 2, 3, 6, 9, 18.", km: "១×១៨, ២×៩, ៣×៦ → ១, ២, ៣, ៦, ៩, ១៨។" } },
      { prompt: { en: "Is 51 prime?", km: "តើ ៥១ ជាចំនួនបឋមទេ?" }, solution: { en: "No — 5+1 = 6, so 3 divides it: 3 × 17.", km: "ទេ — ៥+១ = ៦ ដូច្នេះ ៣ ចែកដាច់វា៖ ៣ × ១៧។" } },
    ],
    tip: {
      en: "You only have to test up to the square root. For 51, stop at 7.",
      km: "អ្នកគ្រាន់តែសាកល្បងរហូតដល់ឬសការេប៉ុណ្ណោះ។ សម្រាប់ ៥១ ឈប់ត្រឹម ៧។",
    },
  },
  {
    id: "m12",
    minutes: 6,
    title: { en: "What a fraction actually says", km: "អត្ថន័យពិតនៃប្រភាគ" },
    objective: {
      en: "Read the two numbers in a fraction as an instruction rather than a picture to memorise.",
      km: "អានលេខទាំងពីរក្នុងប្រភាគជាការណែនាំ មិនមែនជារូបភាពត្រូវទន្ទេញ។",
    },
    sections: [
      {
        heading: { en: "Bottom cuts, top counts", km: "ខាងក្រោមកាត់ ខាងលើរាប់" },
        body: [
          {
            en: "In 3/4 the 4 says cut the whole into four equal parts; the 3 says take three of them. That is the entire definition, and it survives everything you will later do to fractions.",
            km: "ក្នុង ៣/៤ លេខ ៤ ប្រាប់ឲ្យកាត់ទាំងមូលជាបួនផ្នែកស្មើគ្នា; លេខ ៣ ប្រាប់ឲ្យយកបីក្នុងចំណោមនោះ។ នោះជានិយមន័យទាំងមូល ហើយវានៅតែពិតគ្រប់ពេលក្រោយៗទៀត។",
          },
          {
            en: "It is also a division waiting to happen: 3/4 is 3 ÷ 4 = 0.75. Fraction, division and decimal are three faces of one number.",
            km: "វាក៏ជាការចែកដែលរង់ចាំកើតឡើងផងដែរ៖ ៣/៤ គឺ ៣ ÷ ៤ = ០.៧៥។ ប្រភាគ ការចែក និងទសភាគ គឺជាបីមុខនៃលេខតែមួយ។",
          },
        ],
      },
      {
        heading: { en: "Bigger bottom, smaller piece", km: "ខាងក្រោមធំ ចំណែកតូច" },
        body: [
          {
            en: "1/8 is smaller than 1/3, even though 8 is bigger — more cuts means thinner slices. This is the one place fractions feel backwards, and it catches people for years.",
            km: "១/៨ តូចជាង ១/៣ ទោះបី ៨ ធំជាងក៏ដោយ — កាត់ច្រើន មានន័យថាចំណែកស្តើងជាង។ នេះជាចំណុចតែមួយដែលប្រភាគមើលទៅផ្ទុយ ហើយវាធ្វើឲ្យមនុស្សច្រឡំអស់ជាច្រើនឆ្នាំ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Denominator cuts, numerator counts.", km: "ភាគបែងកាត់ ភាគយករាប់។" },
      { en: "A fraction is also a division.", km: "ប្រភាគក៏ជាការចែកផងដែរ។" },
      { en: "A bigger denominator makes a smaller piece.", km: "ភាគបែងធំជាង ធ្វើឲ្យចំណែកតូចជាង។" },
    ],
    examples: [
      { prompt: { en: "Which is bigger, 2/5 or 1/2?", km: "តើមួយណាធំជាង ២/៥ ឬ ១/២?" }, solution: { en: "1/2 = 2.5/5, so 1/2 wins.", km: "១/២ = ២.៥/៥ ដូច្នេះ ១/២ ធំជាង។" } },
      { prompt: { en: "Write 7/10 as a decimal.", km: "សរសេរ ៧/១០ ជាទសភាគ។" }, solution: { en: "7 ÷ 10 = 0.7.", km: "៧ ÷ ១០ = ០.៧។" } },
    ],
    tip: {
      en: "Compare any fraction to 1/2 first. It settles most \"which is bigger\" questions on sight.",
      km: "ប្រៀបធៀបប្រភាគនីមួយៗនឹង ១/២ សិន។ វាដោះស្រាយសំណួរ «មួយណាធំជាង» ភាគច្រើនភ្លាមៗ។",
    },
  },
  {
    id: "m13",
    minutes: 6,
    title: { en: "Equivalent fractions", km: "ប្រភាគស្មើគ្នា" },
    objective: {
      en: "Rewrite a fraction without changing its value, and reduce it to its simplest form.",
      km: "សរសេរប្រភាគឡើងវិញដោយមិនប្តូរតម្លៃ ហើយសម្រួលវាទៅជាទម្រង់សាមញ្ញបំផុត។",
    },
    sections: [
      {
        heading: { en: "Multiply top and bottom by the same thing", km: "គុណខាងលើ និងខាងក្រោមនឹងលេខដដែល" },
        body: [
          {
            en: "2/3 = 4/6 = 20/30. Multiplying both parts by the same number is multiplying by 1 in disguise, so the value cannot move. Cutting the cake into more slices does not give you more cake.",
            km: "២/៣ = ៤/៦ = ២០/៣០។ ការគុណផ្នែកទាំងពីរនឹងលេខដដែល គឺជាការគុណនឹង ១ ក្នុងទម្រង់ក្លែងខ្លួន ដូច្នេះតម្លៃមិនអាចប្តូរបានទេ។ ការកាត់នំជាចំណែកច្រើនជាង មិនធ្វើឲ្យអ្នកបាននំច្រើនជាងទេ។",
          },
        ],
      },
      {
        heading: { en: "Simplifying is the same move, backwards", km: "ការសម្រួល គឺជាចលនាដដែល តែថយក្រោយ" },
        body: [
          {
            en: "To simplify, divide both parts by a shared factor until none is left. 18/24: both divide by 6, giving 3/4. Use the divisibility tests from earlier to spot the factor.",
            km: "ដើម្បីសម្រួល សូមចែកផ្នែកទាំងពីរនឹងកត្តារួម រហូតដល់គ្មានសល់។ ១៨/២៤៖ ទាំងពីរចែកដាច់នឹង ៦ បាន ៣/៤។ ប្រើការសាកល្បងចែកដាច់ខាងលើ ដើម្បីរកកត្តា។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Same number on top and bottom keeps the value.", km: "លេខដដែលនៅខាងលើនិងខាងក្រោម រក្សាតម្លៃដដែល។" },
      { en: "Simplify by dividing out shared factors.", km: "សម្រួលដោយចែកកត្តារួមចេញ។" },
      { en: "Simplest form has no factor left in common.", km: "ទម្រង់សាមញ្ញបំផុត គ្មានកត្តារួមនៅសល់ទេ។" },
    ],
    examples: [
      { prompt: { en: "Write 3/5 with a denominator of 20.", km: "សរសេរ ៣/៥ ដោយមានភាគបែង ២០។" }, solution: { en: "×4 on both: 12/20.", km: "គុណ ៤ ទាំងពីរ៖ ១២/២០។" } },
      { prompt: { en: "Simplify 45/60.", km: "សម្រួល ៤៥/៦០។" }, solution: { en: "Both ÷15 → 3/4.", km: "ទាំងពីរចែក ១៥ → ៣/៤។" } },
    ],
    tip: {
      en: "Simplify before you calculate, not after. Small numbers are easier to be right about.",
      km: "សម្រួលមុននឹងគណនា មិនមែនក្រោយទេ។ លេខតូចជាង ធ្វើឲ្យត្រឹមត្រូវងាយជាង។",
    },
  },
  {
    id: "m14",
    minutes: 8,
    title: { en: "Adding and subtracting fractions", km: "ការបូក និងដកប្រភាគ" },
    objective: {
      en: "Add fractions safely by making the pieces the same size first.",
      km: "បូកប្រភាគឲ្យត្រឹមត្រូវ ដោយធ្វើឲ្យចំណែកមានទំហំដូចគ្នាជាមុនសិន។",
    },
    sections: [
      {
        heading: { en: "You can only add same-sized pieces", km: "អ្នកអាចបូកបានតែចំណែកទំហំដូចគ្នា" },
        body: [
          {
            en: "1/2 + 1/3 is not 2/5. Halves and thirds are different pieces, so first rewrite both over 6: 3/6 + 2/6 = 5/6. Now the tops can be counted.",
            km: "១/២ + ១/៣ មិនស្មើ ២/៥ ទេ។ ពាក់កណ្តាល និងមួយភាគបី ជាចំណែកខុសគ្នា ដូច្នេះត្រូវសរសេរទាំងពីរលើ ៦ សិន៖ ៣/៦ + ២/៦ = ៥/៦។ ឥឡូវអាចរាប់ភាគយកបាន។",
          },
        ],
      },
      {
        heading: { en: "Choosing the common bottom", km: "ការជ្រើសភាគបែងរួម" },
        body: [
          {
            en: "Multiplying the two denominators always works. The smallest common multiple keeps the numbers tidier: for 1/4 + 1/6, use 12 rather than 24.",
            km: "ការគុណភាគបែងទាំងពីរ តែងតែដំណើរការ។ ពហុគុណរួមតូចបំផុត ធ្វើឲ្យលេខស្អាតជាង៖ សម្រាប់ ១/៤ + ១/៦ សូមប្រើ ១២ ជាជាង ២៤។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Same denominator first, then add the tops only.", km: "ភាគបែងដូចគ្នាសិន រួចបូកតែភាគយក។" },
      { en: "Never add the denominators.", km: "កុំបូកភាគបែងជាដាច់ខាត។" },
      { en: "Simplify the answer at the end.", km: "សម្រួលចម្លើយនៅចុងបញ្ចប់។" },
    ],
    examples: [
      { prompt: { en: "2/5 + 1/3", km: "២/៥ + ១/៣" }, solution: { en: "6/15 + 5/15 = 11/15.", km: "៦/១៥ + ៥/១៥ = ១១/១៥។" } },
      { prompt: { en: "3/4 − 1/6", km: "៣/៤ − ១/៦" }, solution: { en: "9/12 − 2/12 = 7/12.", km: "៩/១២ − ២/១២ = ៧/១២។" } },
    ],
    tip: {
      en: "Estimate first: 2/5 + 1/3 is a bit under 1. If your answer says 3, you slipped.",
      km: "ប៉ាន់ស្មានសិន៖ ២/៥ + ១/៣ តិចជាង ១ បន្តិច។ បើចម្លើយអ្នកបាន ៣ នោះអ្នកខុសហើយ។",
    },
  },
  {
    id: "m15",
    minutes: 7,
    title: { en: "Multiplying and dividing fractions", km: "ការគុណ និងចែកប្រភាគ" },
    objective: {
      en: "Use the two rules that are easier than adding — and understand why dividing flips.",
      km: "ប្រើក្បួនពីរដែលងាយជាងការបូក — ហើយយល់ថាហេតុអ្វីការចែកត្រូវត្រឡប់។",
    },
    sections: [
      {
        heading: { en: "Multiplying: straight across", km: "ការគុណ៖ គុណទល់មុខគ្នា" },
        body: [
          {
            en: "2/3 × 4/5 = 8/15. Tops times tops, bottoms times bottoms — no common denominator needed. \"Of\" means multiply: half of 2/3 is 1/2 × 2/3 = 1/3.",
            km: "២/៣ × ៤/៥ = ៨/១៥។ ភាគយកគុណភាគយក ភាគបែងគុណភាគបែង — មិនត្រូវការភាគបែងរួមទេ។ ពាក្យ «នៃ» មានន័យថាគុណ៖ ពាក់កណ្តាលនៃ ២/៣ គឺ ១/២ × ២/៣ = ១/៣។",
          },
        ],
      },
      {
        heading: { en: "Dividing: multiply by the flip", km: "ការចែក៖ គុណនឹងប្រភាគត្រឡប់" },
        body: [
          {
            en: "3 ÷ 1/4 asks how many quarters fit in 3 — twelve. Flipping and multiplying gives 3 × 4/1 = 12. The flip is not a trick; it is the grouping question written down.",
            km: "៣ ÷ ១/៤ សួរថាមានប៉ុន្មានភាគបួនក្នុង ៣ — ដប់ពីរ។ ការត្រឡប់រួចគុណ បាន ៣ × ៤/១ = ១២។ ការត្រឡប់មិនមែនជាល្បិចទេ; វាជាសំណួរដាក់ជាក្រុមដែលសរសេរចុះ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Multiply straight across, no common denominator.", km: "គុណទល់មុខគ្នា ដោយមិនចាំបាច់ភាគបែងរួម។" },
      { en: "\"Of\" means ×.", km: "ពាក្យ «នៃ» មានន័យថា ×។" },
      { en: "Dividing by a fraction = multiplying by its flip.", km: "ការចែកនឹងប្រភាគ = ការគុណនឹងប្រភាគត្រឡប់។" },
    ],
    examples: [
      { prompt: { en: "3/4 of 20", km: "៣/៤ នៃ ២០" }, solution: { en: "20 ÷ 4 = 5, then × 3 = 15.", km: "២០ ÷ ៤ = ៥ រួច × ៣ = ១៥។" } },
      { prompt: { en: "2/3 ÷ 4/9", km: "២/៣ ÷ ៤/៩" }, solution: { en: "2/3 × 9/4 = 18/12 = 3/2.", km: "២/៣ × ៩/៤ = ១៨/១២ = ៣/២។" } },
    ],
    tip: {
      en: "Cancel before multiplying — crossing out shared factors early keeps the numbers small.",
      km: "សម្រួលមុននឹងគុណ — ការកាត់កត្តារួមតាំងពីដំបូង រក្សាលេខឲ្យតូច។",
    },
  },
  {
    id: "m16",
    minutes: 6,
    title: { en: "Decimals in disguise", km: "ទសភាគក្នុងទម្រង់ក្លែងខ្លួន" },
    objective: {
      en: "Move between fractions and decimals, and add decimals without misplacing a column.",
      km: "ប្តូររវាងប្រភាគនិងទសភាគ ហើយបូកទសភាគដោយមិនដាក់ខុសជួរឈរ។",
    },
    sections: [
      {
        heading: { en: "A decimal is a fraction over ten", km: "ទសភាគ គឺជាប្រភាគលើគោលដប់" },
        body: [
          {
            en: "0.7 is 7/10 and 0.25 is 25/100. Place value simply keeps going to the right of the point: tenths, hundredths, thousandths.",
            km: "០.៧ គឺ ៧/១០ ហើយ ០.២៥ គឺ ២៥/១០០។ តម្លៃទីតាំងគ្រាន់តែបន្តទៅខាងស្តាំនៃសញ្ញាក្បៀស៖ ភាគដប់ ភាគរយ ភាគពាន់។",
          },
        ],
      },
      {
        heading: { en: "Line up the point, not the digits", km: "តម្រឹមសញ្ញាក្បៀស មិនមែនខ្ទង់លេខ" },
        body: [
          {
            en: "Adding 12.4 and 3.75 goes wrong when the digits are lined up right-to-left. Line up the decimal points, pad with a zero — 12.40 + 3.75 = 16.15 — and the columns take care of themselves.",
            km: "ការបូក ១២.៤ និង ៣.៧៥ នឹងខុស ពេលតម្រឹមខ្ទង់លេខពីស្តាំទៅឆ្វេង។ តម្រឹមសញ្ញាក្បៀស បំពេញដោយសូន្យ — ១២.៤០ + ៣.៧៥ = ១៦.១៥ — រួចជួរឈរនឹងត្រូវដោយខ្លួនឯង។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "0.1 = 1/10, 0.01 = 1/100.", km: "០.១ = ១/១០, ០.០១ = ១/១០០។" },
      { en: "Pad with zeros so both numbers have the same length.", km: "បំពេញសូន្យ ដើម្បីឲ្យលេខទាំងពីរមានប្រវែងដូចគ្នា។" },
      { en: "Know 1/2, 1/4, 1/5 and 3/4 as decimals by heart.", km: "ចាំ ១/២, ១/៤, ១/៥ និង ៣/៤ ជាទសភាគដោយចិត្ត។" },
    ],
    examples: [
      { prompt: { en: "Write 3/8 as a decimal.", km: "សរសេរ ៣/៨ ជាទសភាគ។" }, solution: { en: "3 ÷ 8 = 0.375.", km: "៣ ÷ ៨ = ០.៣៧៥។" } },
      { prompt: { en: "0.6 + 0.45", km: "០.៦ + ០.៤៥" }, solution: { en: "0.60 + 0.45 = 1.05.", km: "០.៦០ + ០.៤៥ = ១.០៥។" } },
    ],
    tip: {
      en: "Trailing zeros after the point change nothing: 0.6 and 0.60 are the same number.",
      km: "សូន្យនៅខាងចុងក្រោយសញ្ញាក្បៀស មិនប្តូរអ្វីទេ៖ ០.៦ និង ០.៦០ ជាលេខតែមួយ។",
    },
  },
  {
    id: "m17",
    minutes: 7,
    title: { en: "Percentages in your head", km: "ភាគរយក្នុងចិត្ត" },
    objective: {
      en: "Build any percentage from 10%, 5% and 1% instead of reaching for a calculator.",
      km: "សាងសង់ភាគរយណាមួយពី ១០%, ៥% និង ១% ជំនួសការប្រើម៉ាស៊ីនគិតលេខ។",
    },
    sections: [
      {
        heading: { en: "Percent means per hundred", km: "ភាគរយ មានន័យថាក្នុងមួយរយ" },
        body: [
          {
            en: "25% is 25/100 = 1/4. Once a percentage is a fraction you already know, the work disappears: 25% of 60 is a quarter of 60 = 15.",
            km: "២៥% គឺ ២៥/១០០ = ១/៤។ ពេលភាគរយក្លាយជាប្រភាគដែលអ្នកចេះស្រាប់ ការងារបាត់ទៅ៖ ២៥% នៃ ៦០ គឺមួយភាគបួននៃ ៦០ = ១៥។",
          },
        ],
      },
      {
        heading: { en: "The 10% ladder", km: "ជណ្តើរ ១០%" },
        body: [
          {
            en: "10% is one column shift: 10% of 240 is 24. Half of that is 5% (12), a tenth of it is 1% (2.4). Stack them: 17% = 24 + 12 + 4.8 = 40.8.",
            km: "១០% គឺការផ្លាស់មួយជួរឈរ៖ ១០% នៃ ២៤០ គឺ ២៤។ ពាក់កណ្តាលនៃនោះគឺ ៥% (១២) មួយភាគដប់នៃនោះគឺ ១% (២.៤)។ ដាក់បញ្ចូលគ្នា៖ ១៧% = ២៤ + ១២ + ៤.៨ = ៤០.៨។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "10% = shift one column right.", km: "១០% = ផ្លាស់ទៅស្តាំមួយជួរឈរ។" },
      { en: "5% is half of 10%; 1% is a tenth of it.", km: "៥% គឺពាក់កណ្តាលនៃ ១០%; ១% គឺមួយភាគដប់នៃវា។" },
      { en: "x% of y = y% of x — swap if it is easier.", km: "x% នៃ y = y% នៃ x — ប្តូរបើវាងាយជាង។" },
    ],
    examples: [
      { prompt: { en: "15% of 80", km: "១៥% នៃ ៨០" }, solution: { en: "10% = 8, 5% = 4, total 12.", km: "១០% = ៨, ៥% = ៤, សរុប ១២។" } },
      { prompt: { en: "A $40 shirt, 30% off. Pay what?", km: "អាវ ៤០ ដុល្លារ បញ្ចុះ ៣០%។ ត្រូវបង់ប៉ុន្មាន?" }, solution: { en: "Pay 70%: 10% = 4, so 7 × 4 = $28.", km: "បង់ ៧០%៖ ១០% = ៤ ដូច្នេះ ៧ × ៤ = ២៨ ដុល្លារ។" } },
    ],
    tip: {
      en: "For a discount, work out what you pay, not what you save. One step instead of two.",
      km: "សម្រាប់ការបញ្ចុះតម្លៃ សូមគណនាអ្វីដែលអ្នកត្រូវបង់ មិនមែនអ្វីដែលអ្នកសន្សំបានទេ។ ជំហានមួយ ជំនួសពីរ។",
    },
  },
  {
    id: "m18",
    minutes: 7,
    title: { en: "Ratio and proportion", km: "សមាមាត្រ និងធៀប" },
    objective: {
      en: "Share an amount in a given ratio and scale a recipe up or down without guessing.",
      km: "ចែកចំនួនតាមសមាមាត្រដែលបានកំណត់ ហើយពង្រីក ឬបង្រួមរូបមន្តដោយមិនបាច់ទាយ។",
    },
    sections: [
      {
        heading: { en: "Count the shares first", km: "រាប់ចំណែកសិន" },
        body: [
          {
            en: "Split $60 in the ratio 2:3. That is 5 shares in total, so one share is $12. The two parts are $24 and $36 — and they add back to $60, which is your check.",
            km: "ចែក ៦០ ដុល្លារ តាមសមាមាត្រ ២:៣។ សរុបមាន ៥ ចំណែក ដូច្នេះមួយចំណែកគឺ ១២ ដុល្លារ។ ផ្នែកទាំងពីរគឺ ២៤ ដុល្លារ និង ៣៦ ដុល្លារ — ហើយបូកគ្នាវិញបាន ៦០ ដុល្លារ ដែលជាការត្រួតពិនិត្យរបស់អ្នក។",
          },
        ],
      },
      {
        heading: { en: "Scale by finding one unit", km: "ពង្រីកដោយរកឯកតាមួយ" },
        body: [
          {
            en: "If 4 notebooks cost $6, one costs $1.50, so 10 cost $15. Going through the single unit turns every proportion question into two easy steps.",
            km: "បើសៀវភៅ ៤ ក្បាល ថ្លៃ ៦ ដុល្លារ នោះមួយក្បាលថ្លៃ ១.៥០ ដុល្លារ ដូច្នេះ ១០ ក្បាល ថ្លៃ ១៥ ដុល្លារ។ ការឆ្លងកាត់ឯកតាមួយ ប្តូរសំណួរធៀបទាំងអស់ទៅជាជំហានងាយពីរ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Total shares = the ratio numbers added.", km: "ចំណែកសរុប = ផលបូកនៃលេខសមាមាត្រ។" },
      { en: "Find one share, then multiply out.", km: "រកមួយចំណែក រួចគុណចេញ។" },
      { en: "Check by adding the parts back to the whole.", km: "ពិនិត្យដោយបូកផ្នែកទាំងអស់ត្រឡប់ទៅជាទាំងមូល។" },
    ],
    examples: [
      { prompt: { en: "Share 45 sweets between 4:5.", km: "ចែកស្ករគ្រាប់ ៤៥ តាម ៤:៥។" }, solution: { en: "9 shares → 5 each. 20 and 25.", km: "៩ ចំណែក → មួយចំណែក ៥។ បាន ២០ និង ២៥។" } },
      { prompt: { en: "3 kg of rice costs $4.50. What do 7 kg cost?", km: "អង្ករ ៣ គីឡូ ថ្លៃ ៤.៥០ ដុល្លារ។ ៧ គីឡូថ្លៃប៉ុន្មាន?" }, solution: { en: "1 kg = $1.50, so 7 kg = $10.50.", km: "១ គីឡូ = ១.៥០ ដុល្លារ ដូច្នេះ ៧ គីឡូ = ១០.៥០ ដុល្លារ។" } },
    ],
    tip: {
      en: "Write the units beside the numbers. Half of all ratio mistakes are lining up the wrong pair.",
      km: "សរសេរឯកតានៅក្បែរលេខ។ ពាក់កណ្តាលនៃកំហុសសមាមាត្រ គឺការតម្រឹមគូខុស។",
    },
  },
  {
    id: "m19",
    minutes: 6,
    title: { en: "Negative numbers on the line", km: "ចំនួនអវិជ្ជមានលើបន្ទាត់លេខ" },
    objective: {
      en: "Add and subtract below zero by moving along a line instead of memorising sign rules.",
      km: "បូកនិងដកក្រោមសូន្យ ដោយផ្លាស់ទីតាមបន្ទាត់ ជំនួសការទន្ទេញក្បួនសញ្ញា។",
    },
    sections: [
      {
        heading: { en: "Left is minus, right is plus", km: "ឆ្វេងគឺដក ស្តាំគឺបូក" },
        body: [
          {
            en: "Draw the line once in your head: … −3, −2, −1, 0, 1, 2, 3 … Adding walks right, subtracting walks left. −2 + 5 walks five steps right and lands on 3.",
            km: "គូរបន្ទាត់នេះម្តងក្នុងចិត្ត៖ … −៣, −២, −១, ០, ១, ២, ៣ … ការបូកដើរទៅស្តាំ ការដកដើរទៅឆ្វេង។ −២ + ៥ ដើរប្រាំជំហានទៅស្តាំ ហើយឈប់នៅ ៣។",
          },
        ],
      },
      {
        heading: { en: "Two minuses turn around", km: "ដកពីរ បង្វែរទិស" },
        body: [
          {
            en: "5 − (−3) is 8: taking away a debt leaves you better off, so the second minus turns the walk around. For multiplying, the same idea gives negative × negative = positive.",
            km: "៥ − (−៣) ស្មើ ៨៖ ការដកបំណុលចេញ ធ្វើឲ្យអ្នកមានស្ថានភាពប្រសើរជាង ដូច្នេះសញ្ញាដកទីពីរបង្វែរទិសដើរ។ សម្រាប់ការគុណ គំនិតដដែលផ្តល់ថា អវិជ្ជមាន × អវិជ្ជមាន = វិជ្ជមាន។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Adding moves right, subtracting moves left.", km: "ការបូកផ្លាស់ទៅស្តាំ ការដកផ្លាស់ទៅឆ្វេង។" },
      { en: "Subtracting a negative adds.", km: "ការដកចំនួនអវិជ្ជមាន គឺជាការបូក។" },
      { en: "Same signs multiply to positive, mixed to negative.", km: "សញ្ញាដូចគ្នាគុណបានវិជ្ជមាន សញ្ញាខុសគ្នាបានអវិជ្ជមាន។" },
    ],
    examples: [
      { prompt: { en: "−7 + 4", km: "−៧ + ៤" }, solution: { en: "Four steps right from −7: −3.", km: "ដើរបួនជំហានទៅស្តាំពី −៧៖ −៣។" } },
      { prompt: { en: "−6 × −5", km: "−៦ × −៥" }, solution: { en: "Same signs → positive 30.", km: "សញ្ញាដូចគ្នា → វិជ្ជមាន ៣០។" } },
    ],
    tip: {
      en: "Read the sign as owing money. −7 + 4 is a debt of seven, paying back four.",
      km: "អានសញ្ញាដកជាបំណុល។ −៧ + ៤ គឺបំណុល ៧ ហើយសង ៤។",
    },
  },
  {
    id: "m20",
    minutes: 8,
    title: { en: "Turning words into arithmetic", km: "ការប្តូរពាក្យទៅជាគណិត" },
    objective: {
      en: "Work through a word problem in a fixed order, so the hard part stops being the reading.",
      km: "ដោះស្រាយលំហាត់ជាអត្ថបទតាមលំដាប់ជាក់លាក់ ដើម្បីកុំឲ្យផ្នែកពិបាកជាការអានទៀត។",
    },
    sections: [
      {
        heading: { en: "Four steps, every time", km: "បួនជំហាន គ្រប់ពេល" },
        body: [
          {
            en: "One: what is the question actually asking for? Two: what numbers matter, and in what units? Three: what operation matches the story? Four: estimate, calculate, then check the answer against the estimate.",
            km: "មួយ៖ តើសំណួរសួររកអ្វីពិតប្រាកដ? ពីរ៖ លេខណាខ្លះសំខាន់ ហើយក្នុងឯកតាណា? បី៖ ប្រមាណវិធីណាដែលត្រូវនឹងរឿង? បួន៖ ប៉ាន់ស្មាន គណនា រួចផ្ទៀងចម្លើយនឹងការប៉ាន់ស្មាន។",
          },
        ],
      },
      {
        heading: { en: "Words that name the operation", km: "ពាក្យដែលប្រាប់ប្រមាណវិធី" },
        body: [
          {
            en: "\"Altogether\" and \"total\" add. \"How many more\" and \"left\" subtract. \"Each\" and \"per\" usually multiply or divide. They are hints, not rules — the story decides.",
            km: "ពាក្យ «សរុប» និង «ទាំងអស់» គឺបូក។ «ច្រើនជាងប៉ុន្មាន» និង «នៅសល់» គឺដក។ «ម្នាក់ៗ» និង «ក្នុងមួយ» ជាធម្មតាគុណ ឬចែក។ ទាំងនេះជាតម្រុយ មិនមែនក្បួនទេ — រឿងជាអ្នកសម្រេច។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Name the question before touching the numbers.", km: "កំណត់សំណួរ មុននឹងប៉ះលេខ។" },
      { en: "Keep the units with the numbers all the way through.", km: "រក្សាឯកតាជាមួយលេខពីដើមដល់ចប់។" },
      { en: "Estimate first — it catches a wrong operation instantly.", km: "ប៉ាន់ស្មានសិន — វាចាប់បានប្រមាណវិធីខុសភ្លាមៗ។" },
    ],
    examples: [
      {
        prompt: { en: "A box holds 24 pencils. A school buys 15 boxes and hands out 280. How many are left?", km: "ប្រអប់មួយផ្ទុកខ្មៅដៃ ២៤។ សាលាទិញ ១៥ ប្រអប់ ហើយចែក ២៨០។ នៅសល់ប៉ុន្មាន?" },
        solution: { en: "15 × 24 = 360; 360 − 280 = 80 pencils.", km: "១៥ × ២៤ = ៣៦០; ៣៦០ − ២៨០ = ៨០ ខ្មៅដៃ។" },
      },
      {
        prompt: { en: "Three friends split a $54 bill evenly. One pays with a $20 note. What is the change?", km: "មិត្តបីនាក់ចែកវិក្កយបត្រ ៥៤ ដុល្លារ ស្មើគ្នា។ ម្នាក់បង់ដោយក្រដាស ២០ ដុល្លារ។ ប្រាក់អាប់ប៉ុន្មាន?" },
        solution: { en: "54 ÷ 3 = 18; 20 − 18 = $2.", km: "៥៤ ÷ ៣ = ១៨; ២០ − ១៨ = ២ ដុល្លារ។" },
      },
    ],
    tip: {
      en: "Write the answer as a sentence with its unit. \"80\" is not an answer; \"80 pencils left\" is.",
      km: "សរសេរចម្លើយជាប្រយោគ ជាមួយឯកតារបស់វា។ «៨០» មិនមែនជាចម្លើយទេ; «នៅសល់ខ្មៅដៃ ៨០» ទើបជាចម្លើយ។",
    },
  },
];

const HISTORY = [
  {
    id: "h1",
    minutes: 7,
    title: { en: "Reading a timeline", km: "ការអានខ្សែកាលប្បវត្តិ" },
    objective: {
      en: "Learn dates as a connected sequence of causes and effects rather than as isolated numbers.",
      km: "រៀនកាលបរិច្ឆេទជាលំដាប់ដែលភ្ជាប់គ្នារវាងហេតុនិងផល ជាជាងលេខដាច់ដោយឡែក។",
    },
    sections: [
      {
        heading: { en: "Anchors, then neighbours", km: "ចំណុចយោង រួចអ្វីៗនៅជុំវិញ" },
        body: [
          {
            en: "Nobody memorises fifty dates evenly. Pick four or five anchor years you'll never forget, then hang everything else off them as \"nine years after\" or \"just before\". Recall becomes navigation instead of retrieval.",
            km: "គ្មាននរណាទន្ទេញកាលបរិច្ឆេទហាសិបស្មើៗគ្នាបានទេ។ ជ្រើសរើសឆ្នាំយោងបួន ឬប្រាំដែលអ្នកនឹងមិនភ្លេច រួចព្យួរអ្វីៗផ្សេងទៀតលើវាថា «ប្រាំបួនឆ្នាំក្រោយ» ឬ «មុនបន្តិច»។ ការនឹកឡើងវិញក្លាយជាការរុករក ជាជាងការទាញយក។",
          },
          {
            en: "Try this on the back of your cards: mark the anchor year in the margin, then note the card's own date relative to it.",
            km: "សាកល្បងធ្វើនេះនៅខាងក្រោយកាតរបស់អ្នក៖ សម្គាល់ឆ្នាំយោងនៅគែម រួចកត់ត្រាកាលបរិច្ឆេទរបស់កាតនោះធៀបនឹងវា។",
          },
        ],
      },
      {
        heading: { en: "Every date answers a question", km: "រាល់កាលបរិច្ឆេទឆ្លើយសំណួរមួយ" },
        body: [
          {
            en: "A year on its own is trivia. A year attached to \"what changed, and why then?\" is history — and it's far easier to remember, because you can reconstruct it from the story if the number slips.",
            km: "ឆ្នាំតែឯងគឺជាចំណេះដឹងទូទៅ។ ឆ្នាំដែលភ្ជាប់នឹងសំណួរ «អ្វីបានផ្លាស់ប្តូរ ហើយហេតុអ្វីនៅពេលនោះ?» គឺជាប្រវត្តិសាស្ត្រ — ហើយវាងាយចាំជាង ព្រោះអ្នកអាចសាងសង់វាឡើងវិញពីរឿងរ៉ាវ បើលេខភ្លេចបាត់។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Choose 4–5 anchor years and learn them cold.", km: "ជ្រើសរើសឆ្នាំយោង ៤–៥ ហើយទន្ទេញឲ្យស្ទាត់។" },
      { en: "Store other dates as distances from an anchor.", km: "រក្សាកាលបរិច្ឆេទផ្សេងជាចម្ងាយពីចំណុចយោង។" },
      { en: "Always pair a date with what it changed.", km: "តែងតែផ្គូផ្គងកាលបរិច្ឆេទជាមួយអ្វីដែលវាបានផ្លាស់ប្តូរ។" },
    ],
    examples: [
      {
        prompt: { en: "Anchor: 1953, Cambodian independence. Place 1863 and 1975.", km: "ចំណុចយោង៖ ១៩៥៣ ឯករាជ្យកម្ពុជា។ ដាក់ ១៨៦៣ និង ១៩៧៥។" },
        solution: {
          en: "1863 is ninety years before — the protectorate begins. 1975 is twenty-two years after — the regime that ends the post-independence era.",
          km: "១៨៦៣ គឺកៅសិបឆ្នាំមុន — អាណាព្យាបាលចាប់ផ្តើម។ ១៩៧៥ គឺម្ភៃពីរឆ្នាំក្រោយ — របបដែលបញ្ចប់សម័យក្រោយឯករាជ្យ។",
        },
      },
    ],
    tip: {
      en: "Lay the cards out left to right on a table in date order once. Seeing the gaps physically fixes the sequence.",
      km: "រៀបកាតពីឆ្វេងទៅស្តាំលើតុតាមលំដាប់កាលបរិច្ឆេទម្តង។ ការមើលឃើញគម្លាតជាក់ស្តែង ជួយចងចាំលំដាប់បានយ៉ាងល្អ។",
    },
  },
  {
    id: "h2",
    minutes: 8,
    title: { en: "The protectorate, 1863–1953", km: "សម័យអាណាព្យាបាល ១៨៦៣–១៩៥៣" },
    objective: {
      en: "Understand how Cambodia entered the French protectorate and what changed over those ninety years.",
      km: "យល់ពីរបៀបដែលកម្ពុជាចូលក្រោមអាណាព្យាបាលបារាំង និងអ្វីដែលបានផ្លាស់ប្តូរក្នុងរយៈពេលកៅសិបឆ្នាំនោះ។",
    },
    sections: [
      {
        heading: { en: "1863: the treaty", km: "១៨៦៣៖ សន្ធិសញ្ញា" },
        body: [
          {
            en: "King Norodom signed a protectorate treaty with France in 1863, at a point when the kingdom was under sustained pressure from its larger neighbours. The arrangement preserved the monarchy while transferring real administrative control.",
            km: "ព្រះបាទនរោត្តមបានចុះហត្ថលេខាលើសន្ធិសញ្ញាអាណាព្យាបាលជាមួយបារាំងក្នុងឆ្នាំ១៨៦៣ នៅពេលដែលព្រះរាជាណាចក្រកំពុងស្ថិតក្រោមសម្ពាធជាប់ជាប្រចាំពីប្រទេសជិតខាងធំៗ។ ការរៀបចំនេះរក្សាទុករបបរាជានិយម ខណៈផ្ទេរអំណាចគ្រប់គ្រងរដ្ឋបាលពិតប្រាកដ។",
          },
          {
            en: "From 1887 Cambodia was administered as part of French Indochina, alongside Vietnam and later Laos — which is why so much of the period's history is shared across the three.",
            km: "ចាប់ពីឆ្នាំ១៨៨៧ កម្ពុជាត្រូវបានគ្រប់គ្រងជាផ្នែកមួយនៃឥណ្ឌូចិនបារាំង រួមជាមួយវៀតណាម និងក្រោយមកឡាវ — នេះជាមូលហេតុដែលប្រវត្តិសាស្ត្រនៃសម័យកាលនេះមានចំណុចរួមគ្នាច្រើនរវាងបីប្រទេស។",
          },
        ],
      },
      {
        heading: { en: "What changed on the ground", km: "អ្វីដែលបានផ្លាស់ប្តូរជាក់ស្តែង" },
        body: [
          {
            en: "Taxation, land registration and the civil service were reorganised along French lines. Angkor was surveyed and restored, and the temples became central to how the country was represented abroad — and to how Cambodians articulated their own national identity.",
            km: "ការយកពន្ធ ការចុះបញ្ជីដីធ្លី និងមុខងាររដ្ឋបាល ត្រូវបានរៀបចំឡើងវិញតាមបែបបារាំង។ អង្គរត្រូវបានស្ទង់និងជួសជុល ហើយប្រាសាទទាំងនោះក្លាយជាចំណុចស្នូលនៃរបៀបដែលប្រទេសត្រូវបានតំណាងនៅបរទេស — និងរបៀបដែលប្រជាជនកម្ពុជាបញ្ជាក់អត្តសញ្ញាណជាតិរបស់ខ្លួន។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "1863 — protectorate treaty signed with France.", km: "១៨៦៣ — ចុះហត្ថលេខាសន្ធិសញ្ញាអាណាព្យាបាលជាមួយបារាំង។" },
      { en: "1887 — Cambodia incorporated into French Indochina.", km: "១៨៨៧ — កម្ពុជាត្រូវបញ្ចូលក្នុងឥណ្ឌូចិនបារាំង។" },
      { en: "The monarchy continued; administrative power did not.", km: "របបរាជានិយមបន្តមាន; ប៉ុន្តែអំណាចរដ្ឋបាលមិនបន្តទេ។" },
    ],
    examples: [
      {
        prompt: { en: "Why is 1863 an anchor year rather than 1887?", km: "ហេតុអ្វីបានជា ១៨៦៣ ជាឆ្នាំយោង ជាជាង ១៨៨៧?" },
        solution: {
          en: "1863 is the decision point — the treaty that set everything after it in motion. 1887 is an administrative consequence, easiest remembered as \"twenty-four years later\".",
          km: "១៨៦៣ គឺជាចំណុចសម្រេចចិត្ត — សន្ធិសញ្ញាដែលធ្វើឲ្យអ្វីៗក្រោយមកកើតឡើង។ ១៨៨៧ គឺជាផលវិបាករដ្ឋបាល ដែលងាយចាំបំផុតថា «ម្ភៃបួនឆ្នាំក្រោយមក»។",
        },
      },
    ],
    tip: {
      en: "Put 1863 on its own card with nothing else on the back. It's the hinge the whole century turns on.",
      km: "ដាក់ ១៨៦៣ លើកាតដោយឡែក ដោយគ្មានអ្វីផ្សេងនៅខាងក្រោយ។ វាជាកំណល់ដែលសតវត្សទាំងមូលបង្វិលជុំវិញ។",
    },
  },
  {
    id: "h3",
    minutes: 7,
    title: { en: "Independence, 1953", km: "ឯករាជ្យ ១៩៥៣" },
    objective: {
      en: "Trace the route to full independence on 9 November 1953 and why the date still structures the calendar.",
      km: "តាមដានផ្លូវទៅរកឯករាជ្យពេញលេញនៅថ្ងៃទី៩ វិច្ឆិកា ១៩៥៣ និងហេតុអ្វីកាលបរិច្ឆេទនេះនៅតែសំខាន់ក្នុងប្រតិទិន។",
    },
    sections: [
      {
        heading: { en: "The royal crusade", km: "ព្រះរាជយាត្រាទាមទារឯករាជ្យ" },
        body: [
          {
            en: "After the Second World War, King Norodom Sihanouk pressed France for independence through a sustained diplomatic campaign rather than armed struggle — travelling abroad to build international pressure. France transferred full sovereignty on 9 November 1953.",
            km: "បន្ទាប់ពីសង្គ្រាមលោកលើកទីពីរ ព្រះបាទនរោត្តម សីហនុបានជំរុញបារាំងឲ្យផ្តល់ឯករាជ្យ តាមរយៈយុទ្ធនាការការទូតជាប់ជាបន្តបន្ទាប់ ជាជាងការតស៊ូដោយអាវុធ — ដោយធ្វើដំណើរទៅបរទេសដើម្បីបង្កើតសម្ពាធអន្តរជាតិ។ បារាំងបានផ្ទេរអធិបតេយ្យភាពពេញលេញនៅថ្ងៃទី៩ វិច្ឆិកា ១៩៥៣។",
          },
          {
            en: "9 November remains Cambodia's Independence Day, marked each year at the Independence Monument in Phnom Penh.",
            km: "ថ្ងៃទី៩ វិច្ឆិកា នៅតែជាទិវាឯករាជ្យជាតិកម្ពុជា ដែលប្រារព្ធជារៀងរាល់ឆ្នាំនៅវិមានឯករាជ្យក្នុងរាជធានីភ្នំពេញ។",
          },
        ],
      },
      {
        heading: { en: "Why the method matters", km: "ហេតុអ្វីវិធីសាស្ត្រមានសារៈសំខាន់" },
        body: [
          {
            en: "Independence came by negotiation, in a region where neighbouring states were reaching the same goal through war. Exam questions often turn on that contrast, so learn the method alongside the date.",
            km: "ឯករាជ្យបានមកតាមរយៈការចរចា នៅក្នុងតំបន់ដែលរដ្ឋជិតខាងកំពុងសម្រេចគោលដៅដដែលតាមរយៈសង្គ្រាម។ សំណួរប្រឡងច្រើនតែផ្តោតលើភាពផ្ទុយគ្នានេះ ដូច្នេះសូមរៀនវិធីសាស្ត្រទន្ទឹមនឹងកាលបរិច្ឆេទ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "9 November 1953 — full independence from France.", km: "៩ វិច្ឆិកា ១៩៥៣ — ឯករាជ្យពេញលេញពីបារាំង។" },
      { en: "Achieved by diplomatic campaign, not armed struggle.", km: "សម្រេចបានតាមយុទ្ធនាការការទូត មិនមែនការតស៊ូដោយអាវុធ។" },
      { en: "Ninety years after the 1863 treaty.", km: "កៅសិបឆ្នាំបន្ទាប់ពីសន្ធិសញ្ញា ១៨៦៣។" },
    ],
    examples: [
      {
        prompt: { en: "How long was the protectorate period?", km: "តើសម័យអាណាព្យាបាលមានរយៈពេលប៉ុន្មាន?" },
        solution: { en: "1863 to 1953 — ninety years exactly. The round number is worth remembering; it links both anchors.", km: "ពី ១៨៦៣ ដល់ ១៩៥៣ — កៅសិបឆ្នាំគត់។ លេខមូលនេះគួរចងចាំ; វាភ្ជាប់ចំណុចយោងទាំងពីរ។" },
      },
    ],
    tip: {
      en: "Learn 1863 and 1953 as a pair. Knowing either one plus \"ninety years\" gives you the other.",
      km: "រៀន ១៨៦៣ និង ១៩៥៣ ជាគូ។ ដឹងមួយណាក៏ដោយ បូកនឹង «កៅសិបឆ្នាំ» នោះអ្នកបានមួយទៀត។",
    },
  },
  {
    id: "h4",
    minutes: 8,
    title: { en: "1953 to today", km: "ពី ១៩៥៣ ដល់សព្វថ្ងៃ" },
    objective: {
      en: "Place the main phases of modern Cambodian history in order, with the dates that separate them.",
      km: "ដាក់ដំណាក់កាលសំខាន់ៗនៃប្រវត្តិសាស្ត្រកម្ពុជាសម័យទំនើបតាមលំដាប់ ជាមួយកាលបរិច្ឆេទដែលបំបែកពួកវា។",
    },
    sections: [
      {
        heading: { en: "The phases", km: "ដំណាក់កាលនានា" },
        body: [
          {
            en: "The post-independence Sangkum period ran through the 1950s and 60s. The Khmer Republic followed from 1970. Democratic Kampuchea — the Khmer Rouge period — lasted from 1975 to 1979, and remains the defining rupture of the century. The People's Republic of Kampuchea followed, and the 1991 Paris Peace Agreements opened the way to UN-supervised elections in 1993 and the restoration of the monarchy.",
            km: "សម័យសង្គមក្រោយឯករាជ្យបានដំណើរការពេញទសវត្សរ៍ឆ្នាំ១៩៥០ និង១៩៦០។ សាធារណរដ្ឋខ្មែរបានបន្តចាប់ពីឆ្នាំ១៩៧០។ កម្ពុជាប្រជាធិបតេយ្យ — សម័យខ្មែរក្រហម — មានរយៈពេលពីឆ្នាំ១៩៧៥ ដល់១៩៧៩ ហើយនៅតែជាការបែកបាក់ដ៏សំខាន់បំផុតនៃសតវត្សនេះ។ សាធារណរដ្ឋប្រជាមានិតកម្ពុជាបានបន្តមក ហើយកិច្ចព្រមព្រៀងសន្តិភាពទីក្រុងប៉ារីសឆ្នាំ១៩៩១ បានបើកផ្លូវទៅរកការបោះឆ្នោតក្រោមការត្រួតពិនិត្យរបស់អង្គការសហប្រជាជាតិក្នុងឆ្នាំ១៩៩៣ និងការស្តារឡើងវិញនូវរបបរាជានិយម។",
          },
        ],
      },
      {
        heading: { en: "Learn the boundaries, not the middles", km: "រៀនព្រំដែន មិនមែនចំណុចកណ្តាល" },
        body: [
          {
            en: "For an exam, the transition years carry the marks: 1970, 1975, 1979, 1991, 1993. Each one is a question of the form \"what ended and what began?\" — which is exactly the shape of a good flashcard.",
            km: "សម្រាប់ការប្រឡង ឆ្នាំផ្លាស់ប្តូរជាឆ្នាំដែលមានពិន្ទុ៖ ១៩៧០, ១៩៧៥, ១៩៧៩, ១៩៩១, ១៩៩៣។ ឆ្នាំនីមួយៗគឺជាសំណួរក្នុងទម្រង់ «អ្វីបានបញ្ចប់ ហើយអ្វីបានចាប់ផ្តើម?» — ដែលជាទម្រង់ត្រឹមត្រូវនៃកាតសិក្សាដ៏ល្អ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "1975–1979 — Democratic Kampuchea.", km: "១៩៧៥–១៩៧៩ — កម្ពុជាប្រជាធិបតេយ្យ។" },
      { en: "1991 — Paris Peace Agreements.", km: "១៩៩១ — កិច្ចព្រមព្រៀងសន្តិភាពទីក្រុងប៉ារីស។" },
      { en: "1993 — UN-supervised elections; monarchy restored.", km: "១៩៩៣ — ការបោះឆ្នោតក្រោមការត្រួតពិនិត្យរបស់ អ.ស.ប; ស្តារឡើងវិញនូវរបបរាជានិយម។" },
    ],
    examples: [
      {
        prompt: { en: "Order these: Paris Peace Agreements, independence, Democratic Kampuchea.", km: "តម្រៀបតាមលំដាប់៖ កិច្ចព្រមព្រៀងសន្តិភាពប៉ារីស ឯករាជ្យ កម្ពុជាប្រជាធិបតេយ្យ។" },
        solution: { en: "Independence 1953 → Democratic Kampuchea 1975–79 → Paris Peace Agreements 1991.", km: "ឯករាជ្យ ១៩៥៣ → កម្ពុជាប្រជាធិបតេយ្យ ១៩៧៥–៧៩ → កិច្ចព្រមព្រៀងសន្តិភាពប៉ារីស ១៩៩១។" },
      },
    ],
    tip: {
      en: "Write one card per transition year, front \"1979?\", back \"what ended, what began\". Five cards covers the modern era.",
      km: "សរសេរកាតមួយក្នុងមួយឆ្នាំផ្លាស់ប្តូរ ខាងមុខ «១៩៧៩?» ខាងក្រោយ «អ្វីបញ្ចប់ អ្វីចាប់ផ្តើម»។ កាតប្រាំគ្របដណ្តប់សម័យទំនើប។",
    },
  },
];

const PHYSICS = [
  {
    id: "p1",
    minutes: 6,
    title: { en: "Speed, distance and time", km: "ល្បឿន គម្លាត និងពេលវេលា" },
    objective: {
      en: "Use the speed-distance-time triangle to solve for whichever quantity is missing.",
      km: "ប្រើត្រីកោណ ល្បឿន-គម្លាត-ពេលវេលា ដើម្បីរកបរិមាណដែលបាត់។",
    },
    sections: [
      {
        heading: { en: "One relationship, three quantities", km: "ទំនាក់ទំនងមួយ បរិមាណបី" },
        body: [
          {
            en: "Speed is how much distance is covered per unit of time: speed = distance ÷ time. Rearranged, distance = speed × time, and time = distance ÷ speed. All three versions say the same thing — pick the one that isolates whatever you're solving for.",
            km: "ល្បឿន គឺជាចំនួនគម្លាតដែលធ្វើដំណើរបានក្នុងមួយឯកតាពេលវេលា៖ ល្បឿន = គម្លាត ÷ ពេលវេលា។ រៀបចំឡើងវិញ គម្លាត = ល្បឿន × ពេលវេលា ហើយ ពេលវេលា = គម្លាត ÷ ល្បឿន។ ទម្រង់ទាំងបីនិយាយអំពីរឿងតែមួយ — ជ្រើសរើសទម្រង់ដែលញែកបរិមាណដែលអ្នកកំពុងរក។",
          },
          {
            en: "Units have to match before you calculate: if speed is in km/h, time needs to be in hours, not minutes. Converting minutes to hours (divide by 60) is the single most common step students skip.",
            km: "ឯកតាត្រូវតែផ្គូផ្គងគ្នា មុននឹងគណនា៖ បើល្បឿនគិតជា km/h ពេលវេលាត្រូវគិតជាម៉ោង មិនមែននាទីទេ។ ការបំប្លែងនាទីទៅជាម៉ោង (ចែកនឹង ៦០) គឺជាជំហានដែលសិស្សរំលងច្រើនជាងគេ។",
          },
        ],
      },
      {
        heading: { en: "Average speed isn't the average of two speeds", km: "ល្បឿនមធ្យម មិនមែនជាមធ្យមភាគនៃល្បឿនពីរទេ" },
        body: [
          {
            en: "Average speed for a whole trip is total distance ÷ total time — not simply (speed₁ + speed₂) ÷ 2, unless the time spent at each speed happens to be equal. Driving half the distance at 40 km/h and half at 60 km/h gives an average below 50 km/h, because more time is spent at the slower speed.",
            km: "ល្បឿនមធ្យមសម្រាប់ដំណើរទាំងមូល គឺ គម្លាតសរុប ÷ ពេលវេលាសរុប — មិនមែនគ្រាន់តែ (ល្បឿន១ + ល្បឿន២) ÷ ២ ទេ លុះត្រាតែពេលវេលាចំណាយលើល្បឿននីមួយៗស្មើគ្នា។ បើបើកបរពាក់កណ្តាលគម្លាតដោយល្បឿន ៤០ km/h និងពាក់កណ្តាលដោយ ៦០ km/h ល្បឿនមធ្យមនឹងទាបជាង ៥០ km/h ព្រោះចំណាយពេលច្រើនជាងលើល្បឿនយឺត។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "speed = distance ÷ time; distance = speed × time; time = distance ÷ speed.", km: "ល្បឿន = គម្លាត ÷ ពេលវេលា; គម្លាត = ល្បឿន × ពេលវេលា; ពេលវេលា = គម្លាត ÷ ល្បឿន។" },
      { en: "Convert units so time and speed use the same time unit before calculating.", km: "បំប្លែងឯកតា ដើម្បីឲ្យពេលវេលា និងល្បឿនប្រើឯកតាពេលដូចគ្នា មុននឹងគណនា។" },
      { en: "Average speed = total distance ÷ total time, not the average of the speeds.", km: "ល្បឿនមធ្យម = គម្លាតសរុប ÷ ពេលវេលាសរុប មិនមែនមធ្យមភាគនៃល្បឿនទេ។" },
    ],
    examples: [
      {
        prompt: { en: "A car travels 150 km in 3 hours. What is its speed?", km: "ឡានមួយធ្វើដំណើរ ១៥០ គីឡូម៉ែត្រ ក្នុងរយៈពេល ៣ ម៉ោង។ តើល្បឿនប៉ុន្មាន?" },
        solution: { en: "speed = distance ÷ time = 150 ÷ 3 = 50 km/h.", km: "ល្បឿន = គម្លាត ÷ ពេលវេលា = ១៥០ ÷ ៣ = ៥០ km/h។" },
      },
    ],
    tip: {
      en: "Draw the triangle: distance on top, speed and time on the bottom. Cover the one you want — the triangle shows whether to multiply or divide the other two.",
      km: "គូរត្រីកោណ៖ គម្លាតនៅលើ ល្បឿននិងពេលវេលានៅក្រោម។ គ្របបិទតម្លៃដែលអ្នកចង់រក — ត្រីកោណនឹងបង្ហាញថាត្រូវគុណ ឬចែកតម្លៃពីរទៀត។",
    },
  },
  {
    id: "p2",
    minutes: 7,
    title: { en: "Newton's three laws of motion", km: "ច្បាប់ចលនាទាំងបីរបស់ញូតុន" },
    objective: {
      en: "State Newton's three laws and recognise which one explains a given everyday situation.",
      km: "រៀបរាប់ច្បាប់ចលនាទាំងបីរបស់ញូតុន ហើយកំណត់ថាមួយណាពន្យល់ស្ថានភាពប្រចាំថ្ងៃដែលបានផ្តល់ឲ្យ។",
    },
    sections: [
      {
        heading: { en: "First law: inertia", km: "ច្បាប់ទី១៖ អចលភាព" },
        body: [
          {
            en: "An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted on by an unbalanced force. This is why passengers lurch forward when a car brakes suddenly — their bodies were moving and kept trying to, even after the car stopped.",
            km: "វត្ថុនៅសម្រាកនៅតែសម្រាក ហើយវត្ថុកំពុងធ្វើចលនានៅតែធ្វើចលនាដោយល្បឿនថេរ លុះត្រាតែមានកម្លាំងមិនស្មើគ្នាមកប៉ះពាល់។ នេះជាមូលហេតុដែលអ្នកដំណើរបោលទៅមុខ ពេលឡានឈប់ភ្លាមៗ — រាងកាយពួកគេកំពុងធ្វើចលនា ហើយបន្តព្យាយាមធ្វើដដែល សូម្បីតែក្រោយឡានឈប់ក៏ដោយ។",
          },
        ],
      },
      {
        heading: { en: "Second and third laws", km: "ច្បាប់ទី២ និងទី៣" },
        body: [
          {
            en: "The second law gives force a formula: F = m × a — force equals mass times acceleration. The same force accelerates a light object more than a heavy one. The third law says every force has an equal and opposite reaction: push on a wall, and the wall pushes back on you just as hard — that push is what keeps your hand from going through it.",
            km: "ច្បាប់ទី២ ផ្តល់រូបមន្តដល់កម្លាំង៖ F = m × a — កម្លាំងស្មើនឹងម៉ាស់គុណនឹងសំទុះ។ កម្លាំងដូចគ្នា ធ្វើឲ្យវត្ថុស្រាលមានសំទុះលឿនជាងវត្ថុធ្ងន់។ ច្បាប់ទី៣ចែងថា កម្លាំងគ្រប់មួយមានប្រតិកម្មស្មើគ្នា និងផ្ទុយទិស៖ រុញជញ្ជាំង ជញ្ជាំងក៏រុញអ្នកមកវិញខ្លាំងស្មើគ្នា — ការរុញនោះហើយដែលរារាំងដៃអ្នកមិនឲ្យធ្លុះចូលទៅក្នុងវា។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "First law: objects resist changes to their motion (inertia).", km: "ច្បាប់ទី១៖ វត្ថុតទល់នឹងការផ្លាស់ប្តូរចលនារបស់វា (អចលភាព)។" },
      { en: "Second law: F = m × a.", km: "ច្បាប់ទី២៖ F = m × a។" },
      { en: "Third law: every action has an equal and opposite reaction.", km: "ច្បាប់ទី៣៖ សកម្មភាពគ្រប់មួយ មានប្រតិកម្មស្មើគ្នា និងផ្ទុយទិស។" },
    ],
    examples: [
      {
        prompt: { en: "A 2 kg object accelerates at 3 m/s². What force acts on it?", km: "វត្ថុមួយមានម៉ាស់ ២ គីឡូក្រាម មានសំទុះ ៣ m/s²។ តើកម្លាំងអ្វីប៉ះពាល់លើវា?" },
        solution: { en: "F = m × a = 2 × 3 = 6 newtons.", km: "F = m × a = ២ × ៣ = ៦ នូតុន។" },
      },
    ],
    tip: {
      en: "Whenever you see \"why does it keep moving\" think first law; \"how much force\" think second law; \"what pushes back\" think third law.",
      km: "រាល់ពេលឃើញ «ហេតុអ្វីវានៅតែធ្វើចលនា» គិតដល់ច្បាប់ទី១; «កម្លាំងប៉ុន្មាន» គិតដល់ច្បាប់ទី២; «អ្វីរុញត្រឡប់មកវិញ» គិតដល់ច្បាប់ទី៣។",
    },
  },
  {
    id: "p3",
    minutes: 7,
    title: { en: "Work, energy and power", km: "ការងារ ថាមពល និងកម្លាំងអំណាច" },
    objective: {
      en: "Distinguish work, energy and power, and calculate each from the others.",
      km: "សម្គាល់ភាពខុសគ្នារវាងការងារ ថាមពល និងកម្លាំងអំណាច ហើយគណនានីមួយៗពីគ្នាទៅវិញទៅមក។",
    },
    sections: [
      {
        heading: { en: "Work moves energy", km: "ការងារផ្លាស់ប្តូរថាមពល" },
        body: [
          {
            en: "In physics, work is only done when a force moves something: work = force × distance. Holding a heavy bag still does zero work, no matter how tired your arm gets, because nothing moved. Carrying that same bag up a flight of stairs does work, because the bag's height — and so its energy — changed.",
            km: "ក្នុងរូបវិទ្យា ការងារកើតឡើងតែពេលកម្លាំងធ្វើឲ្យអ្វីមួយផ្លាស់ទីប៉ុណ្ណោះ៖ ការងារ = កម្លាំង × គម្លាត។ ការកាន់កាបូបធ្ងន់ដោយមិនកម្រើក មិនធ្វើការងារឡើយ ទោះបីដៃហត់ប៉ុនណាក៏ដោយ ព្រោះគ្មានអ្វីផ្លាស់ទីទេ។ ការលីកបាបនោះឡើងជណ្តើរ ធ្វើការងារ ព្រោះកម្ពស់បាបនោះ — ហើយថាមពលរបស់វា — បានផ្លាស់ប្តូរ។",
          },
        ],
      },
      {
        heading: { en: "Power is how fast work gets done", km: "កម្លាំងអំណាចគឺល្បឿននៃការធ្វើការងារ" },
        body: [
          {
            en: "Power = work ÷ time. Two people can carry the same bag up the same stairs, doing the same amount of work — but whoever does it faster has the higher power output. This is why a more powerful engine isn't one that can pull more total load overall, but one that can deliver a given amount of work in less time.",
            km: "កម្លាំងអំណាច = ការងារ ÷ ពេលវេលា។ មនុស្សពីរនាក់អាចលីកបាបដូចគ្នាឡើងជណ្តើរដូចគ្នា ធ្វើការងារចំនួនស្មើគ្នា — ប៉ុន្តែអ្នកណាធ្វើលឿនជាង មានកម្លាំងអំណាចខ្ពស់ជាង។ នេះជាមូលហេតុដែលម៉ាស៊ីនដែលមានអានុភាពខ្ពស់ជាង មិនមែនជាម៉ាស៊ីនអាចទាញបានច្រើនជាងសរុបទេ ប៉ុន្តែជាម៉ាស៊ីនអាចផ្តល់ការងារកម្រិតដូចគ្នាក្នុងពេលតិចជាង។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Work = force × distance; work is zero if nothing moves.", km: "ការងារ = កម្លាំង × គម្លាត; ការងារស្មើសូន្យ បើគ្មានអ្វីផ្លាស់ទី។" },
      { en: "Power = work ÷ time — the rate at which work is done.", km: "កម្លាំងអំណាច = ការងារ ÷ ពេលវេលា — អត្រានៃការធ្វើការងារ។" },
      { en: "Energy is the capacity to do work; work transfers it from one place or form to another.", km: "ថាមពលគឺសមត្ថភាពធ្វើការងារ; ការងារផ្ទេរវាពីកន្លែង ឬទម្រង់មួយទៅមួយទៀត។" },
    ],
    examples: [
      {
        prompt: { en: "A force of 20 N moves a box 5 m. How much work is done?", km: "កម្លាំង ២០ នូតុន ធ្វើឲ្យប្រអប់ផ្លាស់ទី ៥ ម៉ែត្រ។ តើមានការងារប៉ុន្មាន?" },
        solution: { en: "work = force × distance = 20 × 5 = 100 joules.", km: "ការងារ = កម្លាំង × គម្លាត = ២០ × ៥ = ១០០ ជូល។" },
      },
    ],
    tip: {
      en: "\"Work\" in physics needs motion in the direction of the force — effort alone, with no movement, is never work.",
      km: "«ការងារ» ក្នុងរូបវិទ្យា ត្រូវការចលនាតាមទិសកម្លាំង — កិច្ចខិតខំតែឯង ដោយគ្មានចលនា មិនដែលជាការងារឡើយ។",
    },
  },
  {
    id: "p4",
    minutes: 8,
    title: { en: "Electric circuits: current, voltage, resistance", km: "សៀគ្វីអគ្គិសនី៖ ចរន្ត វ៉ុល និងភាពទប់ទល់" },
    objective: {
      en: "Use Ohm's law to relate current, voltage and resistance in a simple circuit.",
      km: "ប្រើច្បាប់អូម ដើម្បីភ្ជាប់ទំនាក់ទំនងចរន្ត វ៉ុល និងភាពទប់ទល់ក្នុងសៀគ្វីធម្មតា។",
    },
    sections: [
      {
        heading: { en: "Three quantities, one law", km: "បរិមាណបី ច្បាប់មួយ" },
        body: [
          {
            en: "Voltage (V) pushes current through a circuit; current (I) is the flow of charge; resistance (R) opposes that flow. Ohm's law ties them together: V = I × R. Raise the voltage and current rises with it; raise the resistance and current falls, for the same voltage.",
            km: "វ៉ុល (V) រុញចរន្តឲ្យហូរកាត់សៀគ្វី; ចរន្ត (I) គឺជាលំហូរនៃបន្ទុកអគ្គិសនី; ភាពទប់ទល់ (R) ទប់ស្កាត់លំហូរនោះ។ ច្បាប់អូម ភ្ជាប់ទាំងបីនេះចូលគ្នា៖ V = I × R។ បង្កើនវ៉ុល ចរន្តកើនតាម; បង្កើនភាពទប់ទល់ ចរន្តថយចុះ សម្រាប់វ៉ុលដូចគ្នា។",
          },
        ],
      },
      {
        heading: { en: "Series vs parallel", km: "សៀគ្វីជាប់ខ្សែសង្វាក់ និងប៉ារ៉ាឡែល" },
        body: [
          {
            en: "In a series circuit, components sit one after another along a single loop, so the same current flows through all of them — if one bulb breaks, the whole loop stops. In a parallel circuit, components sit on separate branches, so each gets the full voltage and the current splits between branches — one bulb breaking doesn't stop the others.",
            km: "ក្នុងសៀគ្វីជាប់ខ្សែសង្វាក់ សមាសធាតុនានាតម្រៀបជាប់គ្នាតាមរង្វិលជុំតែមួយ ដូច្នេះចរន្តដូចគ្នាហូរកាត់ទាំងអស់ — បើអំពូលមួយដាច់ រង្វិលជុំទាំងមូលឈប់។ ក្នុងសៀគ្វីប៉ារ៉ាឡែល សមាសធាតុនានាតម្រៀបនៅសាខាដាច់ដោយឡែក ដូច្នេះនីមួយៗទទួលបានវ៉ុលពេញ ហើយចរន្តបែងចែកតាមសាខា — អំពូលមួយដាច់ មិនធ្វើឲ្យអំពូលផ្សេងទៀតឈប់ទេ។",
          },
        ],
      },
    ],
    keyPoints: [
      { en: "Ohm's law: V = I × R.", km: "ច្បាប់អូម៖ V = I × R។" },
      { en: "Series: same current everywhere, one break stops everything.", km: "ជាប់ខ្សែសង្វាក់៖ ចរន្តដូចគ្នាគ្រប់ទីកន្លែង ដាច់មួយកន្លែងធ្វើឲ្យឈប់ទាំងអស់។" },
      { en: "Parallel: same voltage on each branch, one break doesn't stop the rest.", km: "ប៉ារ៉ាឡែល៖ វ៉ុលដូចគ្នានៅគ្រប់សាខា ដាច់មួយកន្លែងមិនធ្វើឲ្យសាខាផ្សេងទៀតឈប់ទេ។" },
    ],
    examples: [
      {
        prompt: { en: "A circuit has a 12 V battery and 4 Ω resistance. What is the current?", km: "សៀគ្វីមួយមានថ្ម ១២ វ៉ុល និងភាពទប់ទល់ ៤ អូម។ តើចរន្តប៉ុន្មាន?" },
        solution: { en: "I = V ÷ R = 12 ÷ 4 = 3 amps.", km: "I = V ÷ R = ១២ ÷ ៤ = ៣ អាំពែរ។" },
      },
    ],
    tip: {
      en: "Cover the letter you want in \"V over I R\" the same way as the speed triangle — it tells you whether to multiply or divide.",
      km: "គ្របបិទអក្សរដែលអ្នកចង់រកក្នុង «V លើ I R» ដូចត្រីកោណល្បឿនដែរ — វានឹងប្រាប់ថាត្រូវគុណ ឬចែក។",
    },
  },
];

export const COURSES = {
  grammar: GRAMMAR,
  math: MATH,
  history: HISTORY,
  physics: PHYSICS,
  // DEMO SCAFFOLD: the Biology deck (code MING-1187) has no course of its
  // own yet, so it borrows the maths path — twenty lessons, chests and an
  // exam — to demo the Learn view end to end. The lesson text is maths.
  // Replace this with a real BIOLOGY array when the course is written.
  biology: MATH,
};

export function lessonsFor(subject) {
  return COURSES[subject] ?? [];
}
