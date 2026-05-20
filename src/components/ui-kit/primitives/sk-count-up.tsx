'use client';

import { useEffect, useState, type CSSProperties } from 'react';

export interface SkCountUpProps {
  to: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

export function SkCountUp({ to, duration = 700, className, style }: SkCountUpProps) {
  const [v, setV] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(to * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return (
    <span className={className} style={style}>
      {v}
    </span>
  );
}
