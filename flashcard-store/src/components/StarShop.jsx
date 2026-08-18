/* StarShop.jsx — the top-up shop behind the stars pill
 *
 *   import StarShop from "./StarShop";
 *
 *   <StarShop open={open} stars={stars} apples={apples} dailyClaimed={false}
 *             onClose={…} onBuyPack={pack => …} onClaimDaily={() => n}
 *             onTradeApple={() => n} onOpenDailyTasks={…} />
 *
 * Presentational: it never touches storage. Every handler is the host's
 * (LessonPath → Account), and the balance it draws is whatever `stars`
 * says — the HUD counts up on its own whenever that number changes.
 *
 * Self-contained like CoursePicker: styles embedded, portalled to <body>,
 * every class prefixed `ss-` so nothing collides with the picker's own
 * global sheet (.pill, .price, .sub, .cat …).
 *
 * The checkout is a SIMULATION — no payment is taken and nothing is sent
 * anywhere, same as the plan upgrade in Plans.jsx.
 */
import React from "react";
import { createPortal } from "react-dom";
import { Star } from "./CoursePicker";
import AppleMark from "./AppleMark.jsx";
import paymentQR from "../assets/payment-qr.png";

const CSS = `
  .ss-veil, .ss-wrap{
    --paper:#F7F4ED; --sheet:#FFFFFF; --ink:#1C1A15; --body:#4A473F;
    --muted:#857F73; --faint:#AEA89A; --hair:#E1DBCC; --hair-2:#CFC8B6; --track:#E8E2D5;
    --green:#243529; --green-mid:#3E5F48; --green-btn:#3E8F52; --green-dark:#2C6E3D;
    --green-soft:#E5EBE4; --green-line:#B2C6B4;
    --brass:#8E6F2A; --brass-mid:#C9922A; --brass-lit:#F0C255; --brass-soft:#F3EBD8;
    --type:"Courier Prime","American Typewriter","Courier New",monospace;
    --sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
    --e:cubic-bezier(.2,.7,.2,1);
    --pop:cubic-bezier(.34,1.5,.4,1);
    font-family:var(--sans);
  }
  .ss-veil{position:fixed;inset:0;z-index:80;background:rgba(31,29,24,.5);
           -webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);
           animation:ss-fade .22s var(--e) both}
  @keyframes ss-fade{from{opacity:0}to{opacity:1}}
  .ss-wrap{position:fixed;inset:0;z-index:81;display:grid;place-items:center;padding:20px}
  .ss-box{position:relative;width:min(940px,100%);max-height:90vh;overflow-y:auto;
          background:var(--paper);border:1px solid var(--hair);border-radius:26px;
          padding:22px 24px 26px;box-shadow:0 24px 56px rgba(31,29,24,.3);
          animation:ss-in .34s var(--pop) both;color:var(--body)}
  @keyframes ss-in{from{opacity:0;transform:translateY(24px) scale(.95)}to{opacity:1;transform:none}}
  .ss-box *{box-sizing:border-box}

  /* ---------- header + balance HUD ---------- */
  .ss-head{display:flex;align-items:center;gap:14px;margin-bottom:18px}
  .ss-head h2{margin:0;font-family:var(--type);font-size:23px;font-weight:700;
              letter-spacing:-.02em;color:var(--green);line-height:1.2}
  .ss-head p{margin:2px 0 0;font-size:12.5px;color:var(--muted)}
  .ss-head .ss-grow{flex:1}
  .ss-x{width:36px;height:36px;flex:none;border:0;border-radius:50%;cursor:pointer;
        display:grid;place-items:center;background:var(--track);color:var(--body);
        transition:all .14s var(--e)}
  .ss-x:hover{background:var(--hair-2);color:var(--ink);transform:rotate(90deg)}

  .ss-hud{display:flex;align-items:center;gap:10px;padding:9px 16px 9px 12px;border-radius:16px;
          background:var(--sheet);border:1px solid var(--hair);box-shadow:0 3px 0 var(--hair)}
  .ss-hud b{font-family:var(--type);font-size:20px;font-weight:700;line-height:1;color:var(--brass)}
  .ss-hud i{font-style:normal;display:block;margin-top:3px;font-size:9.5px;font-weight:800;
            letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
  .ss-hud.ss-bump{animation:ss-bump .5s var(--pop)}
  @keyframes ss-bump{0%{transform:none}35%{transform:scale(1.12)}100%{transform:none}}

  /* ---------- section headings ---------- */
  .ss-lab{display:flex;align-items:baseline;gap:8px;margin:20px 0 10px}
  .ss-lab:first-of-type{margin-top:4px}
  .ss-lab h3{margin:0;font-size:11px;font-weight:800;letter-spacing:.16em;
             text-transform:uppercase;color:var(--faint)}
  .ss-lab span{font-size:12px;color:var(--muted)}

  /* ---------- the free row: daily chest + apple trade ---------- */
  .ss-free{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  @media (max-width:680px){ .ss-free{grid-template-columns:1fr} }
  .ss-card{display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--sheet);
           border:1px solid var(--hair);border-radius:18px;box-shadow:0 4px 0 var(--hair)}
  .ss-card .ss-art{width:58px;height:58px;flex:none;display:grid;place-items:center;
                   border-radius:16px;background:var(--brass-soft)}
  .ss-card h4{margin:0;font-size:14.5px;font-weight:700;color:var(--ink)}
  .ss-card p{margin:3px 0 0;font-size:12px;color:var(--muted);line-height:1.4}
  .ss-card .ss-mid{flex:1;min-width:0}

  .ss-btn{flex:none;border:0;cursor:pointer;font:inherit;font-size:13px;font-weight:800;
          letter-spacing:.04em;padding:10px 16px;border-radius:12px;color:#fff;
          background:var(--green-btn);box-shadow:0 3px 0 var(--green-dark);
          transition:all .12s var(--e)}
  .ss-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 0 var(--green-dark)}
  .ss-btn:active:not(:disabled){transform:translateY(3px);box-shadow:0 0 0 var(--green-dark)}
  .ss-btn:disabled{background:var(--track);color:var(--faint);box-shadow:0 3px 0 var(--hair);
                   cursor:default}
  .ss-btn.ss-gold{background:linear-gradient(180deg,var(--brass-lit),var(--brass-mid));
                  box-shadow:0 3px 0 #A8791F;color:#3B2C08}
  .ss-btn.ss-gold:hover:not(:disabled){box-shadow:0 4px 0 #A8791F}
  .ss-btn.ss-gold:active:not(:disabled){box-shadow:0 0 0 #A8791F}
  .ss-btn.ss-ghost{background:none;color:var(--body);border:1.5px solid var(--hair-2);
                   box-shadow:none;padding:9px 15px}
  .ss-btn.ss-ghost:hover{border-color:var(--hair-2);background:var(--track);transform:none}

  /* the chest jiggles until it's claimed, so the free thing gets noticed */
  .ss-chest-art{animation:ss-tilt 2.6s var(--e) infinite;transform-origin:50% 80%}
  @keyframes ss-tilt{0%,72%,100%{transform:rotate(0)}78%{transform:rotate(-7deg)}
                     86%{transform:rotate(6deg)}93%{transform:rotate(-3deg)}}
  .ss-done .ss-chest-art{animation:none;opacity:.45;filter:grayscale(1)}
  .ss-done{background:#FBF9F3}

  /* ---------- the packs ---------- */
  .ss-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
  @media (max-width:820px){ .ss-grid{grid-template-columns:repeat(2,1fr)} }
  @media (max-width:420px){ .ss-grid{grid-template-columns:1fr} }

  .ss-pack{position:relative;display:grid;justify-items:center;gap:2px;padding:20px 12px 14px;
           background:var(--sheet);border:1px solid var(--hair);border-radius:20px;
           box-shadow:0 4px 0 var(--hair);cursor:pointer;font:inherit;text-align:center;
           overflow:hidden;transition:all .14s var(--e);animation:ss-up .4s var(--e) both}
  @keyframes ss-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  .ss-pack:hover{transform:translateY(-3px);border-color:var(--brass-lit);
                 box-shadow:0 7px 0 var(--hair)}
  .ss-pack:active{transform:translateY(2px);box-shadow:0 1px 0 var(--hair)}
  .ss-pack.ss-hot{border-color:var(--brass-lit);background:
       radial-gradient(120% 80% at 50% 0,#FFF9E9 0,var(--sheet) 62%)}

  /* a slow shine sweeping over the vessel art */
  .ss-pack .ss-shine{position:absolute;top:-40%;left:-60%;width:40%;height:180%;
       background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);
       transform:rotate(18deg);pointer-events:none;animation:ss-sweep 4.5s var(--e) infinite}
  @keyframes ss-sweep{0%,62%{left:-60%}100%{left:130%}}

  .ss-pack .ss-vessel{width:92px;height:82px;display:grid;place-items:center;
                      transition:transform .18s var(--pop)}
  .ss-pack:hover .ss-vessel{transform:translateY(-3px) scale(1.05)}
  .ss-pack .ss-amt{display:flex;align-items:center;gap:6px;font-family:var(--type);
                   font-size:19px;font-weight:700;color:var(--ink);line-height:1}
  .ss-pack .ss-nm{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;
                  color:var(--faint);margin-top:2px}
  .ss-pack .ss-bonus{margin-top:7px;padding:4px 10px;border-radius:999px;
                     background:var(--green-soft);color:var(--green-mid);
                     font-size:11px;font-weight:800;letter-spacing:.02em}
  .ss-pack .ss-bonus.ss-none{background:var(--track);color:var(--muted)}
  .ss-pack .ss-buy{margin-top:10px;width:100%;padding:9px 0;border-radius:12px;
                   background:var(--green-btn);color:#fff;font-size:13.5px;font-weight:800;
                   letter-spacing:.03em;box-shadow:0 3px 0 var(--green-dark)}
  .ss-pack:hover .ss-buy{background:#46A25D}
  .ss-tag{position:absolute;top:12px;right:-30px;width:120px;padding:4px 0;text-align:center;
          transform:rotate(38deg);background:linear-gradient(180deg,var(--brass-lit),var(--brass-mid));
          color:#3B2C08;font-size:9px;font-weight:800;letter-spacing:.1em;
          box-shadow:0 2px 6px rgba(31,29,24,.2)}

  /* ---------- the pay sheet ---------- */
  .ss-pay{position:absolute;inset:0;z-index:2;display:grid;place-items:center;padding:22px;
          background:rgba(247,244,237,.94);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);
          border-radius:26px;animation:ss-fade .2s var(--e) both}
  .ss-sheet{width:min(430px,100%);background:var(--sheet);border:1px solid var(--hair);
            border-radius:22px;padding:22px;text-align:center;
            box-shadow:0 14px 34px rgba(31,29,24,.18);animation:ss-in .3s var(--pop) both}
  .ss-sheet h3{margin:12px 0 4px;font-family:var(--type);font-size:20px;color:var(--green)}
  .ss-sheet .ss-sub{margin:0 0 16px;font-size:12.5px;color:var(--muted)}
  .ss-qr{display:flex;align-items:center;gap:14px;padding:12px;border-radius:16px;
         background:var(--paper);border:1px solid var(--hair);text-align:left}
  .ss-qr img{width:92px;height:92px;flex:none;border-radius:10px;object-fit:cover;
             background:#fff;border:1px solid var(--hair)}
  .ss-qr dl{margin:0;flex:1;display:grid;gap:7px}
  .ss-qr div{display:flex;justify-content:space-between;gap:10px;font-size:12.5px}
  .ss-qr dt{color:var(--muted)}
  .ss-qr dd{margin:0;font-family:var(--type);font-weight:700;color:var(--ink)}
  .ss-note{margin:12px 0 0;font-size:11.5px;color:var(--faint);line-height:1.5}
  .ss-actions{display:flex;gap:10px;margin-top:16px}
  .ss-actions .ss-btn{flex:1}

  /* ---------- the payoff ---------- */
  .ss-won{font-family:var(--type);font-size:30px;font-weight:700;color:var(--brass);
          display:flex;align-items:center;justify-content:center;gap:10px;
          animation:ss-bump .55s var(--pop) both}
  .ss-burst{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:26px}
  .ss-fly{position:absolute;top:50%;left:50%;animation:ss-fly 1s var(--e) both}
  @keyframes ss-fly{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}
                    18%{opacity:1}
                    100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.1) rotate(var(--rot))}}

  /* Star from CoursePicker leans on its sheet's .star rule; restate it so
     the shop draws right even if the picker isn't mounted. */
  .ss-veil .star, .ss-wrap .star{flex:none;display:block}

  /* ---------- phones ---------- */
  @media (max-width:560px){
    .ss-wrap{padding:10px}
    .ss-box{padding:18px 16px 22px;border-radius:22px;max-height:94vh}
    .ss-head{flex-wrap:wrap;gap:10px}
    .ss-head h2{font-size:20px}
    .ss-head p{display:none}
    .ss-head .ss-grow{display:none}
    .ss-hud{order:3;flex:1 1 100%;justify-content:center}
    .ss-card{gap:11px;padding:12px 13px}
    .ss-card .ss-art{width:48px;height:48px}
    .ss-card .ss-art svg{width:42px;height:auto}
    .ss-pack{padding:16px 8px 12px}
    .ss-pack .ss-vessel{width:74px;height:66px}
    .ss-pack .ss-vessel svg{width:64px;height:auto}
    .ss-pay{padding:12px;border-radius:22px}
    .ss-sheet{padding:18px 16px}
    .ss-qr{flex-direction:column;text-align:center}
    .ss-qr img{width:120px;height:120px}
    .ss-qr dl{width:100%}
  }

  @media (prefers-reduced-motion:reduce){
    .ss-veil *,.ss-wrap *{animation:none!important;transition:none!important}
  }
`;

/* ================================================================
   the vessels — flat art, one per tier, so the sizes read at a glance
   ================================================================ */
const GOLD = { lit: "#F0C255", mid: "#C9922A", dark: "#8E6F2A", ink: "#5B4715" };

function Pouch() {
  return (
    <svg width="74" height="70" viewBox="0 0 74 70" fill="none" aria-hidden="true">
      <path d="M22 22h30l8 26a10 10 0 0 1-9.6 12.6H23.6A10 10 0 0 1 14 48Z"
            fill={GOLD.mid} stroke={GOLD.ink} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M24 26h26l6.4 21H17.6Z" fill={GOLD.lit} />
      <path d="M22 22c0-5 3-8 15-8s15 3 15 8" stroke={GOLD.ink} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M18 20h38" stroke={GOLD.ink} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M37 34l2.4 5 5.4.8-3.9 3.7.9 5.3-4.8-2.4-4.8 2.4.9-5.3-3.9-3.7 5.4-.8Z"
            fill="#FFF6DC" stroke={GOLD.ink} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function Jar() {
  return (
    <svg width="74" height="70" viewBox="0 0 74 70" fill="none" aria-hidden="true">
      <rect x="26" y="8" width="22" height="8" rx="2.6" fill={GOLD.dark} stroke={GOLD.ink} strokeWidth="2.4" />
      <path d="M18 24a8 8 0 0 1 8-8h22a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8Z"
            fill="#EFEADC" stroke={GOLD.ink} strokeWidth="2.6" />
      <path d="M20 40h34v12a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8Z" fill={GOLD.mid} />
      <path d="M20 40h34v6H20Z" fill={GOLD.lit} />
      <path d="M31 46l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6Z" fill="#FFF6DC" />
      <path d="M45 49l1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5Z" fill="#FFF6DC" />
      <path d="M24 22v10" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

function Chest() {
  return (
    <svg width="78" height="70" viewBox="0 0 78 70" fill="none" aria-hidden="true">
      <path d="M13 30a26 26 0 0 1 52 0v4H13Z" fill={GOLD.mid} stroke={GOLD.ink} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M19 30a20 20 0 0 1 40 0" stroke={GOLD.lit} strokeWidth="4" />
      <rect x="11" y="33" width="56" height="26" rx="4" fill="#A8763C" stroke={GOLD.ink} strokeWidth="2.6" />
      <path d="M11 39h56v6H11Z" fill={GOLD.mid} />
      <rect x="33" y="38" width="12" height="14" rx="2.6" fill={GOLD.lit} stroke={GOLD.ink} strokeWidth="2.2" />
      <circle cx="39" cy="45" r="2" fill={GOLD.ink} />
      <path d="M39 4l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7Z"
            fill="#FFF0C6" stroke={GOLD.ink} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M20 14l1.4 2.9 3.2.5-2.3 2.2.5 3.2-2.8-1.5-2.8 1.5.5-3.2-2.3-2.2 3.2-.5Z" fill="#FFF0C6" opacity=".9" />
      <path d="M58 14l1.4 2.9 3.2.5-2.3 2.2.5 3.2-2.8-1.5-2.8 1.5.5-3.2-2.3-2.2 3.2-.5Z" fill="#FFF0C6" opacity=".9" />
    </svg>
  );
}

function Vault() {
  return (
    <svg width="78" height="72" viewBox="0 0 78 72" fill="none" aria-hidden="true">
      <rect x="9" y="12" width="60" height="50" rx="8" fill="#5C6B63" stroke={GOLD.ink} strokeWidth="2.6" />
      <rect x="15" y="18" width="48" height="38" rx="5" fill="#77887E" />
      <circle cx="39" cy="37" r="15" fill={GOLD.mid} stroke={GOLD.ink} strokeWidth="2.6" />
      <circle cx="39" cy="37" r="8.5" fill={GOLD.lit} />
      <path d="M39 24v-5M39 55v-5M52 37h5M21 37h5M48.5 27.5l3.5-3.5M26 48l3.5-3.5M48.5 46.5l3.5 3.5M26 26l3.5 3.5"
            stroke={GOLD.ink} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M39 32.6l1.5 3.1 3.4.5-2.4 2.4.6 3.4-3.1-1.6-3.1 1.6.6-3.4-2.4-2.4 3.4-.5Z" fill="#FFF6DC" />
      <path d="M13 62v5M65 62v5" stroke={GOLD.ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M62 6l1.6 3.3 3.6.5-2.6 2.6.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.6 3.6-.5Z" fill={GOLD.lit} />
    </svg>
  );
}

const AppleArt = <AppleMark size={34} />;

/* ================================================================
   the packs — swap for your own price list
   ================================================================ */
const PACKS = [
  { k: "pouch", n: "Pouch", stars: 100, bonus: 0, price: 0.99, art: <Pouch /> },
  { k: "jar", n: "Jar", stars: 500, bonus: 50, price: 3.99, art: <Jar /> },
  { k: "chest", n: "Chest", stars: 1200, bonus: 300, price: 8.99, art: <Chest />, tag: "POPULAR", hot: true },
  { k: "vault", n: "Vault", stars: 3000, bonus: 1000, price: 19.99, art: <Vault />, tag: "BEST VALUE" },
];

const total = (p) => p.stars + p.bonus;
const money = (n) => "$" + n.toFixed(2);

/** Rolls a number up to its new value — the balance never just jumps. */
function useCountUp(value, ms = 700) {
  const [shown, setShown] = React.useState(value);
  const from = React.useRef(value);

  React.useEffect(() => {
    if (value === from.current) return;
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(a + (value - a) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    // rAF is throttled to nothing in a background tab, which would leave
    // the balance frozen at the old number — land it either way
    const done = setTimeout(() => { setShown(value); from.current = value; }, ms + 60);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
  }, [value, ms]);

  return shown;
}

/* the stars that fly outward when a top-up lands */
function Burst() {
  const bits = React.useMemo(
    () => Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2 + Math.random();
      const d = 120 + Math.random() * 190;
      return {
        dx: Math.cos(a) * d + "px",
        dy: Math.sin(a) * d * 0.75 + "px",
        rot: Math.round(Math.random() * 360 - 180) + "deg",
        size: 14 + Math.round(Math.random() * 16),
        delay: Math.random() * 0.22,
      };
    }),
    []
  );
  return (
    <div className="ss-burst" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} className="ss-fly"
              style={{ "--dx": b.dx, "--dy": b.dy, "--rot": b.rot, animationDelay: b.delay + "s" }}>
          <Star size={b.size} />
        </span>
      ))}
    </div>
  );
}

/**
 * StarShop — top up, claim the daily stars, or trade apples for them.
 *
 * onClaimDaily / onTradeApple return the number of stars credited (0 when
 * the host refused: already claimed today, not enough apples), so the shop
 * can show the right payoff without knowing the rules.
 */
export default function StarShop({
  open,
  stars = 0,
  apples = 0,
  dailyClaimed = false,
  starsPerApple = 200,
  dailyStars = 50,
  onClose,
  onBuyPack,
  onClaimDaily,
  onTradeApple,
  onOpenDailyTasks,
}) {
  const [pending, setPending] = React.useState(null);   /* the pack at the pay sheet */
  const [won, setWon] = React.useState(null);           /* stars just credited */
  const [bump, setBump] = React.useState(false);        /* the HUD's little kick */
  const shown = useCountUp(stars);

  /* Escape closes the pay sheet first, then the shop */
  React.useEffect(() => {
    if (!open) return;
    const esc = (e) => {
      if (e.key !== "Escape") return;
      if (pending || won) { setPending(null); setWon(null); return; }
      onClose && onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, pending, won, onClose]);

  /* the page behind must not scroll while the shop is up */
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  /* forget the last purchase when the shop closes */
  React.useEffect(() => {
    if (!open) { setPending(null); setWon(null); }
  }, [open]);

  if (!open) return null;

  const credited = (n) => {
    if (!n) return;
    setWon(n);
    setBump(true);
    setTimeout(() => setBump(false), 600);
  };

  const pay = () => {
    if (!pending) return;
    onBuyPack && onBuyPack(pending);
    const n = total(pending);
    setPending(null);
    credited(n);
  };

  const claim = () => credited(onClaimDaily ? onClaimDaily() : 0);
  const trade = () => credited(onTradeApple ? onTradeApple() : 0);

  return createPortal(
    <>
      <style>{CSS}</style>
      <div className="ss-veil" onClick={() => onClose && onClose()} />
      <div className="ss-wrap" role="dialog" aria-modal="true" aria-label="Star shop">
        <div className="ss-box">
          <div className="ss-head">
            <div>
              <h2>Star shop</h2>
              <p>Top up, then spend them on any course in the picker.</p>
            </div>
            <span className="ss-grow" />
            <span className={"ss-hud" + (bump ? " ss-bump" : "")}>
              <Star size={28} />
              <span>
                <b>{shown.toLocaleString()}</b>
                <i>Your stars</i>
              </span>
            </span>
            <button className="ss-x" aria-label="Close" onClick={() => onClose && onClose()}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          {/* ---------- free stars ---------- */}
          <div className="ss-lab">
            <h3>Free stars</h3>
            <span>no payment needed</span>
          </div>
          <div className="ss-free">
            <div className={"ss-card" + (dailyClaimed ? " ss-done" : "")}>
              <span className="ss-art">
                <span className="ss-chest-art"><Chest /></span>
              </span>
              <span className="ss-mid">
                <h4>Daily chest</h4>
                <p>{dailyClaimed
                  ? "Opened today — a new one lands tomorrow."
                  : `Open it for ${dailyStars} stars, once a day.`}</p>
              </span>
              <button className="ss-btn ss-gold" disabled={dailyClaimed} onClick={claim}>
                {dailyClaimed ? "Claimed" : "Open"}
              </button>
            </div>

            <div className={"ss-card" + (apples < 1 ? " ss-done" : "")}>
              <span className="ss-art">{AppleArt}</span>
              <span className="ss-mid">
                <h4>Trade an apple</h4>
                <p>{apples >= 1
                  ? `1 apple → ${starsPerApple.toLocaleString()} stars. You have ${apples}.`
                  : "Earn apples from daily tasks and your streak."}</p>
              </span>
              {apples >= 1 ? (
                <button className="ss-btn" onClick={trade}>Trade</button>
              ) : (
                <button className="ss-btn ss-ghost"
                        onClick={() => { onClose && onClose(); onOpenDailyTasks && onOpenDailyTasks(); }}>
                  Tasks
                </button>
              )}
            </div>
          </div>

          {/* ---------- the packs ---------- */}
          <div className="ss-lab">
            <h3>Top up</h3>
            <span>bigger packs carry a bonus</span>
          </div>
          <div className="ss-grid">
            {PACKS.map((p, i) => (
              <button key={p.k} className={"ss-pack" + (p.hot ? " ss-hot" : "")}
                      style={{ animationDelay: 0.05 * i + "s" }}
                      onClick={() => setPending(p)}>
                {p.tag && <span className="ss-tag">{p.tag}</span>}
                <span className="ss-vessel">{p.art}</span>
                <span className="ss-shine" />
                <span className="ss-amt"><Star size={19} />{total(p).toLocaleString()}</span>
                <span className="ss-nm">{p.n}</span>
                <span className={"ss-bonus" + (p.bonus ? "" : " ss-none")}>
                  {p.bonus ? `+${p.bonus} bonus` : "no bonus"}
                </span>
                <span className="ss-buy">{money(p.price)}</span>
              </button>
            ))}
          </div>

          {/* ---------- the pay sheet ---------- */}
          {pending && (
            <div className="ss-pay">
              <div className="ss-sheet">
                <span className="ss-vessel">{pending.art}</span>
                <h3>{total(pending).toLocaleString()} stars</h3>
                <p className="ss-sub">
                  {pending.n} pack{pending.bonus ? ` · ${pending.stars.toLocaleString()} + ${pending.bonus} bonus` : ""}
                </p>
                <div className="ss-qr">
                  <img src={paymentQR} alt="Scan to pay" />
                  <dl>
                    <div><dt>Amount</dt><dd>{money(pending.price)}</dd></div>
                    <div><dt>Reference</dt><dd>STAR-{pending.k.toUpperCase()}</dd></div>
                    <div><dt>Credited</dt><dd>{total(pending).toLocaleString()} ★</dd></div>
                  </dl>
                </div>
                <p className="ss-note">
                  Demo checkout — no payment is taken and nothing is sent anywhere.
                  The stars land in your balance straight away.
                </p>
                <div className="ss-actions">
                  <button className="ss-btn ss-ghost" onClick={() => setPending(null)}>Cancel</button>
                  <button className="ss-btn ss-gold" onClick={pay}>Pay {money(pending.price)}</button>
                </div>
              </div>
            </div>
          )}

          {/* ---------- the payoff ---------- */}
          {won && (
            <div className="ss-pay" onClick={() => setWon(null)}>
              <Burst />
              <div className="ss-sheet" onClick={(e) => e.stopPropagation()}>
                <p className="ss-won"><Star size={34} />+{won.toLocaleString()}</p>
                <h3>Stars added</h3>
                <p className="ss-sub">Your balance is now {stars.toLocaleString()}.</p>
                <div className="ss-actions">
                  <button className="ss-btn" onClick={() => setWon(null)}>Nice</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
