import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SubuhModeProvider } from '@/components/features/subuh/SubuhModeProvider';
import { SubuhToggle } from '@/components/features/subuh/SubuhToggle';
import { useSubuhMode } from '@/hooks/use-subuh-mode';

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

function ModeProbe() {
  const { active, override } = useSubuhMode();

  return (
    <output data-testid="subuh-mode-state">
      {override ?? 'auto'}:{active ? 'on' : 'off'}
    </output>
  );
}

describe('SubuhModeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      'stockast.onboarding.v1',
      JSON.stringify({
        warungName: 'Warung Test',
        location: 'jakarta',
        menu: 'nasi uduk',
        completedAt: '2026-05-16T00:00:00.000Z',
      }),
    );
    window.localStorage.setItem('stockast.subuh.override', 'off');
    document.documentElement.className = '';
    document.documentElement.setAttribute('data-subuh', 'off');
  });

  it('shares manual subuh state across all consumers', () => {
    render(
      <SubuhModeProvider>
        <SubuhToggle />
        <ModeProbe />
      </SubuhModeProvider>,
    );

    expect(screen.getByTestId('subuh-mode-state')).toHaveTextContent('off:off');

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('subuh-mode-state')).toHaveTextContent('on:on');
    expect(window.localStorage.getItem('stockast.subuh.override')).toBe('on');
    expect(document.documentElement.classList.contains('subuh-mode')).toBe(true);
    expect(document.documentElement.getAttribute('data-subuh')).toBe('on');
  });
});
