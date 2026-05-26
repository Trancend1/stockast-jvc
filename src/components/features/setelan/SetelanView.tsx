'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { ComponentType } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { SkInput } from '@/components/ui-kit/primitives/sk-input';
import { SkLabel } from '@/components/ui-kit/primitives/sk-label';
import { SkSelect } from '@/components/ui-kit/primitives/sk-select';
import { SkTextarea } from '@/components/ui-kit/primitives/sk-textarea';
import { EmptyState, NotebookMark } from '@/components/ui/illustration';
import { useSubuhMode } from '@/hooks/use-subuh-mode';
import type { SubuhOverride } from '@/lib/subuh-mode';
import { applyOnboardingProfile } from '@/app/actions/onboarding';
import { signOutCurrentDevice } from '@/app/setelan/actions';
import { readOnboardingState, writeOnboardingState } from '@/lib/onboarding-state';
import { LOCATION_GROUPS, findLocation } from '@/lib/config/locations';
import { THRESHOLDS } from '@/lib/config/thresholds';
import { setelan as t } from '@/lib/copy/setelan';
import type { SkIconProps } from '@/components/ui-kit/icons/sk-icons';
import {
  IconEdit,
  IconHistory,
  IconInfo,
  IconMoon,
  IconNote,
  IconShop,
  IconUnlock,
} from '@/components/ui-kit/icons';

type ProfileDraft = {
  warungName: string;
  location: string;
  menu: string;
};

const SUBUH_SEGMENTS: { label: string; value: SubuhOverride }[] = [
  { label: 'Auto', value: null },
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' },
];

function readProfile(): ProfileDraft {
  const s = readOnboardingState();
  return {
    warungName: s?.warungName ?? '',
    location: s?.location ?? '',
    menu: s?.menu ?? '',
  };
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      style={{
        fontFamily: 'var(--sk-font-serif)',
        fontStyle: 'italic',
        fontSize: 12,
        color: 'var(--sk-text-3)',
        padding: '0 4px 7px',
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

interface RowProps {
  icon: ComponentType<SkIconProps>;
  title: string;
  detail?: string;
  trailing?: React.ReactNode;
  last?: boolean;
}

function Row({ icon: Icon, title, detail, trailing, last }: RowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderBottom: last ? 'none' : '1px solid var(--sk-line)',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 7,
          flexShrink: 0,
          background: 'var(--sk-surface-2)',
          color: 'var(--sk-text-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{title}</p>
        {detail ? (
          <p
            style={{
              fontSize: 11.5,
              color: 'var(--sk-text-3)',
              margin: 0,
              marginTop: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {detail}
          </p>
        ) : null}
      </div>
      {trailing}
    </div>
  );
}

export function SetelanView() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<ProfileDraft>(readProfile);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState<ProfileDraft>(profile);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSigningOut, startSignOut] = React.useTransition();
  const { override, setOverride } = useSubuhMode();

  function startEdit() {
    setDraft(profile);
    setError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError(null);
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError(null);

    const result = await applyOnboardingProfile({
      warungName: draft.warungName,
      location: draft.location,
      menu: draft.menu,
    });

    if (result.error) {
      setError(result.error.message ?? t.profil.error_generic);
      setSaving(false);
      return;
    }

    const nextProfile = {
      warungName: draft.warungName.trim(),
      location: draft.location,
      menu: draft.menu.trim(),
    };
    const stored = readOnboardingState();
    writeOnboardingState({
      ...nextProfile,
      completedAt: stored?.completedAt ?? new Date().toISOString(),
    });
    setProfile(nextProfile);
    setSaving(false);
    setEditing(false);
  }

  const locationLabel = findLocation(profile.location)?.label ?? profile.location;
  const menuItems = profile.menu
    ? profile.menu
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const menuCount = menuItems.length;
  const menuDetail =
    menuCount > 0
      ? `${menuCount} item - ${menuItems.slice(0, 2).join(', ')}${menuCount > 2 ? '...' : ''}`
      : t.profil.menu_empty;

  return (
    <AppLayout warungName={profile.warungName}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '14px 16px 32px' }}>
        <div className="sk-card sk-grain" style={{ padding: '14px 14px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 11,
                flexShrink: 0,
                background: 'var(--sk-surface-2)',
                border: '1px solid var(--sk-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconShop size={24} style={{ color: 'var(--sk-text-2)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: 'var(--sk-font-serif)',
                  fontStyle: 'italic',
                  fontSize: 17.5,
                  fontWeight: 600,
                  lineHeight: 1.1,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {profile.warungName || 'Warung kamu'}
              </p>
              <p
                style={{
                  fontSize: 11.5,
                  color: 'var(--sk-text-3)',
                  margin: 0,
                  marginTop: 3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {locationLabel || '-'} {menuCount > 0 ? `- ${menuCount} menu` : ''}
              </p>
            </div>
            <button
              type="button"
              className="sk-btn"
              data-variant="ghost"
              data-size="sm"
              onClick={startEdit}
              aria-label="Ubah profil"
              style={{ width: 34, height: 34, padding: 0, flexShrink: 0 }}
            >
              <IconEdit size={16} />
            </button>
          </div>
        </div>

        {editing ? (
          <div className="sk-card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <SkLabel htmlFor="set-warung-name" hint={t.profil.nama_hint}>
                  {t.profil.nama_warung}
                </SkLabel>
                <SkInput
                  id="set-warung-name"
                  value={draft.warungName}
                  onChange={(v) => setDraft((d) => ({ ...d, warungName: v }))}
                  maxLength={THRESHOLDS.ONBOARDING.WARUNG_NAME_MAX}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <SkLabel htmlFor="set-location">{t.profil.kota}</SkLabel>
                <SkSelect
                  id="set-location"
                  value={draft.location}
                  onChange={(v) => setDraft((d) => ({ ...d, location: v }))}
                >
                  <option value="" disabled>
                    Pilih kota/kabupaten
                  </option>
                  {LOCATION_GROUPS.map((group) => (
                    <optgroup key={group.province} label={group.province}>
                      {group.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </SkSelect>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <SkLabel htmlFor="set-menu" hint={t.profil.menu_hint}>
                  {t.profil.menu_utama}
                </SkLabel>
                <SkTextarea
                  id="set-menu"
                  rows={3}
                  value={draft.menu}
                  onChange={(v) => setDraft((d) => ({ ...d, menu: v }))}
                  maxLength={THRESHOLDS.ONBOARDING.MENU_LIST_MAX_CHARS}
                  placeholder="lele, ayam, nila, mujair"
                />
              </div>

              {error ? (
                <p role="alert" style={{ fontSize: 12.5, color: 'var(--sk-danger)', margin: 0 }}>
                  {error}
                </p>
              ) : null}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <SkButton variant="secondary" size="md" full onClick={cancelEdit} disabled={saving}>
                  {t.profil.batal}
                </SkButton>
                <SkButton
                  variant="brand"
                  size="md"
                  full
                  onClick={handleSave}
                  disabled={
                    saving ||
                    draft.warungName.trim().length === 0 ||
                    draft.location.length === 0 ||
                    draft.menu.trim().length === 0
                  }
                >
                  {saving ? t.profil.menyimpan : t.profil.simpan}
                </SkButton>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <SectionLabel>{t.profil.section}</SectionLabel>
              <div className="sk-card" style={{ padding: 0, overflow: 'hidden' }}>
                <Row
                  icon={IconShop}
                  title={t.profil.nama_warung}
                  detail={profile.warungName || '-'}
                />
                <Row icon={IconHistory} title={t.profil.kota} detail={locationLabel || '-'} />
                <Row icon={IconNote} title={t.profil.menu_utama} detail={menuDetail} last />
              </div>
            </div>

            <div>
              <SectionLabel>{t.autentikasi.section}</SectionLabel>
              <div className="sk-card" style={{ padding: 0, overflow: 'hidden' }}>
                <Row
                  icon={IconUnlock}
                  title={t.autentikasi.login_otp}
                  detail={t.autentikasi.login_otp_desc}
                  trailing={
                    <SkButton variant="ghost" size="sm" onClick={() => router.push('/login')}>
                      {t.autentikasi.buka}
                    </SkButton>
                  }
                />
                <Row
                  icon={IconUnlock}
                  title={t.autentikasi.logout}
                  detail={t.autentikasi.logout_desc}
                  trailing={
                    <SkButton
                      variant="ghost"
                      size="sm"
                      disabled={isSigningOut}
                      onClick={() => startSignOut(() => void signOutCurrentDevice())}
                    >
                      {t.autentikasi.keluar}
                    </SkButton>
                  }
                  last
                />
                <div
                  style={{
                    borderTop: '1px solid var(--sk-line)',
                    padding: '8px 14px 12px',
                  }}
                >
                  <EmptyState
                    icon={<NotebookMark size={52} />}
                    title={t.autentikasi.empty_title}
                    description={t.autentikasi.empty_desc}
                    action={
                      <SkButton
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push('/login')}
                        style={{ width: '100%' }}
                      >
                        {t.autentikasi.empty_action}
                      </SkButton>
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <SectionLabel>{t.tampilan.section}</SectionLabel>
          <div className="sk-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  flexShrink: 0,
                  background: 'var(--sk-surface-2)',
                  color: 'var(--sk-text-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconMoon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{t.tampilan.subuh_label}</p>
                <p style={{ fontSize: 11.5, color: 'var(--sk-text-3)', margin: 0, marginTop: 1 }}>
                  02:00 - 05:30 otomatis
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  background: 'var(--sk-surface-2)',
                  padding: 1.5,
                  borderRadius: 7,
                  fontSize: 11.5,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {SUBUH_SEGMENTS.map((seg) => {
                  const isActive = override === seg.value;
                  return (
                    <button
                      key={seg.label}
                      type="button"
                      onClick={() => setOverride(seg.value)}
                      style={{
                        padding: '4px 9px',
                        borderRadius: 6,
                        background: isActive ? 'var(--sk-surface)' : 'transparent',
                        color: isActive ? 'var(--sk-text)' : 'var(--sk-text-3)',
                        boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                        border: 0,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontWeight: 600,
                        fontSize: 11.5,
                        lineHeight: 1,
                      }}
                    >
                      {seg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>{t.tentang.section}</SectionLabel>
          <div className="sk-card" style={{ padding: 0, overflow: 'hidden' }}>
            <Row
              icon={IconInfo}
              title={t.tentang.app_name}
              detail={`v${t.tentang.versi_value} - ${t.tentang.tagline}`}
              last
            />
          </div>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontFamily: 'var(--sk-font-serif)',
            fontStyle: 'italic',
            fontSize: 11.5,
            color: 'var(--sk-text-3)',
            padding: '4px 0 8px',
            margin: 0,
          }}
        >
          Dibuat untuk pedagang Indonesia - 2026
        </p>
      </div>
    </AppLayout>
  );
}
