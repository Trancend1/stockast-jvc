'use client';

import type { ComponentType } from 'react';
import {
  IconHistory,
  IconHome,
  IconNote,
  IconSettings,
  type SkIconProps,
} from '@/components/ui-kit/icons';

export type SkBottomNavId = 'home' | 'catat' | 'riwayat' | 'setelan';

interface NavItem {
  id: SkBottomNavId;
  label: string;
  Icon: ComponentType<SkIconProps>;
}

const ITEMS: ReadonlyArray<NavItem> = [
  { id: 'home', label: 'Beranda', Icon: IconHome },
  { id: 'catat', label: 'Catat', Icon: IconNote },
  { id: 'riwayat', label: 'Riwayat', Icon: IconHistory },
  { id: 'setelan', label: 'Setelan', Icon: IconSettings },
];

export interface SkBottomNavProps {
  active?: SkBottomNavId;
  onChange?: (id: SkBottomNavId) => void;
}

export function SkBottomNav({ active = 'home', onChange }: SkBottomNavProps) {
  return (
    <div className="sk-nav">
      {ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            className="sk-nav-item"
            data-active={isActive ? 'true' : 'false'}
            onClick={() => onChange?.(id)}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 22,
              }}
            >
              <Icon size={20} stroke={isActive ? 1.8 : 1.5} />
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -3,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--sk-brand)',
                  }}
                />
              )}
            </div>
            <span style={{ fontWeight: isActive ? 600 : 500 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
