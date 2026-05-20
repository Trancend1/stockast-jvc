import { IconCloud, IconRain, IconSun } from '@/components/ui-kit/icons';

export type SkWeatherChipKind = 'sun' | 'cloud' | 'rain';

export interface SkWeatherChipProps {
  kind?: SkWeatherChipKind;
  time?: string;
}

export function SkWeatherChip({ kind = 'rain', time = 'Sore' }: SkWeatherChipProps) {
  const Icon = kind === 'sun' ? IconSun : kind === 'cloud' ? IconCloud : IconRain;
  const label = kind === 'sun' ? 'Cerah' : kind === 'cloud' ? 'Berawan' : 'Hujan';
  return (
    <span
      className="sk-pill"
      style={{
        background: 'var(--sk-surface-2)',
        color: 'var(--sk-text-2)',
        fontWeight: 500,
        padding: '5px 10px 5px 8px',
      }}
    >
      <Icon size={13} />
      <span>
        {time} · {label}
      </span>
    </span>
  );
}
