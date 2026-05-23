// belanja.jsx — The Belanja Card signature component and its variants.
// Four variants explore: editorial restraint (hardened), paper warmth,
// compact density, and pasar-thematic identity.

const I_bc = window.SkIcons;
const SG   = window.SkGlyphs;

// ─────────────── Sample data ───────────────
const BELANJA_ITEMS = [
  { name: "Lele",       qty: 24, unit: "ekor",  base: 30, prevLeft: 5,  trend: "down", delta: "−6"  },
  { name: "Ayam",       qty: 12, unit: "ekor",  base: 10, prevLeft: 0,  trend: "up",   delta: "+2", note: "habis 14:00" },
  { name: "Tahu",       qty: 14, unit: "pcs",   base: 20, prevLeft: 8,  trend: "down", delta: "−6"  },
  { name: "Tempe",      qty: 8,  unit: "papan", base: 8,  prevLeft: 1,  trend: "flat", delta: "0"   },
  { name: "Cabai rawit",qty: 250,unit: "g",     base: 300,prevLeft: 50, trend: "down", delta: "−50" },
];

// ─────────────── Belanja Card · Editorial (v1, default, HARDENED) ───────────────
//
// Hardening pass adds:
//   · DawnRibbon — thematic atmospheric strip (sun + rooftop horizon + weather)
//     replaces the small free-floating weather pill. Adapts to Subuh.
//   · Per-item glyphs — small ink-stamp marks (lele/ayam/tahu/tempe/cabai)
//     give items visual identity without busy iconography.
//   · TallyStamp — gives the item count weight in the hero.
//   · SignatureSeal — small inked footer mark, the AI's "signature".
function BelanjaCardEditorial({ animate = true, items = BELANJA_ITEMS, day = "Selasa", date = "20 Mei", subuh = false, weather = "rain" }) {
  const total = items.length;
  return (
    <div className="sk-card sk-grain" style={{
      padding: 0, overflow: "hidden",
      boxShadow: "var(--sk-shadow-card), 0 4px 16px rgba(26,22,17,0.04)",
    }}>
      {/* Hero — title + tally */}
      <div style={{ padding: "18px 18px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sk-display" style={{ fontSize: 13, lineHeight: 1, color: "var(--sk-text-2)", marginBottom: 4 }}>
              Belanja besok
            </div>
            <div style={{
              fontSize: 22, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.018em",
              marginTop: 2,
            }}>
              {day}, {date}
            </div>
          </div>
          <SG.TallyStamp count={total} />
        </div>

        {/* Dawn Ribbon — thematic atmospheric strip */}
        <div style={{ marginTop: 14 }}>
          <SG.DawnRibbon weather={weather} subuh={subuh} day={day} date={date} time="03:12" />
        </div>
      </div>

      {/* Items — now with leading glyph slot */}
      <div style={{ padding: "0 18px" }}>
        {items.map((it, i) => {
          const G = SG.glyphFor(it.name);
          return (
            <div key={it.name} style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              alignItems: "center", gap: 12,
              padding: "13px 0",
              borderBottom: i < items.length - 1 ? "1px solid var(--sk-line)" : "none",
              animation: animate ? `sk-rise 520ms var(--sk-ease) ${120 + i*55}ms both` : "none",
            }}>
              {/* Glyph slot — small ink stamp, currentColor inherits text-3 muted */}
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "var(--sk-surface-2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--sk-text-2)",
                flexShrink: 0,
              }}>
                {G ? <G size={22} /> : <I_bc.shop size={16} />}
              </div>
              {/* Name + meta */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.005em" }}>{it.name}</div>
                <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 2, lineHeight: 1.3 }}>
                  {it.note
                    ? `${it.note} · base ${it.base}`
                    : `kemarin ${it.base} → sisa ${it.prevLeft}`}
                </div>
              </div>
              {/* Qty + delta */}
              <div style={{ textAlign: "right" }}>
                <div className="sk-mono" style={{
                  fontSize: 22, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1,
                }}>
                  {animate
                    ? <SkCountUp to={it.qty} duration={600 + i*60} />
                    : it.qty}
                  <span style={{
                    fontSize: 12, color: "var(--sk-text-3)", marginLeft: 4,
                    fontWeight: 500, fontFamily: "var(--sk-font)", letterSpacing: 0,
                  }}>{it.unit}</span>
                </div>
                <div className="sk-mono" style={{
                  fontSize: 12,
                  color: it.trend === "down" ? "var(--sk-success)" :
                         it.trend === "up"   ? "var(--sk-warn)" :
                         "var(--sk-text-3)",
                }}>{it.delta}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reasoning — a quiet margin note */}
      <div style={{
        margin: "14px 18px 0", padding: "14px 14px",
        background: "var(--sk-surface-2)", borderRadius: 10,
        fontSize: 13.5, lineHeight: 1.55, color: "var(--sk-text-2)",
        position: "relative",
      }}>
        {/* small inked rule-bar on the left — margin-note feel */}
        <div style={{
          position: "absolute", left: 0, top: 14, bottom: 14, width: 2,
          background: "var(--sk-text-3)", opacity: 0.35, borderRadius: 1,
        }} />
        Lele kemarin sisa 5 dari 30, jadi besok dikurangi. Ayam habis jam 2 siang —
        kemungkinan kurang. Sore hujan, biasanya ramai turun ~10%.
      </div>

      {/* Footer — signed by Stockast */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px 14px",
        marginTop: 4,
      }}>
        <SG.SignatureSeal time="03:12" confidence="high" />
        <SkPill tone="success" dot>Pola jelas · 7 hari</SkPill>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 14px 14px" }}>
        <SkButton variant="primary" size="lg" full
          leading={<I_bc.whatsapp size={18} />}>
          Salin ke WhatsApp
        </SkButton>
      </div>
    </div>
  );
}

// ─────────────── Belanja Card · Warm hand-feel (v2) ───────────────
// Pushes the warmth: stronger paper grain, larger serif moment, cream surface,
// item rows with rule-line-paper baseline rhythm.
function BelanjaCardWarm({ items = BELANJA_ITEMS, day = "Selasa", date = "20 Mei" }) {
  return (
    <div className="sk-card sk-grain" style={{
      padding: 0, overflow: "hidden",
      background: "var(--sk-surface-2)",
      border: "1px solid var(--sk-line-strong)",
      "--sk-grain": 0.09,
    }}>
      <div style={{ padding: "20px 20px 4px", textAlign: "left" }}>
        <div className="sk-display" style={{
          fontSize: 26, lineHeight: 1.1, color: "var(--sk-text)",
        }}>
          Belanja besok,
        </div>
        <div style={{
          fontSize: 26, lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.022em",
          fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
        }}>
          {day} {date}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <SkWeatherChip kind="rain" time="Sore" />
          <SkPill tone="success" dot>Pola jelas</SkPill>
        </div>
      </div>

      <div style={{ padding: "16px 20px 4px", borderTop: "1px solid var(--sk-line)", marginTop: 16 }}>
        {items.map((it, i) => (
          <div key={it.name} style={{
            display: "grid", gridTemplateColumns: "1fr auto",
            alignItems: "baseline", padding: "12px 0",
            borderBottom: i < items.length - 1 ? "1px dashed var(--sk-line-strong)" : "none",
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{it.name}</div>
              <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 2 }}>
                {it.note ? it.note : `kemarin ${it.base}, sisa ${it.prevLeft}`}
              </div>
            </div>
            <div className="sk-mono" style={{ fontSize: 22, fontWeight: 600 }}>
              {it.qty} <span style={{ fontSize: 12, color: "var(--sk-text-3)", fontFamily: "var(--sk-font)", fontWeight: 500, letterSpacing: 0 }}>{it.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        margin: "12px 20px 0",
        fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
        fontSize: 14, lineHeight: 1.55, color: "var(--sk-text-2)",
      }}>
        “Sore hujan, biasanya ramai turun sedikit. Aku kurangi lele 6 ekor dari kemarin.”
      </div>

      <div style={{ padding: "16px 14px 14px" }}>
        <SkButton variant="brand" size="lg" full
          leading={<I_bc.whatsapp size={18} />}>
          Salin ke WhatsApp
        </SkButton>
      </div>
    </div>
  );
}

// ─────────────── Belanja Card · Compact (v3) ───────────────
// Higher density. Fits more items, less hero. Closer to a Linear "table row" feel.
function BelanjaCardCompact({ items = BELANJA_ITEMS, day = "Selasa", date = "20 Mei" }) {
  return (
    <div className="sk-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 16px",
        borderBottom: "1px solid var(--sk-line)",
      }}>
        <div>
          <div className="sk-overline">Belanja</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{day} {date}</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <SkPill tone="success" dot>Pola jelas</SkPill>
        </div>
      </div>

      <div>
        {items.map((it, i) => (
          <div key={it.name} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto",
            alignItems: "center", gap: 12,
            padding: "11px 16px",
            borderBottom: i < items.length - 1 ? "1px solid var(--sk-line)" : "none",
            fontSize: 14,
          }}>
            <span className="sk-mono" style={{
              fontSize: 17, fontWeight: 600, color: "var(--sk-text)",
              minWidth: 36, textAlign: "right",
            }}>{it.qty}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</div>
              <div style={{ fontSize: 11, color: "var(--sk-text-3)" }}>{it.unit} · base {it.base}</div>
            </div>
            <span className="sk-mono" data-trend={it.trend}
              style={{
                fontSize: 12,
                color: it.trend === "down" ? "var(--sk-success)" :
                       it.trend === "up"   ? "var(--sk-warn)" :
                       "var(--sk-text-3)",
              }}>{it.delta}</span>
          </div>
        ))}
      </div>

      <div style={{
        display: "flex", gap: 8, padding: 12,
        borderTop: "1px solid var(--sk-line)",
        background: "var(--sk-surface-2)",
      }}>
        <SkButton variant="ghost" size="md" style={{ flex: 1 }} leading={<I_bc.edit size={16} />}>Atur</SkButton>
        <SkButton variant="primary" size="md" style={{ flex: 2 }}
          leading={<I_bc.whatsapp size={16} />}>Salin ke WA</SkButton>
      </div>
    </div>
  );
}

// ─────────────── Belanja Card · Pasar (v4 — thematic, pushed identity) ───────────────
//
// The hardest-leaning variant. Items are grouped by category (Protein,
// Pendamping, Bumbu); each gets a larger glyph; the hero has a full
// dawn ribbon AND a printed-receipt feel via dashed rules; the footer
// carries a signature seal.
function BelanjaCardPasar({ items = BELANJA_ITEMS, day = "Selasa", date = "20 Mei", weather = "rain", subuh = false }) {
  const groups = items.reduce((acc, it) => {
    const cat = SG.categoryFor(it.name);
    (acc[cat] = acc[cat] || []).push(it);
    return acc;
  }, {});
  const ORDER = ["Protein", "Pendamping", "Bumbu", "Lainnya"];
  const orderedGroups = ORDER.filter(c => groups[c]).map(c => [c, groups[c]]);

  return (
    <div className="sk-card sk-grain" style={{
      padding: 0, overflow: "hidden",
      "--sk-grain": 0.08,
      background: "var(--sk-surface)",
      border: "1px solid var(--sk-line-strong)",
      boxShadow: "var(--sk-shadow-card), 0 6px 22px rgba(26,22,17,0.05)",
    }}>
      {/* Receipt-style centered header */}
      <div style={{ padding: "16px 18px 0", textAlign: "center" }}>
        <div className="sk-display" style={{
          fontSize: 12, color: "var(--sk-text-2)", letterSpacing: "0.02em",
        }}>— belanja besok —</div>
        <div style={{
          fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
          fontSize: 28, fontWeight: 600, letterSpacing: "-0.022em",
          lineHeight: 1.1, marginTop: 4,
        }}>
          {day} {date}
        </div>
      </div>

      {/* Dawn ribbon */}
      <div style={{ padding: "14px 18px 4px" }}>
        <SG.DawnRibbon weather={weather} subuh={subuh} day={day} date={date} time="03:12" />
      </div>

      {/* Grouped items */}
      <div style={{ padding: "4px 18px 0" }}>
        {orderedGroups.map(([cat, list]) => (
          <div key={cat}>
            <SG.CategoryBar label={cat} count={list.length} />
            {list.map((it, i) => {
              const G = SG.glyphFor(it.name);
              return (
                <div key={it.name} style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr auto",
                  alignItems: "center", gap: 12,
                  padding: "12px 0",
                  borderBottom: i < list.length - 1 ? "1px dashed var(--sk-line-strong)" : "none",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: "var(--sk-surface-2)",
                    border: "1px solid var(--sk-line)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--sk-text-2)",
                  }}>
                    {G ? <G size={28} /> : <I_bc.shop size={20} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.005em" }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 2, lineHeight: 1.3 }}>
                      {it.note ? it.note : `kemarin ${it.base} → sisa ${it.prevLeft}`}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="sk-mono" style={{
                      fontSize: 22, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1,
                    }}>
                      {it.qty}
                      <span style={{
                        fontSize: 12, color: "var(--sk-text-3)", marginLeft: 4,
                        fontWeight: 500, fontFamily: "var(--sk-font)", letterSpacing: 0,
                      }}>{it.unit}</span>
                    </div>
                    <div className="sk-mono" style={{
                      fontSize: 11.5,
                      color: it.trend === "down" ? "var(--sk-success)" :
                             it.trend === "up"   ? "var(--sk-warn)" :
                             "var(--sk-text-3)",
                    }}>{it.delta}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Italic margin note */}
      <div style={{
        margin: "16px 18px 0", padding: "12px 14px",
        borderTop: "1px dashed var(--sk-line-strong)",
        borderBottom: "1px dashed var(--sk-line-strong)",
        fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
        fontSize: 14, lineHeight: 1.55, color: "var(--sk-text-2)",
      }}>
        “Sore hujan, ramai turun sedikit. Aku kurangi lele 6 ekor dari kemarin.”
      </div>

      {/* Footer */}
      <div style={{
        padding: "14px 18px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <SG.SignatureSeal time="03:12" confidence="high" />
        <SkPill tone="success" dot>Pola jelas · 7 hari</SkPill>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <SkButton variant="brand" size="lg" full
          leading={<I_bc.whatsapp size={18} />}>
          Salin ke WhatsApp
        </SkButton>
      </div>
    </div>
  );
}

Object.assign(window, { BelanjaCardEditorial, BelanjaCardWarm, BelanjaCardCompact, BelanjaCardPasar, BELANJA_ITEMS });
