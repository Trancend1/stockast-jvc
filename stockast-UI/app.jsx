// app.jsx — Canvas composition for the Stockast refined walkthrough.
// Renders every screen inside both an iPhone and an Android device frame,
// arranged in DCSections. Adds a Tweaks panel that drives Subuh Mode
// + paper-grain intensity + serif accent + density at the root.

const { useState: useS, useEffect: useE } = React;

// Phone dimensions — same content width across both, tight for canvas.
const PHONE_W = 372;
const PHONE_H = 760;
const AB_W    = PHONE_W;
const AB_H    = PHONE_H;

// Wrap a screen in an iOS frame (no built-in nav bar — we use our own)
function PhoneIOS({ children }) {
  return (
    <IOSDevice width={PHONE_W} height={PHONE_H} dark={false}>
      <div style={{ height: "100%", width: "100%" }}>{children}</div>
    </IOSDevice>
  );
}

// Wrap a screen in an Android frame
function PhoneAnd({ children }) {
  return (
    <AndroidDevice width={PHONE_W} height={PHONE_H} dark={false}>
      <div style={{ height: "100%", width: "100%", background: "var(--sk-bg)" }}>{children}</div>
    </AndroidDevice>
  );
}

// ─────────────── Tweaks panel ───────────────
const DEFAULTS = /*EDITMODE-BEGIN*/{
  "subuh": "off",
  "paperGrain": 5,
  "serifAccent": true,
  "density": "standard",
  "revealAnim": true,
  "promoCard": true,
  "belanjaVariant": "editorial",
  "weather": "rain"
}/*EDITMODE-END*/;

// Surface the active tweak state to the dashboard via a global, so we
// don't have to prop-drill every screen.
window.__sk = window.__sk || {};

function StockastTweaks() {
  const [t, setTweak] = useTweaks(DEFAULTS);

  // Apply global state to the document root + push into __sk so screens read it
  useE(() => {
    document.documentElement.setAttribute("data-subuh", t.subuh === "on" ? "on" : "off");
    document.documentElement.style.setProperty("--sk-grain", String(t.paperGrain / 100));
    window.__sk.subuh = t.subuh === "on";
    window.__sk.belanjaVariant = t.belanjaVariant;
    window.__sk.weather = t.weather;
    window.__sk.promoCard = t.promoCard;
    // Nudge a rerender on dependent screens via a custom event
    window.dispatchEvent(new CustomEvent("sk:tweaks"));
  }, [t.subuh, t.paperGrain, t.belanjaVariant, t.weather, t.promoCard]);

  return (
    <TweaksPanel title="Stockast">
      <TweakSection title="Subuh Mode">
        <TweakRadio
          value={t.subuh}
          onChange={(v) => setTweak("subuh", v)}
          options={[
            { value: "off", label: "Day" },
            { value: "on",  label: "Subuh" },
          ]}
        />
      </TweakSection>
      <TweakSection title="Belanja Card">
        <TweakRadio
          value={t.belanjaVariant}
          onChange={(v) => setTweak("belanjaVariant", v)}
          options={[
            { value: "editorial", label: "Editorial" },
            { value: "pasar",     label: "Pasar" },
          ]}
        />
        <TweakSelect
          label="Weather"
          value={t.weather}
          onChange={(v) => setTweak("weather", v)}
          options={[
            { value: "rain",  label: "Sore hujan" },
            { value: "cloud", label: "Berawan" },
            { value: "sun",   label: "Cerah" },
          ]}
        />
      </TweakSection>
      <TweakSection title="Visual">
        <TweakSlider label="Paper grain" min={0} max={12} step={1} value={t.paperGrain} onChange={(v) => setTweak("paperGrain", v)} />
        <TweakToggle label="Serif accent" checked={t.serifAccent} onChange={(v) => setTweak("serifAccent", v)} />
        <TweakToggle label="Reveal animation" checked={t.revealAnim} onChange={(v) => setTweak("revealAnim", v)} />
      </TweakSection>
      <TweakSection title="Dashboard">
        <TweakToggle label="Show promo card" checked={t.promoCard} onChange={(v) => setTweak("promoCard", v)} />
      </TweakSection>
      <TweakSection title="Resources">
        <a href="ui-kit.html" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 12px",
          background: "var(--sk-surface-2)",
          border: "1px solid var(--sk-line)",
          borderRadius: 8,
          textDecoration: "none",
          color: "var(--sk-text)",
          fontSize: 13, fontWeight: 600,
        }}>
          <span>Open UI Kit ↗</span>
          <span style={{ fontSize: 11, color: "var(--sk-text-3)", fontWeight: 500 }}>full system</span>
        </a>
      </TweakSection>
    </TweaksPanel>
  );
}

// ─────────────── Canvas composition ───────────────
function App() {
  return (
    <>
      <StockastTweaks />
      <DesignCanvas>
        {/* ─── Section: Direction ─── */}
        <DCSection
          id="direction"
          title="Direction"
          subtitle="The refinement target — quiet warmth · disciplined typography · one signature serif moment · ‘AI’ as plumbing, not badge.">
          <DCArtboard id="cover" label="Reading" width={760} height={AB_H}>
            <CoverNote />
          </DCArtboard>
          <DCArtboard id="palette" label="Tokens" width={420} height={AB_H}>
            <TokensCard />
          </DCArtboard>
        </DCSection>

        {/* ─── Section: Onboarding (setup form, with decorations) ─── */}
        <DCSection
          id="onboarding"
          title="Onboarding"
          subtitle="Three quick fields to provision the warung. A small ink-stamp decoration above each heading — pemanis, not a hero. Decorations stay warm regardless of Subuh.">
          <DCArtboard id="onb-1" label="01 · Nama" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenOnboardStep step={1} /></PhoneIOS>
          </DCArtboard>
          <DCArtboard id="onb-2" label="02 · Lokasi" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenOnboardStep step={2} /></PhoneIOS>
          </DCArtboard>
          <DCArtboard id="onb-3" label="03 · Menu" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenOnboardStep step={3} /></PhoneIOS>
          </DCArtboard>
          <DCArtboard id="onb-and" label="01 · Android" width={AB_W} height={AB_H}>
            <PhoneAnd><ScreenOnboardStep step={1} /></PhoneAnd>
          </DCArtboard>
        </DCSection>

        {/* ─── Section: Dashboard (signature) ─── */}
        <DCSection
          id="dashboard"
          title="Dashboard — the signature moment"
          subtitle="Bu Yati opens this once at 03:00. Belanja Card eats the first fold. Promo and Pola Mingguan are quiet secondaries. Both devices share the same layout — only chrome differs.">
          <DCArtboard id="dash-ios"  label="Default · iOS" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenDashboard /></PhoneIOS>
          </DCArtboard>
          <DCArtboard id="dash-and" label="Default · Android" width={AB_W} height={AB_H}>
            <PhoneAnd><ScreenDashboard /></PhoneAnd>
          </DCArtboard>
          <DCArtboard id="dash-empty" label="Empty · first-time" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenDashboardEmpty /></PhoneIOS>
          </DCArtboard>
        </DCSection>

        {/* ─── Section: Belanja Card lab ─── */}
        <DCSection
          id="belanja"
          title="Belanja Card · lab"
          subtitle="Three takes on the signature card. v1 is what the dashboard ships. v2 leans into hand-feel for users who want the warung soul louder. v3 is the dense table mode for power users.">
          <DCArtboard id="bc-edit" label="01 · Editorial (default)" width={340} height={760}>
            <CardLabCanvas><BelanjaCardEditorial /></CardLabCanvas>
          </DCArtboard>
          <DCArtboard id="bc-warm" label="02 · Hand-feel" width={340} height={620}>
            <CardLabCanvas><BelanjaCardWarm /></CardLabCanvas>
          </DCArtboard>
          <DCArtboard id="bc-comp" label="03 · Compact" width={340} height={500}>
            <CardLabCanvas><BelanjaCardCompact /></CardLabCanvas>
          </DCArtboard>
          <DCArtboard id="bc-pasar" label="04 · Pasar (thematic)" width={340} height={860}>
            <CardLabCanvas><BelanjaCardPasar /></CardLabCanvas>
          </DCArtboard>
        </DCSection>

        {/* ─── Section: Magic moment flow ─── */}
        <DCSection
          id="magic"
          title="Catat → Tangkap → Simpan"
          subtitle="The three-second magic moment. Single fullscreen task; AI shown as a soft pulsing dot, never a sparkle.">
          <DCArtboard id="catat-input"  label="01 · Input" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenCatat stage="input" /></PhoneIOS>
          </DCArtboard>
          <DCArtboard id="catat-thinking" label="02 · Membaca" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenCatat stage="thinking" /></PhoneIOS>
          </DCArtboard>
          <DCArtboard id="catat-parsed" label="03 · Konfirmasi" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenParseConfirm /></PhoneIOS>
          </DCArtboard>
          <DCArtboard id="catat-saved" label="04 · Simpan ✓" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenParseConfirm saved={true} /></PhoneIOS>
          </DCArtboard>
          <DCArtboard id="promo-sheet" label="05 · Promo draft" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenPromoSheet /></PhoneIOS>
          </DCArtboard>
        </DCSection>

        {/* ─── Section: Secondary surfaces ─── */}
        <DCSection
          id="secondary"
          title="Riwayat · Setelan"
          subtitle="Quiet surfaces. No infinite feed, no 30-toggle settings page.">
          <DCArtboard id="riwayat" label="Riwayat · 7 hari" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenRiwayat /></PhoneIOS>
          </DCArtboard>
          <DCArtboard id="setelan" label="Setelan" width={AB_W} height={AB_H}>
            <PhoneIOS><ScreenSettings /></PhoneIOS>
          </DCArtboard>
          <DCArtboard id="riwayat-and" label="Riwayat · Android" width={AB_W} height={AB_H}>
            <PhoneAnd><ScreenRiwayat /></PhoneAnd>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

// ─────────────── Foundation/intro card components ───────────────
function CoverNote() {
  return (
    <div className="sk-screen" style={{
      width: "100%", height: "100%",
      padding: "44px 48px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      borderRadius: 6,
      border: "1px solid var(--sk-line)",
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 9,
            background: "var(--sk-text)", color: "var(--sk-bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, letterSpacing: "-0.04em",
          }}>S</span>
          <span className="sk-overline">Stockast · refined</span>
        </div>
        <h1 style={{
          fontSize: 36, fontWeight: 700, letterSpacing: "-0.028em",
          lineHeight: 1.1, margin: 0, maxWidth: 560,
        }}>
          Pull the warung toward{" "}
          <span className="sk-display" style={{ fontSize: 36 }}>Linear quiet</span>.
          Keep its soul.
        </h1>
        <p style={{ fontSize: 15, color: "var(--sk-text-2)", lineHeight: 1.6, maxWidth: 540, marginTop: 18 }}>
          The current build leans too SaaS-generated: weak hierarchy, scattered gradients,
          mismatched icons, mushy spacing. This refinement keeps every brand commitment
          (cream, brick orange, Indonesian voice, Bu Yati first) but cleans the room.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, fontSize: 13, lineHeight: 1.55 }}>
        <div>
          <div className="sk-overline" style={{ marginBottom: 10 }}>Keep</div>
          <ul style={{ margin: 0, paddingLeft: 16, color: "var(--sk-text-2)" }}>
            <li>Plus Jakarta Sans, brick orange, cream — exact brand tokens</li>
            <li>Indonesian conversational voice, Bu Yati persona</li>
            <li>Belanja Card as the magic moment</li>
            <li>Subuh Mode color shift</li>
            <li>shadcn primitives, Tailwind, file structure</li>
          </ul>
        </div>
        <div>
          <div className="sk-overline" style={{ marginBottom: 10 }}>Refine</div>
          <ul style={{ margin: 0, paddingLeft: 16, color: "var(--sk-text-2)" }}>
            <li>Type scale tightened, one weight per role</li>
            <li>Icon set redrawn at 1.5px stroke — one family</li>
            <li>Hairline borders, single elevation method per card</li>
            <li>Orange used as accent only — never a flood</li>
            <li>‘AI’ presence: thinking dot · dotted reveal · zero sparkles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TokensCard() {
  const Swatch = ({ name, color, ink = "var(--sk-text)" }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 26, height: 26, borderRadius: 7, background: color, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: ink, letterSpacing: "-0.005em" }}>{name}</div>
        <div className="sk-mono" style={{ fontSize: 11, color: "var(--sk-text-3)" }}>{color}</div>
      </div>
    </div>
  );
  return (
    <div className="sk-screen" style={{
      width: "100%", height: "100%",
      padding: 28, borderRadius: 6, border: "1px solid var(--sk-line)",
      display: "flex", flexDirection: "column", gap: 22,
      overflow: "auto",
    }}>
      <div>
        <div className="sk-overline" style={{ marginBottom: 10 }}>Color</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Swatch name="Cream"  color="#FAF6EE" />
          <Swatch name="Ink"    color="#1A1611" />
          <Swatch name="Brand"  color="#F26F1B" />
          <Swatch name="Mint"   color="#3F9568" />
          <Swatch name="Line"   color="#ECE4D3" />
          <Swatch name="Surface" color="#FFFFFF" />
        </div>
      </div>

      <div>
        <div className="sk-overline" style={{ marginBottom: 10 }}>Type</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--sk-text-3)", marginBottom: 2 }}>Hero · serif italic</div>
            <div className="sk-display" style={{ fontSize: 28 }}>Belanja besok</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--sk-text-3)", marginBottom: 2 }}>Heading · Plus Jakarta 700</div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.018em" }}>Senin, 19 Mei</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--sk-text-3)", marginBottom: 2 }}>Body · Plus Jakarta 400</div>
            <div style={{ fontSize: 15, lineHeight: 1.5 }}>Lele kemarin sisa 5 dari 30 ekor.</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--sk-text-3)", marginBottom: 2 }}>Number · JetBrains Mono 600</div>
            <div className="sk-mono" style={{ fontSize: 26, fontWeight: 600 }}>24</div>
          </div>
        </div>
      </div>

      <div>
        <div className="sk-overline" style={{ marginBottom: 10 }}>Pills</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <SkPill tone="success" dot>Pola jelas</SkPill>
          <SkPill tone="warn" dot>Data baru</SkPill>
          <SkPill>Tidak yakin</SkPill>
          <SkPill tone="brand">10% off</SkPill>
        </div>
      </div>

      <div>
        <div className="sk-overline" style={{ marginBottom: 10 }}>Buttons</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SkButton variant="primary" size="lg" full>Primary action</SkButton>
          <SkButton variant="secondary" size="lg" full>Secondary</SkButton>
          <SkButton variant="brand" size="lg" full>Brand · Belanja</SkButton>
        </div>
      </div>
    </div>
  );
}

function CardLabCanvas({ children }) {
  return (
    <div className="sk-screen" style={{
      width: "100%", height: "100%", padding: 24,
      borderRadius: 6, border: "1px solid var(--sk-line)",
      display: "flex", alignItems: "flex-start",
    }}>
      <div style={{ width: "100%" }}>
        {children}
      </div>
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
