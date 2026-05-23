import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OnboardingForm } from '@/components/features/onboarding/OnboardingForm';

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
  SkLabel: ({
    children,
    htmlFor,
    hint,
  }: {
    children: React.ReactNode;
    htmlFor: string;
    hint?: string;
  }) => (
    <label htmlFor={htmlFor}>
      {children}
      {hint ? <span>{hint}</span> : null}
    </label>
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

describe('OnboardingForm', () => {
  beforeEach(() => {
    push.mockClear();
    applyOnboardingProfile.mockReset();
    ensureDemoSeed.mockReset();
    applyOnboardingProfile.mockResolvedValue({ data: { outletId: 'outlet-1', menuCount: 3 } });
    ensureDemoSeed.mockResolvedValue({ data: { inserted: 0, skipped: true } });
    window.localStorage.clear();
  });

  it('uses separate step pages with Next and Previous while preserving filled answers', async () => {
    render(<OnboardingForm />);

    expect(screen.getByLabelText(/nama warung/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /nama warung kamu apa/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/kota/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/nama warung/i), { target: { value: 'Warung Test' } });
    fireEvent.click(screen.getByRole('button', { name: /lanjut/i }));

    expect(screen.getByLabelText(/kota/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /warungmu ada di mana/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/daftar menu/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/kota/i), { target: { value: 'salatiga' } });
    fireEvent.click(screen.getByRole('button', { name: /lanjut/i }));

    expect(screen.getByLabelText(/daftar menu/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /menu apa saja/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /kembali/i }));
    fireEvent.click(screen.getByRole('button', { name: /kembali/i }));

    expect(screen.getByLabelText(/nama warung/i)).toHaveValue('Warung Test');
  });

  it('submits only from step 3 after all answers are filled', async () => {
    render(<OnboardingForm />);

    fireEvent.change(screen.getByLabelText(/nama warung/i), { target: { value: 'Warung Test' } });
    fireEvent.click(screen.getByRole('button', { name: /lanjut/i }));
    fireEvent.change(screen.getByLabelText(/kota/i), { target: { value: 'salatiga' } });
    fireEvent.click(screen.getByRole('button', { name: /lanjut/i }));
    fireEvent.change(screen.getByLabelText(/daftar menu/i), {
      target: { value: 'ikan, ayam, sapi' },
    });
    fireEvent.click(screen.getByRole('button', { name: /mulai catat stok/i }));

    await waitFor(() =>
      expect(applyOnboardingProfile).toHaveBeenCalledWith({
        warungName: 'Warung Test',
        location: 'salatiga',
        menu: 'ikan, ayam, sapi',
      }),
    );
    expect(push).toHaveBeenCalledWith('/dashboard');
  });
});
