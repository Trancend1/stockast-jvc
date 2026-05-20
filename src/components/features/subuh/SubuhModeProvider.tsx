'use client';

import { useSubuhMode } from '@/hooks/use-subuh-mode';

export function SubuhModeProvider() {
  useSubuhMode();
  return null;
}
