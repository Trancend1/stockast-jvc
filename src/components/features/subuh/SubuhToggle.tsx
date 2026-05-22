'use client';

import { IconMoon, IconSun } from '@/components/ui-kit/icons';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { useSubuhMode } from '@/hooks/use-subuh-mode';

export function SubuhToggle() {
  const { active, toggle } = useSubuhMode();
  const ToggleIcon = active ? IconSun : IconMoon;

  return (
    <SkButton
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={
        active ? 'Subuh Mode aktif. Ketuk untuk mode normal' : 'Mode normal. Ketuk untuk Subuh Mode'
      }
      title={active ? 'Subuh Mode aktif' : 'Mode normal'}
      variant={active ? 'brand' : 'secondary'}
      size="sm"
      data-icon-only="true"
    >
      <ToggleIcon size={16} />
    </SkButton>
  );
}
