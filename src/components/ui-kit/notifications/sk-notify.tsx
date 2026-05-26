'use client';

import * as React from 'react';
import type { CSSProperties, ComponentType, ReactNode } from 'react';
import {
  IconCheckCircle,
  IconClose,
  IconCloseCircle,
  IconInfo,
  IconSpark,
  IconWarnTriangle,
  type SkIconProps,
} from '@/components/ui-kit/icons';

export type ToneKind = 'info' | 'success' | 'warn' | 'danger' | 'brand';

interface ToneConf {
  color: string;
  soft: string;
  icon: ComponentType<SkIconProps>;
}

const TONE_MAP: Record<ToneKind, ToneConf> = {
  info: { color: 'var(--sk-text)', soft: 'var(--sk-surface-2)', icon: IconInfo },
  success: { color: 'var(--sk-success)', soft: 'var(--sk-success-soft)', icon: IconCheckCircle },
  warn: { color: 'var(--sk-warn)', soft: 'var(--sk-warn-soft)', icon: IconWarnTriangle },
  danger: { color: 'var(--sk-danger)', soft: 'var(--sk-danger-soft)', icon: IconCloseCircle },
  brand: { color: 'var(--sk-brand)', soft: 'var(--sk-brand-soft)', icon: IconSpark },
};

export interface ToastProps {
  kind?: ToneKind;
  title?: ReactNode;
  message?: ReactNode;
  onClose?: () => void;
}

export function Toast({ kind = 'success', title, message, onClose }: ToastProps) {
  const conf = TONE_MAP[kind];
  const Ic = conf.icon;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 12px',
        background: 'var(--sk-surface)',
        border: '1px solid var(--sk-line)',
        borderLeft: `3px solid ${conf.color}`,
        borderRadius: 11,
        boxShadow: 'var(--sk-shadow-lift)',
        maxWidth: 320,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 7,
          background: conf.soft,
          color: conf.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Ic size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em' }}>{title}</div>
        )}
        {message && (
          <div style={{ fontSize: 12, color: 'var(--sk-text-2)', marginTop: 1, lineHeight: 1.38 }}>
            {message}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="sk-btn"
          data-variant="ghost"
          data-size="sm"
          aria-label="Tutup"
          style={{ width: 24, height: 24, padding: 0, marginTop: -1, color: 'var(--sk-text-3)' }}
        >
          <IconClose size={13} />
        </button>
      )}
    </div>
  );
}

export interface BannerProps {
  kind?: ToneKind;
  title?: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
}

export function Banner({ kind = 'info', title, message, action }: BannerProps) {
  const conf = TONE_MAP[kind];
  const Ic = conf.icon;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        background: conf.soft,
        borderRadius: 9,
        color: 'var(--sk-text)',
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: 'var(--sk-surface)',
          color: conf.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 0 1px ${conf.color}22`,
        }}
      >
        <Ic size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 13, fontWeight: 700, color: conf.color }}>{title}</div>}
        {message && (
          <div style={{ fontSize: 12, color: 'var(--sk-text-2)', marginTop: 1, lineHeight: 1.35 }}>
            {message}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

export interface InlineAlertProps {
  kind?: ToneKind;
  title?: ReactNode;
  children?: ReactNode;
}

export function InlineAlert({ kind = 'warn', children, title }: InlineAlertProps) {
  const conf = TONE_MAP[kind];
  const Ic = conf.icon;
  const iconStyle: CSSProperties = { marginTop: 2, flexShrink: 0 };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '9px 10px',
        border: `1px dashed ${conf.color}`,
        borderRadius: 7,
        color: conf.color,
        background: conf.soft,
        fontSize: 12,
        lineHeight: 1.45,
      }}
    >
      <Ic size={14} style={iconStyle} />
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>}
        <div style={{ color: 'var(--sk-text-2)' }}>{children}</div>
      </div>
    </div>
  );
}

export interface PushPreviewProps {
  appName?: string;
  time?: ReactNode;
  title?: ReactNode;
  message?: ReactNode;
}

export function PushPreview({
  appName = 'Stockast',
  time = '03:12',
  title,
  message,
}: PushPreviewProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '9px 11px 11px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,0,0,0.05)',
        borderRadius: 12,
        boxShadow: '0 7px 18px rgba(0,0,0,0.14)',
        maxWidth: 304,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: 'var(--sk-text)',
          color: 'var(--sk-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: '-0.04em',
          flexShrink: 0,
        }}
      >
        S
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontSize: 11,
            color: '#3a3a3a',
            marginBottom: 2,
          }}
        >
          <span style={{ fontWeight: 600 }}>{appName.toUpperCase()}</span>
          <span>{time}</span>
        </div>
        <div
          style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1611', letterSpacing: '-0.005em' }}
        >
          {title}
        </div>
        <div style={{ fontSize: 12.5, color: '#3a3328', marginTop: 2, lineHeight: 1.35 }}>
          {message}
        </div>
      </div>
    </div>
  );
}

export type ActivityTone = 'danger' | 'warn' | 'success' | 'brand';

export interface ActivityDotProps {
  count?: number | string;
  tone?: ActivityTone;
  size?: number;
}

export function ActivityDot({ count, tone = 'danger', size = 16 }: ActivityDotProps) {
  const color =
    tone === 'danger'
      ? 'var(--sk-danger)'
      : tone === 'warn'
        ? 'var(--sk-warn)'
        : tone === 'success'
          ? 'var(--sk-success)'
          : 'var(--sk-brand)';
  return (
    <span
      style={{
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: count !== undefined ? size : 8,
        height: count !== undefined ? size : 8,
        padding: count !== undefined ? '0 4px' : 0,
        borderRadius: 999,
        background: color,
        color: '#FFF',
        fontSize: 10,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 0 2px var(--sk-bg)',
        lineHeight: 1,
      }}
    >
      {count}
    </span>
  );
}
