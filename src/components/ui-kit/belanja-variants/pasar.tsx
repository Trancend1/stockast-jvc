import type { CSSProperties } from 'react';
import { IconShop, IconWhatsapp } from '@/components/ui-kit/icons';
import { categoryFor, glyphFor, type GlyphCategory } from '@/components/ui-kit/glyphs';
import { CategoryBar, DawnRibbon, SignatureSeal } from '@/components/ui-kit/illustrations';
import { SkButton, SkPill } from '@/components/ui-kit/primitives';
import { BELANJA_ITEMS, type BelanjaCardCommonProps, type BelanjaItem, trendColor } from './shared';

const ORDER: ReadonlyArray<GlyphCategory> = ['Protein', 'Pendamping', 'Bumbu', 'Lainnya'];

export function BelanjaCardPasar({
  items = BELANJA_ITEMS,
  day = 'Selasa',
  date = '20 Mei',
  weather = 'rain',
  subuh = false,
}: BelanjaCardCommonProps) {
  const groups = new Map<GlyphCategory, BelanjaItem[]>();
  for (const it of items) {
    const cat = categoryFor(it.name);
    const list = groups.get(cat) ?? [];
    list.push(it);
    groups.set(cat, list);
  }
  const orderedGroups = ORDER.flatMap<readonly [GlyphCategory, ReadonlyArray<BelanjaItem>]>((c) => {
    const list = groups.get(c);
    return list ? [[c, list] as const] : [];
  });

  const cardStyle = {
    padding: 0,
    overflow: 'hidden',
    '--sk-grain': '0.08',
    background: 'var(--sk-surface)',
    border: '1px solid var(--sk-line-strong)',
    boxShadow: 'var(--sk-shadow-card), 0 6px 22px rgba(26,22,17,0.05)',
  } as CSSProperties;

  return (
    <div className="sk-card sk-grain" style={cardStyle}>
      <div style={{ padding: '16px 18px 0', textAlign: 'center' }}>
        <div className="sk-display" style={{ fontSize: 12, color: 'var(--sk-text-2)', letterSpacing: '0.02em' }}>
          — belanja besok —
        </div>
        <div
          style={{
            fontFamily: 'var(--sk-font-serif)',
            fontStyle: 'italic',
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.022em',
            lineHeight: 1.1,
            marginTop: 4,
          }}
        >
          {day} {date}
        </div>
      </div>

      <div style={{ padding: '14px 18px 4px' }}>
        <DawnRibbon weather={weather} subuh={subuh} day={day} date={date} time="03:12" />
      </div>

      <div style={{ padding: '4px 18px 0' }}>
        {orderedGroups.map(([cat, list]) => (
          <div key={cat}>
            <CategoryBar label={cat} count={list.length} />
            {list.map((it, i) => {
              const G = glyphFor(it.name);
              return (
                <div
                  key={it.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '44px 1fr auto',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: i < list.length - 1 ? '1px dashed var(--sk-line-strong)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'var(--sk-surface-2)',
                      border: '1px solid var(--sk-line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--sk-text-2)',
                    }}
                  >
                    {G ? <G size={28} /> : <IconShop size={20} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.005em' }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--sk-text-3)', marginTop: 2, lineHeight: 1.3 }}>
                      {it.note ? it.note : `kemarin ${it.base} → sisa ${it.prevLeft}`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="sk-mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                      {it.qty}
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
                    <div className="sk-mono" style={{ fontSize: 11.5, color: trendColor(it.trend) }}>
                      {it.delta}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        style={{
          margin: '16px 18px 0',
          padding: '12px 14px',
          borderTop: '1px dashed var(--sk-line-strong)',
          borderBottom: '1px dashed var(--sk-line-strong)',
          fontFamily: 'var(--sk-font-serif)',
          fontStyle: 'italic',
          fontSize: 14,
          lineHeight: 1.55,
          color: 'var(--sk-text-2)',
        }}
      >
        “Sore hujan, ramai turun sedikit. Aku kurangi lele 6 ekor dari kemarin.”
      </div>

      <div style={{ padding: '14px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SignatureSeal time="03:12" confidence="high" />
        <SkPill tone="success" dot>
          Pola jelas · 7 hari
        </SkPill>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <SkButton variant="brand" size="lg" full leading={<IconWhatsapp size={18} />}>
          Salin ke WhatsApp
        </SkButton>
      </div>
    </div>
  );
}
