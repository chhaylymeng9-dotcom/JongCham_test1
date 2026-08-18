/* CoursePicker.jsx — the "my courses" button, its dropdown, and the course shop
 *
 *   import CoursePicker, { StarsPill } from "./CoursePicker";
 *
 *   <CoursePicker subjects={subjects} current={current} stars={stars}
 *                 onSelect={setCurrent} onBuy={(k, price) => …} />
 *   <StarsPill stars={stars} />
 *
 * Self-contained: the styles and the clover that marks the currency are
 * drawn inline, so there is nothing to import and no asset to copy. Khmer
 * glyphs need the Siemreap font in the host page:
 *   <link href="https://fonts.googleapis.com/css2?family=Siemreap&display=swap" rel="stylesheet">
 */
import React from "react";
import { createPortal } from "react-dom";

const CSS = `/* ==================================================================
   COURSE PICKER — copy from here
   ================================================================== */

  /* ---------- the strip the buttons live in ---------- */
  .strip{display:flex;align-items:center;gap:10px;justify-content:flex-end}

  /* button 1 — the course you are studying */
  .course-btn{position:relative;display:flex;align-items:center;gap:9px;height:70px;
              min-width:150px;padding:0 18px 0 14px;border-radius:16px;cursor:pointer;
              background:var(--sheet);border:1px solid var(--hair);
              box-shadow:0 3px 0 var(--hair);font:inherit;color:var(--ink);
              transition:all .14s var(--e)}
  .course-btn:hover{border-color:var(--green-line);transform:translateY(-1px)}
  .course-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--hair)}
  .course-btn.open{border-color:var(--green-line);box-shadow:0 1px 0 var(--hair);
                   transform:translateY(2px)}
  .course-btn .tile{width:34px;height:34px;flex:none;border-radius:11px;display:grid;
                    place-items:center;color:#fff}
  .course-btn .nm{font-size:14px;font-weight:700;white-space:nowrap}
  .course-btn .caret{color:var(--faint);transition:transform .18s var(--e)}
  .course-btn.open .caret{transform:rotate(180deg)}

  /* a stat pill, for the rest of the strip */
  .pill{display:flex;align-items:center;justify-content:center;gap:8px;height:70px;
        min-width:150px;padding:0 18px;
        border-radius:16px;background:var(--sheet);border:1px solid var(--hair);
        box-shadow:0 3px 0 var(--hair)}
  .pill b{font-family:var(--type);font-size:17px;font-weight:700;line-height:1}
  .pill i{font-style:normal;font-size:9.5px;font-weight:800;letter-spacing:.12em;
          text-transform:uppercase;color:var(--muted);display:block;margin-top:2px}

  /* the balance pill as a button — opens the star shop (StarShop.jsx).
     The "+" corner is the affordance: a pill that only ever showed a
     number looked like a readout, so nobody would think to click it. */
  .pill-btn{position:relative;cursor:pointer;font:inherit;color:var(--ink);
            transition:all .14s var(--e)}
  .pill-btn:hover{border-color:#E3C77E;transform:translateY(-1px);
                  box-shadow:0 4px 0 var(--hair)}
  .pill-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--hair)}
  .pill-btn .plus{position:absolute;top:-7px;right:-7px;width:24px;height:24px;
                  border-radius:50%;display:grid;place-items:center;color:#3B2C08;
                  background:linear-gradient(180deg,#F0C255,#C9922A);
                  box-shadow:0 2px 0 #A8791F;transition:transform .16s var(--pop)}
  .pill-btn:hover .plus{transform:scale(1.14) rotate(90deg)}

  /* ---------- the dropdown ---------- */
  .drop-wrap{position:relative}
  .drop{position:absolute;top:calc(100% + 12px);right:0;z-index:40;width:270px;
        background:var(--sheet);border:1px solid var(--hair);border-radius:18px;
        box-shadow:0 10px 0 rgba(225,219,204,.55),0 18px 34px rgba(31,29,24,.16);
        overflow:hidden;animation:dropIn .2s var(--pop) both}
  .drop[hidden]{display:none}
  @keyframes dropIn{from{opacity:0;transform:translateY(-8px) scale(.97)}
                    to{opacity:1;transform:none}}
  .drop .tip{position:absolute;top:-9px;right:26px;width:16px;height:16px;
             background:var(--sheet);border-left:1px solid var(--hair);
             border-top:1px solid var(--hair);transform:rotate(45deg)}
  .drop .lab{margin:0;padding:14px 16px 8px;font-size:10px;font-weight:800;
             letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
  .drop-row{display:flex;align-items:center;gap:12px;width:100%;padding:11px 16px;
            border:0;border-top:1px solid #F4F0E6;background:none;cursor:pointer;
            text-align:left;font:inherit;transition:background .14s var(--e)}
  .drop-row:hover{background:#FBF9F3}
  .drop-row .tile{width:38px;height:38px;flex:none;border-radius:12px;display:grid;
                  place-items:center;color:#fff}
  .drop-row b{flex:1;font-size:14.5px;font-weight:700}
  .drop-row.on b{color:var(--green-btn)}
  .drop-row .tick{color:var(--green-btn)}
  .drop-row.add .tile{background:var(--track);color:var(--muted);
                      border:1.5px dashed var(--hair-2)}
  .drop-row.add b{font-weight:600}
  .drop-row .add-t{flex:1;min-width:0}
  .drop-row .add-t b{display:block}
  .drop-row .add-t i{display:block;margin-top:1px;font-style:normal;font-size:11.5px;
                     font-weight:500;color:var(--faint)}

  /* ---------- the catalogue ----------
     Portalled to <body> (see the component below) so the path's nodes
     can never paint over it — which also means it sits outside the host
     page's .lp-root, so it can't see that element's design-token custom
     properties (--paper, --sheet, ...) through inheritance. Redeclared
     here with the same values so .cat's descendants still resolve them. */
  .veil, .cat{
    --paper:#F7F4ED; --sheet:#FFFFFF; --ink:#1C1A15; --body:#4A473F;
    --muted:#857F73; --faint:#AEA89A; --hair:#E1DBCC; --hair-2:#CFC8B6; --track:#E8E2D5;
    --green:#243529; --green-mid:#3E5F48; --green-btn:#3E8F52;
    --green-soft:#E5EBE4; --green-line:#B2C6B4;
    --brass:#8E6F2A; --brass-soft:#F3EBD8;
    --type:"Courier Prime","American Typewriter","Courier New",monospace;
    --sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
    --e:cubic-bezier(.2,.7,.2,1);
    --pop:cubic-bezier(.34,1.5,.4,1);
  }
  .veil{position:fixed;inset:0;z-index:70;background:rgba(31,29,24,.45);
        -webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);animation:fade .22s var(--e) both}
  .veil[hidden]{display:none}
  @keyframes fade{from{opacity:0}to{opacity:1}}
  .cat{position:fixed;inset:0;z-index:71;display:grid;place-items:center;padding:20px}
  .cat[hidden]{display:none}
  .cat-box{width:min(880px,100%);max-height:88vh;overflow-y:auto;background:var(--paper);
           border:1px solid var(--hair);border-radius:26px;padding:24px 24px 26px;
           box-shadow:0 24px 56px rgba(31,29,24,.26);
           animation:boxIn .32s var(--pop) both}
  @keyframes boxIn{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:none}}
  .cat-head{display:flex;align-items:center;justify-content:space-between;gap:14px;
            margin-bottom:18px}
  .cat-head h2{margin:0;font-family:var(--type);font-size:22px;font-weight:700;
               letter-spacing:-.02em;color:var(--green)}
  .cat-x{width:36px;height:36px;flex:none;border:0;border-radius:50%;cursor:pointer;
         display:grid;place-items:center;background:var(--track);color:var(--body);
         transition:all .14s var(--e)}
  .cat-x:hover{background:var(--hair-2);color:var(--ink);transform:rotate(90deg)}

  .cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
  @media (max-width:760px){ .cat-grid{grid-template-columns:repeat(3,1fr)} }
  @media (max-width:520px){ .cat-grid{grid-template-columns:repeat(2,1fr)} }

  .sub{position:relative;display:grid;justify-items:center;gap:4px;padding:20px 12px 16px;
       background:var(--sheet);border:1px solid var(--hair);border-radius:20px;
       box-shadow:0 4px 0 var(--hair);cursor:pointer;font:inherit;text-align:center;
       animation:up .38s var(--e) both;transition:all .14s var(--e)}
  @keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  .sub:hover{border-color:var(--green-line);transform:translateY(-2px);
             box-shadow:0 6px 0 var(--hair)}
  .sub:active{transform:translateY(2px);box-shadow:0 1px 0 var(--hair)}
  .sub .tile{width:64px;height:64px;border-radius:20px;display:grid;place-items:center;
             color:#fff;margin-bottom:8px;box-shadow:0 3px 8px rgba(28,26,21,.16)}
  .sub b{font-size:14.5px;font-weight:700;line-height:1.25}
  /* scoped: a bare \`.sub span\` also hits the tile and its glyph */
  .sub .learners{font-size:11.5px;color:var(--muted)}
  .sub .tick{position:absolute;top:10px;right:10px;width:24px;height:24px;border-radius:8px;
             display:grid;place-items:center;background:var(--green-btn);color:#fff}
  .sub.on{border-color:var(--green-line);background:#F6FAF6}

  /* ---------- the price ----------
     The currency mark is drawn in the Star component below, so there is
     nothing to size or crop here. */
  .star{flex:none;display:block}
  .price{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:5px 12px 5px 9px;
         border-radius:999px;background:var(--brass-soft);color:var(--brass);
         font-family:var(--type);font-size:13px;font-weight:700;line-height:1}
  .price.owned{background:var(--green-soft);color:var(--green-mid);
               font-family:var(--sans);font-size:11px;font-weight:800;
               letter-spacing:.1em;text-transform:uppercase;padding:6px 12px}
  .sub.poor .price{background:#FBE9E8;color:#B5403B;animation:nope .4s var(--e)}
  @keyframes nope{0%,100%{transform:translateX(0)}
                  20%{transform:translateX(-6px)}45%{transform:translateX(5px)}
                  70%{transform:translateX(-3px)}}
  .sub.locked{opacity:.96}

  /* the balance, in the strip */
  .pill.stars b{color:var(--brass)}

  /* the tile glyphs, for the ones that are letters rather than icons */
  .glyph{font-family:var(--sans);font-size:22px;font-weight:800;letter-spacing:-.02em}
  .glyph.km{font-family:var(--khmer);font-size:26px;font-weight:400}

  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;



/* ================================================================
   the courses — swap this for your own catalogue
   ================================================================ */
const DEFAULT_SUBJECTS = [
  { k:"math",    n:"Math",      c1:"#6FA8E8", c2:"#3466A8", learners:"12.4k",
    g:(<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6.6h6v1.8H4Zm0 3.2h6v1.8H4ZM6.1 15h1.8v2H10v1.8H7.9v2H6.1v-2H4V17h2.1ZM14 6.6h6v1.8h-6Zm.6 8.2 1.3-1.3 1.6 1.6 1.6-1.6 1.3 1.3-1.6 1.6 1.6 1.6-1.3 1.3-1.6-1.6-1.6 1.6-1.3-1.3 1.6-1.6Z"/></svg>), on:true },
  { k:"english", n:"English",   c1:"#E88A86", c2:"#B23A38", learners:"18.9k",
    g:(<span className="glyph">Aa</span>), on:true },
  { k:"khmer",   n:"Khmer",     c1:"#F0C255", c2:"#C9922A", learners:"21.2k",
    g:(<span className="glyph km">ក</span>) },
  { k:"biology", n:"Biology",   c1:"#7FCB93", c2:"#2F7A46", learners:"8.1k",
    g:(<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 3c0 6 10 6 10 12M17 3c0 6-10 6-10 12M7 21c0-2 10-2 10 0"/><path d="M8.5 7h7M8 11h8M8.5 15h7"/></svg>) },
  { k:"chem",    n:"Chemistry", c1:"#7FD0C8", c2:"#2E8079", learners:"6.7k",
    g:(<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M10 3v6.5L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.5V3"/><path d="M9 3h6M7.5 14h9"/></svg>) },
  { k:"physics", n:"Physics",   c1:"#9B8FE0", c2:"#5A4BA8", learners:"5.9k",
    g:(<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4.4"/><ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(120 12 12)"/></svg>) },
  { k:"history", n:"History",   c1:"#C9A87A", c2:"#8A6634", learners:"7.3k",
    g:(<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M2.5 8 12 3.5 21.5 8"/><path d="M5 9v8M9.6 9v8M14.4 9v8M19 9v8"/><path d="M3 20.5h18"/></svg>) },
  { k:"hsk",     n:"HSK",       c1:"#EE8B86", c2:"#B2322F", learners:"4.4k",
    g:(<span className="glyph">汉</span>) },
  { k:"ielts",   n:"IELTS",     c1:"#88C4E8", c2:"#2E6E9E", learners:"9.6k",
    g:(<span className="glyph" style={{ fontSize: 17 }}>IELTS</span>) },
  { k:"toefl",   n:"TOEFL",     c1:"#F0A96B", c2:"#C0672A", learners:"3.8k",
    g:(<span className="glyph" style={{ fontSize: 17 }}>TOEFL</span>) }
];

const tileStyle = s => ({ background: `linear-gradient(${s.c1},${s.c2})` });

const TICK = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5 10 17.5 19 7" />
  </svg>
);

/* One leaf, tip at the origin, body above it — the clover is this shape
   four times, turned a quarter each time. Traced off the photographed
   clover: a heart with the notch at the outer edge, wider than it is
   tall, meeting its neighbours in a tight point at the stem. */
const LEAF =
  "M0 0C-1.4-3.2-6.6-3.4-6.6-7.5c0-2.9 2.7-4.3 4.7-2.7 1 .8 1.5 1.8 1.9 2.7.4-.9.9-1.9 1.9-2.7 2-1.6 4.7-.2 4.7 2.7C6.6-3.4 1.4-3.2 0 0Z";
/* the darker half, split down the midrib the way the leaf shades in the
   photo — one side catches the light, the other doesn't */
const LEAF_SHADE =
  "M0 0C-1.4-3.2-6.6-3.4-6.6-7.5c0-2.9 2.7-4.3 4.7-2.7 1 .8 1.5 1.8 1.9 2.7Z";

function Leaf({ turn, light, dark }) {
  return (
    <g transform={`rotate(${turn})`}>
      <path d={LEAF} fill={light} />
      <path d={LEAF_SHADE} fill={dark} />
      {/* the pale midrib running out from the stem */}
      <path d="M0 -1.2V-9.4" stroke="#D9E9AE" strokeWidth=".9" strokeLinecap="round" opacity=".85" />
    </g>
  );
}

/**
 * The currency mark — a four-leaf clover, at whatever size you ask for.
 * Drawn rather than photographed so it stays crisp at 17px in a price
 * chip and at 34px in the shop's payoff, with no white ground to hide.
 */
export function Star({ size = 22 }) {
  return (
    <svg className="star" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* the stem, curving away as it does in the photograph */}
      <path d="M12 13.4c.3 3.3-.2 6.2-1.9 8.4" stroke="#A9C95F" strokeWidth="1.6" strokeLinecap="round" />
      <g transform="translate(12 12.4)">
        <Leaf turn={-45} light="#82B75C" dark="#5E9A45" />
        <Leaf turn={45} light="#76AF52" dark="#54903E" />
        <Leaf turn={135} light="#6FA84F" dark="#4E8B3F" />
        <Leaf turn={225} light="#7FB45C" dark="#5A9642" />
        <circle r="1" fill="#C7DE93" />
      </g>
    </svg>
  );
}

/**
 * The balance pill for the strip: <StarsPill stars={900} />
 * With onClick it becomes a button (the star shop's entry point) and
 * grows a "+" corner; without one it stays the plain readout it was.
 */
export function StarsPill({ stars = 0, onClick, label = "Top up stars" }) {
  const inner = (
    <>
      <Star size={26} />
      <span><b>{stars.toLocaleString()}</b><i>Stars</i></span>
    </>
  );

  if (!onClick) return <span className="pill stars">{inner}</span>;

  return (
    <button type="button" className="pill stars pill-btn" onClick={onClick} title={label} aria-label={label}>
      {inner}
      <span className="plus" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="3.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </span>
    </button>
  );
}

/**
 * CoursePicker — the "my courses" button, its dropdown, and the catalogue.
 *
 *   <CoursePicker
 *     subjects={SUBJECTS}        // optional, defaults to the built-in ten
 *     current="math"
 *     stars={900}
 *     price={300}                // what an unowned course costs
 *     onSelect={key => …}        // switched to a course they already own
 *     onBuy={(key, price) => …}  // bought one — deduct the stars your side
 *   />
 *
 * A subject is { k, n, c1, c2, learners, g, on } where `g` is the tile glyph
 * (an <svg> element or a <span className="glyph">) and `on` means already owned.
 */
export default function CoursePicker({
  subjects, current, stars = 0, price = 300, onSelect, onBuy, onAddDeck
}) {
  const list = React.useMemo(
    () => (subjects && subjects.length ? subjects : DEFAULT_SUBJECTS), [subjects]);

  const [open, setOpen]   = React.useState(false);   /* the dropdown */
  const [cat, setCat]     = React.useState(false);   /* the catalogue */
  const [poor, setPoor]   = React.useState(null);    /* the key that just failed */
  const wrap = React.useRef(null);

  const cur = list.find(s => s.k === current) || list[0];

  /* close the dropdown on an outside click, and everything on Escape */
  React.useEffect(() => {
    const away = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const esc  = e => {
      if (e.key !== "Escape") return;
      if (cat) setCat(false); else setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away);
                   window.removeEventListener("keydown", esc); };
  }, [cat]);

  /* the page behind must not scroll while the catalogue is up */
  React.useEffect(() => {
    if (!cat) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [cat]);

  const pick = s => {
    if (s.on) { onSelect && onSelect(s.k); setCat(false); setOpen(false); return; }
    if (stars < (s.price ?? price)) {
      /* say no on the card itself rather than in an alert */
      setPoor(null);
      requestAnimationFrame(() => setPoor(s.k));
      return;
    }
    onBuy && onBuy(s.k, s.price ?? price);
    setCat(false);
    setOpen(false);
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="drop-wrap" ref={wrap}>
        <button className={"course-btn" + (open ? " open" : "")}
                aria-haspopup="true" aria-expanded={open}
                onClick={() => setOpen(v => !v)}>
          <span className="tile" style={tileStyle(cur)}>{cur.g}</span>
          <span className="nm">{cur.n}</span>
          <span className="caret">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l7 7 7-7" /></svg>
          </span>
        </button>

        {open && (
          <div className="drop" role="menu">
            <span className="tip" />
            <p className="lab">My courses</p>
            {list.filter(s => s.on).map(s => (
              <button key={s.k} className={"drop-row" + (s.k === cur.k ? " on" : "")}
                      role="menuitem"
                      onClick={() => { onSelect && onSelect(s.k); setOpen(false); }}>
                <span className="tile" style={tileStyle(s)}>{s.g}</span>
                <b>{s.n}</b>
                {s.k === cur.k && <span className="tick">{TICK}</span>}
              </button>
            ))}
            <button className="drop-row add" role="menuitem"
                    onClick={() => { setOpen(false); setCat(true); }}>
              <span className="tile">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </span>
              <span className="add-t">
                <b>Add a new course</b>
                <i>Buy it with stars</i>
              </span>
            </button>

            {/* the other way in: a printed box comes with an activation
                code, which unlocks its deck without spending anything */}
            {onAddDeck && (
              <button className="drop-row add" role="menuitem"
                      onClick={() => { setOpen(false); onAddDeck(); }}>
                <span className="tile">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4Z" />
                    <path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9" />
                  </svg>
                </span>
                <span className="add-t">
                  <b>Add a new deck</b>
                  <i>Redeem a box code</i>
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {cat && createPortal(
        <>
          <div className="veil" onClick={() => setCat(false)} />
          <div className="cat" role="dialog" aria-modal="true" aria-label="Add a new course">
            <div className="cat-box">
              <div className="cat-head">
                <h2>Choose a course</h2>
                <button className="cat-x" aria-label="Close" onClick={() => setCat(false)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
              <div className="cat-grid">
                {list.map((s, i) => (
                  <button key={s.k}
                          className={"sub" + (s.on ? " on" : " locked") + (poor === s.k ? " poor" : "")}
                          style={{ animationDelay: 0.03 * i + "s" }}
                          onClick={() => pick(s)}>
                    {s.on && <span className="tick">{TICK}</span>}
                    <span className="tile" style={tileStyle(s)}>{s.g}</span>
                    <b>{s.n}</b>
                    <span className="learners">{s.learners} learners</span>
                    {s.on
                      ? <span className="price owned">Added</span>
                      : <span className="price"><Star size={22} />{s.price ?? price}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
