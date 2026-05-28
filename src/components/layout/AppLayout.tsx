'use client';

import * as React from 'react';
import { SubuhToggle } from '@/components/features/subuh/SubuhToggle';
import { SkBottomNav, type SkBottomNavId } from '@/components/ui-kit/primitives/sk-bottom-nav';
import { SkTopBar, type SkTopBarProps } from '@/components/ui-kit/primitives/sk-topbar';
import { readOnboardingState, writeOnboardingState } from '@/lib/onboarding-state';
import { getActiveWarungName } from '@/app/actions/onboarding';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

const ROUTE_TO_NAV: Record<string, SkBottomNavId> = {
  '/dashboard': 'home',
  '/catat': 'catat',
  '/riwayat': 'riwayat',
  '/setelan': 'setelan',
};

const NAV_TO_ROUTE: Record<SkBottomNavId, string> = {
  home: '/dashboard',
  catat: '/catat',
  riwayat: '/riwayat',
  setelan: '/setelan',
};

interface AppLayoutProps extends Omit<SkTopBarProps, 'mode'> {
  children: ReactNode;
  /** 'default' = warung home bar, 'task' = back button bar. Default: auto from route */
  topbarMode?: SkTopBarProps['mode'];
  /** Hide bottom nav (e.g. deep task pages) */
  hideNav?: boolean;
  /** Shared desktop/tablet content width policy */
  contentWidth?: 'base' | 'wide' | 'full';
}

export function AppLayout({
  children,
  topbarMode,
  hideNav = false,
  contentWidth = 'base',
  warungName,
  trailing,
  ...topbarProps
}: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hydratedWarungName, setHydratedWarungName] = React.useState<string | undefined>(
    warungName,
  );

  const activeNav = ROUTE_TO_NAV[pathname] ?? 'home';
  const resolvedMode = topbarMode ?? 'default';
  const resolvedTrailing = trailing === undefined ? <SubuhToggle /> : trailing;
  const todayLabel = React.useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, []);

  React.useEffect(() => {
    if (warungName && warungName.trim().length > 0) {
      const trimmed = warungName.trim();
      setHydratedWarungName(trimmed);

      const onboarding = readOnboardingState();
      if (!onboarding || onboarding.warungName !== trimmed) {
        const nextState = onboarding
          ? { ...onboarding, warungName: trimmed }
          : {
              warungName: trimmed,
              location: '',
              menu: '',
              completedAt: new Date().toISOString(),
            };
        writeOnboardingState(nextState);
      }
      return;
    }

    const onboarding = readOnboardingState();
    const storedName = onboarding?.warungName?.trim();
    if (storedName) {
      setHydratedWarungName(storedName);
    }

    void getActiveWarungName().then((result) => {
      if (!result.error && result.data) {
        const dbName = result.data.trim();
        setHydratedWarungName(dbName);
        const nextState = onboarding
          ? { ...onboarding, warungName: dbName }
          : {
              warungName: dbName,
              location: '',
              menu: '',
              completedAt: new Date().toISOString(),
            };
        writeOnboardingState(nextState);
      }
    });
  }, [warungName]);

  function handleNavChange(id: SkBottomNavId) {
    router.push(NAV_TO_ROUTE[id]);
  }

  return (
    <div
      className="app-layout-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        background: 'var(--sk-bg)',
      }}
    >
      <div className="app-layout-topbar-shell">
        <div className="app-layout-topbar-content">
          <SkTopBar
            {...topbarProps}
            mode={resolvedMode}
            warungName={hydratedWarungName}
            date={topbarProps.date ?? todayLabel}
            trailing={resolvedTrailing}
          />
        </div>
      </div>
      <main
        className="app-layout-main"
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: hideNav ? 0 : 72,
        }}
      >
        <div
          data-testid="app-layout-content"
          className={`app-layout-content app-layout-content--${contentWidth}`}
        >
          {children}
        </div>
      </main>
      {!hideNav && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
          <SkBottomNav active={activeNav} onChange={handleNavChange} />
        </div>
      )}
    </div>
  );
}
