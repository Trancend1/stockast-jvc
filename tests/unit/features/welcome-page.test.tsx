import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from '@/app/page';

const push = vi.fn();
const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

vi.mock('@/components/ui-kit/illustrations/branding', () => ({
  WordLogo: () => <div>Stockast</div>,
  WelcomeHero: () => <div>Welcome Hero</div>,
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
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('HomePage', () => {
  beforeEach(() => {
    push.mockClear();
    replace.mockClear();
    window.localStorage.clear();
  });

  it('shows welcome choices for users without an existing local warung setup', async () => {
    render(<HomePage />);

    expect(screen.getByText('Stockast')).toBeInTheDocument();
    expect(screen.getByText('Welcome Hero')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /buat warung baru/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sudah punya warung/i })).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalledWith('/onboarding');

    fireEvent.click(screen.getByRole('button', { name: /buat warung baru/i }));
    expect(push).toHaveBeenCalledWith('/onboarding');

    fireEvent.click(screen.getByRole('button', { name: /sudah punya warung/i }));
    expect(push).toHaveBeenCalledWith('/login');
  });

  it('sends already-onboarded local users straight to dashboard', async () => {
    window.localStorage.setItem(
      'stockast.onboarding.v1',
      JSON.stringify({
        warungName: 'Warung Lama',
        location: 'salatiga',
        menu: 'lele',
        completedAt: '2026-05-16T00:00:00.000Z',
      }),
    );

    render(<HomePage />);

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
  });
});
