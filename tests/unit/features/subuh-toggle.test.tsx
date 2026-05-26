import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SubuhToggle } from '@/components/features/subuh/SubuhToggle';

const toggle = vi.fn();

vi.mock('@/hooks/use-subuh-mode', () => ({
  useSubuhMode: () => ({
    active: false,
    toggle,
  }),
}));

vi.mock('@/components/ui-kit/primitives/sk-button', () => ({
  SkButton: ({
    children,
    onClick,
    ...rest
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui-kit/icons', () => ({
  IconMoon: () => <span aria-hidden="true">Moon</span>,
  IconSun: () => <span aria-hidden="true">Sun</span>,
}));

describe('SubuhToggle', () => {
  it('renders the topbar dark-mode toggle even without onboarding state', () => {
    render(<SubuhToggle />);

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Mode normal. Ketuk untuk Subuh Mode',
    );
  });

  it('toggles subuh mode when pressed', () => {
    toggle.mockClear();
    render(<SubuhToggle />);

    fireEvent.click(screen.getByRole('button'));

    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
