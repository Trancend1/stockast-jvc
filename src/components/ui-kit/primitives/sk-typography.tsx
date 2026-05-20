import type { CSSProperties, ReactNode } from 'react';

export interface SkOverlineProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function SkOverline({ children, style }: SkOverlineProps) {
  return (
    <div className="sk-overline" style={style}>
      {children}
    </div>
  );
}

export interface SkDividerProps {
  inset?: number;
  style?: CSSProperties;
}

export function SkDivider({ inset = 0, style }: SkDividerProps) {
  return <hr className="sk-hr" style={{ marginLeft: inset, marginRight: inset, ...style }} />;
}
