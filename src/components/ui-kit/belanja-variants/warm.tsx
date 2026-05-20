import type { CSSProperties } from 'react';
import { IconWhatsapp } from '@/components/ui-kit/icons';
import { SkButton, SkPill, SkWeatherChip } from '@/components/ui-kit/primitives';
import { BELANJA_ITEMS, type BelanjaCardCommonProps } from './shared';

export function BelanjaCardWarm({ items = BELANJA_ITEMS, day = 'Selasa', date = '20 Mei' }: BelanjaCardCommonProps) {
  const cardStyle = {
    padding: 0,
    overflow: 'hidden',
    background: 'var(--sk-surface-2)',
    border: '1px solid var(--sk-line-strong)',
    '--sk-grain': '0.09',
  } as CSSProperties;
  return (
    <div className="sk-card sk-grain" style={cardStyle}>
      <div style={{ padding: '20px 20px 4px', textAlign: 'left' }}>
        <div className="sk-display" style={{ fontSize: 26, lineHeight: 1.1, color: 'var(--sk-text)' }}>
          Belanja besok,
        </div>
        <div
          style={{
            fontSize: 26,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: '-0.022em',
            fontFamily: 'var(--sk-font-serif)',
            fontStyle: 'italic',
          }}
        >
          {day} {date}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <SkWeatherChip kind="rain" time="Sore" />
          <SkPill tone="success" dot>
            Pola jelas
          </SkPill>
        </div>
      </div>

      <div style={{ padding: '16px 20px 4px', borderTop: '1px solid var(--sk-line)', marginTop: 16 }}>
        {items.map((it, i) => (
          <div
            key={it.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'baseline',
              padding: '12px 0',
              borderBottom: i < items.length - 1 ? '1px dashed var(--sk-line-strong)' : 'none',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{it.name}</div>
              <div style={{ fontSize: 12, color: 'var(--sk-text-3)', marginTop: 2 }}>
                {it.note ? it.note : `kemarin ${it.base}, sisa ${it.prevLeft}`}
              </div>
            </div>
            <div className="sk-mono" style={{ fontSize: 22, fontWeight: 600 }}>
              {it.qty}{' '}
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--sk-text-3)',
                  fontFamily: 'var(--sk-font)',
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                {it.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          margin: '12px 20px 0',
          fontFamily: 'var(--sk-font-serif)',
          fontStyle: 'italic',
          fontSize: 14,
          lineHeight: 1.55,
          color: 'var(--sk-text-2)',
        }}
      >
        “Sore hujan, biasanya ramai turun sedikit. Aku kurangi lele 6 ekor dari kemarin.”
      </div>

      <div style={{ padding: '16px 14px 14px' }}>
        <SkButton variant="brand" size="lg" full leading={<IconWhatsapp size={18} />}>
          Salin ke WhatsApp
        </SkButton>
      </div>
    </div>
  );
}
