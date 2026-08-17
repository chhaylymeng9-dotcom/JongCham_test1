/* LessonChat.jsx — the "complete the chat" lesson screen for JongCham
 *
 *   import LessonChat from "./LessonChat";
 *   <LessonChat onClose={() => setLesson(null)} onDone={r => save(r)} />
 *
 * Two answers per question, one right. English chrome, Khmer content.
 * Self-contained: styles, the landscape and the penguin picture all live in here.
 * Needs the Khmer font in the host page:
 *   <link href="https://fonts.googleapis.com/css2?family=Siemreap&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
 */
import React from "react";

const CSS = `
  :root{
    --bg:#F7F4ED; --line:#DFD9CA; --line-2:#CBC4B2;
    --ink:#1F1D18; --dim:#6C665B; --faint:#9C9689;
    --pick:#EAF2F9; --pick-line:#8FB9D8; --pick-ink:#2B5F86;
    --ok:#2F7A46; --ok-deep:#2C6E3D; --ok-bg:#E4F1E7;
    --no:#B5403B; --no-deep:#9C3733; --no-bg:#FAE8E6;
    --khmer:"Siemreap","Khmer OS Siemreap","Noto Sans Khmer",serif;
    --sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
    --in:cubic-bezier(.16,.84,.34,1);          /* ease out, for things arriving */
    --out:cubic-bezier(.5,0,.75,0);            /* ease in, for things leaving  */
    --pop:cubic-bezier(.34,1.56,.5,1);         /* a little overshoot           */
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{margin:0;background:var(--bg);color:var(--ink);
       font-family:var(--khmer),var(--sans);font-size:16px;line-height:1.75;
       -webkit-font-smoothing:antialiased}
  button{font:inherit;color:inherit}
  /* every bit of chrome is English, in Inter; only the lesson content is Khmer */
  .en{font-family:var(--sans);line-height:1.45}

  /* ---------- the landscape behind everything ---------- */
  .land{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
  .land svg{position:absolute;inset:0;width:100%;height:100%}
  /* a scrim so the text never fights the hills */
  .land::after{content:"";position:absolute;inset:0;
    background:linear-gradient(180deg,rgba(247,244,237,.60) 0%,rgba(247,244,237,.30) 46%,
                                       rgba(247,244,237,.72) 100%)}
  .drift{animation:drift 90s linear infinite}
  @keyframes drift{from{transform:translateX(0)}to{transform:translateX(-600px)}}

  .lesson{position:relative;z-index:0;min-height:100%;display:flex;flex-direction:column}

  /* ---------- top bar ---------- */
  .top{display:flex;align-items:center;gap:18px;padding:20px 24px 8px;
       max-width:1100px;width:100%;margin:0 auto}
  .quit{flex:none;width:34px;height:34px;border:0;background:none;cursor:pointer;
        color:var(--faint);display:grid;place-items:center;border-radius:50%;
        transition:color .16s var(--in),background .16s var(--in),transform .16s var(--pop)}
  .quit:hover{color:var(--ink);background:#EDE8DC;transform:rotate(90deg)}
  .track{flex:1;height:15px;border-radius:99px;background:#E4DED0;overflow:hidden}
  .track i{display:block;height:100%;width:0;border-radius:99px;
           background:linear-gradient(90deg,#4FA268,#3E8F52);
           transition:width .55s var(--in)}
  .count{flex:none;font-family:var(--sans);font-size:14px;font-weight:700;color:var(--dim)}

  /* ---------- the exercise ---------- */
  .stage{flex:1;width:100%;max-width:1100px;margin:0 auto;padding:34px 24px 160px}
  h1{font-family:var(--sans);font-size:31px;font-weight:800;letter-spacing:-.02em;
     margin:0 0 34px}

  /* each new question slides up as a group, its parts a beat apart */
  .fade{opacity:0;animation:up .5s var(--in) forwards}
  @keyframes up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
  .lesson.leaving .stage{animation:down .22s var(--out) forwards}
  @keyframes down{to{opacity:0;transform:translateY(-14px)}}

  .say{display:flex;align-items:flex-start;gap:14px;margin-bottom:26px}
  .say.me{flex-direction:row-reverse}
  .face{flex:none;width:78px;height:78px}
  .bubble{position:relative;max-width:640px;border:2px solid var(--line-2);
          border-radius:16px;padding:14px 20px;
          background:rgba(255,255,255,.78);backdrop-filter:blur(3px);
          transition:border-color .2s var(--in),background .2s var(--in)}
  .bubble::before,.bubble::after{content:"";position:absolute;top:26px;
    width:0;height:0;border:11px solid transparent}
  .say:not(.me) .bubble::before{left:-22px;border-right-color:var(--line-2)}
  .say:not(.me) .bubble::after{left:-19px;border-right-color:#FFFFFF}
  .say.me .bubble::before{right:-22px;border-left-color:var(--line-2)}
  .say.me .bubble::after{right:-19px;border-left-color:#FFFFFF}
  .bubble .spk{float:left;margin:5px 10px 0 0;color:#3B7FB5}

  .me .bubble{min-width:210px;min-height:64px;display:flex;align-items:center;
              justify-content:center;text-align:center}
  .blank{display:block;width:150px;height:2px;background:var(--line-2);border-radius:2px}
  .me .bubble.filled{border-color:var(--pick-line);background:var(--pick);
                     animation:drop .3s var(--pop)}
  @keyframes drop{0%{opacity:0;transform:translateY(-10px) scale(.94)}
                  100%{opacity:1;transform:none}}

  /* ---------- the two answers ---------- */
  .opts{display:grid;gap:15px;margin-top:38px}
  .opt{display:flex;align-items:center;gap:18px;width:100%;text-align:left;
       border:2px solid var(--line);border-bottom-width:4px;border-radius:16px;
       background:rgba(255,255,255,.80);padding:18px 22px;cursor:pointer;
       transition:background .16s var(--in),border-color .16s var(--in),
                  color .16s var(--in),transform .16s var(--pop)}
  .opt:hover:not(:disabled){background:#FFFFFF;border-color:var(--line-2);
                            transform:translateY(-2px)}
  .opt:active:not(:disabled){transform:translateY(1px)}
  .opt .n{flex:none;width:34px;height:34px;border:2px solid var(--line-2);
          border-radius:9px;display:grid;place-items:center;color:var(--dim);
          font-family:var(--sans);font-size:14px;font-weight:700;
          transition:border-color .16s var(--in),color .16s var(--in)}
  .opt .txt{flex:1;text-align:center;padding-right:34px}
  .opt.on{border-color:var(--pick-line);background:var(--pick);color:var(--pick-ink)}
  .opt.on .n{border-color:var(--pick-line);color:var(--pick-ink)}
  .opt.right{border-color:var(--ok-deep);background:var(--ok-bg);color:var(--ok);
             animation:cheer .5s var(--pop)}
  .opt.right .n{border-color:var(--ok-deep);color:var(--ok)}
  @keyframes cheer{0%{transform:none}35%{transform:scale(1.025)}100%{transform:none}}
  .opt.wrong{border-color:var(--no-deep);background:var(--no-bg);color:var(--no);
             animation:shake .42s var(--in)}
  .opt.wrong .n{border-color:var(--no-deep);color:var(--no)}
  @keyframes shake{0%,100%{transform:translateX(0)}
                   18%{transform:translateX(-9px)}38%{transform:translateX(7px)}
                   58%{transform:translateX(-5px)}78%{transform:translateX(3px)}}
  .opt:disabled{cursor:default}
  /* the entrance lives on its own class: .right / .wrong replace the animation
     property outright, and a fading-in option would otherwise stay invisible */
  .opt.in{animation:up .5s var(--in) both}

  /* ---------- footer ---------- */
  .foot{position:fixed;left:0;right:0;bottom:0;z-index:2;
        border-top:2px solid var(--line);background:#FFFFFF;
        transition:background .24s var(--in),border-color .24s var(--in)}
  .foot.ok{background:var(--ok-bg);border-color:transparent}
  .foot.no{background:var(--no-bg);border-color:transparent}
  .foot-in{max-width:1100px;margin:0 auto;padding:20px 24px;
           display:flex;align-items:center;gap:20px}
  .verdict{flex:1;display:none;align-items:center;gap:14px}
  .foot.ok .verdict,.foot.no .verdict{display:flex;animation:up .34s var(--in) both}
  .foot.ok .skip,.foot.no .skip{display:none}
  .vmark{flex:none;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;
         background:#3E8F52;color:#FFFFFF;animation:stamp .42s var(--pop) both}
  @keyframes stamp{0%{opacity:0;transform:scale(.4) rotate(-25deg)}
                   100%{opacity:1;transform:none}}
  .foot.no .vmark{background:#C0453F;color:#FFFFFF}
  .vtext b{display:block;font-family:var(--sans);font-size:20px;font-weight:800;
           color:var(--ok);line-height:1.35}
  .foot.no .vtext b{color:var(--no)}
  .vtext span{display:block;font-size:14.5px;color:var(--ok);opacity:.86}
  .foot.no .vtext span{color:var(--no)}

  .btn{border:0;border-radius:14px;cursor:pointer;font-family:var(--sans);
       font-size:15px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;
       padding:0 34px;height:54px;
       transition:background .16s var(--in),color .16s var(--in),
                  transform .12s var(--in),border-color .16s var(--in),filter .16s var(--in)}
  .skip{flex:none;background:transparent;border:2px solid var(--line-2);
        border-bottom-width:4px;color:var(--dim)}
  .skip:hover{background:#EFEADE;color:var(--ink)}
  .skip:active{transform:translateY(2px);border-bottom-width:2px}
  .go{margin-left:auto;background:#E7E1D3;color:var(--faint);
      border-bottom:4px solid #D3CCBB;cursor:not-allowed}
  .go.live{background:#3E8F52;color:#FFFFFF;border-bottom-color:#245C33;
           cursor:pointer;animation:wake .3s var(--pop)}
  @keyframes wake{0%{transform:scale(.96)}100%{transform:none}}
  .go.live:hover{filter:brightness(1.07)}
  .go.live:active{transform:translateY(2px);border-bottom-width:2px}
  .foot.no .go{background:#C0453F;color:#FFFFFF;border-bottom-color:#8E2F2B;
               cursor:pointer}

  /* ---------- the end ---------- */
  .done{display:none;flex:1;flex-direction:column;align-items:center;justify-content:center;
        text-align:center;padding:40px 24px 170px;gap:6px}
  .lesson.over .stage{display:none}
  .lesson.over .done{display:flex;animation:up .5s var(--in) both}
  .done .star{animation:spinIn .8s var(--pop) both}
  /* a full house gets a gold outline and a small flare */
  .done .star.full{animation:spinIn .8s var(--pop) both, flare 1.6s ease-in-out .8s infinite}
  @keyframes flare{0%,100%{filter:none}50%{filter:drop-shadow(0 0 10px rgba(242,195,60,.75))}}
  @keyframes spinIn{0%{opacity:0;transform:scale(.3) rotate(-40deg)}
                    100%{opacity:1;transform:none}}
  .done h2{font-family:var(--sans);font-size:33px;font-weight:800;margin:18px 0 4px}
  .done p{color:var(--dim);margin:0;max-width:34ch}
  .score{display:flex;gap:14px;margin-top:26px}
  .score div{min-width:158px;border:2px solid var(--line);border-radius:16px;
             padding:14px 18px;background:rgba(255,255,255,.8)}
  .score span{display:block;font-family:var(--sans);font-size:11px;font-weight:800;
              letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
  .score b{display:block;font-family:var(--sans);font-size:28px;font-weight:800;margin-top:2px}
  .score .a b{color:var(--ok)} .score .b b{color:#B4892A}


  /* ---------- "wait, don't go" ---------- */
  .leave-veil{position:fixed;inset:0;z-index:60;background:rgba(31,29,24,.45);
              -webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);
              animation:up .22s var(--in) both}
  .leave-veil[hidden]{display:none}
  .leave{position:fixed;inset:0;z-index:61;display:grid;place-items:center;padding:20px}
  .leave[hidden]{display:none}
  .leave-box{width:min(430px,100%);background:#FFFFFF;border:1px solid var(--line);
             border-radius:24px;padding:26px 26px 22px;text-align:center;
             box-shadow:0 22px 50px rgba(31,29,24,.22);
             animation:boxIn .38s var(--pop) both}
  @keyframes boxIn{0%{opacity:0;transform:translateY(22px) scale(.94)}
                   100%{opacity:1;transform:none}}
  .leave-box h3{font-family:var(--sans);font-size:21px;font-weight:800;line-height:1.35;
                margin:14px 0 20px;color:var(--ink)}
  .leave-box .btn{width:100%}
  .stay{background:#3E8F52;color:#fff;border-bottom:4px solid #245C33}
  .stay:hover{filter:brightness(1.07)}
  .stay:active{transform:translateY(2px);border-bottom-width:2px}
  .end{margin-top:6px;width:100%;height:48px;border:0;background:none;cursor:pointer;
       font-family:var(--sans);font-size:14px;font-weight:800;letter-spacing:.08em;
       text-transform:uppercase;color:#C0453F;border-radius:14px;
       transition:background .16s var(--in)}
  .end:hover{background:#FBEDEC}

  /* the penguin: just the picture, nothing moving */
  .cry{display:block;width:158px;height:auto;margin:0 auto}

  @media (max-width:640px){
    h1{font-size:24px;margin-bottom:26px}
    .face{width:58px;height:58px}
    .stage{padding:26px 18px 180px}
    .opt .txt{padding-right:0;text-align:left}
    .foot-in{padding:16px 18px;flex-wrap:wrap}
    .btn{flex:1;padding:0 18px}
    .go{margin-left:0}
    .score div{min-width:0;flex:1}
  }
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

/* the landscape, one static blob of SVG */
const LAND = `<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#D3E4EC"/><stop offset="1" stop-color="#E6EFE1"/>
      </linearGradient>
      <g id="pine">
        <path d="M0 0 L-13 30 H13Z" fill="currentColor"/>
        <path d="M0 -14 L-10 12 H10Z" fill="currentColor"/>
        <path d="M0 -26 L-7 -2 H7Z" fill="currentColor"/>
        <rect x="-2" y="28" width="4" height="9" fill="currentColor"/>
      </g>
      <g id="round">
        <rect x="-2.6" y="0" width="5.2" height="16" fill="currentColor"/>
        <circle cx="-9" cy="-2" r="10" fill="currentColor"/>
        <circle cx="9" cy="-3" r="10.6" fill="currentColor"/>
        <circle cx="0" cy="-11" r="13" fill="currentColor"/>
      </g>
    </defs>

    <rect width="1440" height="900" fill="url(#sky)"/>
    <circle cx="1180" cy="140" r="46" fill="#F2E6BE" opacity=".85"/>

    <!-- far ridge -->
    <path d="M0 470 Q150 392 300 452 Q430 392 560 448 Q700 384 840 446
             Q980 390 1120 450 Q1280 396 1440 462 L1440 900 L0 900Z" fill="#B4CCB3"/>
    <!-- middle hills, drifting very slowly -->
    <g class="drift">
      <path d="M0 560 Q180 486 360 552 Q540 484 720 550 Q900 486 1080 552
               Q1260 490 1440 556 Q1620 490 1800 556 Q1980 486 2160 552 L2160 900 L0 900Z"
            fill="#9CBC9B"/>
    </g>
    <!-- tree line -->
    <g color="#7EA87E">
      <use href="#pine" x="90"  y="600" transform="scale(1.5)" style="transform-origin:90px 600px"/>
      <use href="#round" x="230" y="606"/>
      <use href="#pine" x="360" y="596"/>
      <use href="#round" x="520" y="610" transform="scale(1.3)" style="transform-origin:520px 610px"/>
      <use href="#pine" x="700" y="600"/>
      <use href="#round" x="860" y="608"/>
      <use href="#pine" x="1010" y="598" transform="scale(1.4)" style="transform-origin:1010px 598px"/>
      <use href="#round" x="1180" y="610"/>
      <use href="#pine" x="1330" y="602"/>
    </g>
    <!-- foreground bank -->
    <path d="M0 660 Q240 610 480 662 Q720 606 960 660 Q1200 612 1440 664 L1440 900 L0 900Z"
          fill="#8DB28C"/>
    <g color="#6E9B70">
      <use href="#round" x="140" y="700" transform="scale(1.8)" style="transform-origin:140px 700px"/>
      <use href="#pine"  x="640" y="706" transform="scale(1.9)" style="transform-origin:640px 706px"/>
      <use href="#round" x="1120" y="704" transform="scale(1.7)" style="transform-origin:1120px 704px"/>
    </g>
    <path d="M0 780 Q360 742 720 786 Q1080 742 1440 790 L1440 900 L0 900Z" fill="#7FA97E"/>
  </svg>`;

/* the crying penguin, embedded so there is no asset to copy */
const PENGUIN = "data:image/jpeg;base64,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";

/* ================================================================
   the questions — swap this for your own chapter
   ================================================================ */
const DEFAULT_Q = [
  { ask:"តើឯកតាមូលដ្ឋាននៃប្រព័ន្ធប្រសាទគឺអ្វី?",
    a:["កោសិកាឈាម","ណឺរ៉ូន (Neuron)"], ok:1,
    why:"ណឺរ៉ូន ជាឯកតាមូលដ្ឋាននៃប្រព័ន្ធប្រសាទ។" },

  { ask:"តើផ្នែកណារបស់ណឺរ៉ូនមានតួនាទីទទួលសារប្រសាទចូល?",
    a:["ដេនឌ្រីត (Dendrite)","អាក់សូន (Axon)"], ok:0,
    why:"ដេនឌ្រីត ទទួលសារប្រសាទចូល រីឯអាក់សូនបញ្ជូនចេញ។" },

  { ask:"តើ CNS រួមមានអ្វីខ្លះ?",
    a:["ខួរក្បាល និងសរសៃប្រសាទ","ខួរក្បាល និងខួរឆ្អឹងខ្នង"], ok:1,
    why:"CNS គឺ ខួរក្បាល និងខួរឆ្អឹងខ្នង។ សរសៃប្រសាទស្ថិតក្នុង PNS។" },

  { ask:"តើ Sensory neuron មានមុខងារអ្វី?",
    a:["បញ្ជូនព័ត៌មានពី Receptor ទៅ CNS","បញ្ជូនបញ្ជាពី CNS ទៅសាច់ដុំ"], ok:0,
    why:"Sensory neuron នាំព័ត៌មានចូល។ ការបញ្ជូនចេញទៅសាច់ដុំជាតួនាទី Motor neuron។" },

  { ask:"តើ Reflex action មានលក្ខណៈដូចម្តេច?",
    a:["យឺត និងស្ម័គ្រចិត្ត","លឿន និងមិនស្ម័គ្រចិត្ត"], ok:1,
    why:"Reflex កើតឡើងលឿន ដោយមិនឆ្លងកាត់ការសម្រេចចិត្ត។" },

  { ask:"តើតម្រូវប្រសាទ (nervous coordination) មានន័យដូចម្តេច?",
    a:["ដំណើរការបញ្ជូនឈាម និងអុកស៊ីសែនទៅសរីរាង្គ",
       "ដំណើរការទទួលរំញោច បញ្ជូនទៅមជ្ឈមណ្ឌលប្រសាទ រួចបញ្ជាឱ្យសរីរាង្គឆ្លើយតប"], ok:1,
    why:"តម្រូវប្រសាទ = ទទួលរំញោច → ដំណើរការ → ឆ្លើយតប។" },

  { ask:"ចូរជ្រើសរើសបញ្ជីផ្នែកសំខាន់ៗរបស់ណឺរ៉ូន។",
    a:["ដេនឌ្រីត, តួកោសិកា, អាក់សូន, Myelin sheath, Axon terminal",
       "ដេនឌ្រីត, សួត, អាក់សូន, បេះដូង"], ok:0,
    why:"ណឺរ៉ូនមាន ដេនឌ្រីត, តួកោសិកា (Soma), អាក់សូន, Myelin sheath និង Axon terminals។" },

  { ask:"តើ Synapse ជាអ្វី?",
    a:["ជាស្រទាប់ខាងក្រៅនៃខួរក្បាល",
       "ជាតំបន់តភ្ជាប់រវាងណឺរ៉ូន និងកោសិកាគោលដៅ"], ok:1,
    why:"នៅ Synapse សារប្រសាទបន្តតាមរយៈ neurotransmitter។" }
];

// exposed so callers can show an accurate "N questions" fact without
// hardcoding a number that would drift if DEFAULT_Q ever changes —
// every lesson uses this same built-in set today, whatever its subject
export const DEFAULT_QUESTION_COUNT = DEFAULT_Q.length;

/* ================================================================
   sound, synthesised so there are no files to ship
   ================================================================ */
let AC = null;
const audio = () => (AC = AC || new (window.AudioContext || window.webkitAudioContext)());
function note(freq, at, len, type, vol, slideTo) {
  try {
    const c = audio(), o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, c.currentTime + at);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + at + len);
    g.gain.setValueAtTime(0.0001, c.currentTime + at);
    g.gain.exponentialRampToValueAtTime(vol, c.currentTime + at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + at + len);
    o.connect(g).connect(c.destination);
    o.start(c.currentTime + at);
    o.stop(c.currentTime + at + len + 0.02);
  } catch (_) {}
}
const dingRight = () => { note(660,0,.18,"sine",.18); note(880,.09,.18,"sine",.16); note(1320,.18,.30,"sine",.12); };
const dingWrong = () => { note(196,0,.22,"triangle",.20,110); note(147,.05,.26,"sine",.13,98); };
const dingPick  = () => note(520,0,.05,"sine",.05);
const dingDone  = () => { note(523,0,.16,"sine",.16); note(659,.11,.16,"sine",.15);
                          note(784,.22,.16,"sine",.14); note(1047,.33,.36,"sine",.13); };

const TICK  = 'M4 12.5 9.5 18 20 6.5';
const CROSS = 'M6 6l12 12M18 6L6 18';

/**
 * LessonChat
 *
 *   <LessonChat
 *     questions={myQuestions}                 // optional, defaults to the built-in set
 *     title="Complete the chat"               // optional
 *     onClose={() => setOpen(false)}
 *     onDone={({ right, total, percent }) => saveProgress(percent)}
 *   />
 *
 * A question is { ask, a:[wrong/right, wrong/right], ok:0|1, why }.
 * Chrome is English, the lesson content is whatever language you put in `questions`.
 */
export default function LessonChat({ questions, title = "Complete the chat", onClose, onDone }) {
  const Q = React.useMemo(() => (questions && questions.length ? questions : DEFAULT_Q), [questions]);

  const [i, setI]             = React.useState(0);
  const [pick, setPick]       = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [right, setRight]     = React.useState(0);
  const [seen, setSeen]       = React.useState(0);     /* how many have been answered */
  const [over, setOver]       = React.useState(false);
  const [leaving, setLeaving] = React.useState(false); /* the between-questions fade */
  const [asking, setAsking]   = React.useState(false); /* the "wait, don't go" dialog */
  const [fill, setFill]       = React.useState(0);     /* how much of the star is gold */
  const reported = React.useRef(false);       /* onDone fires once, never twice */

  const q = Q[i];
  const percent = Math.round((right / Q.length) * 100);

  /* ---------------- answering ---------------- */
  const choose = k => {
    if (checked) return;
    dingPick();
    setPick(k);
  };

  const check = () => {
    setChecked(true);
    setSeen(n => n + 1);
    if (pick === q.ok) { setRight(n => n + 1); dingRight(); }
    else dingWrong();
  };

  const next = () => {
    if (i >= Q.length - 1) { finish(); return; }
    /* the old question eases out before the new one eases in */
    setLeaving(true);
    setTimeout(() => {
      setI(n => n + 1);
      setPick(null);
      setChecked(false);
      setLeaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  const finish = () => {
    setOver(true);
    dingDone();
    /* record the score exactly once, the moment the result screen appears.
       A throw in the parent must never trap the user inside the lesson. */
    if (!reported.current) {
      reported.current = true;
      try {
        if (onDone) onDone({ right, total: Q.length, percent });
      } catch (err) {
        console.error("[LessonChat] onDone threw:", err);
      }
    }
  };

  const onGo = () => { if (checked) next(); else if (pick !== null) check(); };

  /* the star fills from the bottom up to the accuracy */
  React.useEffect(() => {
    if (!over) { setFill(0); return; }
    const target = percent / 100, t0 = performance.now();
    let raf;
    const rise = now => {
      const k = Math.min(1, (now - t0) / 900);
      setFill(target * (1 - Math.pow(1 - k, 3)));      /* ease out */
      if (k < 1) raf = requestAnimationFrame(rise);
    };
    raf = requestAnimationFrame(rise);
    return () => cancelAnimationFrame(raf);
  }, [over, percent]);

  /* ---------------- leaving ---------------- */
  /* nothing answered yet means nothing to lose — leave without asking */
  const tryClose = () => { if (seen === 0 || over) close(); else setAsking(true); };
  /* the only way out. Finish, the ✕ and End session all land here.
     It navigates and nothing else — recording the score is finish()'s job. */
  const close = () => {
    setAsking(false);
    if (onClose) onClose();
  };

  React.useEffect(() => {
    const onKey = e => {
      if (asking) {
        if (e.key === "Escape") { e.preventDefault(); setAsking(false); }
        return;                                        /* the dialog swallows the rest */
      }
      if (over) return;
      if (e.key === "1" || e.key === "2") { e.preventDefault(); choose(+e.key - 1); }
      else if (e.key === "Enter") { e.preventDefault(); onGo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* browsers keep audio asleep until the first gesture */
  React.useEffect(() => {
    const wake = () => { try { audio().resume(); } catch (_) {} };
    window.addEventListener("pointerdown", wake, { once: true });
    return () => window.removeEventListener("pointerdown", wake);
  }, []);

  const won = checked && pick === q.ok;
  /* the finish screen gets a plain bar, not the last question's verdict */
  const footCls = "foot" + (over ? "" : checked ? (won ? " ok" : " no") : "");

  return (
    <>
      <style>{CSS}</style>

      {/* the landscape behind everything */}
      <div className="land" aria-hidden="true" dangerouslySetInnerHTML={{ __html: LAND }} />

      <div className={"lesson" + (over ? " over" : "") + (leaving ? " leaving" : "")}>

        <div className="top">
          <button className="quit" onClick={tryClose} aria-label="Close lesson">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.6" strokeLinecap="round"><path d={CROSS} /></svg>
          </button>
          <div className="track">
            <i style={{ width: (over ? 100 : (i / Q.length) * 100) + "%" }} />
          </div>
          <span className="count en">{over ? Q.length : i + 1} / {Q.length}</span>
        </div>

        <div className="stage" key={i}>
          <h1 className="en fade">{title}</h1>

          <div className="say fade" style={{ animationDelay: ".07s" }}>
            <svg className="face" viewBox="0 0 80 80" aria-hidden="true">
              <rect x="16" y="60" width="48" height="14" rx="5" fill="#E9A8BA" />
              <path d="M18 34a22 22 0 0 1 44 0v10a22 22 0 0 1-44 0Z" fill="#C08663" />
              <path d="M14 32c0-15 12-24 26-24s26 9 26 24c0 4-3 6-6 5-6-2-13-3-20-3s-14 1-20 3c-3 1-6-1-6-5Z" fill="#382F2D" />
              <ellipse cx="30" cy="43" rx="3.4" ry="4" fill="#221B19" />
              <ellipse cx="50" cy="43" rx="3.4" ry="4" fill="#221B19" />
              <path d="M23 37c3-2 8-2 11 0M46 37c3-2 8-2 11 0" stroke="#382F2D" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M27 55h26c0 5-6 8-13 8s-13-3-13-8Z" fill="#382F2D" />
            </svg>
            <div className="bubble">
              <svg className="spk" width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9h4l5-4v14l-5-4H4Zm13 .5a4 4 0 0 1 0 5M19.5 7a7 7 0 0 1 0 10"
                      stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </svg>
              <span>{q.ask}</span>
            </div>
          </div>

          <div className="say me fade" style={{ animationDelay: ".13s" }}>
            <svg className="face" viewBox="0 0 80 80" aria-hidden="true">
              <rect x="16" y="62" width="48" height="12" rx="5" fill="#6FC9E2" />
              <circle cx="22" cy="24" r="9" fill="#2C2420" /><circle cx="58" cy="24" r="9" fill="#2C2420" />
              <path d="M14 36a26 26 0 0 1 52 0v8a26 26 0 0 1-52 0Z" fill="#84603F" />
              <ellipse cx="40" cy="52" rx="13" ry="12" fill="#DFC198" />
              <ellipse cx="29" cy="40" rx="4" ry="4.4" fill="#221B19" />
              <ellipse cx="51" cy="40" rx="4" ry="4.4" fill="#221B19" />
              <path d="M22 34c4-3 10-3 14 0M44 34c4-3 10-3 14 0" stroke="#5B3E27" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <ellipse cx="40" cy="49" rx="5" ry="3.6" fill="#382919" />
            </svg>
            <div className={"bubble" + (pick !== null ? " filled" : "")}>
              {pick !== null ? q.a[pick] : <span className="blank" />}
            </div>
          </div>

          <div className="opts">
            {q.a.map((t, k) => {
              let cls = "opt in";
              if (checked) cls = "opt" + (k === q.ok ? " right" : k === pick ? " wrong" : "");
              else if (pick === k) cls = "opt in on";
              return (
                <button key={k} className={cls} disabled={checked}
                        style={checked ? undefined : { animationDelay: 0.18 + k * 0.08 + "s" }}
                        onClick={() => choose(k)}>
                  <span className="n">{k + 1}</span>
                  <span className="txt">{t}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="done">
          <svg className={"star" + (percent === 100 ? " full" : "")}
               width="104" height="104" viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              {/* two stops at the same offset: gold below the line, nothing above it */}
              <linearGradient id="lcStarFill" x1="0" y1="1" x2="0" y2="0">
                <stop offset={fill} stopColor="#F2C33C" />
                <stop offset={fill} stopColor="#F2C33C" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M12 2 15 8.5 22 9.5 17 14.5 18.2 21.5 12 18.2 5.8 21.5 7 14.5 2 9.5 9 8.5Z"
                  fill="url(#lcStarFill)" stroke="#1F1D18" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="en">Lesson complete!</h2>
          <p className="en">
            {percent === 100 ? "A clean run — every answer right."
              : percent >= 60 ? "Nicely done. Keep going."
              : "Worth another pass at this one."}
          </p>
          <div className="score">
            <div className="a"><span>Correct</span><b>{right} / {Q.length}</b></div>
            <div className="b"><span>Accuracy</span><b>{percent}%</b></div>
          </div>
        </div>

        <div className={footCls}>
          <div className="foot-in">
            <div className="verdict">
              <span className="vmark">
                <svg width={won ? 26 : 24} height={won ? 26 : 24} viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d={won ? TICK : CROSS} />
                </svg>
              </span>
              <span className="vtext">
                <b className="en">{won ? "Correct!" : "Correct answer:"}</b>
                <span>{won ? q.why : q.a[q.ok] + " — " + q.why}</span>
              </span>
            </div>
            {!over && <button className="btn skip en" onClick={() => { setPick(-1); check(); }}>Skip</button>}
            <button className={"btn go en" + (over || pick !== null ? " live" : "")}
                    disabled={!over && pick === null}
                    onClick={over ? close : onGo}>
              {over ? "Finish" : checked ? "Continue" : "Check"}
            </button>
          </div>
        </div>
      </div>

      {/* "wait, don't go" */}
      {asking && (
        <>
          <div className="leave-veil" onClick={() => setAsking(false)} />
          <div className="leave" role="dialog" aria-modal="true" aria-label="Leave the lesson?">
            <div className="leave-box">
              <img className="cry" alt="" src={PENGUIN} />
              <h3 className="en">Wait, don&rsquo;t go! You&rsquo;ll lose your progress if you quit now</h3>
              <button className="btn stay en" autoFocus onClick={() => setAsking(false)}>Keep learning</button>
              <button className="end" onClick={close}>End session</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}