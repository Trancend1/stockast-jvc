import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppGate } from '@/components/features/app-gate/AppGate';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

describe('AppGate', () => {
  beforeEach(() => {
    replace.mockClear();
    window.localStorage.clear();
  });

  it('keeps gated content hidden while redirecting users without onboarding', async () => {
    render(
      <AppGate fallback={<p>Loading gate</p>}>
        <p>Dashboard content</p>
      </AppGate>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/onboarding'));
    expect(screen.getByText('Loading gate')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });

  it('renders gated content after onboarding exists', async () => {
    window.localStorage.setItem(
      'stockast.onboarding.v1',
      JSON.stringify({
        warungName: 'Warung Subuh',
        location: 'jakarta',
        menu: 'nasi uduk',
        completedAt: '2026-05-16T00:00:00.000Z',
      }),
    );

    render(
      <AppGate fallback={<p>Loading gate</p>}>
        <p>Dashboard content</p>
      </AppGate>,
    );

    expect(await screen.findByText('Dashboard content')).toBeInTheDocument();
    expect(screen.queryByText('Loading gate')).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
