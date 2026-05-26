'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { IconArrowL } from '@/components/ui-kit/icons';

export type SkTopBarMode = 'default' | 'task';
export type SkTopBarStatus = 'synced' | 'pending';

export interface SkTopBarProps {
  mode?: SkTopBarMode;
  title?: ReactNode;
  warungName?: string;
  date?: ReactNode;
  status?: SkTopBarStatus;
  onBack?: () => void;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export function SkTopBar({
  mode = 'default',
  title,
  warungName,
  date,
  status,
  onBack,
  leading,
  trailing,
}: SkTopBarProps) {
  if (mode === 'task') {
    const leadingControl = leading ?? (onBack ? <BackButton onBack={onBack} /> : null);
    return (
      <div
        className="sk-topbar"
        style={{
          display: 'grid',
          gridTemplateColumns: '40px minmax(0, 1fr) auto',
          gap: 6,
          paddingTop: 6,
          paddingBottom: 6,
        }}
      >
        <div style={{ justifySelf: 'start', minWidth: 36 }}>{leadingControl}</div>
        <div
          style={{
            minWidth: 0,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 600,
            alignSelf: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
        <div style={{ justifySelf: 'end', minWidth: 36 }}>{trailing}</div>
      </div>
    );
  }
  return (
    <div className="sk-topbar" style={{ paddingTop: 14, paddingBottom: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14.5, fontWeight: 680, letterSpacing: '-0.012em' }}>
            {formatWarungName(warungName)}
          </span>
          {status && (
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: status === 'synced' ? 'var(--sk-success)' : 'var(--sk-warn)',
                marginTop: 1,
              }}
            />
          )}
        </div>
        {date && (
          <span style={{ fontSize: 11.5, color: 'var(--sk-text-3)', fontWeight: 500 }}>{date}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 4 }}>{trailing}</div>
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="sk-btn"
      data-variant="ghost"
      data-size="sm"
      aria-label="Kembali"
      style={{ width: 32, height: 32, padding: 0 }}
    >
      <IconArrowL size={16} />
    </button>
  );
}

function formatWarungName(name?: string): string {
  const trimmed = name?.trim();
  if (!trimmed) return 'Warung kamu';
  return /^warung\b/i.test(trimmed) ? trimmed : `Warung ${trimmed}`;
}
