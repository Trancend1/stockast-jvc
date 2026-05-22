// charts.jsx — Lightweight, scalable data-viz components.
//
//   · Sparkline       — smooth area line, optional gradient fill
//   · BarSeries       — vertical bar series (already shown in dashboard)
//   · CandleSeries    — warung candlesticks: morning open, peak high,
//                       slow low, closing — colored mint(up)/brick(down)
//   · DeltaWidget     — big number + trend arrow + sparkline; the
//                       "ticker tile" of the dashboard
//   · DonutMini       — small donut for item-mix breakdowns
//   · ProgressMeter   — horizontal bar for goal tracking
//   · TallyCounter    — large mono number with subtle label
//
// All SVG-based, accept width/height, color from CSS vars so they
// adapt to Subuh mode automatically.

const C_BRICK = "#F26F1B";
const C_MINT  = "#4DA66E";

// Build SVG path from a series of numbers (0..N)
function buildLinePath(values, w, h, padding = 4) {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = (w - padding * 2) / (values.length - 1 || 1);
  return values.map((v, i) => {
    const x = padding + i * stepX;
    const y = padding + (1 - (v - min) / span) * (h - padding * 2);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

function buildAreaPath(values, w, h, padding = 4) {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = (w - padding * 2) / (values.length - 1 || 1);
  let d = "";
  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = padding + (1 - (v - min) / span) * (h - padding * 2);
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  });
  d += `L ${(w - padding).toFixed(1)} ${(h - padding).toFixed(1)} L ${padding.toFixed(1)} ${(h - padding).toFixed(1)} Z`;
  return d;
}

// ─────────────── Sparkline ───────────────
function Sparkline({
  data = [12, 18, 14, 22, 26, 20, 28, 24, 30, 36, 32, 40],
  width = 120, height = 40,
  stroke = "currentColor", fill = true, trend,
}) {
  const auto = trend != null
    ? (trend === "up" ? C_MINT : trend === "down" ? C_BRICK : "currentColor")
    : stroke;
  const id = "sp-" + Math.random().toString(36).slice(2, 8);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ display: "block" }}>
      {fill && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor={auto} stopOpacity="0.28" />
            <stop offset="100%" stopColor={auto} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={buildAreaPath(data, width, height)} fill={`url(#${id})`} />}
      <path d={buildLinePath(data, width, height)} fill="none" stroke={auto}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* end dot */}
      {(() => {
        const last = data[data.length - 1];
        const min = Math.min(...data);
        const max = Math.max(...data);
        const span = max - min || 1;
        const cx = width - 4;
        const cy = 4 + (1 - (last - min) / span) * (height - 8);
        return <circle cx={cx} cy={cy} r="2.4" fill={auto} />;
      })()}
    </svg>
  );
}

// ─────────────── BarSeries ───────────────
function BarSeries({
  data = [
    { d: "Sn", v: 28, active: true }, { d: "Sl", v: 22 }, { d: "Rb", v: 24 },
    { d: "Km", v: 26 }, { d: "Jm", v: 32 }, { d: "Sb", v: 38 }, { d: "Mg", v: 30 },
  ],
  width = 280, height = 80, showLabels = true,
}) {
  const max = Math.max(...data.map(d => d.v));
  const barW = (width - 6 * (data.length - 1)) / data.length;
  const inner = showLabels ? height - 18 : height;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ display: "block" }}>
      {data.map((b, i) => {
        const x = i * (barW + 6);
        const bh = (b.v / max) * inner;
        return (
          <g key={i}>
            <rect x={x} y={inner - bh} width={barW} height={bh}
                  fill={b.active ? "var(--sk-text)" : "var(--sk-surface-3)"}
                  rx="2" />
            {showLabels && (
              <text x={x + barW / 2} y={height - 4} textAnchor="middle"
                    fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                    fontWeight={b.active ? 700 : 500}
                    fontSize="10.5"
                    fill={b.active ? "var(--sk-text)" : "var(--sk-text-3)"}>
                {b.d}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────── CandleSeries — warung-dialect candlesticks ───────────────
//
// Each candle represents a day's activity in warung shorthand:
//   open  = pagi (morning start)
//   high  = puncak (peak hour)
//   low   = lengang (slow point)
//   close = sore (closing tally)
//
// Up day = close > open → mint body; down day = brick body.
function CandleSeries({
  data = [
    { o: 20, h: 28, l: 18, c: 24 }, { o: 24, h: 30, l: 22, c: 28 },
    { o: 28, h: 32, l: 22, c: 22 }, { o: 22, h: 26, l: 14, c: 18 },
    { o: 18, h: 24, l: 16, c: 22 }, { o: 22, h: 36, l: 20, c: 34 },
    { o: 34, h: 38, l: 28, c: 30 },
  ],
  width = 280, height = 110, labels = ["Sn","Sl","Rb","Km","Jm","Sb","Mg"],
}) {
  const allMin = Math.min(...data.map(d => d.l));
  const allMax = Math.max(...data.map(d => d.h));
  const span = allMax - allMin || 1;
  const PAD = 14;
  const inner = height - PAD - 16;
  const slotW = (width - PAD * 2) / data.length;

  const yScale = (v) => PAD + (1 - (v - allMin) / span) * inner;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
         style={{ display: "block" }}>
      {/* baseline */}
      <line x1={PAD} y1={height - 14} x2={width - PAD} y2={height - 14}
            stroke="var(--sk-line-strong)" strokeWidth="1" strokeLinecap="round" />
      {data.map((d, i) => {
        const up = d.c >= d.o;
        const cx = PAD + slotW * i + slotW / 2;
        const top = yScale(d.h);
        const bot = yScale(d.l);
        const yO = yScale(d.o);
        const yC = yScale(d.c);
        const bodyTop = Math.min(yO, yC);
        const bodyH = Math.max(2, Math.abs(yC - yO));
        const bodyW = slotW * 0.6;
        return (
          <g key={i}>
            {/* wick */}
            <line x1={cx} y1={top} x2={cx} y2={bot}
                  stroke="var(--sk-text)" strokeWidth="1.2" strokeLinecap="round" />
            {/* body */}
            <rect x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH}
                  fill={up ? C_MINT : C_BRICK}
                  stroke="var(--sk-text)" strokeWidth="1.2" />
            {/* label */}
            {labels[i] && (
              <text x={cx} y={height - 2} textAnchor="middle"
                    fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                    fontWeight="500" fontSize="10"
                    fill="var(--sk-text-3)">{labels[i]}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────── DeltaWidget ───────────────
// Big tile: a number + small trend arrow + sparkline trail underneath.
// Use as a "ticker tile" on the dashboard.
function DeltaWidget({
  label = "Hari ini", value = "Rp 624k", deltaLabel = "+12%",
  trend = "up", data, width, height,
}) {
  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const tone =
    trend === "up"   ? "var(--sk-success)" :
    trend === "down" ? "var(--sk-danger)"  :
                       "var(--sk-text-3)";
  return (
    <div style={{
      padding: "14px 14px 10px",
      background: "var(--sk-surface)",
      border: "1px solid var(--sk-line)",
      borderRadius: 12,
      display: "flex", flexDirection: "column", gap: 4,
      width, height,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
        textTransform: "uppercase", color: "var(--sk-text-3)",
      }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span className="sk-mono" style={{
          fontSize: 22, fontWeight: 700, letterSpacing: "-0.04em",
        }}>{value}</span>
        <span className="sk-mono" style={{
          fontSize: 12, fontWeight: 600, color: tone,
        }}>{arrow} {deltaLabel}</span>
      </div>
      <Sparkline data={data} trend={trend} width={140} height={32} />
    </div>
  );
}

// ─────────────── DonutMini ───────────────
//
// Small donut for category mix. Pass values as `[{ label, v, color }, ...]`.
function DonutMini({
  values = [
    { label: "Lele",  v: 36, color: C_BRICK },
    { label: "Ayam",  v: 24, color: "#B68220" },
    { label: "Tahu",  v: 22, color: C_MINT  },
    { label: "Tempe", v: 18, color: "#4A7EA0" },
  ],
  size = 100, thickness = 14, showLegend = false,
}) {
  const total = values.reduce((a, b) => a + b.v, 0) || 1;
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}
           xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx={cx} cy={cy} r={r} fill="none"
                stroke="var(--sk-surface-3)" strokeWidth={thickness} />
        {values.map((s, i) => {
          const frac = s.v / total;
          const dash = `${frac * circ} ${circ}`;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                    stroke={s.color} strokeWidth={thickness}
                    strokeDasharray={dash}
                    strokeDashoffset={-offset}
                    transform={`rotate(-90 ${cx} ${cy})`} />
          );
          offset += frac * circ;
          return el;
        })}
        <text x={cx} y={cy + 4} textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="14" fontWeight="600" fill="var(--sk-text)">{total}</text>
      </svg>
      {showLegend && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
          {values.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              <span style={{ color: "var(--sk-text-2)" }}>{s.label}</span>
              <span className="sk-mono" style={{ color: "var(--sk-text-3)", marginLeft: "auto" }}>
                {Math.round(s.v / total * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────── ProgressMeter ───────────────
function ProgressMeter({ value = 64, max = 100, label, hint, tone = "brand" }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color =
    tone === "success" ? "var(--sk-success)" :
    tone === "warn"    ? "var(--sk-warn)"    :
    tone === "danger"  ? "var(--sk-danger)"  :
                         "var(--sk-brand)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {(label || hint) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          {label && <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>}
          {hint && <span className="sk-mono" style={{ fontSize: 12, color: "var(--sk-text-3)" }}>{hint}</span>}
        </div>
      )}
      <div style={{
        height: 8, borderRadius: 4, background: "var(--sk-surface-3)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${pct}%`, background: color, borderRadius: 4,
          transition: "width 320ms var(--sk-ease)",
        }} />
      </div>
    </div>
  );
}

// ─────────────── TallyCounter ───────────────
function TallyCounter({ value = 24, label = "ekor lele", trend, delta }) {
  const tone =
    trend === "up"   ? "var(--sk-warn)"    :
    trend === "down" ? "var(--sk-success)" :
                       "var(--sk-text-3)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
      <span className="sk-mono" style={{
        fontSize: 38, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1,
      }}>{value}</span>
      <span style={{ fontSize: 12, color: "var(--sk-text-3)" }}>{label}</span>
      {delta && (
        <span className="sk-mono" style={{ fontSize: 11, color: tone, marginTop: 2 }}>
          {delta}
        </span>
      )}
    </div>
  );
}

// ─────────────── HeatStrip — a single-row heatmap ───────────────
// 14-day or 28-day "is it busy?" heat strip. Each cell is a small
// rounded square; intensity scales with v. Used on the dashboard.
function HeatStrip({
  data = Array.from({ length: 28 }, (_, i) => Math.round(Math.random() * 40 + 6)),
  width = 280, height = 28, label,
}) {
  const max = Math.max(...data);
  const cellW = (width - (data.length - 1) * 2) / data.length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <div className="sk-overline">{label}</div>}
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
           xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
           style={{ display: "block" }}>
        {data.map((v, i) => {
          const op = 0.18 + 0.78 * (v / max);
          return (
            <rect key={i} x={i * (cellW + 2)} y={0}
                  width={cellW} height={height} rx="2"
                  fill={C_BRICK} opacity={op.toFixed(2)} />
          );
        })}
      </svg>
    </div>
  );
}

window.SkCharts = {
  Sparkline, BarSeries, CandleSeries,
  DeltaWidget, DonutMini, ProgressMeter, TallyCounter, HeatStrip,
};
