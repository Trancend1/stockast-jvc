// ui.jsx — Stockast shared UI primitives.
// All components map cleanly to shadcn/Tailwind in production:
//   SkButton  -> <Button>
//   SkCard    -> <Card>
//   SkPill    -> <Badge>
//   SkInput   -> <Input>
//   SkTopBar  -> sticky header
//   SkBottomNav -> bottom nav
//   SkSheet   -> <Sheet>
// The classnames map to tokens.css; nothing here invents new structure.

const { useState, useEffect, useRef } = React;
const I = window.SkIcons;

// ─────────────── Atoms ───────────────

function SkButton({ children, variant = "secondary", size = "md", full, leading, trailing, onClick, style }) {
  return (
    <button className="sk-btn"
      data-variant={variant} data-size={size} data-full={full ? "true" : undefined}
      onClick={onClick} style={style}>
      {leading}
      <span>{children}</span>
      {trailing}
    </button>
  );
}

function SkCard({ children, tone, style, signature }) {
  return (
    <div className={"sk-card" + (signature ? " sk-grain" : "")} data-tone={tone} style={style}>
      {children}
    </div>
  );
}

function SkPill({ children, tone, dot, style }) {
  return (
    <span className="sk-pill" data-tone={tone} style={style}>
      {dot && <i className="sk-dot" />}
      {children}
    </span>
  );
}

function SkInput({ value, onChange, placeholder, type = "text", style, inputMode, autoFocus }) {
  return (
    <input className="sk-input" type={type} value={value} onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder} inputMode={inputMode} autoFocus={autoFocus} style={style}
      autoCapitalize="off" autoCorrect="off" spellCheck={false} />
  );
}

function SkLabel({ children, htmlFor, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
      <label htmlFor={htmlFor} style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em" }}>{children}</label>
      {hint && <span style={{ fontSize: 12, color: "var(--sk-text-3)", lineHeight: 1.4 }}>{hint}</span>}
    </div>
  );
}

function SkOverline({ children, style }) {
  return <div className="sk-overline" style={style}>{children}</div>;
}

function SkDivider({ inset = 0, style }) {
  return <hr className="sk-hr" style={{ marginLeft: inset, marginRight: inset, ...style }} />;
}

function SkThinking() {
  return <span className="sk-thinking" aria-label="thinking"><i /><i /><i /></span>;
}

// ─────────────── Top bar (shared, sticky) ───────────────
//
// Modes:
//   default — "Warung Bu Yati" + date + tiny status dot
//   task    — back arrow + title (for fullscreen tasks)
function SkTopBar({ mode = "default", title, warungName = "Bu Yati", date, status, onBack, trailing }) {
  if (mode === "task") {
    return (
      <div className="sk-topbar" style={{ paddingTop: 8, paddingBottom: 8 }}>
        <button onClick={onBack} className="sk-btn" data-variant="ghost" data-size="sm"
          style={{ width: 36, height: 36, padding: 0, marginLeft: -8 }}>
          <I.arrowL size={18} />
        </button>
        <div style={{ flex: 1, textAlign: "center", fontSize: 15, fontWeight: 600 }}>{title}</div>
        <div style={{ width: 36 }}>{trailing}</div>
      </div>
    );
  }
  return (
    <div className="sk-topbar" style={{ paddingTop: 14, paddingBottom: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.012em" }}>Warung {warungName}</span>
          {status && (
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: status === "synced" ? "var(--sk-success)" : "var(--sk-warn)",
              marginTop: 1,
            }} />
          )}
        </div>
        <span style={{ fontSize: 12, color: "var(--sk-text-3)", fontWeight: 500 }}>{date}</span>
      </div>
      <div style={{ display: "flex", gap: 6 }}>{trailing}</div>
    </div>
  );
}

// ─────────────── Bottom nav ───────────────
function SkBottomNav({ active = "home", onChange }) {
  const items = [
    { id: "home",     label: "Beranda",  Icon: I.home },
    { id: "catat",    label: "Catat",    Icon: I.note },
    { id: "riwayat",  label: "Riwayat",  Icon: I.history },
    { id: "setelan",  label: "Setelan",  Icon: I.settings },
  ];
  return (
    <div className="sk-nav">
      {items.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <div key={id} className="sk-nav-item" data-active={isActive} onClick={() => onChange?.(id)}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 22 }}>
              <Icon size={20} stroke={isActive ? 1.8 : 1.5} />
              {isActive && (
                <span style={{
                  position: "absolute", bottom: -3,
                  width: 4, height: 4, borderRadius: "50%", background: "var(--sk-brand)",
                }}/>
              )}
            </div>
            <span style={{ fontWeight: isActive ? 600 : 500 }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────── Bottom sheet (over content) ───────────────
function SkSheet({ children, title, onClose, height = 480 }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "var(--sk-scrim)",
      display: "flex", alignItems: "flex-end",
      animation: "sk-fade 200ms var(--sk-ease) both",
      zIndex: 20,
    }}>
      <div style={{
        width: "100%",
        background: "var(--sk-bg)",
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        animation: "sk-rise 320ms var(--sk-ease) both",
        maxHeight: "92%",
        display: "flex", flexDirection: "column",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 4 }}>
          <span style={{ width: 36, height: 4, borderRadius: 2, background: "var(--sk-line-strong)" }} />
        </div>
        {title && (
          <div style={{
            padding: "12px 20px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: "-0.015em" }}>{title}</h3>
            {onClose && (
              <button onClick={onClose} className="sk-btn" data-variant="ghost" data-size="sm"
                style={{ width: 32, height: 32, padding: 0 }}>
                <I.close size={18} />
              </button>
            )}
          </div>
        )}
        <div style={{ overflow: "auto", padding: "0 20px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─────────────── App scaffold (top bar + content + nav) ───────────────
function SkApp({ children, top, bottom, scroll = true, padded = true }) {
  return (
    <div className="sk-screen" style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      {top}
      <div style={{
        flex: 1, overflow: scroll ? "auto" : "hidden",
        padding: padded ? "4px 18px 24px" : 0,
      }}>{children}</div>
      {bottom}
    </div>
  );
}

// ─────────────── Weather chip (signature, animated) ───────────────
function SkWeatherChip({ kind = "rain", time = "Sore" }) {
  const Icon = kind === "sun" ? I.sun : kind === "cloud" ? I.cloud : I.rain;
  const label =
    kind === "sun" ? "Cerah" :
    kind === "cloud" ? "Berawan" :
    "Hujan";
  return (
    <span className="sk-pill" style={{
      background: "var(--sk-surface-2)", color: "var(--sk-text-2)",
      fontWeight: 500, padding: "5px 10px 5px 8px",
    }}>
      <Icon size={13} />
      <span>{time} · {label}</span>
    </span>
  );
}

// ─────────────── Step dots (onboarding) ───────────────
function SkSteps({ count = 3, current = 0 }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{
          width: i === current ? 18 : 5,
          height: 5,
          borderRadius: 4,
          background: i === current ? "var(--sk-text)" : "var(--sk-line-strong)",
          transition: "width 220ms var(--sk-ease), background-color 220ms var(--sk-ease)",
        }}/>
      ))}
    </div>
  );
}

// ─────────────── Empty state (calm, no clip art) ───────────────
function SkEmpty({ title, body, cta, icon: IconCmp }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      textAlign: "center", padding: "32px 20px", gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--sk-surface-2)", color: "var(--sk-text-3)",
      }}>
        {IconCmp ? <IconCmp size={20} /> : <I.note size={20} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 240 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: "-0.012em" }}>{title}</h3>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--sk-text-2)", lineHeight: 1.45 }}>{body}</p>
      </div>
      {cta}
    </div>
  );
}

// ─────────────── Count-up number (signature) ───────────────
function SkCountUp({ to, duration = 700, className, style }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let raf, start;
    const tick = (t) => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setV(Math.round(to * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span ref={ref} className={className} style={style}>{v}</span>;
}

Object.assign(window, {
  SkButton, SkCard, SkPill, SkInput, SkLabel, SkOverline, SkDivider, SkThinking,
  SkTopBar, SkBottomNav, SkSheet, SkApp, SkWeatherChip, SkSteps, SkEmpty, SkCountUp,
});
