'use client';

import * as React from 'react';
import Link from 'next/link';
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
type StepIndex = 0 | 1 | 2;
const TOTAL_STEPS = 3;

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = React.useState<StepIndex>(0);
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

  const currentStep = step;
  const stepIncomplete =
    step === 0
      ? warungName.trim().length === 0
      : step === 1
        ? location.length === 0
        : menu.trim().length === 0;

  function goNext() {
    if (stepIncomplete) return;
    setErrorMsg(null);
    setStep((current) => (current < 2 ? ((current + 1) as StepIndex) : current));
  }

  function goPrevious() {
    setErrorMsg(null);
    setStep((current) => (current > 0 ? ((current - 1) as StepIndex) : current));
  }

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

  const copy = stepCopy(step);

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[560px] flex-col justify-between gap-4 py-3 sm:min-h-[720px] sm:gap-5 sm:py-6"
    >
      <header className="flex flex-col gap-2">
        <SkSteps count={TOTAL_STEPS} current={currentStep} />
        <p className="text-brand-700 mt-2 text-xs font-semibold tracking-wider uppercase">
          {t.step_label(step + 1, TOTAL_STEPS)}
        </p>
        <h1 className="text-2xl leading-tight font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {copy.title}
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-neutral-600 sm:text-base">
          {copy.description}
        </p>
      </header>

      <div className="flex items-center justify-center py-4 sm:py-6" aria-hidden="true">
        <div className="h-32 w-full max-w-[240px] sm:h-36 sm:max-w-[280px]">
          {step === 0 ? <OnbDecorNama /> : null}
          {step === 1 ? <OnbDecorLokasi /> : null}
          {step === 2 ? <OnbDecorMenu /> : null}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {step === 0 ? (
          <div className="flex flex-col gap-2">
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
        ) : null}

        {step === 1 ? (
          <div className="flex flex-col gap-2">
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
        ) : null}

        {step === 2 ? (
          <div className="flex flex-col gap-2">
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
        ) : null}

        {errorMsg ? (
          <p role="alert" className="text-danger text-sm">
            {errorMsg}
          </p>
        ) : null}

        <div className={step === 0 ? 'grid grid-cols-1' : 'grid grid-cols-2 gap-2'}>
          {step > 0 ? (
            <SkButton type="button" variant="secondary" size="md" full onClick={goPrevious}>
              {t.previous}
            </SkButton>
          ) : null}
          {step < 2 ? (
            <SkButton
              type="button"
              variant="brand"
              size="md"
              full
              disabled={stepIncomplete}
              onClick={goNext}
            >
              {t.next}
            </SkButton>
          ) : (
            <SkButton type="submit" variant="brand" size="md" full disabled={disabled}>
              {submitting ? t.finishing : t.submit}
            </SkButton>
          )}
        </div>

        <p className="text-center text-xs text-neutral-500">
          {t.returning.prompt}{' '}
          <Link href="/login" className="font-semibold text-[var(--sk-brand)] underline-offset-2">
            {t.returning.link}
          </Link>
        </p>

        <p className="text-center text-xs text-neutral-500">{common.tagline}</p>
      </div>
    </form>
  );
}

function stepCopy(step: StepIndex): { title: string; description: string } {
  if (step === 0) {
    return {
      title: t.fields.warung_name.title,
      description: t.fields.warung_name.description,
    };
  }
  if (step === 1) {
    return {
      title: t.fields.location.title,
      description: t.fields.location.description,
    };
  }
  return {
    title: t.fields.menu.title,
    description: t.fields.menu.description,
  };
}
