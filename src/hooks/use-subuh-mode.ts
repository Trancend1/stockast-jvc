'use client';

import * as React from 'react';
import { isSubuhTime } from '@/lib/subuh';

const CLASS_NAME = 'subuh-mode';
const STORAGE_KEY = 'stockast.subuh.override';
const POLL_INTERVAL_MS = 60_000;

type Override = 'on' | 'off' | null;

/**
 * Manages `html.subuh-mode` class.
 *
 * Resolution: manual override (localStorage) wins over time gate.
 * When override is null → follow isSubuhTime() and re-check every minute.
 */
export function useSubuhMode() {
  const [active, setActive] = React.useState(false);
  const [override, setOverrideState] = React.useState<Override>(null);

  React.useEffect(() => {
    const stored = readOverride();
    setOverrideState(stored);
    applyState(stored, new Date(), setActive);

    const interval = window.setInterval(() => {
      applyState(readOverride(), new Date(), setActive);
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  const setOverride = React.useCallback((next: Override) => {
    writeOverride(next);
    setOverrideState(next);
    applyState(next, new Date(), setActive);
  }, []);

  const toggle = React.useCallback(() => {
    const next: Override = active ? 'off' : 'on';
    setOverride(next);
  }, [active, setOverride]);

  return { active, override, setOverride, toggle };
}

function applyState(
  override: Override,
  now: Date,
  setActive: (v: boolean) => void,
): void {
  const next = override === 'on' ? true : override === 'off' ? false : isSubuhTime(now);
  setActive(next);
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle(CLASS_NAME, next);
}

function readOverride(): Override {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === 'on' || raw === 'off' ? raw : null;
}

function writeOverride(next: Override): void {
  if (typeof window === 'undefined') return;
  if (next === null) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, next);
  }
}
