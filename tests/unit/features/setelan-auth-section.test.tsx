import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SetelanView } from '@/components/features/setelan/SetelanView';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/components/layout/AppLayout', () => ({
  AppLayout: ({ children, contentWidth }: { children: React.ReactNode; contentWidth?: string }) => (
    <div data-testid="settings-layout" data-content-width={contentWidth}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui-kit/primitives/sk-button', () => ({
  SkButton: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock('@/hooks/use-subuh-mode', () => ({
  useSubuhMode: () => ({ override: null, setOverride: vi.fn() }),
}));

vi.mock('@/app/actions/onboarding', () => ({
  applyOnboardingProfile: vi.fn(),
}));

vi.mock('@/app/setelan/actions', () => ({
  signOutCurrentDevice: vi.fn(),
}));

vi.mock('@/lib/onboarding-state', () => ({
  readOnboardingState: () => ({
    warungName: 'Warung Test',
    location: 'salatiga',
    menu: 'lele, ayam',
    completedAt: '2026-05-25T00:00:00.000Z',
  }),
  writeOnboardingState: vi.fn(),
}));

describe('SetelanView auth section', () => {
  it('keeps only implemented auth actions visible and collapses the rest into an empty state', () => {
    render(<SetelanView />);

    expect(screen.getByText(/fitur autentikasi lanjutan belum tersedia/i)).toBeInTheDocument();
    expect(
      screen.getByText(/verifikasi akun, ubah email\/nomor hp, dan keamanan akun/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buka' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buka Login OTP' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /keluar/i })).toBeInTheDocument();
    expect(screen.getByTestId('settings-layout')).toHaveAttribute('data-content-width', 'wide');
    expect(screen.getByTestId('settings-shell')).toBeInTheDocument();
    expect(screen.queryByText(/^Verifikasi akun$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Email \/ nomor HP$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Keamanan akun$/)).not.toBeInTheDocument();
  });
});
