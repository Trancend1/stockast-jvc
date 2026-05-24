import * as React from 'react';
import type { ReactNode } from 'react';

const M_BRICK = '#F26F1B';
const M_MINT = '#4DA66E';

export type DawnRibbonWeather = 'rain' | 'sun' | 'cloud';

export interface DawnRibbonProps {
  weather?: DawnRibbonWeather;
  subuh?: boolean;
  day?: string;
  date?: string;
  time?: string;
}

export function DawnRibbon({
  weather = 'rain',
  subuh = false,
  day = 'Selasa',
  date = '20 Mei',
  time = '03:12',
}: DawnRibbonProps) {
  const sunFill = subuh ? '#76b8d0' : M_BRICK;
  const sunGlow = subuh ? 'rgba(118, 184, 208, 0.18)' : 'rgba(242, 111, 27, 0.16)';
  const sunGlow2 = subuh ? 'rgba(118, 184, 208, 0.35)' : 'rgba(242, 111, 27, 0.32)';

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 10,
        background: subuh ? 'rgba(173, 232, 244, 0.04)' : 'var(--sk-surface-2)',
        border: '1px solid var(--sk-line)',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 140 44"
        width={120}
        height={36}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <circle cx="22" cy="26" r="16" fill={sunGlow} />
        <circle cx="22" cy="26" r="10" fill={sunGlow2} />
        {subuh ? (
          <g>
            <circle cx="22" cy="26" r="7" fill={sunFill} />
            <circle cx="25" cy="24" r="6" fill="rgba(0, 18, 53, 0.85)" />
          </g>
        ) : (
          <circle cx="22" cy="26" r="6" fill={sunFill} />
        )}

        <line
          x1="0"
          y1="36"
          x2="140"
          y2="36"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />

        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.65"
        >
          <path d="M 46 36 L 46 26 L 54 21 L 62 26 L 62 36" />
          <path d="M 70 36 L 70 30 L 76 26 L 82 30 L 82 36" />
          <path d="M 90 36 L 90 24 L 100 18 L 110 24 L 110 36" />
          <rect x="97" y="29" width="6" height="7" />
        </g>

        {weather === 'rain' && (
          <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55">
            <path d="M 122 10 l -2 6 M 128 8 l -2 6 M 134 12 l -2 6" />
          </g>
        )}
        {weather === 'cloud' && (
          <path
            d="M 122 14 q -4 0 -4 -4 q 0 -5 6 -5 q 4 -3 8 0 q 5 0 5 5 q 0 4 -5 4 z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
            opacity="0.55"
          />
        )}
        {weather === 'sun' && (
          <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55">
            <circle cx="128" cy="12" r="3" fill="none" />
            <path d="M 128 5 v 2 M 128 17 v 2 M 121 12 h 2 M 133 12 h 2 M 123 7 l 1.5 1.5 M 132 16 l 1.5 1.5 M 123 17 l 1.5 -1.5 M 132 8 l 1.5 -1.5" />
          </g>
        )}

        <circle cx="116" cy="36" r="1.8" fill={subuh ? '#7ed9a8' : M_MINT} />
      </svg>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--sk-text-3)',
          }}
        >
          {subuh ? 'Pra-subuh' : 'Pagi'} · {time}
        </div>
        <div style={{ fontSize: 13, color: 'var(--sk-text-2)', lineHeight: 1.3 }}>
          {day} {date} ·{' '}
          <span style={{ color: 'var(--sk-text)', fontWeight: 600 }}>
            sore {weather === 'rain' ? 'hujan' : weather === 'cloud' ? 'berawan' : 'cerah'}
          </span>
        </div>
      </div>
    </div>
  );
}

export interface SignatureSealProps {
  time?: string;
  confidence?: 'high' | 'low';
}

export function SignatureSeal({ time = '03:12', confidence = 'high' }: SignatureSealProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 4px' }}>
      <svg
        viewBox="0 0 36 36"
        width={28}
        height={28}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M 18 4 a 14 14 0 1 1 -0.01 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="60 4 28 3"
          opacity="0.7"
        />
        <circle
          cx="18"
          cy="18"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
        <path
          d="M 18 12 v 8 M 14 18 h 8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="18" cy="18" r="1.4" fill="currentColor" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '-0.005em' }}>
          Disusun Stockast
        </span>
        <span className="sk-mono" style={{ fontSize: 10.5, color: 'var(--sk-text-3)' }}>
          {time} · {confidence === 'high' ? 'yakin' : 'perlu cek'}
        </span>
      </div>
    </div>
  );
}

export interface TallyStampProps {
  count: number | string;
}

export function TallyStamp({ count }: TallyStampProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '6px 12px 4px',
        border: '1px solid var(--sk-line-strong)',
        borderRadius: 8,
        background: 'var(--sk-surface)',
        minWidth: 56,
      }}
    >
      <span
        className="sk-mono"
        style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}
      >
        {count}
      </span>
      <span
        style={{
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--sk-text-3)',
          marginTop: 3,
        }}
      >
        item
      </span>
    </div>
  );
}

export interface CategoryBarProps {
  label: string;
  count?: number;
}

export function CategoryBar({ label, count }: CategoryBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0 6px' }}>
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--sk-text-3)',
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--sk-line)' }} />
      {count != null && (
        <span className="sk-mono" style={{ fontSize: 11, color: 'var(--sk-text-3)' }}>
          {String(count).padStart(2, '0')}
        </span>
      )}
    </div>
  );
}

export interface NotebookFoldProps {
  size?: number;
}

export function NotebookFold({ size = 36 }: NotebookFoldProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M 6 6 L 32 6 L 42 16 L 42 42 L 6 42 Z" />
        <path d="M 32 6 L 32 16 L 42 16" />
        <path d="M 12 26 L 38 26 M 12 32 L 38 32 M 12 38 L 32 38" opacity="0.35" strokeWidth="1" />
      </g>
      <g transform="translate(22 18) rotate(28 0 0)">
        <path d="M 0 0 L 0 12 L -3 14 L 3 14 L 0 12" fill="currentColor" opacity="0.85" />
        <circle cx="0" cy="15" r="1.3" fill={M_BRICK} />
      </g>
    </svg>
  );
}

export interface CapturedStampProps {
  count?: number;
  label?: string;
}

export function CapturedStamp({ count, label = 'tangkap' }: CapturedStampProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '4px 4px' }}>
      <svg
        viewBox="0 0 40 28"
        width={42}
        height={28}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g fill="currentColor">
          <circle cx="6" cy="10" r="2.4" opacity="0.4" />
          <circle cx="14" cy="10" r="2.4" opacity="0.65" />
          <circle cx="22" cy="10" r="2.4" />
        </g>
        <path
          d="M 4 20 q 14 4 32 -2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="34" cy="10" r="2.2" fill={M_BRICK} />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '-0.005em' }}>
          AI {label}
        </span>
        {count != null && (
          <span className="sk-mono" style={{ fontSize: 10.5, color: 'var(--sk-text-3)' }}>
            {count} hal
          </span>
        )}
      </div>
    </div>
  );
}

export interface SavedSealProps {
  label?: string;
  time?: string;
}

export function SavedSeal({ label = 'Tersimpan', time }: SavedSealProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 14px',
        border: '1.5px solid currentColor',
        borderRadius: 999,
        opacity: 0.9,
      }}
    >
      <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="42 3 14 3"
          opacity="0.6"
        />
        <path
          d="M 7 12 L 11 16 L 17 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em' }}>{label}</span>
        {time && (
          <span className="sk-mono" style={{ fontSize: 10.5, opacity: 0.6 }}>
            {time}
          </span>
        )}
      </div>
    </div>
  );
}

export interface LedgerStripeProps {
  rangeLabel?: string;
  avg?: number;
  best?: string;
}

export function LedgerStripe({
  rangeLabel = '12 – 18 Mei',
  avg = 28,
  best = 'Sabtu',
}: LedgerStripeProps) {
  return (
    <div
      style={{
        borderRadius: 12,
        background: 'var(--sk-surface)',
        border: '1px solid var(--sk-line)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <svg
        viewBox="0 0 56 44"
        width={56}
        height={44}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <circle cx="42" cy="14" r="9" fill={M_BRICK} opacity="0.16" />
        <circle cx="42" cy="14" r="5" fill={M_BRICK} opacity="0.7" />
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 4 32 L 4 14 L 18 18 L 18 36 Z" fill="var(--sk-surface-2)" />
          <path d="M 32 32 L 32 14 L 18 18 L 18 36 Z" fill="var(--sk-surface-2)" />
          <path
            d="M 7 22 L 16 24 M 7 26 L 15 27.5 M 22 22 L 30 20 M 22 26 L 30 24"
            opacity="0.45"
            strokeWidth="1"
          />
        </g>
        <path d="M 26 14 L 28 22 L 24 19 Z" fill={M_MINT} />
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--sk-font-serif)',
            fontStyle: 'italic',
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '-0.015em',
            lineHeight: 1.1,
          }}
        >
          {rangeLabel}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 6,
            fontSize: 11.5,
            color: 'var(--sk-text-3)',
          }}
        >
          <span>
            <span className="sk-mono" style={{ color: 'var(--sk-text)', fontWeight: 600 }}>
              {avg}
            </span>{' '}
            rata-rata
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>
            puncak <span style={{ color: 'var(--sk-text)', fontWeight: 600 }}>{best}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export interface WarungMarkProps {
  size?: number;
}

export function WarungMark({ size = 56 }: WarungMarkProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <circle cx="14" cy="14" r="9" fill={M_BRICK} opacity="0.20" />
      <g
        fill="none"
        stroke="#1A1611"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M 8 26 L 30 14 L 52 26" fill="#F4ECD9" />
        <path d="M 6 26 L 54 26" />
        <path d="M 10 26 L 10 50 L 50 50 L 50 26" fill="#F4ECD9" />
        <rect x="26" y="36" width="8" height="14" />
        <rect x="14" y="32" width="8" height="6" />
        <rect x="38" y="32" width="8" height="6" />
        <path d="M 14 22 L 46 22" stroke={M_BRICK} strokeWidth="2.4" />
      </g>
      <circle cx="50" cy="48" r="2.4" fill={M_MINT} />
    </svg>
  );
}

export interface MiniWeatherProps {
  kind?: 'sun' | 'rain' | 'cloud';
  size?: number;
}

export function MiniWeather({ kind = 'sun', size = 22 }: MiniWeatherProps) {
  const view = (children: ReactNode) => (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      {children}
    </svg>
  );

  if (kind === 'rain') {
    return view(
      <>
        <path
          d="M 8 20 q -4 0 -4 -4 q 0 -5 6 -5 q 4 -3 9 0 q 6 0 6 5 q 0 4 -6 4 z"
          fill="var(--sk-surface-2)"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M 11 27 l -1.5 4 M 17 27 l -1.5 4" opacity="0.7" />
          <path d="M 22 27 l -1.5 4" stroke={M_BRICK} opacity="1" />
        </g>
      </>,
    );
  }
  if (kind === 'cloud') {
    return view(
      <>
        <path
          d="M 8 26 q -4 0 -4 -4 q 0 -5 6 -5 q 4 -3 9 0 q 6 0 6 5 q 0 4 -6 4 z"
          fill="var(--sk-surface-2)"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="28" cy="14" r="1.6" fill={M_BRICK} opacity="0.7" />
      </>,
    );
  }
  return view(
    <>
      <circle cx="20" cy="20" r="6" fill={M_BRICK} />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
        <path d="M 20 6 v 4 M 20 30 v 4 M 6 20 h 4 M 30 20 h 4 M 10 10 l 2.5 2.5 M 27.5 27.5 l 2.5 2.5 M 10 30 l 2.5 -2.5 M 27.5 12.5 l 2.5 -2.5" />
      </g>
    </>,
  );
}

export interface SectionLabelProps {
  children: ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px 8px' }}>
      <span style={{ width: 4, height: 4, borderRadius: 50, background: M_BRICK }} />
      <span
        style={{
          fontFamily: 'var(--sk-font-serif)',
          fontStyle: 'italic',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--sk-text-2)',
          letterSpacing: '-0.01em',
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--sk-line)' }} />
    </div>
  );
}
