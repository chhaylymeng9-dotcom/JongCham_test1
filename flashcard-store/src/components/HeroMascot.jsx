import { useCallback, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useI18n } from "../i18n.jsx";
import PandaWalk from "./PandaWalk.jsx";
import "./heroMascot.css";

/* ---------- HeroMascot ----------
The store hero: the panda walking through a bamboo grove, with a standing
invitation to sign in that travels over its head.

Three layers, back to front — the drawn scene, the panda, the bubble. The
scene is drawn rather than filmed because the clip arrives on a studio
backdrop that PandaWalk cuts away; this is what goes in its place, and it
holds still, since the shot is a locked-off camera and the panda is the
only thing crossing it.

PandaWalk reports where the panda's head is on every frame. That lands on
the root as CSS variables rather than state: it arrives at the clip's
frame rate, and re-rendering the hero sixteen times a second to move one
speech bubble would be a poor trade.
--------------------------------- */

/* The scene's own units. It is laid out at half of PandaWalk's canvas, so
   the ground line here is that canvas's GROUND_Y halved and the two stay
   in step: the panda's soles land exactly on the grass. */
const SCENE_W = 420;
const SCENE_H = 280;
const HORIZON = 250;
/* The walking line, low in the frame: the panda crosses along the foot of
   the scene rather than through the middle of it, which is what puts the
   grove and the range behind it instead of around it. */
const GROUND = 266;

/* A stalk, planted on the ground line and leaning a little. Lighter and
   thinner than the panda's own edges — the grove is background and must
   not compete with the character walking through it. */
function Bamboo({ x, height, lean = 0, scale = 1 }) {
  const segments = [];
  for (let y = 34; y < height - 12; y += 34) segments.push(y);
  return (
    <g transform={`translate(${x} ${GROUND}) rotate(${lean}) scale(${scale})`} opacity=".9">
      <path
        d={`M-4.5 0v${-height}h9v${height}Z`}
        fill="#A6C98A"
        stroke="#75A059"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <g stroke="#75A059" strokeWidth="1.8" strokeLinecap="round">
        {segments.map((y) => (
          <path key={y} d={`M-4.5 ${-y}h9`} />
        ))}
      </g>
      <g fill="#9CC17E" stroke="#75A059" strokeWidth="1.6" strokeLinejoin="round">
        <path d={`M0 ${-height + 4}c-16-6-24-16-22-24 10-2 18 6 22 24Z`} />
        <path d={`M0 ${-height + 11}c17-7 25-17 23-25-10-2-19 7-23 25Z`} />
        <path d={`M0 ${-height + 24}c-13-4-20-12-18-19 8-2 16 4 18 19Z`} />
        <path d={`M0 ${-height + 52}c13-5 19-12 17-18-8-2-14 4-17 18Z`} />
      </g>
    </g>
  );
}

/* A range, given as its skyline left to right and closed along the
   horizon. Written out as points rather than as one hand-tuned path
   because the closing edge has to land back on the horizon exactly: get
   the arithmetic wrong by a few units in a relative path and the range
   picks up a slanted base that cuts across the fill. Each skyline starts
   and ends on the horizon itself, so closing it adds no edge. */
function ridge(points) {
  return `M${points.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
}

/* Both ranges start and finish on the horizon, so with no frame around the
   scene neither one ends on a vertical cut at its sides. */
const FAR_RIDGE = [
  [0, HORIZON], [16, 210], [38, 132], [76, 196], [112, 166], [152, 206],
  [196, 128], [240, 200], [278, 168], [318, 206], [356, 150], [396, 200],
  [410, 230], [420, HORIZON],
];

const NEAR_RIDGE = [
  [0, HORIZON], [20, 226], [46, 192], [92, 226], [134, 202], [178, 230],
  [222, 188], [266, 226], [310, 204], [352, 232], [392, 198], [408, 228],
  [420, HORIZON],
];

function Cloud({ y, scale, className }) {
  return (
    <g className={`hp-cloud ${className}`}>
      <g transform={`translate(0 ${y}) scale(${scale})`}>
        <path
          d="M0 22a11 11 0 0 1 11-11 15 15 0 0 1 28 1.4A9.5 9.5 0 0 1 48 22Z"
          fill="#FFFFFF"
          stroke="#D3DEDA"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

function Scene() {
  return (
    <svg className="hp-scene" viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} aria-hidden="true">
      <defs>
        {/* the grass dissolves rather than stopping, so the scene has no
            bottom edge to read as the floor of a panel */}
        <linearGradient id="hp-grass" x1="0" y1={HORIZON} x2="0" y2={SCENE_H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#CFE4B4" />
          <stop offset="0.8" stopColor="#CFE4B4" />
          <stop offset="1" stopColor="#CFE4B4" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* No sky: the page is the sky. A filled rectangle here is what turns
          a scene into a panel, and there is no frame now to justify one. */}
      <Cloud y={28} scale={1} className="hp-cloud-1" />
      <Cloud y={62} scale={0.68} className="hp-cloud-2" />
      <Cloud y={14} scale={1.3} className="hp-cloud-3" />

      {/* Two ranges, the far one cooler, paler and capped so it reads as
          distance rather than as one more hill. */}
      <g stroke="none">
        <path d={ridge(FAR_RIDGE)} fill="#C3D6D8" />
        <path d="M196 128l14 19h-28Z" fill="#EDF5F4" />
        <path d="M356 150l12 16h-24Z" fill="#EDF5F4" />
        <path d={ridge(NEAR_RIDGE)} fill="#AECBB6" />
      </g>

      {/* Every stalk stands clear of the 6% the frame fades out at each
          side — a stalk inside that band is drawn at part opacity and
          reads as a ghost of one rather than as distance — but only just
          clear, so the grove reaches both ends of the scene and there is
          no stretch of empty ground before it starts. */}
      <Bamboo x={36} height={162} lean={-2.5} />
      <Bamboo x={62} height={120} lean={2} scale={0.9} />
      <Bamboo x={98} height={194} lean={-1} scale={0.82} />
      <Bamboo x={144} height={116} lean={1.5} scale={0.7} />
      <Bamboo x={196} height={132} lean={-2} scale={0.74} />
      <Bamboo x={268} height={122} lean={-1.5} scale={0.7} />
      <Bamboo x={312} height={152} lean={2.5} scale={0.86} />
      <Bamboo x={352} height={200} lean={-1.5} />
      <Bamboo x={380} height={138} lean={2} scale={0.92} />

      {/* The grass the panda walks on. It runs right into both bottom
          corners rather than thinning away before it gets there — tapering
          to nothing left the corners bare, which read as the ground giving
          out rather than as a soft edge. It still drops a little at each
          end, and its own gradient fades the bottom out, so neither corner
          ends on a full-height square cut. */}
      <path
        d={`M0 254Q20 ${HORIZON} 44 ${HORIZON}Q120 ${HORIZON - 7} 210 ${HORIZON}Q300 ${HORIZON + 7} 380 ${HORIZON}Q402 ${HORIZON} 420 254V${SCENE_H}H0Z`}
        fill="url(#hp-grass)"
      />
      <path
        d={`M34 ${GROUND}h${SCENE_W - 68}`}
        stroke="#1A1A1A"
        strokeOpacity=".13"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="11 24"
      />
      {/* tufts sit on the walking line, and above where the grass starts
          dissolving, so the panda passes behind them rather than over
          nothing */}
      <g stroke="#A8CE85" strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M34 272v-9M40 272v-13M46 272v-8" />
        <path d="M196 274v-9M202 274v-13M208 274v-8" />
        <path d="M356 270v-9M362 270v-13M368 270v-8" />
      </g>
    </svg>
  );
}

export default function HeroMascot({ onSayClick }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const shownRef = useRef(null);

  /* PandaWalk works out whether the panda's arm is up; the bubble is what
     it is saying, so it is on exactly while the wave is and gone the moment
     the hand comes down. */
  const handleAnchor = useCallback((x, y, greeting) => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--hp-x", `${x}%`);
    root.style.setProperty("--hp-y", `${y}%`);
    if (shownRef.current !== greeting) {
      shownRef.current = greeting;
      root.dataset.panda = greeting ? "hi" : "walking";
    }
  }, []);

  return (
    <div className="hp-root" ref={rootRef} data-panda="walking">
      {/* The frame clips the panda as it enters and leaves; the bubble is
          outside it so it can sit above the head near the top of the scene
          without being cut off on a narrow column. */}
      <div className="hp-frame">
        <Scene />
        <PandaWalk onAnchor={handleAnchor} label={t("hero.mascotAlt")} reduceMotion={reduceMotion} />
      </div>

      {/* Rides on the panda's head for the whole crossing. */}
      <div className="hp-say">
        <button type="button" className="hp-bubble" onClick={onSayClick}>
          {t("hero.pandaSays")}
        </button>
      </div>
    </div>
  );
}
