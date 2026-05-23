// notifications.jsx — Notification surfaces.
//
//   · Toast        — small floating message, slides down from top
//   · Banner       — wide inline persistent notice with action
//   · InlineAlert  — in-card alert: info/success/warn/danger
//   · PushPreview  — full mobile lock-screen push card (for mockups)
//   · ActivityDot  — small badge mark for icons (bell, nav)
//
// Tones follow the existing semantic palette in tokens.css.

const Nico = window.SkIcons;

// ─────────────── Toast ───────────────
function Toast({ kind = "success", title, message, onClose }) {
  const conf = TONE_MAP[kind] || TONE_MAP.info;
  const Ic = conf.icon;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "12px 14px",
      background: "var(--sk-surface)",
      border: "1px solid var(--sk-line)",
      borderLeft: `3px solid ${conf.color}`,
      borderRadius: 12,
      boxShadow: "var(--sk-shadow-lift)",
      maxWidth: 340,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: conf.soft, color: conf.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Ic size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: "-0.005em" }}>{title}</div>}
        {message && <div style={{ fontSize: 12.5, color: "var(--sk-text-2)", marginTop: 2, lineHeight: 1.4 }}>{message}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} className="sk-btn" data-variant="ghost" data-size="sm"
          style={{ width: 28, height: 28, padding: 0, marginTop: -2, color: "var(--sk-text-3)" }}>
          <Nico.close size={14} />
        </button>
      )}
    </div>
  );
}

// ─────────────── Banner ───────────────
function Banner({ kind = "info", title, message, action }) {
  const conf = TONE_MAP[kind] || TONE_MAP.info;
  const Ic = conf.icon;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 14px",
      background: conf.soft,
      borderRadius: 10,
      color: "var(--sk-text)",
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: "var(--sk-surface)", color: conf.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 0 0 1px " + conf.color + "22",
      }}>
        <Ic size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 13.5, fontWeight: 700, color: conf.color }}>{title}</div>}
        {message && <div style={{ fontSize: 12.5, color: "var(--sk-text-2)", marginTop: 1, lineHeight: 1.4 }}>{message}</div>}
      </div>
      {action}
    </div>
  );
}

// ─────────────── InlineAlert ───────────────
function InlineAlert({ kind = "warn", children, title }) {
  const conf = TONE_MAP[kind] || TONE_MAP.warn;
  const Ic = conf.icon;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "10px 12px",
      border: `1px dashed ${conf.color}`,
      borderRadius: 8,
      color: conf.color,
      background: conf.soft,
      fontSize: 12.5,
      lineHeight: 1.45,
    }}>
      <Ic size={14} style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>}
        <div style={{ color: "var(--sk-text-2)" }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────── PushPreview ───────────────
// Full mobile lock-screen-style push card, used in marketing mockups.
function PushPreview({ appName = "Stockast", time = "03:12", title, message }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "10px 12px 12px",
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(0,0,0,0.05)",
      borderRadius: 14,
      boxShadow: "0 8px 22px rgba(0,0,0,0.15)",
      maxWidth: 320,
    }}>
      {/* app glyph */}
      <div style={{
        width: 30, height: 30, borderRadius: 7,
        background: "var(--sk-text)", color: "var(--sk-bg)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 14, letterSpacing: "-0.04em",
        flexShrink: 0,
      }}>S</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          fontSize: 11, color: "#3a3a3a", marginBottom: 2,
        }}>
          <span style={{ fontWeight: 600 }}>{appName.toUpperCase()}</span>
          <span>{time}</span>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1611", letterSpacing: "-0.005em" }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "#3a3328", marginTop: 2, lineHeight: 1.35 }}>{message}</div>
      </div>
    </div>
  );
}

// ─────────────── ActivityDot ───────────────
// A small badge mark on top-right of an icon container.
function ActivityDot({ count, tone = "danger", size = 16 }) {
  const color =
    tone === "danger"  ? "var(--sk-danger)"  :
    tone === "warn"    ? "var(--sk-warn)"    :
    tone === "success" ? "var(--sk-success)" :
                         "var(--sk-brand)";
  return (
    <span style={{
      position: "absolute", top: -4, right: -4,
      minWidth: count ? size : 8,
      height: count ? size : 8,
      padding: count ? "0 4px" : 0,
      borderRadius: 999,
      background: color,
      color: "#FFF",
      fontSize: 10, fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 0 0 2px var(--sk-bg)",
      lineHeight: 1,
    }}>{count}</span>
  );
}

// ─────────────── Tone map ───────────────
const TONE_MAP = {
  info:    { color: "var(--sk-text)",    soft: "var(--sk-surface-2)",   icon: Nico.info  },
  success: { color: "var(--sk-success)", soft: "var(--sk-success-soft)", icon: Nico.checkCircle },
  warn:    { color: "var(--sk-warn)",    soft: "var(--sk-warn-soft)",    icon: Nico.warnTriangle },
  danger:  { color: "var(--sk-danger)",  soft: "var(--sk-danger-soft)",  icon: Nico.closeCircle },
  brand:   { color: "var(--sk-brand)",   soft: "var(--sk-brand-soft)",   icon: Nico.spark },
};

window.SkNotify = {
  Toast, Banner, InlineAlert, PushPreview, ActivityDot,
};
