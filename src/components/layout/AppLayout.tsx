'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { SkBottomNav, type SkBottomNavId } from '@/components/ui-kit/primitives/sk-bottom-nav';
import { SkTopBar, type SkTopBarProps } from '@/components/ui-kit/primitives/sk-topbar';

const ROUTE_TO_NAV: Record<string, SkBottomNavId> = {
  '/dashboard': 'home',
  '/catat': 'catat',
  '/riwayat': 'riwayat',
};

const NAV_TO_ROUTE: Record<SkBottomNavId, string> = {
  home: '/dashboard',
  catat: '/catat',
  riwayat: '/riwayat',
  setelan: '/dashboard', // Setelan deferred to Sprint G
};

interface AppLayoutProps extends Omit<SkTopBarProps, 'mode'> {
  children: ReactNode;
  /** 'default' = warung home bar, 'task' = back button bar. Default: auto from route */
  topbarMode?: SkTopBarProps['mode'];
  /** Hide bottom nav (e.g. deep task pages) */
  hideNav?: boolean;
}

export function AppLayout({
  children,
  topbarMode,
  hideNav = false,
  ...topbarProps
}: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const activeNav = ROUTE_TO_NAV[pathname] ?? 'home';
  const isTopLevel = Object.keys(ROUTE_TO_NAV).includes(pathname);
  const resolvedMode = topbarMode ?? (isTopLevel ? 'default' : 'task');

  function handleNavChange(id: SkBottomNavId) {
    router.push(NAV_TO_ROUTE[id]);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        background: 'var(--sk-bg)',
      }}
    >
      <SkTopBar
        mode={resolvedMode}
        onBack={resolvedMode === 'task' ? () => router.back() : undefined}
        {...topbarProps}
      />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: hideNav ? 0 : 72,
        }}
      >
        {children}
      </main>
      {!hideNav && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
          <SkBottomNav active={activeNav} onChange={handleNavChange} />
        </div>
      )}
    </div>
  );
}
