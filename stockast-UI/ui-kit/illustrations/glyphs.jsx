// glyphs.jsx — Stockast adaptive thematic system
//
// Two families live here:
//
//   1. ITEM GLYPHS — small (24px), abstract ink-stamp marks for each
//      stocked item. Lele, ayam, tahu, tempe, cabai. They use
//      currentColor for the body stroke so they inherit from their host
//      (subdued in cards, ghostly in Subuh mode), with a single
//      brick-orange accent dot per glyph to keep the warung warmth even
//      when everything else fades to sea-light.
//
//   2. ATMOSPHERIC MOTIFS — horizontal ink illustrations that frame
//      time-of-day. The Dawn Ribbon sits above items; the Signature
//      Seal sits at the footer. These DO adapt to Subuh — sun softens
//      into a moon, brick rays cool into sea-light — because they speak
//      to time-of-day, which is the whole point of Subuh Mode.
//
// Stroke + style anchors match OnbDecor in onboarding.jsx so the whole
// thing reads as one hand.

const G_BRICK = "#F26F1B";
const G_MINT  = "#4DA66E";

// ─────────────── Glyph wrapper ───────────────
function Glyph({ children, size = 24, style }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ flexShrink: 0, display: "block", ...style }}>
      {children}
    </svg>
  );
}

// ─────────────── Item glyphs ───────────────
// Each one: thin outline (1.5px) + one tiny brick or mint accent.
// Outline uses currentColor — host controls subtlety.

function GlyphLele({ size, style }) {
  return (
    <Glyph size={size} style={style}>
      {/* catfish body — elongated oval with tail fan */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round">
        <path d="M 5 21 q 4 -7 12 -7 q 8 0 14 4 l 4 -4 l -1 5 l 1 5 l -4 -4 q -6 4 -14 4 q -8 0 -12 -7 z" />
        {/* gill curve */}
        <path d="M 24 16 q 0 5 0 10" opacity="0.4" />
        {/* whiskers — defining catfish */}
        <path d="M 10 22 q -2 4 -4 5 M 13 23 q -1 4 -3 6" opacity="0.55" strokeWidth="1.2" />
      </g>
      {/* eye — brick accent */}
      <circle cx="22" cy="19" r="1.4" fill={G_BRICK} />
    </Glyph>
  );
}

function GlyphAyam({ size, style }) {
  return (
    <Glyph size={size} style={style}>
      {/* chicken silhouette: round body + small head + tail tuft */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round">
        {/* body */}
        <path d="M 10 28 q -2 -10 8 -12 q 10 -2 12 6 q 2 6 -2 8 q -2 -4 -6 -3 q 0 4 -2 4 q -2 0 -2 -4 q -4 1 -8 1 z" />
        {/* leg */}
        <path d="M 16 27 v 4 M 22 27 v 4" strokeWidth="1.2" />
        {/* beak */}
        <path d="M 30 19 l 4 -1 l -3 3 z" fill="currentColor" stroke="none" opacity="0.7" />
        {/* eye dot */}
        <circle cx="28" cy="18" r="0.9" fill="currentColor" />
      </g>
      {/* comb — brick accent */}
      <path d="M 26 13 q 1 -3 2 0 q 1 -3 2 0 q 1 -3 2 0 l 0 2 q -3 1 -6 0 z"
            fill={G_BRICK} stroke="none" />
    </Glyph>
  );
}

function GlyphTahu({ size, style }) {
  return (
    <Glyph size={size} style={style}>
      {/* tofu cube — slight isometric */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinejoin="round" strokeLinecap="round">
        {/* top face */}
        <path d="M 8 16 L 20 11 L 32 16 L 20 21 Z" />
        {/* left side */}
        <path d="M 8 16 L 8 27 L 20 32 L 20 21" />
        {/* right side */}
        <path d="M 32 16 L 32 27 L 20 32" />
        {/* surface marks on top — porous texture hint */}
        <circle cx="16" cy="16" r="0.7" fill="currentColor" opacity="0.5" />
        <circle cx="22" cy="14" r="0.7" fill="currentColor" opacity="0.5" />
        <circle cx="20" cy="18" r="0.7" fill="currentColor" opacity="0.5" />
      </g>
      {/* corner brick accent */}
      <circle cx="32" cy="16" r="1.4" fill={G_BRICK} />
    </Glyph>
  );
}

function GlyphTempe({ size, style }) {
  return (
    <Glyph size={size} style={style}>
      {/* tempe slab — flatter rectangle, lots of soy-bean dots */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinejoin="round" strokeLinecap="round">
        <path d="M 6 17 L 22 12 L 34 17 L 18 22 Z" />
        <path d="M 6 17 L 6 24 L 18 29 L 18 22" />
        <path d="M 34 17 L 34 24 L 18 29" />
      </g>
      {/* soy-bean specks — the defining feature */}
      <g fill="currentColor" opacity="0.7">
        <circle cx="11" cy="18" r="0.9" />
        <circle cx="16" cy="16.5" r="0.9" />
        <circle cx="22" cy="15" r="0.9" />
        <circle cx="27" cy="17" r="0.9" />
        <circle cx="13" cy="21" r="0.9" />
        <circle cx="19" cy="19" r="0.9" />
        <circle cx="24" cy="20" r="0.9" />
      </g>
      {/* one mint speck — a single fresh bean */}
      <circle cx="29" cy="20" r="1.1" fill={G_MINT} />
    </Glyph>
  );
}

function GlyphCabai({ size, style }) {
  return (
    <Glyph size={size} style={style}>
      {/* red chili — curved pointed pepper, fully brick fill */}
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* stem */}
        <path d="M 14 10 q 0 -3 3 -4 q 2 -1 4 1"
              fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* leaf at stem */}
        <path d="M 18 8 q 4 -2 6 -1 q -1 3 -4 4 z"
              fill="currentColor" opacity="0.55" stroke="none" />
        {/* pepper body — brick orange */}
        <path d="M 16 10 q 4 0 6 2 q 6 5 8 14 q -2 6 -8 6 q -10 0 -10 -10 q 0 -8 4 -12 z"
              fill={G_BRICK} stroke="currentColor" strokeWidth="1.5" />
        {/* highlight curve */}
        <path d="M 17 14 q 3 4 4 12"
              fill="none" stroke="#FFF" strokeWidth="1.2" opacity="0.4" />
      </g>
    </Glyph>
  );
}

// Resolve a glyph by item name (case-insensitive, fuzzy contains)
function glyphFor(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("lele"))  return GlyphLele;
  if (n.includes("ayam"))  return GlyphAyam;
  if (n.includes("tahu"))  return GlyphTahu;
  if (n.includes("tempe")) return GlyphTempe;
  if (n.includes("cabai") || n.includes("cabe") || n.includes("rawit")) return GlyphCabai;
  return null;
}

// ─────────────── Atmospheric motifs ───────────────
//
// Dawn Ribbon — sits inside the Belanja Card hero. A horizontal scene:
// soft brick sun, ink horizon with rooftop silhouettes, small rain
// drops or sun rays, and a date stamp anchored on the right.
//
// Adapts to:
//   weather: "rain" | "sun" | "cloud"  → swaps the right-side weather mark
//   subuh:   boolean                    → soft moon over sea + drops
function DawnRibbon({ weather = "rain", subuh = false, day = "Selasa", date = "20 Mei", time = "03:12" }) {
  const sunFill   = subuh ? "#76b8d0" : G_BRICK;
  const sunGlow   = subuh ? "rgba(118, 184, 208, 0.18)" : "rgba(242, 111, 27, 0.16)";
  const sunGlow2  = subuh ? "rgba(118, 184, 208, 0.35)" : "rgba(242, 111, 27, 0.32)";

  return (
    <div style={{
      position: "relative",
      borderRadius: 10,
      background: subuh ? "rgba(173, 232, 244, 0.04)" : "var(--sk-surface-2)",
      border: "1px solid var(--sk-line)",
      padding: "10px 12px",
      display: "flex", alignItems: "center", gap: 12,
      overflow: "hidden",
    }}>
      {/* SVG scene — left-anchored, fills vertically */}
      <svg viewBox="0 0 140 44" width={120} height={36}
           xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
           style={{ flexShrink: 0 }}>
        {/* soft sun glow */}
        <circle cx="22" cy="26" r="16" fill={sunGlow} />
        <circle cx="22" cy="26" r="10" fill={sunGlow2} />
        {/* sun core (or moon crescent in subuh) */}
        {subuh ? (
          <g>
            <circle cx="22" cy="26" r="7" fill={sunFill} />
            <circle cx="25" cy="24" r="6" fill={subuh ? "rgba(0, 18, 53, 0.85)" : "var(--sk-surface-2)"} />
          </g>
        ) : (
          <circle cx="22" cy="26" r="6" fill={sunFill} />
        )}

        {/* horizon line */}
        <line x1="0" y1="36" x2="140" y2="36"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />

        {/* rooftop silhouettes */}
        <g fill="none" stroke="currentColor" strokeWidth="1.3"
           strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
          <path d="M 46 36 L 46 26 L 54 21 L 62 26 L 62 36" />
          <path d="M 70 36 L 70 30 L 76 26 L 82 30 L 82 36" />
          <path d="M 90 36 L 90 24 L 100 18 L 110 24 L 110 36" />
          {/* center door */}
          <rect x="97" y="29" width="6" height="7" />
        </g>

        {/* weather marks on right */}
        {weather === "rain" && (
          <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55">
            <path d="M 122 10 l -2 6 M 128 8 l -2 6 M 134 12 l -2 6" />
          </g>
        )}
        {weather === "cloud" && (
          <path d="M 122 14 q -4 0 -4 -4 q 0 -5 6 -5 q 4 -3 8 0 q 5 0 5 5 q 0 4 -5 4 z"
                fill="none" stroke="currentColor" strokeWidth="1.3"
                strokeLinejoin="round" opacity="0.55" />
        )}
        {weather === "sun" && (
          <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55">
            <circle cx="128" cy="12" r="3" fill="none" />
            <path d="M 128 5 v 2 M 128 17 v 2 M 121 12 h 2 M 133 12 h 2 M 123 7 l 1.5 1.5 M 132 16 l 1.5 1.5 M 123 17 l 1.5 -1.5 M 132 8 l 1.5 -1.5" />
          </g>
        )}

        {/* small mint warmth dot */}
        <circle cx="116" cy="36" r="1.8" fill={subuh ? "#7ed9a8" : G_MINT} />
      </svg>

      {/* meta block */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{
          fontSize: 11.5, fontWeight: 600,
          letterSpacing: "0.04em", textTransform: "uppercase",
          color: "var(--sk-text-3)",
        }}>
          {subuh ? "Pra-subuh" : "Pagi"} · {time}
        </div>
        <div style={{ fontSize: 13, color: "var(--sk-text-2)", lineHeight: 1.3 }}>
          {day} {date} ·{" "}
          <span style={{ color: "var(--sk-text)", fontWeight: 600 }}>
            sore {weather === "rain" ? "hujan" : weather === "cloud" ? "berawan" : "cerah"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Signature Seal — small inked footer mark for the Belanja Card.
// Reads "Disusun · Stockast" with a tiny pulsing dot (the AI signature)
// and a hand-drawn underline. Subuh-adaptive via currentColor.
function SignatureSeal({ time = "03:12", confidence = "high" }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      padding: "6px 4px",
    }}>
      {/* the seal: a small circle stamp with a quill nib inside */}
      <svg viewBox="0 0 36 36" width={28} height={28}
           xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
           style={{ flexShrink: 0 }}>
        {/* outer circle, slightly broken (hand-stamped feel) */}
        <path d="M 18 4 a 14 14 0 1 1 -0.01 0"
              fill="none" stroke="currentColor" strokeWidth="1.4"
              strokeLinecap="round" strokeDasharray="60 4 28 3" opacity="0.7" />
        {/* inner small circle */}
        <circle cx="18" cy="18" r="9" fill="none"
                stroke="currentColor" strokeWidth="1" opacity="0.4" />
        {/* quill nib mark */}
        <path d="M 18 12 v 8 M 14 18 h 8"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
        <circle cx="18" cy="18" r="1.4" fill="currentColor" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "-0.005em" }}>
          Disusun Stockast
        </span>
        <span className="sk-mono" style={{ fontSize: 10.5, color: "var(--sk-text-3)" }}>
          {time} · {confidence === "high" ? "yakin" : "perlu cek"}
        </span>
      </div>
    </div>
  );
}

// Tally Stamp — small numeric badge for the card hero.
// A vertical block: big mono number, tiny "item" label, set on a
// slightly elevated chip. Used as the alternative to a free-floating
// pill — gives the count weight, like a stock ticker.
function TallyStamp({ count }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "6px 12px 4px",
      border: "1px solid var(--sk-line-strong)",
      borderRadius: 8,
      background: "var(--sk-surface)",
      minWidth: 56,
    }}>
      <span className="sk-mono" style={{
        fontSize: 22, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1,
      }}>{count}</span>
      <span style={{
        fontSize: 9.5, fontWeight: 600, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "var(--sk-text-3)", marginTop: 3,
      }}>item</span>
    </div>
  );
}

// Category bar — a soft horizontal divider with a small label
// (used in v4 Pasar variant to group items: Protein / Sayur / Bumbu).
function CategoryBar({ label, count }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 0 6px",
    }}>
      <span style={{
        fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "var(--sk-text-3)",
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "var(--sk-line)" }} />
      {count != null && (
        <span className="sk-mono" style={{ fontSize: 11, color: "var(--sk-text-3)" }}>
          {String(count).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

// Categorize an item name into Protein / Sayur · Bumbu / Lainnya
function categoryFor(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("lele") || n.includes("ayam") || n.includes("ikan") || n.includes("daging")) return "Protein";
  if (n.includes("tahu") || n.includes("tempe")) return "Pendamping";
  if (n.includes("cabai") || n.includes("cabe") || n.includes("rawit") || n.includes("bawang")) return "Bumbu";
  return "Lainnya";
}

// ─────────────── Pass 2 motifs — Catat / Riwayat / Setelan ───────────────

// NotebookFold — small "torn page corner" mark for the Catat header.
// A quill nib sits on a folded notebook corner with a ruled baseline.
// Subuh-adaptive via currentColor; brick accent on nib tip.
function NotebookFold({ size = 36 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ flexShrink: 0, display: "block" }}>
      {/* page corner with fold */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinejoin="round" strokeLinecap="round">
        <path d="M 6 6 L 32 6 L 42 16 L 42 42 L 6 42 Z" />
        {/* fold line */}
        <path d="M 32 6 L 32 16 L 42 16" />
        {/* ruled baselines */}
        <path d="M 12 26 L 38 26 M 12 32 L 38 32 M 12 38 L 32 38"
              opacity="0.35" strokeWidth="1" />
      </g>
      {/* quill nib — diagonal */}
      <g transform="translate(22 18) rotate(28 0 0)">
        <path d="M 0 0 L 0 12 L -3 14 L 3 14 L 0 12"
              fill="currentColor" opacity="0.85" />
        <circle cx="0" cy="15" r="1.3" fill={G_BRICK} />
      </g>
    </svg>
  );
}

// CapturedStamp — a small "AI tangkap" mark for parse-confirm header.
// Three dots (think bullet) with a small inked underline curve. Reads
// as "captured by listening" — same dialect as the SignatureSeal.
function CapturedStamp({ count, label = "tangkap" }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      padding: "4px 4px",
    }}>
      <svg viewBox="0 0 40 28" width={42} height={28}
           xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* three pulse dots */}
        <g fill="currentColor">
          <circle cx="6"  cy="10" r="2.4" opacity="0.4" />
          <circle cx="14" cy="10" r="2.4" opacity="0.65" />
          <circle cx="22" cy="10" r="2.4" />
        </g>
        {/* inked underline — slight curve */}
        <path d="M 4 20 q 14 4 32 -2"
              fill="none" stroke="currentColor" strokeWidth="1.4"
              strokeLinecap="round" opacity="0.6" />
        {/* small brick dot — "captured" */}
        <circle cx="34" cy="10" r="2.2" fill={G_BRICK} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "-0.005em" }}>
          AI {label}
        </span>
        {count != null && (
          <span className="sk-mono" style={{ fontSize: 10.5, color: "var(--sk-text-3)" }}>
            {count} hal
          </span>
        )}
      </div>
    </div>
  );
}

// SavedSeal — used on the post-save confirmation. A circular stamp
// reading "Tersimpan" with a small check inside. Subuh-adaptive.
function SavedSeal({ label = "Tersimpan", time }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 12,
      padding: "8px 14px",
      border: "1.5px solid currentColor",
      borderRadius: 999,
      opacity: 0.9,
    }}>
      <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeDasharray="42 3 14 3" opacity="0.6" />
        <path d="M 7 12 L 11 16 L 17 8" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.005em" }}>{label}</span>
        {time && <span className="sk-mono" style={{ fontSize: 10.5, opacity: 0.6 }}>{time}</span>}
      </div>
    </div>
  );
}

// LedgerStripe — Riwayat header strip. A serif italic week range with
// a small calendar/sun ribbon icon, average/best metrics, and a tiny
// stitched dotted underline. Sits at the top of the Riwayat screen.
function LedgerStripe({ rangeLabel = "12 – 18 Mei", avg = 28, best = "Sabtu" }) {
  return (
    <div style={{
      borderRadius: 12,
      background: "var(--sk-surface)",
      border: "1px solid var(--sk-line)",
      padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      {/* small ledger illustration — open book + sun */}
      <svg viewBox="0 0 56 44" width={56} height={44}
           xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
           style={{ flexShrink: 0 }}>
        {/* sun behind */}
        <circle cx="42" cy="14" r="9" fill={G_BRICK} opacity="0.16" />
        <circle cx="42" cy="14" r="5" fill={G_BRICK} opacity="0.7" />

        {/* book */}
        <g fill="none" stroke="currentColor" strokeWidth="1.4"
           strokeLinecap="round" strokeLinejoin="round">
          <path d="M 4 32 L 4 14 L 18 18 L 18 36 Z" fill="var(--sk-surface-2)" />
          <path d="M 32 32 L 32 14 L 18 18 L 18 36 Z" fill="var(--sk-surface-2)" />
          {/* page lines */}
          <path d="M 7 22 L 16 24 M 7 26 L 15 27.5 M 22 22 L 30 20 M 22 26 L 30 24"
                opacity="0.45" strokeWidth="1" />
        </g>
        {/* mint bookmark */}
        <path d="M 26 14 L 28 22 L 24 19 Z" fill={G_MINT} />
      </svg>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
          fontSize: 18, fontWeight: 600, letterSpacing: "-0.015em",
          lineHeight: 1.1,
        }}>
          {rangeLabel}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11.5, color: "var(--sk-text-3)" }}>
          <span>
            <span className="sk-mono" style={{ color: "var(--sk-text)", fontWeight: 600 }}>{avg}</span> rata-rata
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>
            puncak <span style={{ color: "var(--sk-text)", fontWeight: 600 }}>{best}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// WarungMark — small ink stamp depicting a warung facade with rooftop,
// door, and name plate. Used on the Settings profile card. Always-warm
// palette (identity moment, not surface chrome).
function WarungMark({ size = 56 }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ flexShrink: 0, display: "block" }}>
      {/* soft sun behind */}
      <circle cx="14" cy="14" r="9" fill={G_BRICK} opacity="0.20" />

      {/* warung structure */}
      <g fill="none" stroke="#1A1611" strokeWidth="1.7"
         strokeLinejoin="round" strokeLinecap="round">
        {/* rooftop */}
        <path d="M 8 26 L 30 14 L 52 26" fill="#F4ECD9" />
        {/* eave shadow */}
        <path d="M 6 26 L 54 26" />
        {/* body */}
        <path d="M 10 26 L 10 50 L 50 50 L 50 26" fill="#F4ECD9" />
        {/* door */}
        <rect x="26" y="36" width="8" height="14" />
        {/* window left */}
        <rect x="14" y="32" width="8" height="6" />
        {/* window right */}
        <rect x="38" y="32" width="8" height="6" />
        {/* nameplate ribbon */}
        <path d="M 14 22 L 46 22" stroke={G_BRICK} strokeWidth="2.4" />
      </g>

      {/* mint dot — open */}
      <circle cx="50" cy="48" r="2.4" fill={G_MINT} />
    </svg>
  );
}

// MiniWeather — small ink-stamp weather glyph. Used in Riwayat day rows
// and in the parse-confirm "cuaca" item. currentColor + brick accent.
function MiniWeather({ kind = "sun", size = 22 }) {
  if (kind === "rain") {
    return (
      <Glyph size={size}>
        {/* cloud */}
        <path d="M 8 20 q -4 0 -4 -4 q 0 -5 6 -5 q 4 -3 9 0 q 6 0 6 5 q 0 4 -6 4 z"
              fill="var(--sk-surface-2)" stroke="currentColor" strokeWidth="1.5"
              strokeLinejoin="round" />
        {/* drops — brick accent on one */}
        <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M 11 27 l -1.5 4 M 17 27 l -1.5 4" opacity="0.7" />
          <path d="M 22 27 l -1.5 4" stroke={G_BRICK} opacity="1" />
        </g>
      </Glyph>
    );
  }
  if (kind === "cloud") {
    return (
      <Glyph size={size}>
        <path d="M 8 26 q -4 0 -4 -4 q 0 -5 6 -5 q 4 -3 9 0 q 6 0 6 5 q 0 4 -6 4 z"
              fill="var(--sk-surface-2)" stroke="currentColor" strokeWidth="1.5"
              strokeLinejoin="round" />
        <circle cx="28" cy="14" r="1.6" fill={G_BRICK} opacity="0.7" />
      </Glyph>
    );
  }
  // sun
  return (
    <Glyph size={size}>
      <circle cx="20" cy="20" r="6" fill={G_BRICK} />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
        <path d="M 20 6 v 4 M 20 30 v 4 M 6 20 h 4 M 30 20 h 4 M 10 10 l 2.5 2.5 M 27.5 27.5 l 2.5 2.5 M 10 30 l 2.5 -2.5 M 27.5 12.5 l 2.5 -2.5" />
      </g>
    </Glyph>
  );
}

// SectionLabel — small serif italic group divider for Settings.
// "Akun", "Tampilan", "Tentang". A small dot leads the label.
function SectionLabel({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "6px 4px 8px",
    }}>
      <span style={{
        width: 4, height: 4, borderRadius: 50,
        background: G_BRICK,
      }} />
      <span style={{
        fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
        fontSize: 14, fontWeight: 600,
        color: "var(--sk-text-2)", letterSpacing: "-0.01em",
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "var(--sk-line)" }} />
    </div>
  );
}

window.SkGlyphs = {
  Glyph,
  GlyphLele, GlyphAyam, GlyphTahu, GlyphTempe, GlyphCabai,
  glyphFor,
  DawnRibbon, SignatureSeal, TallyStamp,
  CategoryBar, categoryFor,
  // Below: motifs added in the second hardening pass — Catat / Riwayat / Setelan
  NotebookFold, CapturedStamp, LedgerStripe, WarungMark, MiniWeather,
  SectionLabel, SavedSeal,
};
