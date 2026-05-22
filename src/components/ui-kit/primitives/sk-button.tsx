'use client';

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

export type SkButtonVariant = 'primary' | 'brand' | 'secondary' | 'ghost';
export type SkButtonSize = 'sm' | 'md' | 'lg';

export interface SkButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: ReactNode;
  variant?: SkButtonVariant;
  size?: SkButtonSize;
  full?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  style?: CSSProperties;
}

export function SkButton({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  full,
  leading,
  trailing,
  ...rest
}: SkButtonProps) {
  return (
    <button
      type="button"
      className={className ? `sk-btn ${className}` : 'sk-btn'}
      data-variant={variant}
      data-size={size}
      data-full={full ? 'true' : undefined}
      {...rest}
    >
      {leading}
      {children != null && <span>{children}</span>}
      {trailing}
    </button>
  );
}
