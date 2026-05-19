'use client';

import * as React from 'react';

/**
 * Reactive `navigator.onLine` with `online`/`offline` event subscription.
 * SSR-safe: defaults to true when window is unavailable so server-rendered
 * UI assumes connectivity until the client hydrates and can correct.
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = React.useState<boolean>(() => {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
  });

  React.useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }
    function handleOffline() {
      setOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}
