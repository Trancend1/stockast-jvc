import { IconEdit, IconWhatsapp } from '@/components/ui-kit/icons';
import { SkButton, SkPill } from '@/components/ui-kit/primitives';
import { BELANJA_ITEMS, type BelanjaCardCommonProps, trendColor } from './shared';

export function BelanjaCardCompact({ items = BELANJA_ITEMS, day = 'Selasa', date = '20 Mei' }: BelanjaCardCommonProps) {
  return (
    <div className="sk-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px',
          borderBottom: '1px solid var(--sk-line)',
        }}
      >
        <div>
          <div className="sk-overline">Belanja</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>
            {day} {date}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <SkPill tone="success" dot>
            Pola jelas
          </SkPill>
        </div>
      </div>

      <div>
        {items.map((it, i) => (
          <div
            key={it.name}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              alignItems: 'center',
              gap: 12,
              padding: '11px 16px',
              borderBottom: i < items.length - 1 ? '1px solid var(--sk-line)' : 'none',
              fontSize: 14,
            }}
          >
            <span
              className="sk-mono"
              style={{ fontSize: 17, fontWeight: 600, color: 'var(--sk-text)', minWidth: 36, textAlign: 'right' }}
            >
              {it.qty}
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {it.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--sk-text-3)' }}>
                {it.unit} · base {it.base}
              </div>
            </div>
            <span className="sk-mono" data-trend={it.trend} style={{ fontSize: 12, color: trendColor(it.trend) }}>
              {it.delta}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: 12,
          borderTop: '1px solid var(--sk-line)',
          background: 'var(--sk-surface-2)',
        }}
      >
        <SkButton variant="ghost" size="md" style={{ flex: 1 }} leading={<IconEdit size={16} />}>
          Atur
        </SkButton>
        <SkButton variant="primary" size="md" style={{ flex: 2 }} leading={<IconWhatsapp size={16} />}>
          Salin ke WA
        </SkButton>
      </div>
    </div>
  );
}
