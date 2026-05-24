'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/db/supabase-client';
import { getUserOutlet } from '@/lib/db/queries/users';
import { type ActionResult, fail, ok } from '@/types/action-result';
import { THRESHOLDS } from '@/lib/config/thresholds';
import { checkRateLimit } from '@/lib/kv';

const SEED_DIMSUM_PHONE = process.env.SEED_DIMSUM_PHONE?.trim() || '+6281234567000';
const SEED_DIMSUM_EMAIL = process.env.SEED_DIMSUM_EMAIL?.trim() || 'dimsum-seed@stockast.local';
const SEED_DIMSUM_OTP = process.env.SEED_DIMSUM_OTP?.trim() || '123456';
const SEED_DIMSUM_PASSWORD = process.env.SEED_DIMSUM_PASSWORD?.trim() || 'StockastDimsum!2026';

function normalizePhone(phone: string): string {
  return phone.replace(/^\+/, '');
}

function isSeedDimsumLogin(phone: string): boolean {
  return normalizePhone(phone) === normalizePhone(SEED_DIMSUM_PHONE);
}

function isPhoneProviderDisabled(error: { code?: string; message?: string }): boolean {
  return (
    error.code === 'phone_provider_disabled' ||
    error.message?.includes('Unsupported phone provider') === true
  );
}

/**
 * Step 1 of phone OTP login. Sends 6-digit OTP via SMS (requires Supabase
 * phone auth provider configured — see Supabase dashboard > Auth > Providers).
 *
 * For local dev: OTP appears in `supabase logs auth` without SMS.
 */
export async function sendOtp(phone: string): Promise<ActionResult<null>> {
  const trimmed = phone.trim();
  if (!trimmed) return fail('INPUT_INVALID', 'Nomor HP wajib diisi.');

  const quota = await checkRateLimit({
    scope: 'otp',
    identity: trimmed,
    limit: THRESHOLDS.RATE_LIMIT.OTP_PER_PHONE_PER_15MIN,
    windowSec: 15 * 60,
  });
  if (!quota.allowed) {
    return fail('QUOTA_EXCEEDED', 'Terlalu sering. Tunggu sebentar ya.', {
      retryAfterSec: quota.retryAfterSec,
      resetAt: quota.resetAt,
      store: quota.store,
    });
  }

  const db = await createServerClient();
  const { error } = await db.auth.signInWithOtp({
    phone: trimmed,
    options: { shouldCreateUser: true },
  });

  if (error) {
    if (isPhoneProviderDisabled(error) && isSeedDimsumLogin(trimmed)) {
      return ok(null);
    }
    if (error.message.includes('rate')) {
      return fail('QUOTA_EXCEEDED', 'Terlalu sering. Tunggu sebentar ya.');
    }
    return fail('INTERNAL', 'Gagal kirim OTP. Coba lagi.');
  }
  return ok(null);
}

/**
 * Step 2: verify the OTP token. On success, session cookie is set by Supabase SSR.
 * Redirects to /dashboard if existing user, /onboarding if new user.
 */
export async function verifyOtp(phone: string, token: string): Promise<ActionResult<null>> {
  const trimmedPhone = phone.trim();
  const trimmedToken = token.trim();

  if (!trimmedPhone || !trimmedToken) {
    return fail('INPUT_INVALID', 'Nomor HP dan kode OTP wajib diisi.');
  }
  if (!/^\d{6}$/.test(trimmedToken)) {
    return fail('INPUT_INVALID', 'Kode harus 6 angka.');
  }

  const db = await createServerClient();
  if (isSeedDimsumLogin(trimmedPhone)) {
    if (trimmedToken !== SEED_DIMSUM_OTP) {
      return fail('INPUT_INVALID', `Kode demo Dimsum salah. Pakai ${SEED_DIMSUM_OTP}.`);
    }

    const { data, error } = await db.auth.signInWithPassword({
      email: SEED_DIMSUM_EMAIL,
      password: SEED_DIMSUM_PASSWORD,
    });

    if (error || !data.user) {
      return fail('INTERNAL', 'Seed Dimsum belum siap. Jalankan pnpm seed:dimsum dulu.');
    }

    const outletId = await getUserOutlet(db, data.user.id);
    redirect(outletId ? '/dashboard' : '/onboarding');
  }

  const { data, error } = await db.auth.verifyOtp({
    phone: trimmedPhone,
    token: trimmedToken,
    type: 'sms',
  });

  if (error || !data.user) {
    return fail('INPUT_INVALID', 'Kode salah atau sudah kedaluwarsa.');
  }

  const outletId = await getUserOutlet(db, data.user.id);
  redirect(outletId ? '/dashboard' : '/onboarding');
}
