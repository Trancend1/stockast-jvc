// ui-kit.jsx — Stockast comprehensive UI Kit reference page.
//
// A long-form design-system showcase: foundations, iconography, glyphs,
// illustrations, weather scenes, components, charts, notifications,
// Belanja Card variants, empty states.
//
// Sticky sidebar nav on the left; scrollable content on the right.

const { useState: uksUseState, useEffect: uksUseEffect } = React;
const IK = window.SkIcons;
const SG = window.SkGlyphs;
const SW = window.SkWeather;
const SL = window.SkWelcomes;
const SC = window.SkCharts;
const SE = window.SkEmpty;
const SN = window.SkNotify;

// ─────────────── Sections ───────────────
const SECTIONS = [
  { id: "brand",         label: "Brand",          group: "Foundation" },
  { id: "principles",    label: "Principles",     group: "Foundation" },
  { id: "color",         label: "Color",          group: "Foundation" },
  { id: "type",          label: "Typography",     group: "Foundation" },
  { id: "spacing",       label: "Spacing · Radii · Shadow", group: "Foundation" },
  { id: "motion",        label: "Motion",         group: "Foundation" },

  { id: "icons-nav",     label: "Navigation icons",     group: "Iconography" },
  { id: "icons-action",  label: "Action icons",         group: "Iconography" },
  { id: "icons-status",  label: "Status indicators",    group: "Iconography" },
  { id: "icons-finance", label: "Financial / dashboard", group: "Iconography" },
  { id: "icons-weather", label: "Weather marks",        group: "Iconography" },

  { id: "glyphs",        label: "Item glyphs",     group: "Illustration" },
  { id: "motifs",        label: "Atmospheric motifs", group: "Illustration" },
  { id: "weather",       label: "Weather scenes",  group: "Illustration" },
  { id: "welcomes",      label: "Brand heroes",    group: "Illustration" },
  { id: "empty",         label: "Empty states",    group: "Illustration" },

  { id: "buttons",       label: "Buttons",         group: "Components" },
  { id: "pills",         label: "Pills · Badges",  group: "Components" },
  { id: "inputs",        label: "Inputs",          group: "Components" },
  { id: "cards",         label: "Cards",           group: "Components" },
  { id: "nav",           label: "Navigation",      group: "Components" },
  { id: "lists",         label: "Lists",           group: "Components" },

  { id: "charts",        label: "Charts",          group: "Data" },
  { id: "notify",        label: "Notifications",   group: "Data" },

  { id: "belanja",       label: "Belanja Card",    group: "Signature" },
];

// ─────────────── Building blocks ───────────────
const Section = ({ id, title, subtitle, children }) => (
  <section id={id} style={{
    padding: "48px 56px 32px",
    borderBottom: "1px solid var(--sk-line)",
    scrollMarginTop: 24,
  }}>
    <div style={{ marginBottom: 22, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--sk-text-3)" }}>§ {id}</div>
      <h2 style={{
        margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: "-0.022em",
        lineHeight: 1.1,
      }}>{title}</h2>
      {subtitle && (
        <p style={{ margin: 0, fontSize: 14.5, color: "var(--sk-text-2)", maxWidth: 720, lineHeight: 1.55 }}>{subtitle}</p>
      )}
    </div>
    {children}
  </section>
);

const Grid = ({ cols = 3, gap = 14, children, style }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, ...style }}>
    {children}
  </div>
);

const Tile = ({ children, label, sublabel, style, padding = 16 }) => (
  <div style={{
    background: "var(--sk-surface)",
    border: "1px solid var(--sk-line)",
    borderRadius: 12,
    padding,
    display: "flex", flexDirection: "column", gap: 8,
    minHeight: 92,
    ...style,
  }}>
    <div style={{
      flex: 1,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--sk-surface-2)",
      borderRadius: 8,
      padding: 12, minHeight: 76,
      color: "var(--sk-text-2)",
    }}>
      {children}
    </div>
    {label && (
      <div style={{ display: "flex", flexDirection: "column", gap: 1, padding: "0 2px" }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
        {sublabel && <span className="sk-mono" style={{ fontSize: 10.5, color: "var(--sk-text-3)" }}>{sublabel}</span>}
      </div>
    )}
  </div>
);

const Pillbar = ({ children }) => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
    {children}
  </div>
);

const Quote = ({ children, by }) => (
  <div style={{
    fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
    fontSize: 17, lineHeight: 1.55, color: "var(--sk-text)",
    padding: "14px 18px",
    borderLeft: "3px solid var(--sk-brand)",
    background: "var(--sk-brand-soft)",
    borderRadius: 8,
    margin: "8px 0",
  }}>
    <div>{children}</div>
    {by && <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 6, fontStyle: "normal" }}>— {by}</div>}
  </div>
);

// ─────────────── Brand ───────────────
function BrandSection() {
  return (
    <Section id="brand"
      title="Stockast"
      subtitle="“Stock + forecast” — a quiet AI for warung pedagang. Looks like Linear. Feels like a notebook on the counter."
    >
      <div style={{
        background: "var(--sk-surface)",
        border: "1px solid var(--sk-line)",
        borderRadius: 14,
        padding: 28,
        display: "flex", flexDirection: "column", gap: 22,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <SL.WordLogo width={220} height={56} />
          <span className="sk-pill" data-tone="brand">v1.5 · refined</span>
        </div>

        <SL.WelcomeHero width={"100%"} height={240} />

        <SL.TickerBanner width={"100%"} height={42} />

        <Quote by="Bu Yati persona">
          Aku catat besok mau belanja apa, terus Stockast itungin. Kayak ngobrol sama tetangga, bukan sama aplikasi.
        </Quote>
      </div>
    </Section>
  );
}

// ─────────────── Principles ───────────────
function PrinciplesSection() {
  const items = [
    { t: "Quiet warmth", b: "Linear discipline + warung ink-stamps. Never SaaS-generated, never showroom-corporate." },
    { t: "AI as plumbing", b: "Thinking dots, not sparkles. Confidence rules, not magic taglines. Show the work." },
    { t: "Bu Yati first", b: "Indonesian conversational voice. 3am open-time. Big tap targets. Subuh-mode adaptation." },
    { t: "One ink, one hand", b: "All glyphs and motifs share a single 1.5px stroke. Brick + mint accents only where it earns its place." },
    { t: "Type carries meaning", b: "Serif italic for warmth and dates. Mono for numbers. Sans for everything else." },
    { t: "Real data, real food", b: "Stock-market shorthand integrated with food forms. Sparklines grow out of trays." },
  ];
  return (
    <Section id="principles" title="Principles" subtitle="The six commitments every visual decision passes through.">
      <Grid cols={2} gap={14}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: "var(--sk-surface)",
            border: "1px solid var(--sk-line)",
            borderRadius: 12,
            padding: 18,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="sk-mono" style={{
                fontSize: 11, fontWeight: 700,
                color: "var(--sk-brand)",
              }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: "-0.012em" }}>{it.t}</h3>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "var(--sk-text-2)" }}>{it.b}</p>
          </div>
        ))}
      </Grid>
    </Section>
  );
}

// ─────────────── Color ───────────────
function ColorSection() {
  const palette = {
    "Surfaces": [
      { n: "Bg",        v: "#FAF6EE", t: "--sk-bg" },
      { n: "Surface",   v: "#FFFFFF", t: "--sk-surface" },
      { n: "Surface 2", v: "#F4EFE5", t: "--sk-surface-2" },
      { n: "Surface 3", v: "#EFE9DC", t: "--sk-surface-3" },
    ],
    "Ink": [
      { n: "Text",        v: "#1A1611", t: "--sk-text",     ink: "#fff" },
      { n: "Text 2",      v: "#5D5447", t: "--sk-text-2",   ink: "#fff" },
      { n: "Text 3",      v: "#8A8073", t: "--sk-text-3",   ink: "#fff" },
      { n: "Text disabled", v: "#B8AE9D", t: "--sk-text-disabled" },
    ],
    "Lines": [
      { n: "Line",         v: "#ECE4D3", t: "--sk-line" },
      { n: "Line strong",  v: "#DDD3BD", t: "--sk-line-strong" },
      { n: "Line active",  v: "#1A1611", t: "--sk-line-active", ink: "#fff" },
    ],
    "Brand": [
      { n: "Brand",      v: "#F26F1B", t: "--sk-brand",      ink: "#fff" },
      { n: "Brand press",v: "#D85710", t: "--sk-brand-press",ink: "#fff" },
      { n: "Brand soft", v: "#FFF1E4", t: "--sk-brand-soft" },
      { n: "Brand ink",  v: "#6B2E08", t: "--sk-brand-ink",  ink: "#fff" },
    ],
    "Semantic": [
      { n: "Success",      v: "#3F9568", t: "--sk-success",      ink: "#fff" },
      { n: "Success soft", v: "#E5F1EA", t: "--sk-success-soft" },
      { n: "Warn",         v: "#B68220", t: "--sk-warn",         ink: "#fff" },
      { n: "Warn soft",    v: "#FAEFD4", t: "--sk-warn-soft" },
      { n: "Danger",       v: "#B83E33", t: "--sk-danger",       ink: "#fff" },
      { n: "Danger soft",  v: "#FBEAE6", t: "--sk-danger-soft" },
    ],
    "Subuh (night)": [
      { n: "Deep",      v: "#001f54", t: "Subuh bg",   ink: "#fff" },
      { n: "Filtered",  v: "#21295c", t: "overhead",   ink: "#fff" },
      { n: "Sea-light", v: "#61a5c2", t: "Subuh brand",ink: "#fff" },
      { n: "Vapor",     v: "#c8e2ec", t: "Subuh text", ink: "#001f54" },
    ],
  };

  return (
    <Section id="color" title="Color" subtitle="Cream-warm by day. Deep-sea by Subuh. Brand orange is the accent, not the flood.">
      {Object.entries(palette).map(([group, list]) => (
        <div key={group} style={{ marginBottom: 22 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>{group}</div>
          <Grid cols={4} gap={10}>
            {list.map(s => (
              <div key={s.n} style={{
                background: "var(--sk-surface)",
                border: "1px solid var(--sk-line)",
                borderRadius: 10, overflow: "hidden",
              }}>
                <div style={{ height: 80, background: s.v, color: s.ink || "var(--sk-text)",
                  padding: "10px 12px",
                  display: "flex", alignItems: "flex-end",
                  fontFamily: "var(--sk-font-mono)", fontSize: 11, fontWeight: 600,
                }}>{s.v}</div>
                <div style={{ padding: "8px 12px 10px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.n}</div>
                  <div className="sk-mono" style={{ fontSize: 10.5, color: "var(--sk-text-3)" }}>{s.t}</div>
                </div>
              </div>
            ))}
          </Grid>
        </div>
      ))}
    </Section>
  );
}

// ─────────────── Type ───────────────
function TypeSection() {
  return (
    <Section id="type" title="Typography" subtitle="Three families, three roles. Plus Jakarta carries the UI. Newsreader serif italic for warmth and dates. JetBrains Mono for numbers.">
      <div style={{
        background: "var(--sk-surface)", border: "1px solid var(--sk-line)",
        borderRadius: 14, padding: 28, display: "flex", flexDirection: "column", gap: 18,
      }}>
        <div>
          <div className="sk-overline">Display · Newsreader italic 500</div>
          <div className="sk-display" style={{ fontSize: 42, lineHeight: 1.1 }}>Belanja besok, Selasa 20 Mei</div>
        </div>
        <div>
          <div className="sk-overline">Heading · Plus Jakarta 700</div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.022em" }}>Warung Bu Yati · Salatiga</div>
        </div>
        <div>
          <div className="sk-overline">Subhead · Plus Jakarta 600</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Pola Senin biasanya +12%</div>
        </div>
        <div>
          <div className="sk-overline">Body · Plus Jakarta 400</div>
          <div style={{ fontSize: 15, lineHeight: 1.55, maxWidth: 560 }}>
            Lele kemarin sisa 5 dari 30, jadi besok dikurangi. Ayam habis jam 2 siang —
            kemungkinan kurang. Sore hujan, biasanya ramai turun ~10%.
          </div>
        </div>
        <div>
          <div className="sk-overline">Caption · Plus Jakarta 500 · 12px</div>
          <div className="sk-caption">kemarin 30 → sisa 5 · base 30 ekor</div>
        </div>
        <div>
          <div className="sk-overline">Numbers · JetBrains Mono 600</div>
          <div className="sk-mono" style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.04em" }}>
            24 · 12 · 250g · +12%
          </div>
        </div>
        <div>
          <div className="sk-overline">Overline · uppercase 600 · 11px</div>
          <div className="sk-overline">Rekomendasi hari ini · Pola mingguan</div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────── Spacing / Radii / Shadow ───────────────
function SpacingSection() {
  return (
    <Section id="spacing" title="Spacing · Radii · Shadow"
      subtitle="A 4-point spacing system. Radii lean medium — 8/10/14 hits the warm-but-architectural sweet spot. Shadows are barely there, single-source.">

      <Grid cols={3} gap={14}>
        <div style={{
          background: "var(--sk-surface)", border: "1px solid var(--sk-line)",
          borderRadius: 12, padding: 18,
        }}>
          <div className="sk-overline">Spacing scale</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {[{ n: "0.5", v: 2 }, { n: "1", v: 4 }, { n: "2", v: 8 }, { n: "3", v: 12 }, { n: "4", v: 16 }, { n: "5", v: 20 }, { n: "6", v: 24 }, { n: "8", v: 32 }].map(s => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="sk-mono" style={{ fontSize: 11, color: "var(--sk-text-3)", width: 28 }}>{s.n}</span>
                <span style={{ display: "block", height: 12, width: s.v * 8, background: "var(--sk-text)", borderRadius: 2 }} />
                <span className="sk-mono" style={{ fontSize: 10.5, color: "var(--sk-text-3)" }}>{s.v}px</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: "var(--sk-surface)", border: "1px solid var(--sk-line)",
          borderRadius: 12, padding: 18,
        }}>
          <div className="sk-overline">Radii</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            {[
              { n: "chip", v: 8 }, { n: "btn", v: 10 }, { n: "input", v: 10 },
              { n: "card", v: 14 }, { n: "sheet", v: 20 }, { n: "pill", v: 999 },
            ].map(r => (
              <div key={r.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 48, height: 48,
                  background: "var(--sk-brand-soft)",
                  border: "1.5px solid var(--sk-brand)",
                  borderRadius: r.v,
                }} />
                <div style={{ fontSize: 11, color: "var(--sk-text-3)", textAlign: "center" }}>
                  {r.n}<br/><span className="sk-mono">{r.v}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: "var(--sk-surface)", border: "1px solid var(--sk-line)",
          borderRadius: 12, padding: 18,
        }}>
          <div className="sk-overline">Shadow</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
            {[
              { n: "sm",   v: "var(--sk-shadow-sm)" },
              { n: "card", v: "var(--sk-shadow-card)" },
              { n: "lift", v: "var(--sk-shadow-lift)" },
            ].map(sh => (
              <div key={sh.n} style={{
                background: "var(--sk-surface)",
                padding: "12px 14px",
                borderRadius: 10,
                boxShadow: sh.v,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{sh.n}</span>
                <span className="sk-mono" style={{ fontSize: 10.5, color: "var(--sk-text-3)" }}>--sk-shadow-{sh.n}</span>
              </div>
            ))}
          </div>
        </div>
      </Grid>
    </Section>
  );
}

// ─────────────── Motion ───────────────
function MotionSection() {
  return (
    <Section id="motion" title="Motion" subtitle="Two easings cover everything. Cubic for utility, spring for moments that should feel alive.">
      <Grid cols={2} gap={14}>
        <div style={{
          background: "var(--sk-surface)", border: "1px solid var(--sk-line)",
          borderRadius: 12, padding: 18,
        }}>
          <div className="sk-overline">Easing</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>--sk-ease</div>
              <div className="sk-mono" style={{ fontSize: 11, color: "var(--sk-text-3)" }}>cubic-bezier(0.2, 0.7, 0.3, 1)</div>
              <div style={{ fontSize: 12, color: "var(--sk-text-2)", marginTop: 4 }}>UI transitions, hover, presses</div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>--sk-ease-spring</div>
              <div className="sk-mono" style={{ fontSize: 11, color: "var(--sk-text-3)" }}>cubic-bezier(0.34, 1.3, 0.64, 1)</div>
              <div style={{ fontSize: 12, color: "var(--sk-text-2)", marginTop: 4 }}>Reveals, count-ups, milestone moments</div>
            </div>
          </div>
        </div>

        <div style={{
          background: "var(--sk-surface)", border: "1px solid var(--sk-line)",
          borderRadius: 12, padding: 18,
        }}>
          <div className="sk-overline">Patterns</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12, fontSize: 13 }}>
            <div><b>sk-rise</b> — translateY(8px) → 0 · 520ms · staggered ~55ms</div>
            <div><b>sk-fade</b> — opacity 0 → 1 · 420ms</div>
            <div><b>sk-pulse</b> — thinking dot · 1.1s loop</div>
            <div><b>count-up</b> — ease-out cubic, 600–900ms</div>
          </div>
        </div>
      </Grid>
    </Section>
  );
}

// ─────────────── Icons sections ───────────────
function IconGrid({ keys }) {
  return (
    <Grid cols={6} gap={10}>
      {keys.map(k => {
        const Ic = IK[k];
        if (!Ic) return null;
        return (
          <Tile key={k} label={k} sublabel="24" padding={10}>
            <Ic size={26} />
          </Tile>
        );
      })}
    </Grid>
  );
}

function IconsNavSection() {
  return (
    <Section id="icons-nav" title="Navigation icons" subtitle="Single family, 1.5px stroke, rounded caps. Paired with labels everywhere.">
      <IconGrid keys={["home", "note", "history", "settings", "shop", "calendar", "clock", "hamburger", "dots", "search", "filter", "sort"]} />
    </Section>
  );
}

function IconsActionSection() {
  return (
    <Section id="icons-action" title="Action icons" subtitle="The verbs of the interface.">
      <IconGrid keys={["arrowR", "arrowL", "chevronR", "chevronD", "plus", "close", "check", "edit", "trash", "copy", "share", "link", "download", "refresh", "undo", "eye", "eyeOff", "lock", "unlock", "pin", "star", "heart", "mic", "moon"]} />
    </Section>
  );
}

function IconsStatusSection() {
  return (
    <Section id="icons-status" title="Status indicators" subtitle="Semantic state in one mark. Pair with a tone color.">
      <IconGrid keys={["checkCircle", "closeCircle", "warnTriangle", "info", "spark", "syncing", "offline", "bell", "bellOff"]} />
    </Section>
  );
}

function IconsFinanceSection() {
  return (
    <Section id="icons-finance" title="Financial / dashboard symbols" subtitle="Stock-market dialect — sparkline marks, candles, trend arrows, cash.">
      <IconGrid keys={["trendUp", "trendDown", "trendFlat", "chartLine", "chartBar", "chartCandle", "donut", "target", "cash", "wallet", "percent", "receipt", "ticker", "bag", "package", "whatsapp"]} />
    </Section>
  );
}

function IconsWeatherSection() {
  return (
    <Section id="icons-weather" title="Weather marks" subtitle="Compact inline marks. Full atmospheric scenes live in the Illustrations section below.">
      <IconGrid keys={["sun", "partlyCloud", "cloud", "rain", "storm", "fog", "moon", "star_small"]} />
    </Section>
  );
}

// ─────────────── Glyphs ───────────────
function GlyphsSection() {
  const items = [
    { n: "Lele",    G: SG.GlyphLele },
    { n: "Ayam",    G: SG.GlyphAyam },
    { n: "Tahu",    G: SG.GlyphTahu },
    { n: "Tempe",   G: SG.GlyphTempe },
    { n: "Cabai",   G: SG.GlyphCabai },
  ];
  return (
    <Section id="glyphs" title="Item glyphs"
      subtitle="Abstract ink-stamps for each stocked item. currentColor on the body so they quiet under Subuh; one brick or mint accent each keeps the warmth.">
      <Grid cols={5} gap={12}>
        {items.map(({ n, G }) => (
          <Tile key={n} label={n} sublabel="glyphFor()" padding={10}>
            <G size={56} />
          </Tile>
        ))}
      </Grid>
      <div style={{ marginTop: 18, fontSize: 12.5, color: "var(--sk-text-3)" }}>
        Sizes: 22 (row inline) · 28 (Pasar variant) · 56 (showcase)
      </div>
    </Section>
  );
}

// ─────────────── Atmospheric Motifs ───────────────
function MotifsSection() {
  return (
    <Section id="motifs" title="Atmospheric motifs"
      subtitle="Larger ink stamps that frame time-of-day, capture moments, and sign artefacts. Composable across screens.">
      <Grid cols={2} gap={14}>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="sk-overline">DawnRibbon</div>
          <SG.DawnRibbon day="Selasa" date="20 Mei" weather="rain" time="03:12" />
          <SG.DawnRibbon day="Selasa" date="20 Mei" weather="sun"  time="06:08" />
          <SG.DawnRibbon day="Selasa" date="20 Mei" weather="cloud" time="07:24" />
          <SG.DawnRibbon day="Selasa" date="20 Mei" weather="rain" time="03:12" subuh />
        </div>

        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="sk-overline">Seals · Stamps · Marks</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", color: "var(--sk-text-2)" }}>
            <SG.SignatureSeal time="03:12" />
            <SG.CapturedStamp count={4} label="tangkap" />
            <SG.SavedSeal label="Tersimpan" time="22:14" />
            <SG.TallyStamp count={5} />
          </div>
          <SG.LedgerStripe rangeLabel="12 – 18 Mei" avg={28} best="Sabtu" />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <SG.WarungMark size={64} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <SG.NotebookFold size={40} />
              <SG.SectionLabel>Akun</SG.SectionLabel>
            </div>
          </div>
        </div>
      </Grid>

      <div style={{ marginTop: 14 }}>
        <div className="sk-overline" style={{ marginBottom: 10 }}>MiniWeather (ink)</div>
        <div style={{
          background: "var(--sk-surface)", border: "1px solid var(--sk-line)",
          borderRadius: 12, padding: 18,
          display: "flex", gap: 24, alignItems: "center", color: "var(--sk-text-2)",
        }}>
          <div style={{ textAlign: "center" }}><SG.MiniWeather kind="sun" size={36} /><div style={{ fontSize: 11, marginTop: 4 }}>Cerah</div></div>
          <div style={{ textAlign: "center" }}><SG.MiniWeather kind="cloud" size={36} /><div style={{ fontSize: 11, marginTop: 4 }}>Berawan</div></div>
          <div style={{ textAlign: "center" }}><SG.MiniWeather kind="rain" size={36} /><div style={{ fontSize: 11, marginTop: 4 }}>Hujan</div></div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────── Weather scenes ───────────────
function WeatherSection() {
  const scenes = [
    { n: "Cerah",    k: "cerah",    g: "Pagi cerah, ramai siap-siap" },
    { n: "Berawan",  k: "berawan",  g: "Mendung tipis, tenang" },
    { n: "Hujan",    k: "hujan",    g: "Sore hujan, ramai turun" },
    { n: "Petir",    k: "petir",    g: "Badai · ramai tutup awal" },
    { n: "Subuh",    k: "subuh",    g: "Pra-fajar, warung pertama buka" },
    { n: "Berkabut", k: "berkabut", g: "Kabut pagi, lambat panas" },
  ];
  return (
    <Section id="weather" title="Weather scenes"
      subtitle="Six full-bleed atmospheric panels for the Belanja Card hero and dashboard banners. All scalable SVG.">
      <Grid cols={2} gap={14}>
        {scenes.map(s => {
          const Cmp = SW.WEATHER_SCENES[s.k];
          return (
            <div key={s.k} style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, overflow: "hidden" }}>
              <Cmp width={"100%"} height={140} />
              <div style={{ padding: "12px 14px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.012em" }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 2 }}>{s.g}</div>
                </div>
                <span className="sk-pill">{s.k}</span>
              </div>
            </div>
          );
        })}
      </Grid>
    </Section>
  );
}

// ─────────────── Brand heroes ───────────────
function WelcomesSection() {
  return (
    <Section id="welcomes" title="Brand heroes" subtitle="Stock-market shorthand × warung ink. Use as splash, hero, or marketing surface.">
      <Grid cols={2} gap={14}>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>WelcomeHero</div>
          <SL.WelcomeHero width={"100%"} height={260} />
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="sk-overline">ForecastIllust</div>
          <SL.ForecastIllust width={260} height={180} />
          <div className="sk-overline" style={{ marginTop: 6 }}>SuccessIllust</div>
          <SL.SuccessIllust width={220} height={160} />
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="sk-overline">TickerBanner</div>
          <SL.TickerBanner width={"100%"} height={42} />
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", alignItems: "center", justifyContent: "space-around", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <SL.MarketMascot size={120} />
            <div style={{ fontSize: 11, color: "var(--sk-text-3)" }}>MarketMascot</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <SL.WordLogo width={200} height={48} />
            <div style={{ fontSize: 11, color: "var(--sk-text-3)" }}>WordLogo</div>
            <div style={{ marginTop: 12, padding: 12, background: "#001f54", borderRadius: 10 }}>
              <SL.WordLogo width={200} height={48} dark />
            </div>
          </div>
        </div>

        {/* Onboarding ink stamps (existing OnbDecor) */}
        <div style={{ gridColumn: "1 / -1", background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>Onboarding decorations · OnbDecor</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <div style={{ background: "var(--sk-surface-2)", borderRadius: 10, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 220, height: 110 }}>{window.OnbDecor && <window.OnbDecor.nama />}</div>
              <span style={{ fontSize: 12, color: "var(--sk-text-3)" }}>nama</span>
            </div>
            <div style={{ background: "var(--sk-surface-2)", borderRadius: 10, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 220, height: 110 }}>{window.OnbDecor && <window.OnbDecor.lokasi />}</div>
              <span style={{ fontSize: 12, color: "var(--sk-text-3)" }}>lokasi</span>
            </div>
            <div style={{ background: "var(--sk-surface-2)", borderRadius: 10, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 220, height: 110 }}>{window.OnbDecor && <window.OnbDecor.menu />}</div>
              <span style={{ fontSize: 12, color: "var(--sk-text-3)" }}>menu</span>
            </div>
          </div>
        </div>
      </Grid>
    </Section>
  );
}

// ─────────────── Empty states ───────────────
function EmptySection() {
  const states = [
    { I: SE.IllustNoData,    t: "Belum ada catatan",     b: "Catat hari ini dulu — tiga hari lagi rekomendasinya muncul sendiri.", cta: <SkButton variant="primary" size="lg" leading={<IK.note size={16} />}>Catat hari ini</SkButton> },
    { I: SE.IllustNoHistory, t: "Minggu pertama, sabar dulu", b: "Aku butuh 5–7 hari data buat melihat polanya.", cta: <SkButton variant="secondary" size="lg">Lihat contoh</SkButton> },
    { I: SE.IllustOffline,   t: "Internet putus",        b: "Kamu masih bisa catat. Aku sinkron pas online lagi.", cta: <SkButton variant="ghost" size="lg" leading={<IK.refresh size={16} />}>Coba lagi</SkButton> },
    { I: SE.IllustError,     t: "Ada yang ngambek",      b: "Lagi nggak bisa baca catatanmu. Coba sebentar lagi ya.",         cta: <SkButton variant="primary" size="lg">Ulangi</SkButton> },
    { I: SE.IllustSearch,    t: "Nggak ada yang cocok",  b: "Coba kata lain atau ubah filternya.",                              cta: <SkButton variant="ghost" size="lg">Reset filter</SkButton> },
    { I: SE.IllustDone,      t: "Udah beres semua",      b: "Catatan hari ini sudah masuk. Sampai jumpa besok subuh.",          cta: <SkButton variant="secondary" size="lg">Lihat ringkasan</SkButton> },
  ];
  return (
    <Section id="empty" title="Empty states" subtitle="Six illustrated states. Always paired with one concrete action — never just a sad mascot.">
      <Grid cols={3} gap={14}>
        {states.map((s, i) => (
          <SE.EmptyPanel key={i} illust={s.I} title={s.t} body={s.b} cta={s.cta} />
        ))}
      </Grid>
    </Section>
  );
}

// ─────────────── Buttons ───────────────
function ButtonsSection() {
  return (
    <Section id="buttons" title="Buttons" subtitle="Three variants × three sizes. Primary is ink-dark. Brand is for the Belanja Card CTA only.">
      <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <SkButton variant="primary" size="lg" leading={<IK.note size={17} />}>Catat hari ini</SkButton>
          <SkButton variant="brand" size="lg" leading={<IK.whatsapp size={18} />}>Salin ke WhatsApp</SkButton>
          <SkButton variant="secondary" size="lg">Sekunder</SkButton>
          <SkButton variant="ghost" size="lg">Ghost</SkButton>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <SkButton variant="primary" size="md">Default size</SkButton>
          <SkButton variant="secondary" size="md" trailing={<IK.arrowR size={16} />}>Lanjut</SkButton>
          <SkButton variant="primary" size="sm">Small</SkButton>
          <SkButton variant="ghost" size="sm" leading={<IK.edit size={13} />}>Atur</SkButton>
          <button className="sk-btn" data-variant="primary" disabled style={{ opacity: 0.4, pointerEvents: "none" }}>Disabled</button>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button className="sk-btn" data-variant="ghost" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}><IK.search size={18} /></button>
          <button className="sk-btn" data-variant="ghost" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}><IK.bell size={18} /></button>
          <button className="sk-btn" data-variant="ghost" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}><IK.moon size={18} /></button>
          <button className="sk-btn" data-variant="secondary" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}><IK.plus size={18} /></button>
          <button className="sk-btn" data-variant="brand" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}><IK.whatsapp size={16} /></button>
        </div>
      </div>
    </Section>
  );
}

// ─────────────── Pills ───────────────
function PillsSection() {
  return (
    <Section id="pills" title="Pills · Badges" subtitle="One pill component, five tones. Dot variant for status, brand variant for promos.">
      <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 24, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <SkPill>neutral</SkPill>
        <SkPill tone="success" dot>Pola jelas</SkPill>
        <SkPill tone="warn" dot>Data baru</SkPill>
        <SkPill tone="danger" dot>Salah</SkPill>
        <SkPill tone="brand">10% off</SkPill>
        <SkPill>tidak yakin</SkPill>
        <SkPill tone="warn">perlu cek</SkPill>
        <SkPill tone="success">OK</SkPill>
      </div>
    </Section>
  );
}

// ─────────────── Inputs ───────────────
function InputsSection() {
  return (
    <Section id="inputs" title="Inputs" subtitle="One input, one textarea, one select, one segmented control. The whole form vocabulary.">
      <Grid cols={2} gap={14}>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
          <SkLabel hint="Yang biasanya pelanggan sebut.">Nama warung</SkLabel>
          <SkInput value="Warung Bu Yati" />
          <SkLabel hint="Pisahkan dengan koma.">Menu utama</SkLabel>
          <textarea className="sk-input" defaultValue={"pecel lele, ayam goreng, tahu, tempe"}
            style={{ height: 90, padding: "12px 14px", lineHeight: 1.5, resize: "none", fontFamily: "inherit" }} />
          <SkLabel>Lokasi</SkLabel>
          <div className="sk-input" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <span>Salatiga</span>
            <IK.chevronD size={16} stroke={2} />
          </div>
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <SkLabel>Subuh Mode</SkLabel>
            <div style={{ display: "flex", background: "var(--sk-surface-2)", padding: 2, borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
              {["Auto", "On", "Off"].map((s, i) => (
                <span key={s} style={{
                  padding: "7px 14px", borderRadius: 6, flex: 1, textAlign: "center",
                  background: i === 0 ? "var(--sk-surface)" : "transparent",
                  color: i === 0 ? "var(--sk-text)" : "var(--sk-text-3)",
                  boxShadow: i === 0 ? "0 1px 2px rgba(26,22,17,0.04)" : "none",
                }}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <SkLabel>Search</SkLabel>
            <div style={{ position: "relative" }}>
              <IK.search size={16} style={{ position: "absolute", left: 14, top: 16, color: "var(--sk-text-3)" }} />
              <input className="sk-input" placeholder="Cari item…" style={{ paddingLeft: 38 }} />
            </div>
          </div>
          <div>
            <SkLabel>Step indicator</SkLabel>
            <SkSteps count={3} current={1} />
          </div>
          <div>
            <SkLabel>Thinking</SkLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--sk-text-2)" }}>
              <SkThinking /> <span>Lagi baca catatanmu…</span>
            </div>
          </div>
        </div>
      </Grid>
    </Section>
  );
}

// ─────────────── Cards ───────────────
function CardsSection() {
  return (
    <Section id="cards" title="Cards" subtitle="Four tones — default, muted, ghost, signature. Signature adds paper grain.">
      <Grid cols={4} gap={12}>
        <SkCard>
          <div className="sk-overline" style={{ marginBottom: 8 }}>Default</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Belanja besok</div>
          <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 2 }}>Selasa · 20 Mei</div>
        </SkCard>
        <SkCard tone="muted">
          <div className="sk-overline" style={{ marginBottom: 8 }}>Muted</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Surface-2 background</div>
          <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 2 }}>No border</div>
        </SkCard>
        <SkCard tone="ghost">
          <div className="sk-overline" style={{ marginBottom: 8 }}>Ghost</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Transparent</div>
          <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 2 }}>Border only</div>
        </SkCard>
        <SkCard signature>
          <div className="sk-overline" style={{ marginBottom: 8 }}>Signature</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>+ paper grain</div>
          <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 2 }}>Belanja Card &c.</div>
        </SkCard>
      </Grid>
    </Section>
  );
}

// ─────────────── Navigation ───────────────
function NavSection() {
  return (
    <Section id="nav" title="Navigation" subtitle="Top bar (default + task) and bottom nav. Both shown inside a fake mobile shell.">
      <Grid cols={2} gap={14}>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>Top bar · default</div>
          <div className="sk-screen" style={{
            width: "100%", border: "1px solid var(--sk-line)", borderRadius: 10, overflow: "hidden",
          }}>
            <SkTopBar warungName="Bu Yati" date="Senin, 19 Mei" status="synced"
              trailing={<button className="sk-btn" data-variant="ghost" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}><IK.moon size={18} /></button>} />
            <div style={{ height: 8 }} />
          </div>
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>Top bar · task</div>
          <div className="sk-screen" style={{
            width: "100%", border: "1px solid var(--sk-line)", borderRadius: 10, overflow: "hidden",
          }}>
            <SkTopBar mode="task" title="Catat hari ini"
              trailing={<button className="sk-btn" data-variant="ghost" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}><IK.mic size={18} /></button>} />
          </div>
        </div>
        <div style={{ gridColumn: "1 / -1", background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>Bottom nav</div>
          <div className="sk-screen" style={{ width: "100%", border: "1px solid var(--sk-line)", borderRadius: 10, overflow: "hidden" }}>
            <SkBottomNav active="home" />
          </div>
        </div>
      </Grid>
    </Section>
  );
}

// ─────────────── Lists ───────────────
function ListsSection() {
  return (
    <Section id="lists" title="Lists" subtitle="Settings rows, item rows, parsed-confirmation rows.">
      <Grid cols={2} gap={14}>
        <div className="sk-card" style={{ padding: 0, overflow: "hidden" }}>
          {[
            { I: IK.shop, t: "Nama warung", d: "Warung Bu Yati" },
            { I: IK.history, t: "Lokasi", d: "Salatiga" },
            { I: IK.note, t: "Menu utama", d: "5 item" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 16px", borderBottom: "1px solid var(--sk-line)",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "var(--sk-surface-2)", color: "var(--sk-text-2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><r.I size={16} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{r.t}</div>
                <div style={{ fontSize: 12, color: "var(--sk-text-3)" }}>{r.d}</div>
              </div>
              <IK.chevronR size={16} stroke={2} style={{ color: "var(--sk-text-3)" }} />
            </div>
          ))}
        </div>
        <div className="sk-card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { name: "Lele", qty: 24, unit: "ekor", trend: "down", delta: "−6" },
            { name: "Ayam", qty: 12, unit: "ekor", trend: "up",   delta: "+2" },
            { name: "Tahu", qty: 14, unit: "pcs",  trend: "down", delta: "−6" },
          ].map((it, i, arr) => {
            const G = SG.glyphFor(it.name);
            return (
              <div key={it.name} style={{
                display: "grid", gridTemplateColumns: "auto 1fr auto",
                gap: 12, padding: "13px 0", alignItems: "center",
                borderBottom: i < arr.length - 1 ? "1px solid var(--sk-line)" : "none",
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--sk-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sk-text-2)" }}><G size={22} /></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{it.name}</div>
                  <div style={{ fontSize: 12, color: "var(--sk-text-3)" }}>{it.unit}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="sk-mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.04em" }}>{it.qty}</span>
                  <div className="sk-mono" style={{ fontSize: 11.5, color: it.trend === "down" ? "var(--sk-success)" : "var(--sk-warn)" }}>{it.delta}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Grid>
    </Section>
  );
}

// ─────────────── Charts ───────────────
function ChartsSection() {
  return (
    <Section id="charts" title="Charts" subtitle="Sparkline, bar series, warung candlesticks, donut, progress, tally, heat strip.">
      <Grid cols={3} gap={14}>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18 }}>
          <div className="sk-overline" style={{ marginBottom: 8 }}>Sparkline</div>
          <SC.Sparkline data={[8, 14, 10, 18, 22, 16, 24, 22, 28, 32, 30, 38]} trend="up" width={240} height={56} />
          <SC.Sparkline data={[40, 32, 36, 28, 22, 24, 16, 20, 12, 14, 8, 10]} trend="down" width={240} height={56} />
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18 }}>
          <div className="sk-overline" style={{ marginBottom: 8 }}>BarSeries</div>
          <SC.BarSeries width={240} height={90} />
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18 }}>
          <div className="sk-overline" style={{ marginBottom: 8 }}>CandleSeries (warung)</div>
          <SC.CandleSeries width={240} height={120} />
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18 }}>
          <div className="sk-overline" style={{ marginBottom: 12 }}>DonutMini</div>
          <SC.DonutMini showLegend />
        </div>
        <SC.DeltaWidget label="Pendapatan" value="Rp 624k" deltaLabel="+12%" trend="up"
          data={[2, 4, 3, 6, 8, 7, 10, 12, 11, 14]} />
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="sk-overline">Progress meters</div>
          <SC.ProgressMeter label="Stok lele"  value={24} max={30} hint="24/30 ekor" tone="brand" />
          <SC.ProgressMeter label="Margin"     value={84} max={100} hint="84%" tone="success" />
          <SC.ProgressMeter label="Sisa diskon" value={32} max={100} hint="32%" tone="warn" />
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", justifyContent: "space-around" }}>
          <SC.TallyCounter value={24} label="ekor lele" trend="down" delta="−6 vs kemarin" />
          <SC.TallyCounter value={12} label="ekor ayam" trend="up"   delta="+2 vs kemarin" />
        </div>
        <div style={{ gridColumn: "span 2", background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>HeatStrip · 28 hari</div>
          <SC.HeatStrip width={560} height={32} />
        </div>
      </Grid>
    </Section>
  );
}

// ─────────────── Notifications ───────────────
function NotifySection() {
  return (
    <Section id="notify" title="Notifications" subtitle="Toast for transient, Banner for persistent, InlineAlert for in-context, Push for system, ActivityDot for badges.">
      <Grid cols={2} gap={14}>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="sk-overline">Toast</div>
          <SN.Toast kind="success" title="Catatan tersimpan" message="Besok subuh, belanja baru tersusun." onClose={() => {}} />
          <SN.Toast kind="warn"    title="Cuaca berubah"     message="Sore tadi malah cerah — coba catat lagi." onClose={() => {}} />
          <SN.Toast kind="danger"  title="Sinkron gagal"     message="Akan dicoba lagi otomatis."                onClose={() => {}} />
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="sk-overline">Banner</div>
          <SN.Banner kind="info"    title="Pola mingguan baru" message="Pola Senin sekarang +12% — sudah aku pakai." action={<SkButton size="sm" variant="ghost">Lihat</SkButton>} />
          <SN.Banner kind="brand"   title="Promo aja?"          message="Tahu masih banyak. Bikin promo sore." action={<SkButton size="sm" variant="brand">Coba</SkButton>} />
          <SN.Banner kind="success" title="7 hari lengkap"      message="Sekarang prediksi sudah berdasarkan polamu." />
        </div>
        <div style={{ background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="sk-overline">InlineAlert</div>
          <SN.InlineAlert kind="warn" title="Perlu cek">
            Cuaca "hujan" — boleh dikoreksi kalau salah baca.
          </SN.InlineAlert>
          <SN.InlineAlert kind="info">
            Aku baru pakai 3 hari data. Tunggu sampai 7 hari biar lebih yakin.
          </SN.InlineAlert>
          <SN.InlineAlert kind="danger" title="Selisih besar">
            Hari ini terjual 30, tapi base hanya 25. Cek lagi ya.
          </SN.InlineAlert>
        </div>
        <div style={{ background: "linear-gradient(180deg, #001f54 0%, #21295c 100%)", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="sk-overline" style={{ color: "rgba(255,255,255,0.65)" }}>PushPreview (lock screen)</div>
          <SN.PushPreview time="03:12" title="Belanja besok siap" message="5 item · Selasa 20 Mei · sore hujan" />
          <SN.PushPreview time="06:08" title="Pagi! Yuk catat" message="Catatan kemarin sudah tersusun untuk hari ini." />
        </div>
        <div style={{ gridColumn: "1 / -1", background: "var(--sk-surface)", border: "1px solid var(--sk-line)", borderRadius: 12, padding: 18, display: "flex", gap: 28, alignItems: "center" }}>
          <div className="sk-overline">ActivityDot</div>
          <div style={{ position: "relative", display: "inline-flex" }}>
            <button className="sk-btn" data-variant="secondary" data-size="sm" style={{ width: 40, height: 40, padding: 0 }}><IK.bell size={18} /></button>
            <SN.ActivityDot count={3} tone="danger" />
          </div>
          <div style={{ position: "relative", display: "inline-flex" }}>
            <button className="sk-btn" data-variant="secondary" data-size="sm" style={{ width: 40, height: 40, padding: 0 }}><IK.note size={18} /></button>
            <SN.ActivityDot count={12} tone="brand" />
          </div>
          <div style={{ position: "relative", display: "inline-flex" }}>
            <button className="sk-btn" data-variant="secondary" data-size="sm" style={{ width: 40, height: 40, padding: 0 }}><IK.share size={18} /></button>
            <SN.ActivityDot tone="success" />
          </div>
        </div>
      </Grid>
    </Section>
  );
}

// ─────────────── Belanja Card variants ───────────────
function BelanjaSection() {
  return (
    <Section id="belanja" title="Belanja Card variants" subtitle="The signature surface. Four directions: editorial restraint, paper warmth, compact density, pasar-thematic.">
      <Grid cols={2} gap={18}>
        <div style={{ background: "var(--sk-surface-2)", border: "1px solid var(--sk-line)", borderRadius: 14, padding: 24 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>v1 · Editorial (default · hardened)</div>
          <BelanjaCardEditorial />
        </div>
        <div style={{ background: "var(--sk-surface-2)", border: "1px solid var(--sk-line)", borderRadius: 14, padding: 24 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>v4 · Pasar (thematic)</div>
          <BelanjaCardPasar />
        </div>
        <div style={{ background: "var(--sk-surface-2)", border: "1px solid var(--sk-line)", borderRadius: 14, padding: 24 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>v2 · Hand-feel</div>
          <BelanjaCardWarm />
        </div>
        <div style={{ background: "var(--sk-surface-2)", border: "1px solid var(--sk-line)", borderRadius: 14, padding: 24 }}>
          <div className="sk-overline" style={{ marginBottom: 10 }}>v3 · Compact</div>
          <BelanjaCardCompact />
        </div>
      </Grid>
    </Section>
  );
}

// ─────────────── Sidebar nav ───────────────
function Sidebar({ active }) {
  const groups = SECTIONS.reduce((acc, s) => {
    (acc[s.group] = acc[s.group] || []).push(s);
    return acc;
  }, {});
  return (
    <aside style={{
      position: "sticky", top: 0, height: "100vh",
      width: 260, flexShrink: 0,
      padding: "28px 18px 20px",
      borderRight: "1px solid var(--sk-line)",
      background: "var(--sk-bg)",
      overflowY: "auto",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <SL.WordLogo width={150} height={36} />
      </div>
      <div style={{
        padding: "8px 10px",
        background: "var(--sk-surface-2)",
        borderRadius: 8,
        fontSize: 11.5, color: "var(--sk-text-2)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <IK.spark size={14} />
        UI Kit · v1.5
      </div>
      <a href="index.html" style={{
        textDecoration: "none",
        padding: "8px 10px",
        fontSize: 12, fontWeight: 600,
        color: "var(--sk-text-2)",
        borderRadius: 8,
        background: "var(--sk-surface)",
        border: "1px solid var(--sk-line)",
        display: "inline-flex", alignItems: "center", gap: 8,
      }}>
        <IK.arrowL size={14} /> Walkthrough
      </a>

      <nav style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
        {Object.entries(groups).map(([g, list]) => (
          <div key={g}>
            <div className="sk-overline" style={{ padding: "12px 10px 6px" }}>{g}</div>
            {list.map(s => (
              <a key={s.id} href={`#${s.id}`} style={{
                display: "block",
                padding: "6px 10px",
                fontSize: 13,
                fontWeight: 500,
                color: active === s.id ? "var(--sk-text)" : "var(--sk-text-2)",
                borderRadius: 6,
                background: active === s.id ? "var(--sk-surface-2)" : "transparent",
                textDecoration: "none",
                letterSpacing: "-0.005em",
              }}>{s.label}</a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

// ─────────────── App ───────────────
function UIKitApp() {
  const [active, setActive] = uksUseState("brand");

  uksUseEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.1] });
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sk-screen" style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--sk-bg)",
    }}>
      <Sidebar active={active} />
      <main style={{ flex: 1, minWidth: 0 }}>
        <BrandSection />
        <PrinciplesSection />
        <ColorSection />
        <TypeSection />
        <SpacingSection />
        <MotionSection />
        <IconsNavSection />
        <IconsActionSection />
        <IconsStatusSection />
        <IconsFinanceSection />
        <IconsWeatherSection />
        <GlyphsSection />
        <MotifsSection />
        <WeatherSection />
        <WelcomesSection />
        <EmptySection />
        <ButtonsSection />
        <PillsSection />
        <InputsSection />
        <CardsSection />
        <NavSection />
        <ListsSection />
        <ChartsSection />
        <NotifySection />
        <BelanjaSection />
        <footer style={{ padding: "32px 56px 56px", color: "var(--sk-text-3)", fontSize: 12 }}>
          Stockast UI Kit · v1.5 · All assets scalable SVG · Dibuat untuk pedagang Indonesia · 2026
        </footer>
      </main>
    </div>
  );
}

const uksRoot = ReactDOM.createRoot(document.getElementById("root"));
uksRoot.render(<UIKitApp />);
