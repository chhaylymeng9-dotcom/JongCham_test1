/* ---------- AppleTree ----------
Ported from a supplied "Apple harvest" mockup — the growing tree and the
cloth sack it drops apples into. The mockup drove both from a demo day
slider; here they're driven by the real numbers (getStreak().current for
the day, getHarvest().available for the sack) with no slider at all.
Everything past this — the reward tiers, "how it works" copy — already
exists for real as Vouchers.jsx's own ticket list below, so only the
grove/tree/sack visual itself was kept.
--------------------------------- */

const C = {
  soil: "#6B4F3A", soilTop: "#7A5B42", leaf: "#3F6B48", leaf2: "#5C8C63",
  trunk: "#7A5B42", apple: "#B8433F", appleDark: "#8F312F", stem: "#5C4A33",
};

function apple(x, y, r) {
  return `
    <g transform="translate(${x} ${y})">
      <path d="M0 ${-r * .62} c${-r * .5} ${-r * .5} ${-r * 1.15} ${-r * .05} ${-r * 1.02} ${r * .62}
               c${r * .1} ${r * .62} ${r * .5} ${r * 1.02} ${r * 1.02} ${r * 1.02}
               c${r * .52} 0 ${r * .92} ${-r * .4} ${r * 1.02} ${-r * 1.02}
               c${r * .13} ${-r * .67} ${-r * .52} ${-r * 1.12} ${-r * 1.02} ${-r * .62}Z" fill="${C.apple}"/>
      <path d="M0 ${-r * .62} c${r * .5} ${-r * .5} ${r * 1.15} ${-r * .05} ${r * 1.02} ${r * .62}
               c${-r * .1} ${r * .62} ${-r * .5} ${r * 1.02} ${-r * 1.02} ${r * 1.02}Z"
            fill="${C.appleDark}" opacity=".55"/>
      <path d="M0 ${-r * .62} v${-r * .55}" stroke="${C.stem}" stroke-width="${r * .24}" stroke-linecap="round"/>
      <path d="M${r * .06} ${-r * .98} c${r * .5} ${-r * .3} ${r * .72} ${r * .04} ${r * .5} ${r * .34}
               c${-r * .4} ${r * .12} ${-r * .7} ${-r * .06} ${-r * .5} ${-r * .34}Z" fill="${C.leaf}"/>
    </g>`;
}

// 0 = no streak, 1-5 = seed through full fruiting tree at day 100+
function level(d) {
  return d === 0 ? 0 : d < 3 ? 1 : d < 7 ? 2 : d < 30 ? 3 : d < 100 ? 4 : 5;
}

function tree(days, w = 250) {
  const L = level(days);
  const soil = `<path d="M8 46 q24 -5 48 0 v6 q-24 5 -48 0 Z" fill="${C.soil}"/>
                <path d="M8 46 q24 -5 48 0 q-24 4 -48 0 Z" fill="${C.soilTop}"/>`;
  let body = "";

  if (L <= 1) body = `<ellipse cx="32" cy="44" rx="5.4" ry="4" fill="${C.soilTop}"/>
    <path d="M32 44 v-4" stroke="${C.leaf}" stroke-width="2" stroke-linecap="round"/>
    <path d="M32 40.5 c-1.6 -1.4 -3.4 -1.2 -4.4 .6 1.8 1 3.3 .7 4.4 -.6Z" fill="${C.leaf}"/>`;

  if (L === 2) body = `<path d="M32 46 V32" stroke="${C.leaf}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M32 36 c-4 -3 -7.5 -2.4 -9.5 1.6 4 2.2 7.4 1.4 9.5 -1.6Z" fill="${C.leaf}"/>
    <path d="M32 33 c4 -3.2 7.6 -2.6 9.6 1.4 -4 2.3 -7.5 1.5 -9.6 -1.4Z" fill="${C.leaf2}"/>`;

  if (L === 3) body = `<path d="M32 46 V22" stroke="${C.leaf}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M32 38 c-5 -3.6 -9 -3 -11.4 1.8 4.8 2.7 8.9 1.8 11.4 -1.8Z" fill="${C.leaf}"/>
    <path d="M32 33 c5 -3.6 9 -3 11.4 1.8 -4.8 2.7 -8.9 1.8 -11.4 -1.8Z" fill="${C.leaf2}"/>
    <path d="M32 27 c-4.4 -3 -8 -2.4 -10 1.6 4.2 2.4 7.8 1.6 10 -1.6Z" fill="${C.leaf}"/>`;

  if (L >= 4) {
    const bigCrown = L === 5 ? `<ellipse cx="32" cy="14" rx="13" ry="9.4" fill="${C.leaf2}" opacity=".85"/>` : "";
    const fruit = L === 5 ? `${apple(24.5, 21.5, 2.9)}${apple(39, 18.5, 2.6)}${apple(32, 26, 2.4)}` : "";
    body = `<path d="M32 46 V26" stroke="${C.trunk}" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M32 34 l-6 -5 M32 30 l6.5 -5.5" stroke="${C.trunk}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="23.5" cy="23" rx="9.4" ry="7.4" fill="${C.leaf}"/>
      <ellipse cx="41" cy="21.5" rx="9" ry="7" fill="${C.leaf}"/>
      <ellipse cx="32" cy="18" rx="12.4" ry="9.6" fill="${C.leaf2}"/>
      ${bigCrown}${fruit}`;
  }
  return `<svg class="jv-tree-svg" viewBox="0 0 64 56" width="${w}" height="${Math.round(w * .875)}">
            ${body}${soil}</svg>`;
}

// the harvest sack — a cloth bag with a rolled top and a tied cord
const SACK_FULL = 20;

function sack(count) {
  const n = Math.min(count, SACK_FULL);
  const MOUTH = "M14 18 h44 c3 0 4 2 3.4 5 L57 27 H15 l-3.4 -4 C11 20 11 18 14 18Z";
  const SPOTS = [[21, 23, 4], [31, 22, 4.2], [41, 22, 4.2], [51, 23, 4]];
  const shown = SPOTS.slice(0, Math.min(n, 4)).map(([x, y, r]) => apple(x, y, r)).join("");
  const f = n / SACK_FULL;
  const belly = 26 + f * 7;
  const clipId = `jv-mouth-${count}`;

  return `
  <svg width="84" height="76" viewBox="0 0 72 66">
    <defs><clipPath id="${clipId}"><path d="${MOUTH}"/></clipPath></defs>
    <ellipse cx="36" cy="60" rx="${20 + f * 4}" ry="4.4" fill="#000" opacity=".2"/>
    <path d="M17 24
             C ${36 - belly} 34 ${36 - belly + 2} 52 22 57
             q14 5 28 0
             C ${36 + belly - 2} 52 ${36 + belly} 34 55 24 Z"
          fill="#C9B79A"/>
    <path d="M36 26 C ${36 + belly - 2} 36 ${36 + belly - 4} 52 44 57
             q5 -1 6 -2 C ${36 + belly - 2} 52 ${36 + belly} 34 55 24 Z"
          fill="#B3A084" opacity=".85"/>
    <g stroke="#AD9C80" stroke-width="1.2" fill="none" opacity=".55" stroke-linecap="round">
      <path d="M27 32 q-3 12 0 21M45 32 q3 12 0 21M36 34 v22"/>
    </g>
    <g clip-path="url(#${clipId})">${shown}</g>
    <path d="M13 17 h46 c3.4 0 4.6 2.4 3.8 5.4 -.7 2.6 -3 4.6 -6 4.6 H17.2
             c-3 0 -5.3 -2 -6 -4.6 C10.4 19.4 11.6 17 15 17Z" fill="#DCCDB3"/>
    <path d="M13 17 h46 c3.4 0 4.6 2.4 3.8 5.4 H9.2 C8.4 19.4 9.6 17 13 17Z"
          fill="#E7DAC3"/>
    <g stroke="#BFAF93" stroke-width=".9" opacity=".6">
      <path d="M20 17.6 v8.4M28 17.4 v8.6M36 17.3 v8.7M44 17.4 v8.6M52 17.6 v8.4"/>
    </g>
    <path d="M12 30 q24 6 48 0" fill="none" stroke="#8A6A46" stroke-width="2.6"
          stroke-linecap="round"/>
    <path d="M52 30 l6 -5 M52 30 l7 3" fill="none" stroke="#8A6A46" stroke-width="2.2"
          stroke-linecap="round"/>
  </svg>`;
}

/** The grove box: tree at the right growth stage for `day`, with a sack
 *  of `apples` beside the trunk once there are any to show. */
export function AppleGrove({ day, apples: count }) {
  return (
    <div className="jv-grove">
      <span dangerouslySetInnerHTML={{ __html: tree(day, 190) }} />
      {count > 0 && (
        <span className="jv-sack" dangerouslySetInnerHTML={{
          __html: sack(count) + (count > SACK_FULL ? `<span class="jv-over">+${count - SACK_FULL}</span>` : ""),
        }} />
      )}
    </div>
  );
}
