import { useEffect, useRef, useState } from "react";

/* ---------- Reveal ----------
The animate-on-scroll building block used across the site, built straight
on the IntersectionObserver API: content starts hidden a short hop below
its resting spot, eases IN when it scrolls into view, and eases back OUT
when it leaves — the observer never disconnects, so scrolling past a
section fades its text away and scrolling back replays the entrance.
Under reduced motion the hidden state is never applied, so everything is
simply present.

`delay` staggers siblings (in seconds); `y` is how far below (in px)
things start. Extra props (handlers, aria, …) pass straight through to
the wrapper div.
--------------------------------- */

const EASE = "cubic-bezier(0.2, 0.7, 0.3, 1)";

export default function Reveal({ children, className, delay = 0, y = 22, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  // Read synchronously so the very first paint under reduced motion is
  // already the visible state — no hidden flash, no transition styles.
  const [reduceMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  const shown = reduceMotion || inView;

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    // No disconnect after the first hit: the observer keeps reporting in
    // both directions so the block eases out on the way past and eases
    // back in on the way back — in AND out, not once.
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // -8% bottom margin: trigger a touch after the edge actually enters
      // the viewport, so things rise in just as they're noticed.
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className={className}
      style={
        reduceMotion
          ? undefined
          : {
              opacity: shown ? 1 : 0,
              transform: shown ? "none" : `translateY(${y}px)`,
              transition: `opacity 0.9s ${EASE} ${delay}s, transform 0.9s ${EASE} ${delay}s`,
            }
      }
      {...rest}
    >
      {children}
    </div>
  );
}
