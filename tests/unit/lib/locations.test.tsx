import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OnboardingForm } from '@/components/features/onboarding/OnboardingForm';
import { LOCATION_GROUPS, LOCATION_OPTIONS, findLocation } from '@/lib/config/locations';

const push = vi.fn();
const applyOnboardingProfile = vi.fn();
const ensureDemoSeed = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/app/actions/onboarding', () => ({
  applyOnboardingProfile: (...args: unknown[]) => applyOnboardingProfile(...args),
  ensureDemoSeed: (...args: unknown[]) => ensureDemoSeed(...args),
}));

vi.mock('@/components/ui-kit/onboarding/onb-decor', () => ({
  OnbDecorNama: () => <div />,
  OnbDecorLokasi: () => <div />,
  OnbDecorMenu: () => <div />,
}));

vi.mock('@/components/ui-kit/primitives/sk-steps', () => ({
  SkSteps: ({ current }: { current: number }) => <div data-testid="step">{current + 1}</div>,
}));

vi.mock('@/components/ui-kit/primitives/sk-label', () => ({
  SkLabel: ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

vi.mock('@/components/ui-kit/primitives/sk-input', () => ({
  SkInput: ({ value, onChange, ...rest }: { value: string; onChange: (value: string) => void }) => (
    <input value={value} onChange={(event) => onChange(event.target.value)} {...rest} />
  ),
}));

vi.mock('@/components/ui-kit/primitives/sk-select', () => ({
  SkSelect: ({
    value,
    onChange,
    children,
    ...rest
  }: {
    value: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
  }) => (
    <select value={value} onChange={(event) => onChange(event.target.value)} {...rest}>
      {children}
    </select>
  ),
}));

vi.mock('@/components/ui-kit/primitives/sk-textarea', () => ({
  SkTextarea: ({
    value,
    onChange,
    ...rest
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => <textarea value={value} onChange={(event) => onChange(event.target.value)} {...rest} />,
}));

vi.mock('@/components/ui-kit/primitives/sk-button', () => ({
  SkButton: ({
    children,
    disabled,
    onClick,
    type = 'button',
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
  }) => (
    <button type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('locations config', () => {
  it('covers Java provinces with structured groups and scalable option volume', () => {
    expect(LOCATION_GROUPS.map((group) => group.province)).toEqual([
      'DKI Jakarta',
      'Banten',
      'Jawa Barat',
      'Jawa Tengah',
      'DI Yogyakarta',
      'Jawa Timur',
    ]);
    expect(LOCATION_OPTIONS.length).toBeGreaterThan(70);
    expect(findLocation('salatiga')?.label).toBe('Salatiga, Jawa Tengah');
    expect(findLocation('jakarta')?.label).toBeTruthy();
  });
});

describe('OnboardingForm location field', () => {
  it('renders city options grouped by province to keep the Java list lighter to scan', () => {
    render(<OnboardingForm />);

    fireEvent.change(screen.getByLabelText(/nama warung/i), { target: { value: 'Warung Test' } });
    fireEvent.click(screen.getByRole('button', { name: /lanjut/i }));

    const select = screen.getByLabelText(/kota/i);
    expect(select.querySelector('optgroup[label="Jawa Tengah"]')).not.toBeNull();
    expect(select.querySelector('option[value="salatiga"]')?.textContent).toBe(
      'Salatiga, Jawa Tengah',
    );
  });
});
