import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from '@/app/page';

const push = vi.fn();
const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

describe('HomePage', () => {
  beforeEach(() => {
    push.mockClear();
    replace.mockClear();
    window.localStorage.clear();
  });

  it('redirects to /homepage for users without onboarding', async () => {
    render(<HomePage />);

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/homepage'));
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
