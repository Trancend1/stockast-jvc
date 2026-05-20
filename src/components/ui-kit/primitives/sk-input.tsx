'use client';

import type { CSSProperties, InputHTMLAttributes } from 'react';

export interface SkInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'className' | 'style'> {
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

export function SkInput({ value, onChange, type = 'text', style, ...rest }: SkInputProps) {
  return (
    <input
      className="sk-input"
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      style={style}
      {...rest}
    />
  );
}
