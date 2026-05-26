'use client';

import * as React from 'react';
import type { CSSProperties, ReactNode, SelectHTMLAttributes } from 'react';

export interface SkSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange' | 'className' | 'style'
> {
  children?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
  style?: CSSProperties;
}

export function SkSelect({ children, value, onChange, invalid, style, ...rest }: SkSelectProps) {
  return (
    <div className="sk-select-wrap">
      <select
        className="sk-input sk-select"
        data-invalid={invalid ? 'true' : undefined}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={style}
        {...rest}
      >
        {children}
      </select>
      <span aria-hidden="true" className="sk-select-icon" />
    </div>
  );
}
