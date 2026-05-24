import * as React from 'react';
import type { CSSProperties, ReactNode } from 'react';

const G_BRICK = '#F26F1B';
const G_MINT = '#4DA66E';

export interface GlyphProps {
  size?: number;
  style?: CSSProperties;
}

function Glyph({ children, size = 24, style }: GlyphProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block', ...style }}
    >
      {children}
    </svg>
  );
}

export function GlyphLele({ size, style }: GlyphProps) {
  return (
    <Glyph size={size} style={style}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 5 21 q 4 -7 12 -7 q 8 0 14 4 l 4 -4 l -1 5 l 1 5 l -4 -4 q -6 4 -14 4 q -8 0 -12 -7 z" />
        <path d="M 24 16 q 0 5 0 10" opacity="0.4" />
        <path d="M 10 22 q -2 4 -4 5 M 13 23 q -1 4 -3 6" opacity="0.55" strokeWidth="1.2" />
      </g>
      <circle cx="22" cy="19" r="1.4" fill={G_BRICK} />
    </Glyph>
  );
}

export function GlyphAyam({ size, style }: GlyphProps) {
  return (
    <Glyph size={size} style={style}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 10 28 q -2 -10 8 -12 q 10 -2 12 6 q 2 6 -2 8 q -2 -4 -6 -3 q 0 4 -2 4 q -2 0 -2 -4 q -4 1 -8 1 z" />
        <path d="M 16 27 v 4 M 22 27 v 4" strokeWidth="1.2" />
        <path d="M 30 19 l 4 -1 l -3 3 z" fill="currentColor" stroke="none" opacity="0.7" />
        <circle cx="28" cy="18" r="0.9" fill="currentColor" />
      </g>
      <path
        d="M 26 13 q 1 -3 2 0 q 1 -3 2 0 q 1 -3 2 0 l 0 2 q -3 1 -6 0 z"
        fill={G_BRICK}
        stroke="none"
      />
    </Glyph>
  );
}

export function GlyphTahu({ size, style }: GlyphProps) {
  return (
    <Glyph size={size} style={style}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M 8 16 L 20 11 L 32 16 L 20 21 Z" />
        <path d="M 8 16 L 8 27 L 20 32 L 20 21" />
        <path d="M 32 16 L 32 27 L 20 32" />
        <circle cx="16" cy="16" r="0.7" fill="currentColor" opacity="0.5" />
        <circle cx="22" cy="14" r="0.7" fill="currentColor" opacity="0.5" />
        <circle cx="20" cy="18" r="0.7" fill="currentColor" opacity="0.5" />
      </g>
      <circle cx="32" cy="16" r="1.4" fill={G_BRICK} />
    </Glyph>
  );
}

export function GlyphTempe({ size, style }: GlyphProps) {
  return (
    <Glyph size={size} style={style}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M 6 17 L 22 12 L 34 17 L 18 22 Z" />
        <path d="M 6 17 L 6 24 L 18 29 L 18 22" />
        <path d="M 34 17 L 34 24 L 18 29" />
      </g>
      <g fill="currentColor" opacity="0.7">
        <circle cx="11" cy="18" r="0.9" />
        <circle cx="16" cy="16.5" r="0.9" />
        <circle cx="22" cy="15" r="0.9" />
        <circle cx="27" cy="17" r="0.9" />
        <circle cx="13" cy="21" r="0.9" />
        <circle cx="19" cy="19" r="0.9" />
        <circle cx="24" cy="20" r="0.9" />
      </g>
      <circle cx="29" cy="20" r="1.1" fill={G_MINT} />
    </Glyph>
  );
}

export function GlyphCabai({ size, style }: GlyphProps) {
  return (
    <Glyph size={size} style={style}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M 14 10 q 0 -3 3 -4 q 2 -1 4 1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M 18 8 q 4 -2 6 -1 q -1 3 -4 4 z"
          fill="currentColor"
          opacity="0.55"
          stroke="none"
        />
        <path
          d="M 16 10 q 4 0 6 2 q 6 5 8 14 q -2 6 -8 6 q -10 0 -10 -10 q 0 -8 4 -12 z"
          fill={G_BRICK}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M 17 14 q 3 4 4 12" fill="none" stroke="#FFF" strokeWidth="1.2" opacity="0.4" />
      </g>
    </Glyph>
  );
}

export type GlyphComponent = (props: GlyphProps) => ReactNode;

export function glyphFor(name: string | null | undefined): GlyphComponent | null {
  const n = (name ?? '').toLowerCase();
  if (n.includes('lele')) return GlyphLele;
  if (n.includes('ayam')) return GlyphAyam;
  if (n.includes('tahu')) return GlyphTahu;
  if (n.includes('tempe')) return GlyphTempe;
  if (n.includes('cabai') || n.includes('cabe') || n.includes('rawit')) return GlyphCabai;
  return null;
}

export type GlyphCategory = 'Protein' | 'Pendamping' | 'Bumbu' | 'Lainnya';

export function categoryFor(name: string | null | undefined): GlyphCategory {
  const n = (name ?? '').toLowerCase();
  if (n.includes('lele') || n.includes('ayam') || n.includes('ikan') || n.includes('daging'))
    return 'Protein';
  if (n.includes('tahu') || n.includes('tempe')) return 'Pendamping';
  if (n.includes('cabai') || n.includes('cabe') || n.includes('rawit') || n.includes('bawang'))
    return 'Bumbu';
  return 'Lainnya';
}
