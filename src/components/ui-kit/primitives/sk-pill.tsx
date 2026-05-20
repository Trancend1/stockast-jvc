import type { CSSProperties, ReactNode } from 'react';

export type SkPillTone = 'default' | 'success' | 'warn' | 'danger' | 'brand';

export interface SkPillProps {
  children?: ReactNode;
  tone?: SkPillTone;
  dot?: boolean;
  style?: CSSProperties;
}

export function SkPill({ children, tone, dot, style }: SkPillProps) {
  return (
    <span className="sk-pill" data-tone={tone === 'default' ? undefined : tone} style={style}>
      {dot && <i className="sk-dot" />}
      {children}
    </span>
  );
}
