// welcomes.jsx — Brand hero illustrations
//
// Stockast = "stock" (inventory) + "forecast". The brand sits at the
// intersection of warung life and market intelligence. These hero
// illustrations marry warung ink-stamps with stock-market shorthand
// (sparklines, candlesticks, ticker tape).
//
// All scalable SVG. Use these on:
//   · WelcomeHero        — landing / onboarding splash
//   · TickerBanner       — running brand strip (decorative)
//   · ForecastIllust     — empty-state hero "tunggu data dulu"
//   · SuccessIllust      — post-save / milestone moment
//   · MarketMascot       — small "stockast mascot" — a warung tray with sparkline

const H_INK   = "#1A1611";
const H_BRICK = "#F26F1B";
const H_MINT  = "#4DA66E";
const H_CREAM = "#F4ECD9";
const H_GOLD  = "#E8C074";
const H_BLUE  = "#4A7EA0";

// ─────────────── 1 · WelcomeHero ───────────────
//
// The brand's signature illustration. A small warung canopy with a
// rising candlestick chart growing OUT of a food tray — the data is
// emerging from real warung life. A small "Bu Yati" silhouette stands
// to the side; ticker tape unfurls from the rooftop.
function WelcomeHero({ width = 320, height = 220 }) {
  return (
    <svg viewBox="0 0 320 220" width={width} height={height}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ display: "block" }}>
      {/* soft sky gradient */}
      <defs>
        <linearGradient id="wh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#FFF1E4" />
          <stop offset="60%" stopColor="#FAF6EE" />
          <stop offset="100%" stopColor="#F4ECD9" />
        </linearGradient>
        <linearGradient id="wh-spark" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"  stopColor={H_BRICK} stopOpacity="0.0" />
          <stop offset="100%" stopColor={H_BRICK} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" fill="url(#wh-sky)" rx="14" />

      {/* sun behind */}
      <circle cx="58" cy="50" r="34" fill={H_BRICK} opacity="0.10" />
      <circle cx="58" cy="50" r="22" fill={H_BRICK} opacity="0.22" />
      <circle cx="58" cy="50" r="14" fill={H_BRICK} />

      {/* ticker tape unfurling from the right (decorative) */}
      <g transform="translate(180 24)">
        <path d="M 0 0 L 130 0 L 122 12 L 130 24 L 0 24 Z"
              fill={H_CREAM} stroke={H_INK} strokeWidth="1.4" strokeLinejoin="round" />
        <g fontFamily="monospace" fontSize="10" fill={H_INK} fontWeight="600">
          <text x="8" y="16">LELE</text>
          <text x="42" y="16" fill={H_MINT}>+8%</text>
          <text x="70" y="16">TAHU</text>
          <text x="102" y="16" fill={H_BRICK}>−6</text>
        </g>
      </g>

      {/* warung canopy */}
      <g transform="translate(40 76)">
        {/* awning */}
        <path d="M 0 0 L 240 0 L 230 22 L 10 22 Z" fill={H_BRICK} stroke={H_INK} strokeWidth="1.6" strokeLinejoin="round" />
        {/* awning stripes */}
        <g stroke={H_CREAM} strokeWidth="3" opacity="0.6">
          <line x1="30" y1="2" x2="22" y2="20" />
          <line x1="70" y1="2" x2="62" y2="20" />
          <line x1="110" y1="2" x2="102" y2="20" />
          <line x1="150" y1="2" x2="142" y2="20" />
          <line x1="190" y1="2" x2="182" y2="20" />
        </g>
        {/* awning scallop bottom */}
        <g fill={H_BRICK} stroke={H_INK} strokeWidth="1.4" strokeLinejoin="round">
          <path d="M 10 22 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 q 8 8 16 0 L 230 22 Z" />
        </g>
        {/* tiny signage */}
        <rect x="100" y="-12" width="40" height="14" rx="2" fill={H_CREAM} stroke={H_INK} strokeWidth="1.2" />
        <text x="120" y="-2" textAnchor="middle" fontFamily="serif" fontStyle="italic"
              fontSize="9" fontWeight="700" fill={H_INK}>WARUNG</text>
      </g>

      {/* food tray (the data emerges from real food) */}
      <g transform="translate(48 156)">
        <ellipse cx="100" cy="14" rx="100" ry="10" fill={H_CREAM} stroke={H_INK} strokeWidth="1.5" />
        <ellipse cx="100" cy="14" rx="86" ry="6" fill="none" stroke={H_INK} strokeWidth="1" opacity="0.35" />
        {/* food shapes */}
        <ellipse cx="30" cy="12" rx="10" ry="5" fill={H_GOLD} stroke={H_INK} strokeWidth="1.3" />
        <rect x="64" y="6" width="14" height="10" rx="2" fill={H_CREAM} stroke={H_INK} strokeWidth="1.3" />
        <path d="M 156 14 q -4 -8 6 -8 q 10 0 6 8 q -6 4 -12 0 z" fill={H_BRICK} stroke={H_INK} strokeWidth="1.3" />
      </g>

      {/* the spark / candlestick rises out of the center */}
      <g transform="translate(140 110)">
        {/* sparkline area fill */}
        <path d="M 0 46 L 12 32 L 26 38 L 40 18 L 52 24 L 64 6 L 64 46 Z"
              fill="url(#wh-spark)" />
        {/* sparkline */}
        <path d="M 0 46 L 12 32 L 26 38 L 40 18 L 52 24 L 64 6"
              fill="none" stroke={H_BRICK} strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round" />
        {/* end dot */}
        <circle cx="64" cy="6" r="3.2" fill={H_BRICK} stroke={H_INK} strokeWidth="1.2" />
        {/* small mint up-arrow */}
        <path d="M 70 6 l 6 -4 l 0 8 z" fill={H_MINT} />
      </g>

      {/* candlesticks behind the chart */}
      <g transform="translate(48 122)" opacity="0.55">
        <g stroke={H_INK} strokeWidth="1.4" strokeLinecap="round">
          <path d="M 8 8 v 22" /><rect x="3" y="14" width="10" height="10" fill={H_MINT} />
          <path d="M 28 4 v 28" /><rect x="23" y="10" width="10" height="14" fill={H_BRICK} />
          <path d="M 48 12 v 18" /><rect x="43" y="16" width="10" height="8" fill={H_MINT} />
        </g>
      </g>

      {/* Bu Yati silhouette — small ink figure at left */}
      <g transform="translate(20 138)">
        <circle cx="6" cy="6" r="6" fill={H_INK} />
        <path d="M 0 14 q 0 -2 6 -2 q 6 0 6 2 L 12 38 L 0 38 Z" fill={H_BRICK} stroke={H_INK} strokeWidth="1.3" strokeLinejoin="round" />
        {/* tray */}
        <path d="M -2 30 L 14 30" stroke={H_INK} strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* mint dot */}
      <circle cx="298" cy="200" r="3" fill={H_MINT} />
    </svg>
  );
}

// ─────────────── 2 · TickerBanner ───────────────
// A horizontal scrolling-feel ticker (static rendering) — used as a
// brand strip at the top of the UI Kit page itself, or as a decorative
// element on landing screens.
function TickerBanner({ width = 600, height = 38 }) {
  const items = [
    { label: "LELE",       v: "+8%",  tone: H_MINT },
    { label: "AYAM",       v: "+12%", tone: H_MINT },
    { label: "TAHU",       v: "−6%",  tone: H_BRICK },
    { label: "TEMPE",      v: "0%",   tone: H_INK },
    { label: "CABAI",      v: "−50g", tone: H_BRICK },
    { label: "POLA SENIN", v: "+12%", tone: H_MINT },
  ];
  return (
    <svg viewBox="0 0 600 38" width={width} height={height}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ display: "block" }}>
      <rect width="600" height="38" fill={H_INK} rx="6" />
      {/* sparkline trail running thru */}
      <path d="M 0 22 q 30 -10 60 0 q 30 10 60 -6 q 30 -16 60 4 q 30 20 60 -10 q 30 -30 60 6 q 30 36 60 -8 q 30 -44 60 10 q 30 44 60 -10 q 30 -44 60 12"
            fill="none" stroke={H_BRICK} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
      <g fontFamily="monospace" fontSize="11" fontWeight="700">
        {items.map((it, i) => {
          const x = 16 + i * 95;
          return (
            <g key={i}>
              <text x={x} y="24" fill={H_CREAM}>{it.label}</text>
              <text x={x + 50} y="24" fill={it.tone}>{it.v}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ─────────────── 3 · ForecastIllust ───────────────
// A more abstract "data is forming" illustration. A series of partial
// candlesticks rising left-to-right, with the rightmost being a dotted
// outline (the "future") and a small magnifying glass orbiting.
function ForecastIllust({ width = 220, height = 160 }) {
  return (
    <svg viewBox="0 0 220 160" width={width} height={height}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ display: "block" }}>
      {/* baseline */}
      <line x1="14" y1="130" x2="206" y2="130"
            stroke={H_INK} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      {/* candles — mint(up), brick(down), mint(up), dotted (future) */}
      <g stroke={H_INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 36 60 v 60" /><rect x="28" y="76" width="16" height="28" fill={H_MINT} />
        <path d="M 76 40 v 80" /><rect x="68" y="58" width="16" height="42" fill={H_BRICK} />
        <path d="M 116 50 v 70" /><rect x="108" y="64" width="16" height="36" fill={H_MINT} />
        <path d="M 156 32 v 90" /><rect x="148" y="42" width="16" height="58"
                                         fill="none" stroke={H_INK} strokeDasharray="3 3" />
      </g>
      {/* up-trend trace line */}
      <path d="M 36 76 L 76 58 L 116 64 L 156 42"
            fill="none" stroke={H_BRICK} strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" />
      {/* dots */}
      <g fill={H_BRICK}>
        <circle cx="36" cy="76" r="3" />
        <circle cx="76" cy="58" r="3" />
        <circle cx="116" cy="64" r="3" />
        <circle cx="156" cy="42" r="3" />
      </g>

      {/* magnifying glass over the future */}
      <g transform="translate(176 24)">
        <circle cx="0" cy="0" r="14" fill={H_CREAM} stroke={H_INK} strokeWidth="1.6" />
        <circle cx="0" cy="0" r="14" fill={H_BRICK} opacity="0.18" />
        <path d="M 10 10 l 8 8" stroke={H_INK} strokeWidth="2.4" strokeLinecap="round" />
        {/* tiny "?" inside */}
        <text x="0" y="4" textAnchor="middle" fontFamily="serif" fontStyle="italic"
              fontSize="14" fontWeight="700" fill={H_INK}>?</text>
      </g>

      {/* mint accent */}
      <circle cx="14" cy="14" r="2.8" fill={H_MINT} />
    </svg>
  );
}

// ─────────────── 4 · SuccessIllust ───────────────
// A celebratory but quiet "saved" mark. A circular stamp with rays,
// inside a check; small confetti dots.
function SuccessIllust({ width = 200, height = 160 }) {
  return (
    <svg viewBox="0 0 200 160" width={width} height={height}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ display: "block" }}>
      {/* rays */}
      <g stroke={H_BRICK} strokeWidth="1.6" strokeLinecap="round" opacity="0.65">
        <path d="M 100 14 v 8 M 100 138 v 8 M 26 80 h 8 M 166 80 h 8" />
        <path d="M 44 24 l 6 6 M 156 136 l -6 -6 M 44 136 l 6 -6 M 156 24 l -6 6" />
      </g>
      {/* outer stamp */}
      <circle cx="100" cy="80" r="44" fill={H_CREAM} stroke={H_INK} strokeWidth="1.8" />
      {/* inner ring */}
      <circle cx="100" cy="80" r="34" fill="none" stroke={H_INK} strokeWidth="1" opacity="0.45" />
      {/* check */}
      <path d="M 82 80 L 96 94 L 122 68"
            fill="none" stroke={H_MINT} strokeWidth="4.5"
            strokeLinecap="round" strokeLinejoin="round" />
      {/* confetti */}
      <g>
        <circle cx="28" cy="120" r="3" fill={H_MINT} />
        <circle cx="50" cy="46" r="2.4" fill={H_BRICK} />
        <circle cx="174" cy="48" r="2.8" fill={H_MINT} />
        <circle cx="160" cy="124" r="2.4" fill={H_BRICK} />
        <rect x="14" y="60" width="6" height="2" fill={H_GOLD} transform="rotate(30 17 61)" />
        <rect x="178" y="92" width="6" height="2" fill={H_GOLD} transform="rotate(-25 181 93)" />
      </g>
    </svg>
  );
}

// ─────────────── 5 · MarketMascot ───────────────
// Small "stockast mascot" — a warung tray (oval plate) with a sparkline
// growing out of it. Used as a logo-companion or empty-state inline mark.
function MarketMascot({ size = 80 }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ display: "block" }}>
      {/* tray */}
      <ellipse cx="40" cy="58" rx="32" ry="6" fill={H_CREAM} stroke={H_INK} strokeWidth="1.6" />
      <ellipse cx="40" cy="58" rx="26" ry="3" fill="none" stroke={H_INK} strokeWidth="1" opacity="0.4" />
      {/* tray contents tiny */}
      <circle cx="22" cy="56" r="3" fill={H_GOLD} />
      <rect x="34" y="52" width="6" height="6" rx="1" fill={H_CREAM} stroke={H_INK} strokeWidth="1" />
      <path d="M 50 58 q -3 -5 4 -5 q 7 0 4 5 z" fill={H_BRICK} stroke={H_INK} strokeWidth="1" />
      {/* sparkline rising out */}
      <path d="M 16 50 L 26 40 L 36 44 L 48 26 L 58 30 L 66 14"
            fill="none" stroke={H_BRICK} strokeWidth="2.4"
            strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="66" cy="14" r="3" fill={H_BRICK} stroke={H_INK} strokeWidth="1" />
      {/* mint accent */}
      <circle cx="14" cy="20" r="2" fill={H_MINT} />
    </svg>
  );
}

// ─────────────── 6 · WordLogo ───────────────
// "Stockast" wordmark with a small sparkline crossing it.
function WordLogo({ width = 220, height = 56, dark = false }) {
  const ink = dark ? "#FAF6EE" : H_INK;
  return (
    <svg viewBox="0 0 220 56" width={width} height={height}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ display: "block" }}>
      {/* S mark in a square */}
      <rect x="4" y="14" width="34" height="34" rx="9" fill={ink} />
      <text x="21" y="40" textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="800" fontSize="22" letterSpacing="-1.5"
            fill={dark ? "#001f54" : "#FAF6EE"}>S</text>
      {/* wordmark */}
      <text x="46" y="40"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="700" fontSize="26" letterSpacing="-1"
            fill={ink}>stockast</text>
      {/* sparkline arrow across the dot of 'k' */}
      <path d="M 138 16 L 148 8 L 156 18 L 168 4"
            fill="none" stroke={H_BRICK} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="168" cy="4" r="2.5" fill={H_BRICK} />
    </svg>
  );
}

window.SkWelcomes = {
  WelcomeHero, TickerBanner, ForecastIllust, SuccessIllust,
  MarketMascot, WordLogo,
};
