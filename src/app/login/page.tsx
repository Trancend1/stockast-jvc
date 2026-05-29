'use client';

import { WordLogo } from '@/components/ui-kit/illustrations/branding';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { SkInput } from '@/components/ui-kit/primitives/sk-input';
import { SkLabel } from '@/components/ui-kit/primitives/sk-label';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { sendOtp, verifyOtp } from './actions';

type Step = 'phone' | 'otp';

export default function LoginPage() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSendOtp() {
    setErrorMsg('');
    startTransition(async () => {
      const result = await sendOtp(phone);
      if (result.error) {
        setErrorMsg(result.error.message);
        return;
      }
      setStep('otp');
    });
  }

  function handleVerifyOtp() {
    setErrorMsg('');
    startTransition(async () => {
      const result = await verifyOtp(phone, otp);
      if (result?.error) {
        setErrorMsg(result.error.message);
      }
    });
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--sk-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        gap: 32,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{
            alignSelf: 'flex-start',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--sk-text-2)',
            textDecoration: 'none',
          }}
        >
          Kembali
        </Link>

        <WordLogo width={125} height={32} />

        {step === 'phone' ? (
          <>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--sk-text)', margin: 0 }}>
                Masuk ke akunmu
              </h1>
              <p style={{ fontSize: 14, color: 'var(--sk-text-2)', marginTop: 6 }}>
                Kami kirim kode 6 angka ke nomor HP-mu.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SkLabel htmlFor="phone">Nomor HP</SkLabel>
              <SkInput
                id="phone"
                type="tel"
                placeholder="+6281234567000"
                value={phone}
                onChange={setPhone}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                inputMode="tel"
                autoComplete="tel"
              />
            </div>

            {errorMsg && (
              <p style={{ fontSize: 13, color: 'var(--sk-danger)', margin: 0 }}>{errorMsg}</p>
            )}

            <SkButton
              variant="brand"
              size="lg"
              onClick={handleSendOtp}
              disabled={isPending || !phone.trim()}
              style={{ width: '100%' }}
            >
              {isPending ? 'Mengirim...' : 'Kirim Kode'}
            </SkButton>
          </>
        ) : (
          <>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--sk-text)', margin: 0 }}>
                Masukkan kode OTP
              </h1>
              <p style={{ fontSize: 14, color: 'var(--sk-text-2)', marginTop: 6 }}>
                Kode 6 angka sudah dikirim ke <span style={{ fontWeight: 600 }}>{phone}</span>.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SkLabel htmlFor="otp">Kode OTP</SkLabel>
              <SkInput
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(v) => setOtp(v.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </div>

            {errorMsg && (
              <p style={{ fontSize: 13, color: 'var(--sk-danger)', margin: 0 }}>{errorMsg}</p>
            )}

            <SkButton
              variant="brand"
              size="lg"
              onClick={handleVerifyOtp}
              disabled={isPending || otp.length < 6}
              style={{ width: '100%' }}
            >
              {isPending ? 'Memverifikasi...' : 'Masuk'}
            </SkButton>

            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setErrorMsg('');
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 14,
                color: 'var(--sk-text-2)',
                cursor: 'pointer',
                textDecoration: 'underline',
                textAlign: 'center',
              }}
            >
              Ganti nomor HP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
