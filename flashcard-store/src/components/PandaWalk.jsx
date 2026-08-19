import { useEffect, useRef } from "react";
import pandaWalking from "../assets/panda-walking.mp4";

/* ---------- PandaWalk ----------
Draws the supplied clip with its backdrop cut away, so the panda can walk
across whatever the hero puts behind it.

The clip is a panda crossing a flat white backdrop from right to left. The
backdrop is one value across the whole frame — no vignette, no drift — so
unlike a filmed plate it needs no reference image; the figure is sampled
from the frame's own border each pass, which also means a re-export at a
different white, or at a different compression, cannot quietly break the
key.

The cut is a flood fill inward from that border, not a per-pixel
threshold. It has to be: the backdrop is 253 and the panda's white fur runs
to 255, so no brightness test can separate them anywhere in the frame. What
separates them is topology — fur is walled in by the drawing's dark
outline, so a fill that starts outside never reaches it. That also fixes
the tolerance: measured across the crossing, 12 holds the head at 0.81
coverage and 28 collapses it to 0.59 by walking in through the fur.

Everything is measured in one of three spaces, so the names matter:
  · source — the clip's own frame, whatever it was exported at
  · work   — 640x360, where the fill runs (~5ms a frame)
  · canvas — the 840x560 backing store this component paints
--------------------------------- */

const WORK_W = 640;
const WORK_H = 360;

/* How far a pixel may stray from the backdrop and still count as backdrop.
   Tight, because on a white backdrop the gap to the fur is nothing and the
   dark outline is the only wall there is. */
const TOLERANCE = 12;

const CANVAS_W = 840;
const CANVAS_H = 560;

/* The panda's soles, in work pixels — the floor is flat and the camera is
   locked, so this never moves and the panda must not bob because a stray
   pixel widened its silhouette for one frame. */
const FEET_Y = 335;
/* Where those soles land on the canvas. Kept in step with HeroMascot's
   GROUND by hand — this canvas is laid out at twice the scene's units, so
   it is that constant doubled. */
const GROUND_Y = 532;

/* Fitting the clip to the canvas width would leave the panda larger than
   the hero wants, so it is scaled about its own head. Scaling the whole
   frame instead would drag the walk off both edges and leave the scene
   empty for a stretch; pinning it to the head keeps the path exactly as
   drawn and only resizes what is on it. */
const ZOOM = 0.76;
const SCALE = (CANVAS_W / 1280) * ZOOM * 2; // work px -> canvas px
const PATH = CANVAS_W / WORK_W; // where a work column lands on the canvas

/* Below this many surviving pixels the panda is mostly off the edge, and
   a bubble pointing at it would be pointing at nothing. */
const MIN_VISIBLE = 26000;

/* ---------- the wave ----------
The bubble is the panda saying hello, so it belongs to the gesture and not
to any point on the path: it is there while the arm is up and gone once the
arm comes down.

The raised arm reads straight off the silhouette. Measured across the
crossing, the width of the figure through the band 45–60% of the way down
from the top of its head sits at 165–170 work pixels the whole time its
hands are down, and 191–203 while the arm is up — one wave per loop. The
two thresholds sit between those with about eleven pixels of clearance
either side, and being two rather than one they give the test hysteresis,
so an arm caught halfway cannot flicker the bubble on and off. */
const WAVE_BAND_TOP = 0.45;
const WAVE_BAND_BOTTOM = 0.6;
const WAVE_ON = 184;
const WAVE_OFF = 176;

/* The frame the still falls on when animation is turned off: the panda is
   mid-stride and near the middle of the scene. */
const STILL_TIME = 3.8;

export default function PandaWalk({ onAnchor, label, reduceMotion }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  /* held in a ref so the render loop always sees the current callback
     without having to be torn down and rebuilt when the parent re-renders */
  const anchorRef = useRef(onAnchor);
  anchorRef.current = onAnchor;

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return undefined;

    /* The clip has no audio track in it, but React sets `muted` as a
       property and never as an attribute, so autoplay policy can still see
       an unmuted element on the first load. Set it here as well. */
    video.muted = true;

    const ctx = canvas.getContext("2d");
    const work = document.createElement("canvas");
    work.width = WORK_W;
    work.height = WORK_H;
    const wctx = work.getContext("2d", { willReadFrequently: true });

    const backdrop = new Uint8Array(WORK_W * WORK_H);
    const queue = new Int32Array(WORK_W * WORK_H);
    const offset = GROUND_Y - FEET_Y * SCALE;
    const border = [];
    /* kept across frames because the wave test is hysteretic */
    let waving = false;

    function paint() {
      if (!video.videoWidth) return;
      wctx.clearRect(0, 0, WORK_W, WORK_H);
      wctx.drawImage(video, 0, 0, WORK_W, WORK_H);
      const frame = wctx.getImageData(0, 0, WORK_W, WORK_H);
      const px = frame.data;

      /* The backdrop's own value, taken as the median of a ring of border
         samples: a median rather than a mean so the panda sitting on top
         of a few of them cannot drag the figure off. */
      border.length = 0;
      for (let x = 0; x < WORK_W; x += 20) {
        border.push(px[x * 4 + 1]);
        border.push(px[((WORK_H - 1) * WORK_W + x) * 4 + 1]);
      }
      for (let y = 0; y < WORK_H; y += 20) {
        border.push(px[y * WORK_W * 4 + 1]);
        border.push(px[(y * WORK_W + WORK_W - 1) * 4 + 1]);
      }
      border.sort((a, b) => a - b);
      const plate = border[border.length >> 1];

      backdrop.fill(0);
      let end = 0;
      const flood = (p) => {
        if (backdrop[p]) return;
        const i = p * 4;
        if (
          Math.abs(px[i] - plate) >= TOLERANCE ||
          Math.abs(px[i + 1] - plate) >= TOLERANCE ||
          Math.abs(px[i + 2] - plate) >= TOLERANCE
        )
          return;
        backdrop[p] = 1;
        queue[end++] = p;
      };
      for (let x = 0; x < WORK_W; x++) {
        flood(x);
        flood((WORK_H - 1) * WORK_W + x);
      }
      for (let y = 0; y < WORK_H; y++) {
        flood(y * WORK_W);
        flood(y * WORK_W + WORK_W - 1);
      }
      while (end > 0) {
        const p = queue[--end];
        const x = p % WORK_W;
        if (x > 0) flood(p - 1);
        if (x < WORK_W - 1) flood(p + 1);
        if (p >= WORK_W) flood(p - WORK_W);
        if (p < WORK_W * (WORK_H - 1)) flood(p + WORK_W);
      }

      /* Clear the backdrop, and the one-pixel rim beside it as well: those
         pixels are half backdrop already, and left in they ring the panda
         with white once it is over the scene. */
      let kept = 0;
      let minX = WORK_W;
      let maxX = -1;
      let minY = WORK_H;
      for (let y = 0; y < WORK_H; y++) {
        for (let x = 0; x < WORK_W; x++) {
          const p = y * WORK_W + x;
          if (backdrop[p]) {
            px[p * 4 + 3] = 0;
            continue;
          }
          const rim =
            x === 0 ||
            y === 0 ||
            x === WORK_W - 1 ||
            y === WORK_H - 1 ||
            backdrop[p - 1] ||
            backdrop[p + 1] ||
            backdrop[p - WORK_W] ||
            backdrop[p + WORK_W];
          if (rim) {
            px[p * 4 + 3] = 0;
            continue;
          }
          kept++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
        }
      }
      wctx.putImageData(frame, 0, 0);

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      if (maxX < 0) {
        anchorRef.current?.(50, 20, false);
        return;
      }

      /* The head, not the bounding box: a swinging arm drags the box's
         centre around by a good twenty pixels a frame, and the scale and
         the bubble both hang off this. */
      const band = Math.max(1, Math.round((FEET_Y - minY) * 0.16));
      let sum = 0;
      let n = 0;
      for (let y = minY; y <= minY + band && y < WORK_H; y++) {
        for (let x = minX; x <= maxX; x++) {
          if (!backdrop[y * WORK_W + x]) {
            sum += x;
            n++;
          }
        }
      }
      const headX = n ? sum / n : (minX + maxX) / 2;

      /* Is the arm up? Widest point through the band across the panda's
         middle, which the raised arm pushes out well past anything the
         body does on its own. */
      const reach = FEET_Y - minY;
      const bandTop = minY + Math.round(reach * WAVE_BAND_TOP);
      const bandEnd = Math.min(WORK_H, minY + Math.round(reach * WAVE_BAND_BOTTOM));
      let armLo = WORK_W;
      let armHi = -1;
      for (let y = bandTop; y < bandEnd; y++) {
        for (let x = minX; x <= maxX; x++) {
          if (!backdrop[y * WORK_W + x]) {
            if (x < armLo) armLo = x;
            if (x > armHi) armHi = x;
          }
        }
      }
      const reachWidth = armHi < 0 ? 0 : armHi - armLo + 1;
      waving = reachWidth > (waving ? WAVE_OFF : WAVE_ON);

      /* Scaling about the head means the head lands where it would have
         without the scale, so its path across the canvas stays linear.
         Drawn as filmed — the panda crosses right to left. */
      ctx.drawImage(
        work,
        0,
        0,
        WORK_W,
        WORK_H,
        headX * (PATH - SCALE),
        offset,
        WORK_W * SCALE,
        WORK_H * SCALE
      );

      anchorRef.current?.(
        (headX * PATH * 100) / CANVAS_W,
        ((offset + minY * SCALE) * 100) / CANVAS_H,
        waving && kept > MIN_VISIBLE
      );
    }

    let running = true;
    let frameHandle = 0;
    let painted = -1;
    /* requestVideoFrameCallback would be the natural clock here, but it
       only fires for a video the compositor is actually presenting, and
       this one is parked off the layout — so it never fires twice. rAF
       instead, doing the fill only when the clip has moved on, so the
       frames the source repeats cost nothing. */
    const tick = () => {
      if (!running) return;
      if (video.currentTime !== painted) {
        painted = video.currentTime;
        paint();
      }
      frameHandle = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      /* One frame, held. Seeking fires `seeked` once the picture is
         actually there, which `loadeddata` alone does not promise. */
      const still = () => paint();
      video.pause();
      video.addEventListener("seeked", still);
      const seek = () => {
        video.currentTime = STILL_TIME;
      };
      if (video.readyState >= 1) seek();
      else video.addEventListener("loadedmetadata", seek, { once: true });
      return () => {
        video.removeEventListener("seeked", still);
      };
    }

    const start = () => {
      video.play().catch(() => {});
      tick();
    };
    if (video.readyState >= 2) start();
    else video.addEventListener("loadeddata", start, { once: true });

    /* A flood fill a frame is cheap but not free, and there is no reason
       to pay for it while the hero is scrolled away. */
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!running) {
            running = true;
            start();
          }
        } else if (running) {
          running = false;
          video.pause();
          cancelAnimationFrame(frameHandle);
        }
      },
      { threshold: 0 }
    );
    watcher.observe(canvas);

    return () => {
      running = false;
      watcher.disconnect();
      video.removeEventListener("loadeddata", start);
      cancelAnimationFrame(frameHandle);
    };
  }, [reduceMotion]);

  return (
    <>
      {/* The clip is only ever a source of pixels; everything on screen is
          painted onto the canvas. It still has to be laid out and decoding,
          so it is parked rather than hidden. A <video> rather than the GIF
          this briefly was: a GIF only advances while the browser is
          actually painting it, and parked at a pixel it never advanced at
          all, which left the panda frozen on its first frame off the right
          edge of the scene. */}
      <video
        ref={videoRef}
        className="hp-source"
        src={pandaWalking}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        className="hp-canvas"
        width={CANVAS_W}
        height={CANVAS_H}
        role="img"
        aria-label={label}
      />
    </>
  );
}
