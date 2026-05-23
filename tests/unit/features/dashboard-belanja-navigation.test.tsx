import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BelanjaCard } from '@/components/features/belanja/BelanjaCard';
import { DashboardShell } from '@/components/features/dashboard/DashboardShell';
import { getPolaMingguan } from '@/app/actions/pola-mingguan';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push }),
}));

vi.mock('@/app/actions/recommendation', () => ({
  getBelanjaCard: vi.fn(async () => ({
    data: sampleBelanjaData,
  })),
}));

vi.mock('@/app/actions/promo', () => ({
  getPromosForToday: vi.fn(async () => ({
    data: { promos: [] },
  })),
}));

vi.mock('@/app/actions/pola-mingguan', () => ({
  getPolaMingguan: vi.fn(async () => ({
    data: { items: [], insight: null },
  })),
}));

vi.mock('@/components/features/cuaca/CuacaCard', () => ({
  CuacaCard: () => <div data-testid="cuaca-card" />,
}));

vi.mock('@/components/features/belanja/BelanjaCardSkeleton', () => ({
  BelanjaCardSkeleton: () => <div data-testid="belanja-skeleton" />,
}));

vi.mock('@/components/ui-kit/illustrations/empty-states', () => ({
  EmptyPanel: ({ title, body, cta }: { title: string; body: string; cta?: React.ReactNode }) => (
    <section>
      <h2>{title}</h2>
      <p>{body}</p>
      {cta}
    </section>
  ),
  IllustError: () => null,
  IllustNoData: () => null,
  IllustNoHistory: () => null,
}));

vi.mock('@/components/layout/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

vi.mock('@/components/ui-kit/primitives/sk-card', () => ({
  SkCard: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
}));

vi.mock('@/components/ui-kit/primitives/sk-pill', () => ({
  SkPill: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('@/components/ui-kit/primitives/sk-button', () => ({
  SkButton: ({
    children,
    onClick,
    type = 'button',
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
  }) => (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  ),
}));

const sampleBelanjaData = {
  outletId: 'outlet-1',
  serviceDate: '2026-05-24',
  confidenceLabel: 'Pola jelas' as const,
  cached: false,
  summary: 'Belanja secukupnya untuk besok.',
  items: [
    {
      menuItemId: 'menu-1',
      menuName: 'Nasi uduk',
      unit: 'porsi',
      base: 20,
      suggested: 24,
      leftoverYesterday: null,
      confidenceLabel: 'Pola jelas' as const,
      reasoning: 'Penjualan stabil.',
    },
  ],
};

describe('dashboard belanja navigation', () => {
  beforeEach(() => {
    push.mockClear();
    vi.mocked(getPolaMingguan).mockClear();
    window.localStorage.clear();
    window.localStorage.setItem(
      'stockast.onboarding.v1',
      JSON.stringify({
        warungName: 'Warung Subuh',
        location: 'jakarta',
        menu: 'nasi uduk',
        completedAt: '2026-05-16T00:00:00.000Z',
      }),
    );
  });

  it('keeps Pola Mingguan off the dashboard data path and removes duplicate Catat CTA', async () => {
    render(<DashboardShell />);

    expect(await screen.findByText('Belanja besok')).toBeInTheDocument();
    expect(getPolaMingguan).not.toHaveBeenCalled();
    expect(screen.queryByText('Pola minggu ini')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /catat hari ini/i })).not.toBeInTheDocument();
  });

  it('opens the separate Pola Mingguan page from the action row beside WhatsApp copy', async () => {
    render(<BelanjaCard data={sampleBelanjaData} />);

    fireEvent.click(screen.getByRole('button', { name: /pola mingguan/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/pola-mingguan'));
    expect(screen.getByRole('button', { name: /salin ke whatsapp/i })).toBeInTheDocument();
  });
});
