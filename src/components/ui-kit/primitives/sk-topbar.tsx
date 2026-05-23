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
  trailing?: ReactNode;
}

export function SkTopBar({
  mode = 'default',
  title,
  warungName,
  date,
  status,
  onBack,
  trailing,
}: SkTopBarProps) {
  if (mode === 'task') {
    return (
      <div
        className="sk-topbar"
        style={{
          display: 'grid',
          gridTemplateColumns: '44px minmax(0, 1fr) auto',
          gap: 8,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="sk-btn"
          data-variant="ghost"
          data-size="sm"
          aria-label="Kembali"
          style={{ width: 36, height: 36, padding: 0 }}
        >
          <IconArrowL size={18} />
        </button>
        <div
          style={{
            minWidth: 0,
            textAlign: 'center',
            fontSize: 15,
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
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.012em' }}>
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
          <span style={{ fontSize: 12, color: 'var(--sk-text-3)', fontWeight: 500 }}>{date}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>{trailing}</div>
    </div>
  );
}

function formatWarungName(name?: string): string {
  const trimmed = name?.trim();
  if (!trimmed) return 'Warung kamu';
  return /^warung\b/i.test(trimmed) ? trimmed : `Warung ${trimmed}`;
}
