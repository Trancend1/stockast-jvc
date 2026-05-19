import * as React from 'react';

/**
 * Skeleton primitive — shimmer placeholder used while server actions resolve.
 * Pair with concrete skeleton components (e.g. BelanjaCardSkeleton) that match
 * the final layout so swap-in feels seamless rather than jumpy.
 *
 * Honors `prefers-reduced-motion` via globals.css (animation suppressed there).
 */
export function Skeleton({
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={`skeleton-shimmer rounded-md ${className}`}
      {...rest}
    />
  );
}
