'use client';

import * as React from 'react';
import {
  resolveSubuhMode,
  SUBUH_CLASS_NAME,
  SUBUH_STORAGE_KEY,
  type SubuhOverride,
} from '@/lib/subuh-mode';

const POLL_INTERVAL_MS = 60_000;

/**
 * Manages `html.subuh-mode` class.
 *
 * Resolution: manual override (localStorage) wins over time gate.
 * When override is null → follow isSubuhTime() and re-check every minute.
 */
export function useSubuhMode() {
  const [active, setActive] = React.useState(false);
  const [override, setOverrideState] = React.useState<SubuhOverride>(null);

  React.useEffect(() => {
    const stored = readOverride();
    setOverrideState(stored);
    applyState(stored, new Date(), setActive);

    const interval = window.setInterval(() => {
      applyState(readOverride(), new Date(), setActive);
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  const setOverride = React.useCallback((next: SubuhOverride) => {
    writeOverride(next);
    setOverrideState(next);
    applyState(next, new Date(), setActive);
  }, []);

  const toggle = React.useCallback(() => {
    const next: SubuhOverride = active ? 'off' : 'on';
    setOverride(next);
  }, [active, setOverride]);

  return { active, override, setOverride, toggle };
}

function applyState(override: SubuhOverride, now: Date, setActive: (v: boolean) => void): void {
  const next = resolveSubuhMode(override, now);
  setActive(next);
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle(SUBUH_CLASS_NAME, next);
}

function readOverride(): SubuhOverride {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(SUBUH_STORAGE_KEY);
  return raw === 'on' || raw === 'off' ? raw : null;
}

function writeOverride(next: SubuhOverride): void {
  if (typeof window === 'undefined') return;
  if (next === null) {
    window.localStorage.removeItem(SUBUH_STORAGE_KEY);
  } else {
    window.localStorage.setItem(SUBUH_STORAGE_KEY, next);
  }
}
