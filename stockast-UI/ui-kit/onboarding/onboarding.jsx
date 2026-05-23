// onboarding.jsx — Tiny ink-stamp decorations for the setup form steps.
//
// Style anchors:
//   · Always-day palette (Subuh toggle doesn't touch them — these are
//     identity moments, not surface chrome). Colors hardcoded.
//   · 2-color system: warm dark stroke + brick-orange accent. One tiny
//     mint moment per illustration for life.
//   · 2px stroke, rounded caps. Slight hand-tilt for warmth — not cartoonish.
//   · Abstract / iconographic, not pictorial. Hints at warung life without
//     literal scenes.
//   · ~180×100 portrait, sits as a small mark above the heading.
//
// Sized via container; SVG scales to fit.

const INK   = "#1A1611";
const BRICK = "#F26F1B";
const MINT  = "#4DA66E";
const CREAM = "#F4ECD9";

// ─────────────── Decor 1 · Nama warung ───────────────
// A small tilted name-plate hanging from a string, with a curl of steam
// rising above. The plate carries one short brick-orange mark — "your name
// goes here". A tiny mint dot for warmth.
function OnbDecorNama() {
  return (
    <svg viewBox="0 0 220 110" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* steam curls */}
      <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
        <path d="M 80 18 q -4 -6 2 -10 q 6 -4 2 -10" />
        <path d="M 96 22 q -4 -6 2 -10" opacity="0.7" />
      </g>

      {/* hang string */}
      <line x1="110" y1="14" x2="110" y2="36" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="110" cy="14" r="2" fill={INK} />

      {/* nameplate (tilted) */}
      <g transform="translate(48 36) rotate(-3 62 22)">
        {/* warm fill */}
        <rect x="0" y="0" width="124" height="44" rx="6" fill={CREAM} stroke={INK} strokeWidth="1.8" />
        {/* short script-like marks (hand-lettering hint) */}
        <path d="M 16 22 q 4 -8 8 0 q 4 8 8 0 t 8 0"
          fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 52 22 q 4 -8 8 0 q 4 8 8 0"
          fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        {/* brick-orange "your-name" tag */}
        <rect x="84" y="14" width="26" height="16" rx="3" fill={BRICK} />
      </g>

      {/* mint warmth dot */}
      <circle cx="184" cy="50" r="3" fill={MINT} />
      {/* small particles */}
      <circle cx="32" cy="64" r="1.8" fill={INK} opacity="0.35" />
      <circle cx="40" cy="92" r="1.4" fill={INK} opacity="0.25" />
    </svg>
  );
}

// ─────────────── Decor 2 · Lokasi ───────────────
// A small horizon: 3 rooftop silhouettes with one pin anchored on the
// middle roof. A soft warm sun rises behind. Mint dot = somewhere known.
function OnbDecorLokasi() {
  return (
    <svg viewBox="0 0 220 110" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* sun (soft) */}
      <circle cx="56" cy="50" r="20" fill={BRICK} opacity="0.16" />
      <circle cx="56" cy="50" r="12" fill={BRICK} opacity="0.35" />

      {/* horizon line */}
      <line x1="14" y1="86" x2="206" y2="86" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />

      {/* rooftops (warung village silhouette) */}
      <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* left small */}
        <path d="M 36 86 L 36 64 L 52 54 L 68 64 L 68 86" />
        {/* center bigger (the one with the pin) */}
        <path d="M 84 86 L 84 56 L 110 40 L 136 56 L 136 86" fill={CREAM} />
        {/* center door */}
        <rect x="104" y="68" width="12" height="18" fill={CREAM} />
        {/* right small */}
        <path d="M 152 86 L 152 60 L 168 50 L 184 60 L 184 86" />
      </g>

      {/* pin on center rooftop */}
      <g transform="translate(110 34)">
        <path d="M 0 14 C -7 6 -7 -2 0 -2 C 7 -2 7 6 0 14 Z"
          fill={BRICK} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="0" cy="2" r="2.2" fill={CREAM} />
      </g>

      {/* mint dot — "found you" */}
      <circle cx="200" cy="22" r="3" fill={MINT} />
      {/* particles */}
      <circle cx="14" cy="20" r="1.4" fill={INK} opacity="0.3" />
      <circle cx="178" cy="98" r="1.4" fill={INK} opacity="0.25" />
    </svg>
  );
}

// ─────────────── Decor 3 · Menu utama ───────────────
// A simple oval plate viewed top-down. Three abstract food shapes on it:
// an elongated form (the lele), a round mound (tahu), an angular form
// (gorengan). A curl of steam, brick-orange highlight on the gorengan.
function OnbDecorMenu() {
  return (
    <svg viewBox="0 0 220 110" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* steam curls above */}
      <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
        <path d="M 104 14 q -4 -6 2 -10 q 6 -4 2 -10" />
        <path d="M 120 18 q -4 -6 2 -10" opacity="0.7" />
      </g>

      {/* plate */}
      <g transform="translate(110 70)">
        <ellipse rx="80" ry="22" fill={CREAM} stroke={INK} strokeWidth="1.8" />
        <ellipse rx="68" ry="14" fill="none" stroke={INK} strokeWidth="1" opacity="0.35" />
      </g>

      {/* food shapes on plate */}
      {/* lele — elongated fish-like form */}
      <g transform="translate(64 68) rotate(-12 0 0)" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -16 0 q 6 -10 18 -8 q 12 2 18 6 l 8 -4 l -2 6 l 2 6 l -8 -4 q -6 4 -18 6 q -12 2 -18 -8 z" fill={CREAM} />
        <circle cx="0" cy="-2" r="1.2" fill={INK} />
      </g>

      {/* tahu — round soft mound */}
      <g transform="translate(112 66)" fill={CREAM} stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <rect x="-10" y="-8" width="20" height="14" rx="3" />
        <line x1="-6" y1="-2" x2="6" y2="-2" stroke={INK} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      </g>

      {/* gorengan — brick-orange angular form (the warmth accent) */}
      <g transform="translate(156 66)" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <path d="M -10 6 q -4 -14 10 -14 q 14 0 10 14 q -10 4 -20 0 z" fill={BRICK} />
      </g>

      {/* mint sprig — "fresh" */}
      <g transform="translate(40 60)" fill="none" stroke={MINT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 0 0 q 6 -6 12 -2" />
        <path d="M 6 -3 q 0 -4 4 -4" />
      </g>
    </svg>
  );
}

window.OnbDecor = {
  nama:   OnbDecorNama,
  lokasi: OnbDecorLokasi,
  menu:   OnbDecorMenu,
};
