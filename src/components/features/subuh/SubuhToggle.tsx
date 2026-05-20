'use client';

import * as React from 'react';
import { useSubuhMode } from '@/hooks/use-subuh-mode';

export function SubuhToggle() {
  const { active, toggle } = useSubuhMode();
  const label = active ? 'Subuh' : 'Normal';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={
        active
          ? 'Subuh Mode aktif. Ketuk untuk mode normal'
          : 'Mode normal. Ketuk untuk Subuh Mode'
      }
      title={active ? 'Subuh Mode aktif' : 'Mode normal'}
      className={
        active
          ? 'inline-flex h-9 items-center justify-center gap-2 rounded-full border border-brand-500 bg-brand-500 px-3 text-xs font-semibold text-[var(--color-on-brand)] shadow-[var(--shadow-card)] transition-colors hover:bg-brand-600'
          : 'inline-flex h-9 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100'
      }
    >
      {active ? <SunIcon /> : <MoonIcon />}
      <span>{label}</span>
    </button>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
