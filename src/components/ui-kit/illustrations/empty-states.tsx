import type { ComponentType, ReactNode } from 'react';

const E_INK = '#1A1611';
const E_BRICK = '#F26F1B';
const E_MINT = '#4DA66E';
const E_CREAM = '#F4ECD9';
const E_GOLD = '#E8C074';

export interface EmptyIllustrationProps {
  size?: number;
}

export function IllustNoData({ size = 140 }: EmptyIllustrationProps) {
  return (
    <svg
      viewBox="0 0 140 110"
      width={size}
      height={(size * 110) / 140}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <g stroke={E_INK} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 30 18 L 96 18 L 110 32 L 110 96 L 30 96 Z" fill={E_CREAM} />
        <path d="M 96 18 L 96 32 L 110 32" fill="none" />
        <path
          d="M 40 46 L 100 46 M 40 56 L 100 56 M 40 66 L 90 66 M 40 76 L 100 76 M 40 86 L 80 86"
          opacity="0.25"
          strokeWidth="1"
        />
      </g>
      <g transform="translate(72 60) rotate(35 0 0)">
        <path d="M 0 0 L 0 28 L -4 32 L 4 32 L 0 28" fill={E_INK} />
        <circle cx="0" cy="34" r="1.6" fill={E_BRICK} />
      </g>
      <circle cx="118" cy="100" r="3" fill={E_MINT} />
    </svg>
  );
}

export function IllustNoHistory({ size = 140 }: EmptyIllustrationProps) {
  return (
    <svg
      viewBox="0 0 140 110"
      width={size}
      height={(size * 110) / 140}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <circle cx="106" cy="34" r="20" fill={E_BRICK} opacity="0.16" />
      <circle cx="106" cy="34" r="10" fill={E_BRICK} opacity="0.65" />
      <g stroke={E_INK} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" fill={E_CREAM}>
        <path d="M 36 20 L 80 20 L 78 22 L 60 50 L 56 50 L 38 22 Z" />
        <path d="M 38 96 L 78 96 L 76 94 L 60 70 L 56 70 L 40 94 Z" />
        <line x1="34" y1="20" x2="82" y2="20" strokeWidth="2.4" />
        <line x1="34" y1="96" x2="82" y2="96" strokeWidth="2.4" />
      </g>
      <g fill={E_GOLD}>
        <path d="M 56 42 L 60 42 L 60 50 L 56 50 Z" opacity="0.85" />
        <path d="M 58 56 L 60 56 L 60 70 L 58 70 Z" />
        <path d="M 50 88 q 8 -4 16 0 L 66 96 L 50 96 Z" />
      </g>
      <circle cx="22" cy="102" r="2.6" fill={E_MINT} />
    </svg>
  );
}

export function IllustOffline({ size = 140 }: EmptyIllustrationProps) {
  return (
    <svg
      viewBox="0 0 140 110"
      width={size}
      height={(size * 110) / 140}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <g stroke={E_INK} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 8 60 Q 30 80 50 56" fill="none" />
        <rect x="46" y="46" width="14" height="20" rx="3" fill={E_CREAM} />
        <line x1="48" y1="42" x2="48" y2="46" />
        <line x1="58" y1="42" x2="58" y2="46" />
        <path d="M 132 50 Q 110 30 90 54" fill="none" />
        <path d="M 80 58 L 96 50 L 96 60 L 80 68 Z" fill={E_BRICK} />
      </g>
      <g fill={E_GOLD}>
        <path d="M 66 38 l 2 -6 l 2 6 l 6 -2 l -4 5 l 4 5 l -6 -2 l -2 6 l -2 -6 l -6 2 l 4 -5 l -4 -5 z" />
      </g>
      <circle cx="20" cy="100" r="2.6" fill={E_MINT} />
    </svg>
  );
}

export function IllustError({ size = 140 }: EmptyIllustrationProps) {
  return (
    <svg
      viewBox="0 0 140 110"
      width={size}
      height={(size * 110) / 140}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <g stroke={E_INK} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
        <g transform="translate(70 60) rotate(-22 0 0)">
          <path d="M -22 -8 L 22 -8 L 18 18 L -18 18 Z" fill={E_CREAM} />
          <path d="M -26 -10 L 26 -10" strokeWidth="2.4" />
          <circle cx="0" cy="-15" r="3" fill={E_INK} />
        </g>
        <path d="M 30 92 q 14 -10 36 -6 q 22 6 44 -2 q 4 12 -4 14 L 30 98 Z" fill={E_INK} opacity="0.9" />
      </g>
      <g transform="translate(106 28)">
        <circle cx="0" cy="0" r="12" fill={E_BRICK} />
        <text x="0" y="5" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="16" fill="#FFF">
          !
        </text>
      </g>
    </svg>
  );
}

export function IllustSearch({ size = 140 }: EmptyIllustrationProps) {
  return (
    <svg
      viewBox="0 0 140 110"
      width={size}
      height={(size * 110) / 140}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <g stroke={E_INK} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.45">
        <path d="M 20 24 L 120 24 M 20 40 L 120 40 M 20 56 L 120 56 M 20 72 L 120 72 M 20 88 L 120 88" />
        <path d="M 30 18 L 30 96 M 50 18 L 50 96 M 70 18 L 70 96 M 90 18 L 90 96 M 110 18 L 110 96" />
      </g>
      <g transform="translate(70 56)">
        <circle r="26" fill={E_CREAM} stroke={E_INK} strokeWidth="2" />
        <circle r="22" fill={E_BRICK} opacity="0.10" />
        <path d="M 18 18 L 36 36" stroke={E_INK} strokeWidth="3" strokeLinecap="round" />
        <text x="0" y="6" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="20" fontWeight="700" fill={E_INK}>
          ?
        </text>
      </g>
      <circle cx="120" cy="100" r="2.6" fill={E_MINT} />
    </svg>
  );
}

export function IllustDone({ size = 140 }: EmptyIllustrationProps) {
  return (
    <svg
      viewBox="0 0 140 110"
      width={size}
      height={(size * 110) / 140}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <g stroke={E_BRICK} strokeWidth="1.4" strokeLinecap="round" opacity="0.6">
        <path d="M 70 14 v 6 M 70 90 v 6 M 18 54 h 6 M 116 54 h 6" />
        <path d="M 32 22 l 4 4 M 108 86 l -4 -4 M 32 86 l 4 -4 M 108 22 l -4 4" />
      </g>
      <circle cx="70" cy="54" r="32" fill={E_CREAM} stroke={E_INK} strokeWidth="1.8" />
      <circle cx="70" cy="54" r="24" fill="none" stroke={E_INK} strokeWidth="1" opacity="0.4" />
      <path
        d="M 58 54 L 66 64 L 84 46"
        fill="none"
        stroke={E_MINT}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="118" cy="98" r="3" fill={E_MINT} />
    </svg>
  );
}

export interface EmptyPanelProps {
  illust: ComponentType<EmptyIllustrationProps>;
  title: ReactNode;
  body: ReactNode;
  cta?: ReactNode;
}

export function EmptyPanel({ illust: Ill, title, body, cta }: EmptyPanelProps) {
  return (
    <div
      style={{
        padding: '28px 22px 24px',
        background: 'var(--sk-surface)',
        border: '1px solid var(--sk-line)',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 14,
      }}
    >
      <Ill size={120} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 260 }}>
        <div
          style={{
            fontFamily: 'var(--sk-font-serif)',
            fontStyle: 'italic',
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '-0.012em',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--sk-text-2)' }}>{body}</div>
      </div>
      {cta}
    </div>
  );
}
