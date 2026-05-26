import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from '@/app/login/page';
import OnboardingPage from '@/app/onboarding/page';

vi.mock('@/app/login/actions', () => ({
  sendOtp: vi.fn(),
  verifyOtp: vi.fn(),
}));

vi.mock('@/components/ui-kit/illustrations/branding', () => ({
  WordLogo: () => <div>Stockast</div>,
}));

vi.mock('@/components/ui-kit/primitives/sk-button', () => ({
  SkButton: ({
    children,
    onClick,
    disabled,
    type,
    style,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    style?: React.CSSProperties;
  }) => (
    <button type={type ?? 'button'} disabled={disabled} onClick={onClick} style={style}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui-kit/primitives/sk-input', () => ({
  SkInput: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock('@/components/ui-kit/primitives/sk-label', () => ({
  SkLabel: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

vi.mock('@/components/features/onboarding/OnboardingForm', () => ({
  OnboardingForm: () => <div>Onboarding Form</div>,
}));

describe('Entry navigation', () => {
  it('shows a small back link on login page', () => {
    render(<LoginPage />);

    expect(screen.getByRole('link', { name: /kembali/i })).toHaveAttribute('href', '/');
  });

  it('shows a small back link on onboarding page', () => {
    render(<OnboardingPage />);

    expect(screen.getByRole('link', { name: /kembali/i })).toHaveAttribute('href', '/');
    expect(screen.getByText('Onboarding Form')).toBeInTheDocument();
  });
});
