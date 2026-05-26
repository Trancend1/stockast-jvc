'use client';

import * as React from 'react';
import { SubuhModeContext, useSubuhModeState } from '@/hooks/use-subuh-mode';

export function SubuhModeProvider({ children }: { children?: React.ReactNode }) {
  const state = useSubuhModeState();

  return <SubuhModeContext.Provider value={state}>{children ?? null}</SubuhModeContext.Provider>;
}
