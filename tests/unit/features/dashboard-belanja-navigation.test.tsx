import { getPolaMingguan } from '@/app/actions/pola-mingguan';
import { getPromosForToday } from '@/app/actions/promo';
import { getCuacaCardData } from '@/app/actions/weather';
import { BelanjaCard } from '@/components/features/belanja/BelanjaCard';
import { DashboardShell } from '@/components/features/dashboard/DashboardShell';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

vi.mock('@/app/actions/weather', () => ({
  getCuacaCardData: vi.fn(async () => ({
    data: {
      weather: {
        serviceDate: '2026-05-24',
        adm4Code: '31.71.01.1001',
        category: 'mendung',
        label: 'Mendung',
        hint: 'Pagi mendung, stok normal',
        source: 'bmkg',
        fetchedAt: '2026-05-23T00:00:00.000Z',
        cacheHit: false,
        cacheLayer: 'none',
      },
    },
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

vi.mock('@/components/features/belanja/PromoCardList', () => ({
  PromoCardList: () => <div data-testid="promo-card-list" />,
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
  AppLayout: ({ children, warungName }: { children: React.ReactNode; warungName?: string }) => (
    <main>
      <div data-testid="dashboard-warung-name">{warungName ?? ''}</div>
      {children}
    </main>
  ),
}));

vi.mock('@/components/ui-kit/primitives/sk-card', () => ({
  SkCard: ({
    children,
    className,
    signature: _signature,
    style,
    ...rest
  }: {
    children: React.ReactNode;
    className?: string;
    signature?: boolean;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }) => {
    void _signature;

    return (
      <section className={className} style={style} {...rest}>
        {children}
      </section>
    );
  },
}));

vi.mock('@/components/ui-kit/primitives/sk-pill', () => ({
  SkPill: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('@/components/ui-kit/primitives/sk-button', () => ({
  SkButton: ({
    children,
    onClick,
    full,
    leading,
    trailing,
    type = 'button',
    ...rest
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    full?: boolean;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
  } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type={type} onClick={onClick} data-full={full ? 'true' : undefined} {...rest}>
      {leading}
      {children}
      {trailing}
    </button>
  ),
}));

const sampleBelanjaData = {
  outletId: 'outlet-1',
  serviceDate: '2026-05-24',
  warungName: 'Warung Test',
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
    vi.mocked(getPromosForToday).mockClear();
    vi.mocked(getCuacaCardData).mockClear();
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
    expect(screen.getByTestId('dashboard-warung-name')).toHaveTextContent('Warung Subuh');
    expect(getPolaMingguan).not.toHaveBeenCalled();
    expect(getPromosForToday).toHaveBeenCalledWith({ warungName: 'Warung Subuh' });
    expect(getCuacaCardData).toHaveBeenCalled();
    expect(screen.getByTestId('cuaca-card')).toBeInTheDocument();
    expect(screen.getByTestId('promo-card-list')).toBeInTheDocument();
    expect(screen.queryByText('Pola minggu ini')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /catat hari ini/i })).not.toBeInTheDocument();
  });

  it('splits dashboard into main and side columns for tablet and desktop presentation', async () => {
    render(<DashboardShell />);

    const main = await screen.findByTestId('dashboard-main-column');
    const side = screen.getByTestId('dashboard-side-column');

    expect(main).toContainElement(screen.getByTestId('belanja-card'));
    expect(side).toContainElement(screen.getByTestId('cuaca-card'));
    expect(side).toContainElement(screen.getByTestId('promo-card-list'));
  });

  it('opens item CRUD from the item row instead of visual layout settings', async () => {
    render(<BelanjaCard data={sampleBelanjaData} />);

    expect(screen.queryByRole('button', { name: /^atur$/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/style/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/density/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/grid/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ubah nasi uduk/i }));

    expect(screen.getByRole('dialog', { name: /edit item/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/jumlah/i), { target: { value: '28' } });
    fireEvent.change(screen.getByLabelText(/info/i), { target: { value: 'Tambah stok subuh.' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('Tambah stok subuh')).toBeInTheDocument();
  });

  it('uses a responsive card shell instead of locking the card to full viewport height', () => {
    render(<BelanjaCard data={sampleBelanjaData} />);

    const card = screen.getByTestId('belanja-card');
    const row = screen.getByRole('button', { name: /ubah nasi uduk/i });

    expect(card).not.toHaveStyle({ maxHeight: 'calc(100dvh - 148px)' });
    expect(row).toHaveStyle({ background: 'var(--belanja-item-bg)' });
  });

  it('keeps row info concise and hides zero fluctuation', async () => {
    render(
      <BelanjaCard
        data={{
          ...sampleBelanjaData,
          items: [
            {
              ...sampleBelanjaData.items[0]!,
              base: 5.6666666667,
              suggested: 5.6666666667,
              leftoverYesterday: 3.2,
              reasoning: 'Angka panjang 5.6666666667 harus diringkas.',
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Sisa kemarin 3 porsi')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.queryByText(/5\.666/)).not.toBeInTheDocument();
  });

  it('creates and deletes items through the compact modal flow', async () => {
    render(<BelanjaCard data={sampleBelanjaData} />);

    fireEvent.click(screen.getByRole('button', { name: /tambah item/i }));

    expect(screen.getByRole('dialog', { name: /tambah item/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/^item$/i), { target: { value: 'Ayam goreng' } });
    fireEvent.change(screen.getByLabelText(/fluktuasi/i), { target: { value: '+3' } });
    fireEvent.change(screen.getByLabelText(/jumlah/i), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText(/info/i), { target: { value: 'Menu cepat habis.' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    expect(screen.getByRole('button', { name: /ubah ayam goreng/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ubah ayam goreng/i }));
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    expect(screen.queryByRole('button', { name: /ubah ayam goreng/i })).not.toBeInTheDocument();
  });
});
