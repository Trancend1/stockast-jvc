'use client';

import type { CSSProperties, TextareaHTMLAttributes } from 'react';

export interface SkTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'className' | 'style'
> {
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
  style?: CSSProperties;
}

export function SkTextarea({
  value,
  onChange,
  invalid,
  rows = 4,
  style,
  ...rest
}: SkTextareaProps) {
  return (
    <textarea
      className="sk-input sk-textarea"
      data-invalid={invalid ? 'true' : undefined}
      rows={rows}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      autoCapitalize="sentences"
      autoCorrect="on"
      spellCheck
      style={style}
      {...rest}
    />
  );
}
