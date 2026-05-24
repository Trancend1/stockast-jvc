import * as React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

export type SkCardTone = 'default' | 'muted' | 'ghost';

export interface SkCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode;
  tone?: SkCardTone;
  signature?: boolean;
}

export function SkCard({ children, tone, signature, style, className, ...rest }: SkCardProps) {
  const cls = ['sk-card', signature ? 'sk-grain' : null, className].filter(Boolean).join(' ');
  return (
    <div className={cls} data-tone={tone === 'default' ? undefined : tone} style={style} {...rest}>
      {children}
    </div>
  );
}
