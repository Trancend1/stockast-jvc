import type { CSSProperties, ReactNode } from 'react';

export type SkCardTone = 'default' | 'muted' | 'ghost';

export interface SkCardProps {
  children?: ReactNode;
  tone?: SkCardTone;
  signature?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function SkCard({ children, tone, signature, style, className }: SkCardProps) {
  const cls = ['sk-card', signature ? 'sk-grain' : null, className].filter(Boolean).join(' ');
  return (
    <div className={cls} data-tone={tone === 'default' ? undefined : tone} style={style}>
      {children}
    </div>
  );
}
