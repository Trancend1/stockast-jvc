import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppLayout } from '@/components/layout/AppLayout';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/catat',
  useRouter: () => ({ push }),
}));

vi.mock('@/components/ui-kit/primitives/sk-bottom-nav', () => ({
  SkBottomNav: () => <div data-testid="bottom-nav" />,
}));

vi.mock('@/components/ui-kit/primitives/sk-topbar', () => ({
  SkTopBar: ({
    warungName,
    trailing,
    title,
    mode,
  }: {
    warungName?: string;
    trailing?: React.ReactNode;
    title?: React.ReactNode;
    mode?: string;
  }) => (
    <div>
      <div data-testid="topbar-mode">{mode}</div>
      <div data-testid="topbar-warung">{warungName ?? ''}</div>
      <div data-testid="topbar-title">{title ?? ''}</div>
      <div data-testid="topbar-trailing">{trailing}</div>
    </div>
  ),
}));

vi.mock('@/components/features/subuh/SubuhToggle', () => ({
  SubuhToggle: () => <button type="button">Subuh Toggle</button>,
}));

describe('AppLayout', () => {
  beforeEach(() => {
    push.mockClear();
    window.localStorage.clear();
  });

  it('hydrates warung name from onboarding state when callers do not pass one', async () => {
    window.localStorage.setItem(
      'stockast.onboarding.v1',
      JSON.stringify({
        warungName: 'Warung Test',
        location: 'salatiga',
        menu: 'lele',
        completedAt: '2026-05-16T00:00:00.000Z',
      }),
    );

    render(
      <AppLayout>
        <div>Body</div>
      </AppLayout>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('topbar-warung')).toHaveTextContent('Warung Test'),
    );
  });

  it('provides the shared Subuh toggle by default', async () => {
    window.localStorage.setItem(
      'stockast.onboarding.v1',
      JSON.stringify({
        warungName: 'Bu Yati',
        location: 'salatiga',
        menu: 'lele',
        completedAt: '2026-05-16T00:00:00.000Z',
      }),
    );

    render(
      <AppLayout>
        <div>Body</div>
      </AppLayout>,
    );

    expect(await screen.findByRole('button', { name: /subuh toggle/i })).toBeInTheDocument();
  });

  it('wraps page content in the shared responsive container and honors width variants', () => {
    render(
      <AppLayout contentWidth="wide">
        <div>Body</div>
      </AppLayout>,
    );

    expect(screen.getByTestId('app-layout-content')).toHaveClass(
      'app-layout-content',
      'app-layout-content--wide',
    );
  });
});
