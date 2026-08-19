import "./backButton.css";

/* ---------- BackButton ----------
One back control for the whole account area. Every page that had one had
drawn its own — a bare underlined link here, a bordered pill there, an
uppercase outline on the leaderboard — so "back" looked like a different
kind of control depending on where you had got to.

The shape is the arrow in a filled disc with the word beside it, and the
colours are the site's own rather than the reference's greys, so it reads
as part of this app and not as a pasted-in asset.
--------------------------------- */

export default function BackButton({ onClick, label = "Back", className = "" }) {
  return (
    <button type="button" className={`jc-back ${className}`.trim()} onClick={onClick}>
      <span className="jc-back-disc" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 5l-6 7 6 7" />
        </svg>
      </span>
      {label}
    </button>
  );
}
