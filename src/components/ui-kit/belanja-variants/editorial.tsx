'use client';

import { IconShop, IconWhatsapp } from '@/components/ui-kit/icons';
import { glyphFor } from '@/components/ui-kit/glyphs';
import { DawnRibbon, SignatureSeal, TallyStamp } from '@/components/ui-kit/illustrations';
import { SkButton, SkCountUp, SkPill } from '@/components/ui-kit/primitives';
import { BELANJA_ITEMS, type BelanjaCardCommonProps, trendColor } from './shared';

export function BelanjaCardEditorial({
  animate = true,
  items = BELANJA_ITEMS,
  day = 'Selasa',
  date = '20 Mei',
  subuh = false,
  weather = 'rain',
}: BelanjaCardCommonProps) {
  const total = items.length;
  return (
    <div
      className="sk-card sk-grain"
      style={{
        padding: 0,
        overflow: 'hidden',
        boxShadow: 'var(--sk-shadow-card), 0 4px 16px rgba(26,22,17,0.04)',
      }}
    >
      <div style={{ padding: '18px 18px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sk-display" style={{ fontSize: 13, lineHeight: 1, color: 'var(--sk-text-2)', marginBottom: 4 }}>
              Belanja besok
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.018em', marginTop: 2 }}>
              {day}, {date}
            </div>
          </div>
          <TallyStamp count={total} />
        </div>
        <div style={{ marginTop: 14 }}>
          <DawnRibbon weather={weather} subuh={subuh} day={day} date={date} time="03:12" />
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        {items.map((it, i) => {
          const G = glyphFor(it.name);
          return (
            <div
              key={it.name}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                alignItems: 'center',
                gap: 12,
                padding: '13px 0',
                borderBottom: i < items.length - 1 ? '1px solid var(--sk-line)' : 'none',
                animation: animate ? `sk-rise 520ms var(--sk-ease) ${120 + i * 55}ms both` : 'none',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--sk-surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sk-text-2)',
                  flexShrink: 0,
                }}
              >
                {G ? <G size={22} /> : <IconShop size={16} />}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.005em' }}>{it.name}</div>
                <div style={{ fontSize: 12, color: 'var(--sk-text-3)', marginTop: 2, lineHeight: 1.3 }}>
                  {it.note ? `${it.note} · base ${it.base}` : `kemarin ${it.base} → sisa ${it.prevLeft}`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="sk-mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                  {animate ? <SkCountUp to={it.qty} duration={600 + i * 60} /> : it.qty}
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--sk-text-3)',
                      marginLeft: 4,
                      fontWeight: 500,
                      fontFamily: 'var(--sk-font)',
                      letterSpacing: 0,
                    }}
                  >
                    {it.unit}
                  </span>
                </div>
                <div className="sk-mono" style={{ fontSize: 12, color: trendColor(it.trend) }}>
                  {it.delta}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          margin: '14px 18px 0',
          padding: '14px 14px',
          background: 'var(--sk-surface-2)',
          borderRadius: 10,
          fontSize: 13.5,
          lineHeight: 1.55,
          color: 'var(--sk-text-2)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 14,
            bottom: 14,
            width: 2,
            background: 'var(--sk-text-3)',
            opacity: 0.35,
            borderRadius: 1,
          }}
        />
        Lele kemarin sisa 5 dari 30, jadi besok dikurangi. Ayam habis jam 2 siang — kemungkinan kurang. Sore hujan, biasanya ramai turun ~10%.
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px 14px',
          marginTop: 4,
        }}
      >
        <SignatureSeal time="03:12" confidence="high" />
        <SkPill tone="success" dot>
          Pola jelas · 7 hari
        </SkPill>
      </div>

      <div style={{ padding: '0 14px 14px' }}>
        <SkButton variant="primary" size="lg" full leading={<IconWhatsapp size={18} />}>
          Salin ke WhatsApp
        </SkButton>
      </div>
    </div>
  );
}
