import "./mascot.css";

/* ---------- Cham, the JongCham mascot ----------
An original character for this brand rather than a stock panda. What
makes it ours carries across every pose: it never appears without a card
of its own, and it wears the brand's orange band with a cardstock tag on
the buckle.

Built from one shared <Head>, so a new pose only has to draw a body and
the character still reads as the same panda. Poses: peek · wave · study ·
cheer · sleep.
--------------------------------- */

const INK = "#23201B";
const FUR = "#FBF7EE"; // warmer than white, the colour of the actual card stock
const CARD = "#F1E9D2";
const ACCENT = "#D65F42";
const LEAF = "#7FA95E";

/* The face, drawn around its own origin so a pose can put it anywhere.
   `crop` cuts it off at the chin for the peeking pose. */
function Head({ x, y, scale = 1, tilt = 0 }) {
  return (
    <g className="mc-head" transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`}>
      {/* ears sit up at the corners, tilted out */}
      <g className="mc-ear">
        <ellipse cx="-40" cy="-38" rx="17" ry="14.5" fill={INK} transform="rotate(-32 -40 -38)" />
      </g>
      <ellipse cx="40" cy="-38" rx="17" ry="14.5" fill={INK} transform="rotate(32 40 -38)" />

      {/* a touch wider than tall, so the face reads round-cheeked */}
      <ellipse cx="0" cy="2" rx="52" ry="46" fill={FUR} />

      {/* the patches are long ovals slanting down toward the nose */}
      <ellipse cx="-22" cy="-4" rx="15" ry="20" fill={INK} stroke="none" transform="rotate(-32 -22 -4)" />
      <ellipse cx="22" cy="-4" rx="15" ry="20" fill={INK} stroke="none" transform="rotate(32 22 -4)" />

      <g className="mc-eyes" stroke="none">
        <circle cx="-16" cy="-12" r="8.5" fill="#FFFFFF" />
        <circle cx="16" cy="-12" r="8.5" fill="#FFFFFF" />
      </g>

      {/* rounded-triangle nose over a wide two-stroke smile */}
      <path d="M-11 12c0-4.5 5-7 11-7s11 2.5 11 7-5 11-11 13.5C-6 23-11 16.5-11 12Z" fill={INK} stroke="none" />
      <path d="M0 25.5c-5 7.5-15.5 9.5-23.5 5.5" fill="none" strokeWidth="4.4" strokeLinecap="round" />
      <path d="M0 25.5c5 7.5 15.5 9.5 23.5 5.5" fill="none" strokeWidth="4.4" strokeLinecap="round" />
    </g>
  );
}

/* The band and its cardstock tag — worn in every standing pose. */
function Band({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-34 0a34 34 0 0 0 68 0l3 11a38 38 0 0 1-74 0Z" fill={ACCENT} />
      <rect x="-9" y="7" width="18" height="13" rx="3" fill={CARD} />
      <path d="M-4 12h8M-4 16h5" stroke={INK} strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/* A flashcard, its one constant prop. */
function Card({ x, y, tilt = 0, w = 34, h = 44 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="5" fill={CARD} strokeWidth="4" />
      <path
        d={`M${-w / 2 + 7} ${-h / 2 + 13}h${w - 14}M${-w / 2 + 7} ${-h / 2 + 22}h${w - 14}M${-w / 2 + 7} ${-h / 2 + 31}h${Math.round((w - 14) * 0.55)}`}
        stroke={INK}
        strokeOpacity=".45"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </g>
  );
}

/* ---------- scenery for the walking pose ----------
The mascot walks to the left, so the world slides to the right past it:
scenery starts off the LEFT edge and is spread out by the negative delays
in the stylesheet, so each pass crosses the frame in full. The drift sits
on the outer group because a CSS transform would otherwise override a
transform attribute on the same element. */
const SCENE_X = -26;

function Bamboo({ top, lean, className }) {
  /* Lighter and thinner than the mascot's own outline — the grove has to
     read as the background it is, not compete with the character. Leaves
     come in a crown plus one sprig lower down, so a stalk doesn't read as
     a bare pole with a sprout on top. */
  return (
    <g className={`mc-tree ${className}`} opacity=".85">
      <g transform={`translate(${SCENE_X} 0) rotate(${lean} 0 214)`}>
        <path d={`M-5 214V${top}h10v${214 - top}Z`} fill="#A6C98A" stroke="#75A059" strokeWidth="2" strokeLinejoin="round" />
        <g stroke="#75A059" strokeWidth="2" strokeLinecap="round">
          {[0, 1, 2, 3].map((i) => {
            const y = 214 - 28 - i * 32;
            return y > top + 6 ? <path key={i} d={`M-5 ${y}h10`} /> : null;
          })}
        </g>
        <g fill="#9CC17E" stroke="#75A059" strokeWidth="1.8" strokeLinejoin="round">
          <path d={`M0 ${top + 3}c-17-6-25-17-23-25 10-2 19 6 23 25Z`} />
          <path d={`M0 ${top + 9}c17-7 26-18 24-26-10-2-20 7-24 26Z`} />
          <path d={`M0 ${top + 20}c-14-4-21-13-19-20 8-2 17 4 19 20Z`} />
          <path d={`M0 ${top + 52}c13-5 20-13 18-19-8-2-15 5-18 19Z`} />
        </g>
      </g>
    </g>
  );
}

function SceneCloud({ y, scale, className }) {
  return (
    <g className={`mc-cloud ${className}`}>
      <g transform={`translate(${SCENE_X} ${y}) scale(${scale})`}>
        <path d="M0 12a8 8 0 0 1 8-8 11 11 0 0 1 20 1 7 7 0 0 1 7 7Z" />
      </g>
    </g>
  );
}

/* ---------- poses ---------- */

function PoseWave() {
  return (
    <svg viewBox="0 0 200 220" className="mc-svg" fill="none">
      <ellipse className="mc-shadow" cx="100" cy="204" rx="52" ry="8" fill={INK} opacity=".16" />
      <g className="mc-figure" stroke={INK} strokeWidth="5" strokeLinejoin="round">
        <ellipse cx="72" cy="198" rx="19" ry="11" fill={INK} />
        <ellipse cx="128" cy="198" rx="19" ry="11" fill={INK} />
        <ellipse cx="100" cy="156" rx="46" ry="44" fill={FUR} />
        <path d="M54 148a46 44 0 0 1 92 0 62 60 0 0 0-92 0Z" fill={INK} />
        <g className="mc-arm-wave">
          <ellipse cx="152" cy="122" rx="13" ry="28" fill={INK} transform="rotate(-30 152 122)" />
        </g>
        <ellipse cx="52" cy="162" rx="13" ry="28" fill={INK} transform="rotate(12 52 162)" />
        <Card x={40} y={168} tilt={-10} />
        <Head x={100} y={72} scale={1} />
        <Band x={100} y={122} />
      </g>
    </svg>
  );
}

/* Walking on the spot with a card under one arm. The ground scrolls
   beneath it, which is what sells the walk while the figure stays put and
   centred in its column. */
function PoseWalk() {
  return (
    /* cropped just above the ears — enough sky for the clouds, no more,
       so the hero's speech bubble can sit right on the head */
    <svg viewBox="0 8 200 212" className="mc-svg" fill="none">
      {/* sky and grove, drifting past behind the walk */}
      <g fill="#FFFFFF" stroke="#C9D2CB" strokeWidth="2.5" strokeLinejoin="round">
        <SceneCloud y={14} scale={1} className="mc-cloud-1" />
        <SceneCloud y={34} scale={0.7} className="mc-cloud-2" />
        <SceneCloud y={22} scale={1.2} className="mc-cloud-3" />
      </g>
      {/* Distant hills sit still: at that range parallax barely moves
          them, and another travelling layer would only add noise. */}
      <g stroke="none">
        <path d="M-10 214v-38c14-16 26-30 38-30s20 12 32 26c10-12 18-24 30-24s22 14 34 28c12-14 22-26 34-26s26 16 42 34v30Z" fill="#CBD8CB" />
        <path d="M-10 214v-22c18-14 30-26 44-26s26 14 40 26c12-10 20-18 32-18s24 12 38 24 24 8 46 16v0Z" fill="#B2C6B1" />
      </g>

      <Bamboo top={52} lean={-2} className="mc-tree-1" />
      <Bamboo top={78} lean={1.5} className="mc-tree-2" />
      <Bamboo top={38} lean={-1} className="mc-tree-3" />

      <path
        className="mc-ground"
        d="M4 214H196"
        stroke={INK}
        strokeOpacity=".2"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="10 22"
      />
      <ellipse className="mc-shadow" cx="100" cy="212" rx="46" ry="7" fill={INK} opacity=".16" />

      <g className="mc-walk-body" stroke={INK} strokeWidth="5" strokeLinejoin="round">
        {/* Limbs behind the body. The feet point the way it is travelling:
            face-on the figure has no direction of its own, so without them
            a scrolling background can just as easily read as walking
            backwards. */}
        {/* The legs are set well apart and hung from a higher hip, so a
            stride shows two legs rather than one dark lump under the
            belly. The panda faces us, so its feet face us too — squared
            under each leg rather than turned out to one side. */}
        <g className="mc-leg mc-leg-b">
          <rect x="64" y="158" width="26" height="50" rx="13" fill="#171512" />
          <ellipse cx="66" cy="203" rx="15" ry="8.5" fill="#171512" />
        </g>
        <g className="mc-arm mc-arm-b">
          <rect x="56" y="126" width="23" height="42" rx="11.5" fill="#171512" />
        </g>

        <ellipse cx="100" cy="146" rx="42" ry="36" fill={FUR} />
        <path d="M58 136a42 36 0 0 1 84 0 58 54 0 0 0-84 0Z" fill={INK} />

        <g className="mc-leg mc-leg-f">
          <rect x="112" y="158" width="28" height="52" rx="14" fill={INK} />
          <ellipse cx="115" cy="206" rx="16" ry="9" fill={INK} />
        </g>

        <Head x={100} y={78} scale={0.9} />
        <Band x={100} y={124} />

        {/* the front arm carries the card */}
        <g className="mc-arm mc-arm-f">
          <rect x="121" y="126" width="25" height="44" rx="12.5" fill={INK} />
          <Card x={137} y={178} tilt={8} />
        </g>
      </g>
    </svg>
  );
}

function PoseStudy() {
  return (
    <svg viewBox="0 0 200 200" className="mc-svg" fill="none">
      <ellipse className="mc-shadow" cx="100" cy="186" rx="56" ry="8" fill={INK} opacity=".16" />
      <g className="mc-figure" stroke={INK} strokeWidth="5" strokeLinejoin="round">
        <ellipse cx="70" cy="176" rx="22" ry="12" fill={INK} transform="rotate(-6 70 176)" />
        <ellipse cx="130" cy="176" rx="22" ry="12" fill={INK} transform="rotate(6 130 176)" />
        <ellipse cx="100" cy="146" rx="48" ry="38" fill={FUR} />
        <path d="M52 140a48 38 0 0 1 96 0 64 52 0 0 0-96 0Z" fill={INK} />
        <ellipse cx="56" cy="150" rx="13" ry="24" fill={INK} transform="rotate(16 56 150)" />
        <ellipse cx="144" cy="150" rx="13" ry="24" fill={INK} transform="rotate(-16 144 150)" />
        <Head x={100} y={70} scale={0.94} tilt={-4} />
        <Band x={100} y={116} />
        <g className="mc-card-read">
          <Card x={100} y={158} tilt={4} w={54} h={40} />
        </g>
      </g>
    </svg>
  );
}

function PoseCheer() {
  return (
    <svg viewBox="0 0 200 220" className="mc-svg" fill="none">
      <ellipse className="mc-shadow" cx="100" cy="204" rx="48" ry="8" fill={INK} opacity=".16" />
      <g className="mc-sparkle" fill={ACCENT} stroke="none">
        <path d="M34 60l3.4 8.6L46 72l-8.6 3.4L34 84l-3.4-8.6L22 72l8.6-3.4Z" />
        <path d="M168 44l2.6 6.6 6.6 2.6-6.6 2.6-2.6 6.6-2.6-6.6-6.6-2.6 6.6-2.6Z" />
      </g>
      <g className="mc-figure mc-bounce" stroke={INK} strokeWidth="5" strokeLinejoin="round">
        <ellipse cx="74" cy="198" rx="19" ry="11" fill={INK} />
        <ellipse cx="126" cy="198" rx="19" ry="11" fill={INK} />
        <ellipse cx="100" cy="158" rx="44" ry="42" fill={FUR} />
        <path d="M56 150a44 42 0 0 1 88 0 60 58 0 0 0-88 0Z" fill={INK} />
        <ellipse cx="48" cy="112" rx="12" ry="27" fill={INK} transform="rotate(34 48 112)" />
        <ellipse cx="152" cy="112" rx="12" ry="27" fill={INK} transform="rotate(-34 152 112)" />
        <Head x={100} y={74} scale={0.98} />
        <Band x={100} y={124} />
      </g>
    </svg>
  );
}

/* Peering over an edge — cropped at the baseline so whatever it sits on
   reads as the ledge it is hiding behind. */
function PosePeek() {
  /* The canvas is cut at the ledge. The head sits low enough that only the
     brow, ears and eyes clear it — its nose stays below, which is what
     makes it read as hiding rather than standing behind something. */
  return (
    <svg viewBox="0 0 148 88" className="mc-svg" fill="none">
      <g stroke={INK} strokeWidth="5" strokeLinejoin="round">
        <path d="M10 88c0-11 8-18 18-18s18 7 18 18Z" fill={INK} />
        <path d="M102 88c0-11 8-18 18-18s18 7 18 18Z" fill={INK} />
        <ellipse cx="120" cy="83" rx="7" ry="5" fill={CARD} stroke="none" />
        <circle cx="111" cy="76" r="2.8" fill={CARD} stroke="none" />
        <circle cx="117.5" cy="73" r="2.8" fill={CARD} stroke="none" />
        <circle cx="124.5" cy="73" r="2.8" fill={CARD} stroke="none" />
        <circle cx="130" cy="76" r="2.8" fill={CARD} stroke="none" />
        <g className="mc-peek-head">
          <Head x={74} y={80} scale={0.62} />
        </g>
      </g>
    </svg>
  );
}

function PoseSleep() {
  return (
    <svg viewBox="0 0 220 150" className="mc-svg" fill="none">
      <ellipse className="mc-shadow" cx="112" cy="140" rx="66" ry="7" fill={INK} opacity=".16" />
      <g className="mc-figure mc-breathe" stroke={INK} strokeWidth="5" strokeLinejoin="round">
        <ellipse cx="128" cy="110" rx="58" ry="30" fill={FUR} />
        <ellipse cx="160" cy="118" rx="26" ry="21" fill={INK} transform="rotate(-6 160 118)" />
        <ellipse cx="104" cy="112" rx="14" ry="26" fill={INK} transform="rotate(-8 104 112)" />
        <g transform="translate(66 108) scale(.56)">
          <rect x="-20" y="-58" width="30" height="30" rx="10" fill={INK} transform="rotate(-16 -5 -43)" />
          <circle cx="0" cy="0" r="50" fill={FUR} />
          <rect x="-32" y="-26" width="31" height="39" rx="11" fill={INK} stroke="none" transform="rotate(-11 -16 -6)" />
          <path d="M-28 -4q10 9 20 0" stroke={FUR} strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="-44" cy="14" rx="9" ry="7" fill={INK} transform="rotate(-12 -44 14)" />
        </g>
      </g>
      <Card x={34} y={128} tilt={-8} w={38} h={26} />
      <g fill={INK} fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontWeight="700" stroke="none">
        <g className="mc-z mc-z-1"><text x="92" y="56" fontSize="11">z</text></g>
        <g className="mc-z mc-z-2"><text x="100" y="50" fontSize="14">z</text></g>
        <g className="mc-z mc-z-3"><text x="109" y="44" fontSize="17">z</text></g>
      </g>
    </svg>
  );
}

const POSES = {
  walk: PoseWalk,
  wave: PoseWave,
  study: PoseStudy,
  cheer: PoseCheer,
  peek: PosePeek,
  sleep: PoseSleep,
};

export default function Mascot({ pose = "wave", className = "", label }) {
  const Pose = POSES[pose] ?? PoseWave;
  return (
    <span
      className={`mc-root mc-${pose} ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    >
      <Pose />
    </span>
  );
}
