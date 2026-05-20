'use client';

import type { ReactNode } from 'react';
import { IconClose } from '@/components/ui-kit/icons';

export interface SkSheetProps {
  children?: ReactNode;
  title?: ReactNode;
  onClose?: () => void;
  height?: number;
}

export function SkSheet({ children, title, onClose }: SkSheetProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--sk-scrim)',
        display: 'flex',
        alignItems: 'flex-end',
        animation: 'sk-fade 200ms var(--sk-ease) both',
        zIndex: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          background: 'var(--sk-bg)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          animation: 'sk-rise 320ms var(--sk-ease) both',
          maxHeight: '92%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}>
          <span style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--sk-line-strong)' }} />
        </div>
        {title && (
          <div
            style={{
              padding: '12px 20px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: '-0.015em' }}>
              {title}
            </h3>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="sk-btn"
                data-variant="ghost"
                data-size="sm"
                aria-label="Tutup"
                style={{ width: 32, height: 32, padding: 0 }}
              >
                <IconClose size={18} />
              </button>
            )}
          </div>
        )}
        <div style={{ overflow: 'auto', padding: '0 20px 24px' }}>{children}</div>
      </div>
    </div>
  );
}
