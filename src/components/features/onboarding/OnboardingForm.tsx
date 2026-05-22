'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { SkInput } from '@/components/ui-kit/primitives/sk-input';
import { SkLabel } from '@/components/ui-kit/primitives/sk-label';
import { SkSelect } from '@/components/ui-kit/primitives/sk-select';
import { SkSteps } from '@/components/ui-kit/primitives/sk-steps';
import { SkTextarea } from '@/components/ui-kit/primitives/sk-textarea';
import {
  OnbDecorNama,
  OnbDecorLokasi,
  OnbDecorMenu,
} from '@/components/ui-kit/onboarding/onb-decor';
import { onboarding as t } from '@/lib/copy/onboarding';
import { common } from '@/lib/copy/common';
import { LOCATION_OPTIONS } from '@/lib/config/locations';
import { THRESHOLDS } from '@/lib/config/thresholds';
import { applyOnboardingProfile, ensureDemoSeed } from '@/app/actions/onboarding';
import { type OnboardingState, writeOnboardingState } from '@/lib/onboarding-state';

const FIELD_LIMITS = THRESHOLDS.ONBOARDING;

export function OnboardingForm() {
  const router = useRouter();
  const [warungName, setWarungName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [menu, setMenu] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const disabled =
    warungName.trim().length === 0 ||
    location.length === 0 ||
    menu.trim().length === 0 ||
    submitting;

  const currentStep = !warungName.trim() ? 0 : !location ? 1 : 2;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;
    setSubmitting(true);
    setErrorMsg(null);

    const payload = {
      warungName: warungName.trim(),
      location,
      menu: menu.trim(),
    };

    const result = await applyOnboardingProfile(payload);
    if (result.error) {
      setErrorMsg(result.error.message || t.errors.profile_failed);
      setSubmitting(false);
      return;
    }

    const state: OnboardingState = {
      ...payload,
      completedAt: new Date().toISOString(),
    };
    try {
      writeOnboardingState(state);
    } catch {
      // Storage failure non-fatal — DB is the source of truth now.
    }

    // Best-effort pre-seed against the merchant's actual menu_items.
    // Failure here is silent — the dashboard's no-history empty state handles it.
    void ensureDemoSeed(result.data.outletId).catch(() => undefined);
    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <SkSteps count={3} current={currentStep} />
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">{t.heading}</h1>
        <p className="text-base text-neutral-600">{t.subheading}</p>
      </header>

      <div className="flex flex-col gap-2">
        <div style={{ height: 80 }} aria-hidden="true">
          <OnbDecorNama />
        </div>
        <SkLabel htmlFor="warung-name" hint={t.fields.warung_name.help}>
          {t.fields.warung_name.label}
        </SkLabel>
        <SkInput
          id="warung-name"
          autoComplete="off"
          autoFocus
          placeholder={t.fields.warung_name.placeholder}
          value={warungName}
          onChange={setWarungName}
          maxLength={FIELD_LIMITS.WARUNG_NAME_MAX}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div style={{ height: 80 }} aria-hidden="true">
          <OnbDecorLokasi />
        </div>
        <SkLabel htmlFor="location" hint={t.fields.location.help}>
          {t.fields.location.label}
        </SkLabel>
        <SkSelect id="location" value={location} onChange={setLocation}>
          <option value="" disabled>
            {t.fields.location.placeholder}
          </option>
          {LOCATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SkSelect>
      </div>

      <div className="flex flex-col gap-2">
        <div style={{ height: 80 }} aria-hidden="true">
          <OnbDecorMenu />
        </div>
        <SkLabel htmlFor="menu" hint={t.fields.menu.help}>
          {t.fields.menu.label}
        </SkLabel>
        <SkTextarea
          id="menu"
          rows={FIELD_LIMITS.MENU_TEXTAREA_ROWS}
          placeholder={t.fields.menu.placeholder}
          value={menu}
          onChange={setMenu}
          maxLength={FIELD_LIMITS.MENU_LIST_MAX_CHARS}
        />
      </div>

      {errorMsg ? (
        <p role="alert" className="text-danger text-sm">
          {errorMsg}
        </p>
      ) : null}

      <SkButton type="submit" variant="brand" size="lg" full disabled={disabled}>
        {submitting ? t.finishing : t.submit}
      </SkButton>

      <p className="text-center text-xs text-neutral-500">{common.tagline}</p>
    </form>
  );
}
