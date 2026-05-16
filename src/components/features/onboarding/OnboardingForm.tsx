'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { onboarding as t, LOCATION_OPTIONS } from '@/lib/copy/onboarding';
import { common } from '@/lib/copy/common';
import { ensureDemoSeed } from '@/app/actions/onboarding';

const STORAGE_KEY = 'stockast.onboarding.v1';

type OnboardingState = {
  warungName: string;
  location: string;
  menu: string;
  completedAt: string;
};

export function readOnboardingState(): OnboardingState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingState;
    if (!parsed.completedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function OnboardingForm() {
  const router = useRouter();
  const [warungName, setWarungName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [menu, setMenu] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const disabled =
    warungName.trim().length === 0 ||
    location.length === 0 ||
    menu.trim().length === 0 ||
    submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;
    setSubmitting(true);
    const state: OnboardingState = {
      warungName: warungName.trim(),
      location,
      menu: menu.trim(),
      completedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage failure is non-fatal — proceed to dashboard anyway.
    }
    // Best-effort pre-seed so Belanja Card has data on first dashboard view.
    // Failure here is silent — the dashboard's no-history empty state handles it.
    void ensureDemoSeed().catch(() => undefined);
    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{t.heading}</h1>
        <p className="text-base text-neutral-600">{t.subheading}</p>
      </header>

      <div className="flex flex-col gap-2">
        <Label htmlFor="warung-name">{t.fields.warung_name.label}</Label>
        <Input
          id="warung-name"
          autoComplete="off"
          autoFocus
          placeholder={t.fields.warung_name.placeholder}
          value={warungName}
          onChange={(e) => setWarungName(e.target.value)}
          maxLength={80}
        />
        <p className="text-xs text-neutral-500">{t.fields.warung_name.help}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="location">{t.fields.location.label}</Label>
        <Select
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="" disabled>
            {t.fields.location.placeholder}
          </option>
          {LOCATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <p className="text-xs text-neutral-500">{t.fields.location.help}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="menu">{t.fields.menu.label}</Label>
        <Textarea
          id="menu"
          rows={3}
          placeholder={t.fields.menu.placeholder}
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
          maxLength={200}
        />
        <p className="text-xs text-neutral-500">{t.fields.menu.help}</p>
      </div>

      <Button type="submit" size="lg" disabled={disabled} loading={submitting}>
        {submitting ? t.finishing : t.submit}
      </Button>

      <p className="text-center text-xs text-neutral-500">{common.tagline}</p>
    </form>
  );
}
