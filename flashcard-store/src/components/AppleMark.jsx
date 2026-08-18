/* AppleMark.jsx — the apple, one drawing for the whole app
 *
 *   <AppleMark size={34} />
 *
 * Apples are the harvest currency (storage.js's getHarvest), and they used
 * to be drawn twice: a flat two-tone glyph in the daily-task reward pills
 * and this rounder one in the star shop's "trade an apple" card. Same
 * currency, two apples — so the shop's version wins and lives here.
 * Scales down cleanly: the leaf and stem stay legible at 15px.
 */
export default function AppleMark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 7.5c1.6-1.6 4.6-2 6.2-.2 1.7 1.9 1.3 5.6-.6 8.6-1.2 1.9-2.6 3.3-3.9 3.3-.9 0-1.3-.5-1.7-.5s-.8.5-1.7.5c-1.3 0-2.7-1.4-3.9-3.3-1.9-3-2.3-6.7-.6-8.6 1.6-1.8 4.6-1.4 6.2.2Z"
            fill="#C6553F" stroke="#5B2318" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 8.4c1.2-1.2 3.4-1.6 4.7-.5-1.5.2-2.9 1-3.8 2.2Z" fill="#D8705C" />
      <path d="M12 7.5c0-2 .8-3.4 2.6-4.2" stroke="#5B2318" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 6.4c-1.7-.6-2.6-2-2.6-3.4 1.8 0 3 .9 3.4 2.4Z"
            fill="#5FA96D" stroke="#2F5C39" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
