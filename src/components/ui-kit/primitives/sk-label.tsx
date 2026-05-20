import type { ReactNode } from 'react';

export interface SkLabelProps {
  children: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
}

export function SkLabel({ children, htmlFor, hint }: SkLabelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
      <label htmlFor={htmlFor} style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em' }}>
        {children}
      </label>
      {hint && <span style={{ fontSize: 12, color: 'var(--sk-text-3)', lineHeight: 1.4 }}>{hint}</span>}
    </div>
  );
}
