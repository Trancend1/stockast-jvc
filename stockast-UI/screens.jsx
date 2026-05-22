// screens.jsx — Stockast app screens (refined).
// Each screen returns a self-contained block intended to be dropped into
// a device frame (IOSDevice / AndroidDevice) with title prop omitted —
// we render our own SkTopBar.

const I_s = window.SkIcons;
const { useState: useState_s } = React;

// ─────────────── Onboarding — Welcome ───────────────
function ScreenOnboardWelcome() {
  return (
    <div className="sk-screen" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "32px 24px 24px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 320 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8,
            background: "var(--sk-text)", color: "var(--sk-bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14, letterSpacing: "-0.04em",
          }}>S</span>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>Stockast</span>
        </div>
        <h1 style={{
          fontSize: 32, fontWeight: 700, letterSpacing: "-0.025em",
          lineHeight: 1.1, margin: 0, marginBottom: 12,
        }}>
          Halo. Yuk siapin{" "}
          <span className="sk-display" style={{ fontSize: 32 }}>warungmu</span>.
        </h1>
        <p style={{
          fontSize: 15, color: "var(--sk-text-2)", lineHeight: 1.55, margin: 0,
        }}>
          Tiga langkah singkat — nama, lokasi, menu utama. Selesai dalam satu menit.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SkButton variant="primary" size="lg" full trailing={<I_s.arrowR size={18} />}>
          Mulai
        </SkButton>
        <button className="sk-btn" data-variant="ghost"
          style={{ fontSize: 13, color: "var(--sk-text-2)", fontWeight: 500 }}>
          Sudah punya akun
        </button>
      </div>
    </div>
  );
}

// ─────────────── Onboarding — Step (Nama / Lokasi / Menu) ───────────────
// Sweetened with a tiny ink-stamp decoration above the heading.
// Decoration palette is hardcoded — does not respond to Subuh.
function ScreenOnboardStep({ step = 1 }) {
  const D = window.OnbDecor || {};
  const config = [
    {
      label: "Nama warungmu?",
      hint: "Yang biasanya pelanggan sebut.",
      placeholder: "Warung Bu Yati",
      value: "Warung Bu Yati",
      Decor: D.nama,
    },
    {
      label: "Lokasinya di mana?",
      hint: "Buat ngecek cuaca lokal nanti.",
      placeholder: "Pilih kota",
      value: "Salatiga",
      isSelect: true,
      Decor: D.lokasi,
    },
    {
      label: "Menu utamamu apa aja?",
      hint: "Pisahkan dengan koma. Bisa diubah kapan saja.",
      placeholder: "pecel lele, ayam goreng, tahu",
      value: "pecel lele, ayam goreng, tahu, tempe, gorengan",
      isTextarea: true,
      Decor: D.menu,
    },
  ][step - 1];

  const Decor = config.Decor;

  return (
    <div className="sk-screen" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="sk-btn" data-variant="ghost" data-size="sm" style={{ width: 36, height: 36, padding: 0, marginLeft: -8 }}>
          <I_s.arrowL size={18} />
        </button>
        <SkSteps count={3} current={step - 1} />
        <span style={{ fontSize: 12, color: "var(--sk-text-3)", fontWeight: 500 }}>{step} / 3</span>
      </div>

      <div style={{ flex: 1, padding: "20px 24px 24px", display: "flex", flexDirection: "column" }}>
        {/* Decoration — small ink stamp, hands off Subuh */}
        {Decor && (
          <div style={{
            height: 96, marginBottom: 18,
            display: "flex", alignItems: "center", justifyContent: "flex-start",
            opacity: 0.92,
          }}>
            <div style={{ width: 200, height: "100%" }}>
              <Decor />
            </div>
          </div>
        )}

        <h2 style={{
          fontSize: 24, fontWeight: 700, letterSpacing: "-0.022em", margin: 0,
          marginBottom: 8,
        }}>{config.label}</h2>
        <p style={{ fontSize: 14, color: "var(--sk-text-2)", margin: 0, marginBottom: 20 }}>{config.hint}</p>

        {config.isTextarea ? (
          <textarea
            className="sk-input"
            defaultValue={config.value}
            style={{
              height: 110, padding: "12px 14px", lineHeight: 1.5,
              resize: "none", fontFamily: "inherit",
            }}
          />
        ) : config.isSelect ? (
          <div className="sk-input" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <span>{config.value}</span>
            <I_s.chevronD size={16} stroke={2} />
          </div>
        ) : (
          <SkInput value={config.value} placeholder={config.placeholder} />
        )}

        {step === 3 && (
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["pecel lele", "ayam goreng", "tahu", "tempe", "gorengan"].map(t => (
              <SkPill key={t} style={{ background: "var(--sk-surface-2)" }}>{t}</SkPill>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "0 18px 22px" }}>
        <SkButton variant="primary" size="lg" full trailing={step === 3 ? null : <I_s.arrowR size={18} />}>
          {step === 3 ? "Yuk mulai" : "Lanjut"}
        </SkButton>
      </div>
    </div>
  );
}

// ─────────────── Dashboard — default ───────────────
function ScreenDashboard({ showPromo = true, subuh = false }) {
  // Subscribe to tweak state so the dashboard can swap Belanja variants
  const [, setTick] = useState_s(0);
  React.useEffect(() => {
    const fn = () => setTick(x => x + 1);
    window.addEventListener("sk:tweaks", fn);
    return () => window.removeEventListener("sk:tweaks", fn);
  }, []);
  const sk = window.__sk || {};
  const variant = sk.belanjaVariant || "editorial";
  const weather = sk.weather || "rain";
  const isSubuh = !!sk.subuh;
  const promo   = sk.promoCard !== false ? showPromo : false;
  const Belanja = variant === "pasar" ? BelanjaCardPasar : BelanjaCardEditorial;

  return (
    <SkApp
      top={<SkTopBar warungName="Bu Yati" date="Senin, 19 Mei" status="synced"
        trailing={<>
          <button className="sk-btn" data-variant="ghost" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}>
            <I_s.moon size={18} />
          </button>
        </>} />}
      bottom={<SkBottomNav active="home" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* AI status row — small typographic seal */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2px 4px" }}>
          <span className="sk-eyebrow">Rekomendasi hari ini</span>
          <span style={{ fontSize: 11.5, color: "var(--sk-text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span className="sk-thinking" style={{ color: "var(--sk-success)" }}><i/><i/><i/></span>
            Diperbarui 06:12
          </span>
        </div>

        <Belanja animate={true} weather={weather} subuh={isSubuh} />

        {promo && (
          <div className="sk-card" data-tone="ghost" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "var(--sk-warn-soft)", color: "var(--sk-warn)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <I_s.info size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Promo aja?</div>
              <div style={{ fontSize: 12, color: "var(--sk-text-2)", lineHeight: 1.4 }}>
                Tahu masih banyak. Bikin promo sore biar gak nyangkut.
              </div>
            </div>
            <I_s.chevronR size={16} stroke={2} style={{ color: "var(--sk-text-3)" }}/>
          </div>
        )}

        {/* Pola Mingguan */}
        <SkCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div className="sk-overline">Pola mingguan</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                Senin biasanya <span style={{ color: "var(--sk-success)" }}>+12%</span>
              </div>
            </div>
            <I_s.chevronR size={16} stroke={2} style={{ color: "var(--sk-text-3)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 56 }}>
            {[
              { d: "Sn", v: 28, active: true },
              { d: "Sl", v: 22 },
              { d: "Rb", v: 24 },
              { d: "Km", v: 26 },
              { d: "Jm", v: 32 },
              { d: "Sb", v: 38 },
              { d: "Mg", v: 30 },
            ].map((b, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: "100%",
                  height: `${b.v * 1.4}px`,
                  background: b.active ? "var(--sk-text)" : "var(--sk-surface-3)",
                  borderRadius: 3,
                }} />
                <span style={{ fontSize: 10.5, color: b.active ? "var(--sk-text)" : "var(--sk-text-3)", fontWeight: b.active ? 700 : 500 }}>{b.d}</span>
              </div>
            ))}
          </div>
        </SkCard>
      </div>
    </SkApp>
  );
}

// ─────────────── Dashboard — empty / new user ───────────────
function ScreenDashboardEmpty() {
  const SG = window.SkGlyphs;
  return (
    <SkApp
      top={<SkTopBar warungName="Bu Yati" date="Senin, 19 Mei" />}
      bottom={<SkBottomNav active="home" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span className="sk-eyebrow" style={{ paddingLeft: 2 }}>Mulai hari ini</span>

        <SkCard signature style={{
          padding: "22px 18px 22px", textAlign: "left",
          background: "var(--sk-surface)",
        }}>
          {/* Small atmospheric strip — same family as the Belanja Card hero */}
          <div style={{ marginBottom: 14 }}>
            <SG.DawnRibbon weather="cloud" subuh={false} day="Senin" date="19 Mei" time="03:08" />
          </div>
          <div className="sk-display" style={{ fontSize: 18, color: "var(--sk-text-2)" }}>
            Belanja besok belum dihitung.
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.55, color: "var(--sk-text-2)", marginTop: 10 }}>
            Catat dulu apa yang habis hari ini. Tiga hari ke depan, rekomendasi
            akan muncul otomatis di sini.
          </div>
          <div style={{ marginTop: 18 }}>
            <SkButton variant="primary" size="lg" full leading={<I_s.note size={17} />}>
              Catat hari ini
            </SkButton>
          </div>
        </SkCard>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <SkCard tone="muted" style={{ padding: 14 }}>
            <I_s.history size={18} stroke={1.6} />
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>Lihat contoh</div>
            <div style={{ fontSize: 11.5, color: "var(--sk-text-3)", marginTop: 2 }}>Belanja card seperti apa</div>
          </SkCard>
          <SkCard tone="muted" style={{ padding: 14 }}>
            <I_s.mic size={18} stroke={1.6} />
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>Coba suara</div>
            <div style={{ fontSize: 11.5, color: "var(--sk-text-3)", marginTop: 2 }}>Catat tanpa mengetik</div>
          </SkCard>
        </div>
      </div>
    </SkApp>
  );
}

// ─────────────── Catat — stock input fullscreen (HARDENED) ───────────────
//
// Hardening: the surface now reads as a notebook page — subtle ruled
// horizontal lines, a NotebookFold ink-mark at the header, and a small
// dated ledger stub on the right. The "Tulis apa adanya. Aku yang
// nangkep." line gains a quill-nib mark; the thinking treatment becomes
// a more poetic margin-note.
function ScreenCatat({ stage = "input" }) {
  const SG = window.SkGlyphs;
  const NotebookFold = SG.NotebookFold;
  const isThinking = stage === "thinking";
  return (
    <SkApp
      top={<SkTopBar mode="task" title="Catat hari ini"
        trailing={<button className="sk-btn" data-variant="ghost" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}>
          <I_s.mic size={18} />
        </button>} />}
      bottom={null}
      padded={false}
    >
      <div style={{ padding: "8px 18px 18px", display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Notebook header — fold mark + ledger date stub */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 10, padding: "4px 2px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--sk-text-2)" }}>
            <NotebookFold size={32} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{
                fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
                fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em",
              }}>Tulis apa adanya.</div>
              <div style={{ fontSize: 11.5, color: "var(--sk-text-3)" }}>
                Aku yang nangkep — bahasa apa saja.
              </div>
            </div>
          </div>
          <div style={{
            border: "1px solid var(--sk-line-strong)",
            borderRadius: 6, padding: "3px 8px",
            display: "flex", flexDirection: "column", alignItems: "center",
            background: "var(--sk-surface)",
          }}>
            <span className="sk-mono" style={{
              fontSize: 15, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1,
            }}>19</span>
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--sk-text-3)", marginTop: 1,
            }}>MEI</span>
          </div>
        </div>

        {/* Notebook page — ruled background + margin rule */}
        <div style={{
          flex: 1,
          background: "var(--sk-surface)",
          border: "1px solid var(--sk-line)",
          borderRadius: 14,
          padding: "16px 16px 16px 28px",
          position: "relative",
          minHeight: 200,
          backgroundImage: `
            linear-gradient(to right, transparent 22px, var(--sk-brand) 22px, var(--sk-brand) 23px, transparent 23px),
            repeating-linear-gradient(to bottom, transparent 0, transparent 25px, var(--sk-line) 25px, var(--sk-line) 26px)
          `,
          backgroundSize: "100% 100%, 100% 26px",
          backgroundPosition: "0 0, 0 14px",
          backgroundRepeat: "no-repeat, repeat",
        }}>
          {/* subtle margin rule color softening */}
          <div style={{
            position: "absolute", left: 22, top: 8, bottom: 8, width: 1,
            background: "var(--sk-brand)", opacity: 0.35,
          }} />
          <div style={{
            fontSize: 16, lineHeight: "26px", color: "var(--sk-text)",
            whiteSpace: "pre-wrap", position: "relative",
            fontFamily: "var(--sk-font-serif)",
          }}>
            lele sisa 5 dari 30 ekor{"\n"}
            ayam habis jam 2{"\n"}
            tahu sisa 8 dari 20{"\n"}
            sore hujan{" "}
            <span style={{
              display: "inline-block", width: 1.5, height: 18,
              background: "var(--sk-text)", verticalAlign: "middle",
              animation: "sk-pulse 1.2s var(--sk-ease) infinite",
            }} />
          </div>

          {isThinking && (
            <div style={{
              position: "absolute", left: 16, right: 16, bottom: 14,
              padding: "10px 12px",
              background: "var(--sk-surface-2)",
              borderRadius: 10,
              display: "flex", alignItems: "center", gap: 10,
              fontSize: 13, color: "var(--sk-text-2)",
              fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
            }}>
              <SkThinking />
              <span>Lagi baca catatanmu…</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <span style={{ fontSize: 12, color: "var(--sk-text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span className="sk-thinking" style={{ color: "var(--sk-success)" }}><i/><i/><i/></span>
            4 baris · auto-save
          </span>
          <span className="sk-mono" style={{ fontSize: 12, color: "var(--sk-text-3)" }}>22:14</span>
        </div>

        <div style={{ marginTop: 14 }}>
          <SkButton
            variant="primary"
            size="lg"
            full
            trailing={isThinking ? <SkThinking /> : <I_s.arrowR size={18} />}
          >
            {isThinking ? "Sebentar…" : "Baca catatan ini"}
          </SkButton>
        </div>
      </div>
    </SkApp>
  );
}

// ─────────────── Parse Confirm — bottom sheet over Catat (HARDENED) ───────────────
//
// Hardening: each parsed item gets the same ink-stamp glyph used on the
// Belanja Card so the user sees a consistent "voice" across screens.
// The cuaca line uses MiniWeather. Above the list, a CapturedStamp
// signals "AI tangkap 4 hal" — the same dialect as SignatureSeal.
function ScreenParseConfirm({ saved = false }) {
  const SG = window.SkGlyphs;
  const parsed = [
    { name: "Lele",  sold: 25, left: 5,  confidence: "high" },
    { name: "Ayam",  sold: 10, left: 0,  confidence: "high",   note: "habis 14:00" },
    { name: "Tahu",  sold: 12, left: 8,  confidence: "high" },
    { name: "Cuaca sore", sold: null, left: null, confidence: "med", asNote: "hujan", weather: "rain" },
  ];
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <ScreenCatat stage="input" />
      <SkSheet title="Nih, yang aku tangkap. Bener?" height={560}>
        {/* Captured stamp header — small inked annotation above the list */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          margin: "-4px 0 10px",
          color: "var(--sk-text-2)",
        }}>
          <SG.CapturedStamp count={parsed.length} label="tangkap" />
          <span style={{
            fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
            fontSize: 12, color: "var(--sk-text-3)",
          }}>cek dulu, baru simpan</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {parsed.map((p, i) => {
            const G = !p.asNote ? SG.glyphFor(p.name) : null;
            return (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: p.asNote ? "40px 1fr auto" : "40px 1fr auto auto",
                gap: 12, alignItems: "center",
                padding: "12px 14px 12px 12px",
                background: "var(--sk-surface)",
                border: "1px solid var(--sk-line)",
                borderRadius: 12,
                borderLeft: p.confidence === "med"
                  ? "3px solid var(--sk-warn)"
                  : "3px solid var(--sk-success)",
                transition: "all 200ms var(--sk-ease)",
              }}>
                {/* Glyph slot */}
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "var(--sk-surface-2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--sk-text-2)",
                }}>
                  {p.weather
                    ? <SG.MiniWeather kind={p.weather} size={22} />
                    : G
                      ? <G size={22} />
                      : <I_s.note size={16} />}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                  {p.asNote && (
                    <div style={{ fontSize: 12, color: "var(--sk-text-3)" }}>catatan: {p.asNote}</div>
                  )}
                  {!p.asNote && (
                    <div style={{ fontSize: 12, color: "var(--sk-text-3)" }}>
                      terjual <b style={{ color: "var(--sk-text-2)" }}>{p.sold}</b>, sisa <b style={{ color: "var(--sk-text-2)" }}>{p.left}</b>
                      {p.note && <span> · {p.note}</span>}
                    </div>
                  )}
                </div>
                {!p.asNote && (
                  <button className="sk-btn" data-variant="ghost" data-size="sm" style={{ height: 30, padding: "0 8px" }}>
                    <I_s.edit size={14} />
                  </button>
                )}
                {p.asNote && (
                  <span className="sk-pill" data-tone="warn" style={{ fontSize: 11 }}>perlu cek</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer — either action row OR a saved confirmation */}
        {saved ? (
          <div style={{
            marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            color: "var(--sk-success)",
          }}>
            <SG.SavedSeal label="Tersimpan" time="22:14" />
            <div style={{
              fontSize: 12, color: "var(--sk-text-3)", textAlign: "center",
              fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
            }}>
              besok 03:00, belanja baru tersusun.
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <SkButton variant="secondary" size="lg" style={{ flex: 1 }}>Ada yang salah</SkButton>
            <SkButton variant="primary" size="lg" style={{ flex: 1.4 }} leading={<I_s.check size={18} />}>
              Simpan
            </SkButton>
          </div>
        )}
      </SkSheet>
    </div>
  );
}

// ─────────────── Riwayat — 7 hari (HARDENED) ───────────────
//
// Hardening: a LedgerStripe header sets the "ledger book" tone; each
// day card now uses serif italic dates, a row of small ink glyphs for
// the items, a MiniWeather mark, and a hairline ledger-line aesthetic.
function ScreenRiwayat() {
  const SG = window.SkGlyphs;
  const days = [
    { date: "Min 18 Mei", num: 18, left: { lele: 5, ayam: 0, tahu: 8 },  hasReco: true,  weather: "rain"  },
    { date: "Sab 17 Mei", num: 17, left: { lele: 2, ayam: 0, tahu: 4 },  hasReco: true,  weather: "sun"   },
    { date: "Jum 16 Mei", num: 16, left: { lele: 0, ayam: 3, tahu: 6 },  hasReco: true,  weather: "sun"   },
    { date: "Kam 15 Mei", num: 15, left: { lele: 7, ayam: 0, tahu: 10 }, hasReco: true,  weather: "cloud" },
    { date: "Rab 14 Mei", num: 14, left: { lele: 4, ayam: 0, tahu: 8 },  hasReco: true,  weather: "rain"  },
    { date: "Sel 13 Mei", num: 13, left: { lele: 6, ayam: 2, tahu: 5 },  hasReco: false, weather: "sun"   },
    { date: "Sen 12 Mei", num: 12, left: { lele: 3, ayam: 0, tahu: 9 },  hasReco: true,  weather: "cloud" },
  ];
  return (
    <SkApp
      top={
        <div className="sk-topbar" style={{ paddingTop: 14, paddingBottom: 10 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.015em" }}>Riwayat</div>
            <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 1 }}>7 hari terakhir</div>
          </div>
          <button className="sk-btn" data-variant="ghost" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}>
            <I_s.refresh size={18} />
          </button>
        </div>
      }
      bottom={<SkBottomNav active="riwayat" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Ledger stripe — the "open book" hero */}
        <SG.LedgerStripe rangeLabel="12 – 18 Mei" avg={28} best="Sabtu" />

        {days.map((d, i) => {
          // Build glyph row from item names (lele, ayam, tahu)
          const itemEntries = Object.entries(d.left);
          return (
            <div key={i} className="sk-card" style={{
              padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              {/* Day numeral block — ledger ticket */}
              <div style={{
                width: 44, flexShrink: 0,
                display: "flex", flexDirection: "column", alignItems: "center",
                paddingRight: 12,
                borderRight: "1px dashed var(--sk-line-strong)",
              }}>
                <span className="sk-mono" style={{
                  fontSize: 22, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1,
                }}>{d.num}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--sk-text-3)", marginTop: 3,
                }}>{d.date.split(" ")[0]}</span>
              </div>

              {/* Main */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
                    fontSize: 14, fontWeight: 600,
                  }}>{d.date.slice(4)}</span>
                  <span style={{ color: "var(--sk-text-3)", display: "inline-flex" }}>
                    <SG.MiniWeather kind={d.weather} size={18} />
                  </span>
                  <div style={{ flex: 1 }} />
                  {d.hasReco
                    ? <SkPill tone="success" dot>OK</SkPill>
                    : <SkPill>kosong</SkPill>}
                </div>
                {/* Glyph + qty row */}
                <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                  {itemEntries.map(([k, v]) => {
                    const G = SG.glyphFor(k);
                    return (
                      <div key={k} style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--sk-text-2)" }}>
                        {G && <G size={18} />}
                        <span style={{ fontSize: 11.5, color: "var(--sk-text-3)" }}>{k}</span>
                        <span className="sk-mono" style={{
                          fontSize: 12, fontWeight: 600,
                          color: v === 0 ? "var(--sk-success)" : "var(--sk-text)",
                        }}>{v}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
          <SkButton variant="ghost" size="sm">Lihat minggu lalu</SkButton>
        </div>
      </div>
    </SkApp>
  );
}

// ─────────────── Settings (HARDENED) ───────────────
//
// Hardening: the profile card hero now uses a WarungMark ink stamp +
// serif italic name. Settings rows are grouped under SectionLabel
// (serif italic dividers: Akun, Tampilan, Tentang). The Subuh row keeps
// its segmented control but gains a small MiniWeather mark mirroring
// the Riwayat dialect. Logo + version footer made a soft seal.
function ScreenSettings() {
  const SG = window.SkGlyphs;
  const Row = ({ icon: Ic, title, detail, trailing, accent }) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px",
      borderBottom: "1px solid var(--sk-line)",
    }}>
      {Ic && (
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: accent ? "var(--sk-brand-soft)" : "var(--sk-surface-2)",
          color: accent ? "var(--sk-brand-ink)" : "var(--sk-text-2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Ic size={16} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600 }}>{title}</div>
        {detail && <div style={{ fontSize: 12, color: "var(--sk-text-3)", marginTop: 1 }}>{detail}</div>}
      </div>
      {trailing}
    </div>
  );
  return (
    <SkApp
      top={
        <div className="sk-topbar" style={{ paddingTop: 14, paddingBottom: 10 }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.015em" }}>Setelan</div>
        </div>
      }
      bottom={<SkBottomNav active="setelan" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Warung hero — WarungMark + serif italic name + small ledger row */}
        <div className="sk-card sk-grain" style={{
          padding: "16px 16px 14px",
          background: "var(--sk-surface)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 12,
              background: "var(--sk-surface-2)",
              border: "1px solid var(--sk-line)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <SG.WarungMark size={48} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
                fontSize: 19, fontWeight: 600, letterSpacing: "-0.015em",
                lineHeight: 1.1,
              }}>Warung Bu Yati</div>
              <div style={{
                fontSize: 12, color: "var(--sk-text-3)", marginTop: 4,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>Salatiga</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>5 menu</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>aktif 7 hari</span>
              </div>
            </div>
            <button className="sk-btn" data-variant="ghost" data-size="sm" style={{ width: 36, height: 36, padding: 0 }}>
              <I_s.edit size={16} />
            </button>
          </div>
        </div>

        {/* Akun group */}
        <div>
          <SG.SectionLabel>Akun</SG.SectionLabel>
          <div className="sk-card" style={{ padding: 0, overflow: "hidden" }}>
            <Row icon={I_s.shop}    title="Nama warung"  detail="Warung Bu Yati"
              trailing={<I_s.chevronR size={16} stroke={2} style={{ color: "var(--sk-text-3)" }}/>} />
            <Row icon={I_s.history} title="Lokasi"       detail="Salatiga, Jawa Tengah"
              trailing={<I_s.chevronR size={16} stroke={2} style={{ color: "var(--sk-text-3)" }}/>} />
            <Row icon={I_s.note}    title="Menu utama"   detail="5 item — pecel lele, ayam goreng…"
              trailing={<I_s.chevronR size={16} stroke={2} style={{ color: "var(--sk-text-3)" }}/>} />
          </div>
        </div>

        {/* Tampilan group */}
        <div>
          <SG.SectionLabel>Tampilan</SG.SectionLabel>
          <div className="sk-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 16px",
              borderBottom: "1px solid var(--sk-line)",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "var(--sk-surface-2)", color: "var(--sk-text-2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <I_s.moon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>Subuh Mode</div>
                <div style={{
                  fontSize: 12, color: "var(--sk-text-3)", marginTop: 1,
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}>
                  <span className="sk-mono">02:00 – 05:30</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span>otomatis</span>
                </div>
              </div>
              <div style={{
                display: "flex", background: "var(--sk-surface-2)", padding: 2, borderRadius: 8,
                fontSize: 12, fontWeight: 600,
              }}>
                {["Auto", "On", "Off"].map((s, i) => (
                  <span key={s} style={{
                    padding: "5px 10px", borderRadius: 6,
                    background: i === 0 ? "var(--sk-surface)" : "transparent",
                    color: i === 0 ? "var(--sk-text)" : "var(--sk-text-3)",
                    boxShadow: i === 0 ? "0 1px 2px rgba(26,22,17,0.04)" : "none",
                  }}>{s}</span>
                ))}
              </div>
            </div>
            <Row icon={I_s.spark}   title="Animasi terbuka" detail="Hidup · halus"
              trailing={<I_s.chevronR size={16} stroke={2} style={{ color: "var(--sk-text-3)" }}/>} />
          </div>
        </div>

        {/* Tentang group */}
        <div>
          <SG.SectionLabel>Tentang</SG.SectionLabel>
          <div className="sk-card" style={{ padding: 0, overflow: "hidden" }}>
            <Row icon={I_s.info}    title="Tentang Stockast" detail="v1.5 · privasi · bantuan"
              trailing={<I_s.chevronR size={16} stroke={2} style={{ color: "var(--sk-text-3)" }}/>} />
            <Row icon={I_s.whatsapp} title="Kontak admin" detail="Bantuan via WhatsApp" accent
              trailing={<I_s.chevronR size={16} stroke={2} style={{ color: "var(--sk-text-3)" }}/>} />
          </div>
        </div>

        {/* Footer seal — "Dibuat untuk pedagang Indonesia" */}
        <div style={{
          textAlign: "center", padding: "8px 0 16px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          color: "var(--sk-text-3)",
        }}>
          <SG.SignatureSeal time="v1.5" confidence="high" />
          <span style={{
            fontFamily: "var(--sk-font-serif)", fontStyle: "italic",
            fontSize: 11.5,
          }}>
            Dibuat untuk pedagang Indonesia · 2026
          </span>
        </div>
      </div>
    </SkApp>
  );
}

// ─────────────── Promo Sheet (over Dashboard) ───────────────
function ScreenPromoSheet() {
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <ScreenDashboard showPromo={true} />
      <SkSheet title="Promo sore — tahu">
        <p style={{ fontSize: 13, color: "var(--sk-text-2)", margin: "0 0 12px" }}>
          Diskon dijaga maksimal 15% biar margin aman.
        </p>
        <textarea
          className="sk-input"
          defaultValue={"Hai! Tahu segar masih banyak ya hari ini.\nKhusus jam 17–19, diskon 10%. Mampir ya 🙏"}
          style={{ height: 130, padding: "12px 14px", lineHeight: 1.55, resize: "none", fontFamily: "inherit" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 12, color: "var(--sk-text-3)" }}>
          <span>10% off · 12 unit · 17:00–19:00</span>
          <button className="sk-btn" data-variant="ghost" data-size="sm" style={{ height: 28, padding: "0 8px", fontSize: 12 }}>
            <I_s.edit size={13} /> Atur
          </button>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <SkButton variant="secondary" size="lg" style={{ flex: 1 }}>Nggak jadi</SkButton>
          <SkButton variant="primary" size="lg" style={{ flex: 1.4 }} leading={<I_s.whatsapp size={18} />}>
            Salin ke WA
          </SkButton>
        </div>
      </SkSheet>
    </div>
  );
}

Object.assign(window, {
  ScreenOnboardWelcome, ScreenOnboardStep,
  ScreenDashboard, ScreenDashboardEmpty,
  ScreenCatat, ScreenParseConfirm,
  ScreenRiwayat, ScreenSettings,
  ScreenPromoSheet,
});
