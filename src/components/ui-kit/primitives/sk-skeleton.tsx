import type { CSSProperties, HTMLAttributes } from 'react';

export interface SkSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  style?: CSSProperties;
}

export function SkSkeleton({ className, style, ...rest }: SkSkeletonProps) {
  const cls = ['sk-skeleton', className].filter(Boolean).join(' ');
  return <div aria-hidden className={cls} style={style} {...rest} />;
}
