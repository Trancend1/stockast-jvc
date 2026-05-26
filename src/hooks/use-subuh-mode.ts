'use client';

import * as React from 'react';
import { readOnboardingState } from '@/lib/onboarding-state';
import {
  resolveSubuhMode,
  SUBUH_CLASS_NAME,
  SUBUH_DATA_ATTR,
  SUBUH_STORAGE_KEY,
  type SubuhOverride,
} from '@/lib/subuh-mode';

const POLL_INTERVAL_MS = 60_000;

type SubuhModeValue = {
  active: boolean;
  override: SubuhOverride;
  setOverride: (next: SubuhOverride) => void;
  toggle: () => void;
};

export const SubuhModeContext = React.createContext<SubuhModeValue | null>(null);

/**
 * Manages `html.subuh-mode` class.
 *
 * Resolution: manual override (localStorage) wins over time gate.
 * When override is null → follow isSubuhTime() and re-check every minute.
 * Subuh mode is disabled entirely until onboarding is complete.
 */
export function useSubuhMode() {
  const context = React.useContext(SubuhModeContext);
  if (!context) {
    throw new Error('useSubuhMode must be used within SubuhModeProvider');
  }
  return context;
}

export function useSubuhModeState(): SubuhModeValue {
  const [active, setActive] = React.useState(false);
  const [override, setOverrideState] = React.useState<SubuhOverride>(null);

  React.useEffect(() => {
    // No confirmed user — clear any class set by the bootstrap script and bail.
    if (!readOnboardingState()?.completedAt) {
      clearSubuhClass();
      return;
    }

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
  document.documentElement.setAttribute(SUBUH_DATA_ATTR, next ? 'on' : 'off');
}

function clearSubuhClass(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove(SUBUH_CLASS_NAME);
  document.documentElement.setAttribute(SUBUH_DATA_ATTR, 'off');
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
