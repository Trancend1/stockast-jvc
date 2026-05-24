import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkTopBar } from '@/components/ui-kit/primitives/sk-topbar';

describe('SkTopBar', () => {
  it('shows a generic fallback when no warung name is available', () => {
    render(<SkTopBar mode="default" />);

    expect(screen.getByText('Warung kamu')).toBeInTheDocument();
  });

  it('does not duplicate the Warung prefix when the stored name already includes it', () => {
    render(<SkTopBar mode="default" warungName="Warung Maju Jaya" />);

    expect(screen.getByText('Warung Maju Jaya')).toBeInTheDocument();
    expect(screen.queryByText('Warung Warung Maju Jaya')).not.toBeInTheDocument();
  });

  it('keeps default identity on the left with the date under it and controls on the right', () => {
    render(
      <SkTopBar
        mode="default"
        warungName="Maju Jaya"
        date="Minggu, 24 Mei"
        trailing={<button type="button">Mode</button>}
      />,
    );

    expect(screen.getByText('Warung Maju Jaya')).toBeInTheDocument();
    expect(screen.getByText('Minggu, 24 Mei')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mode' })).toBeInTheDocument();
  });

  it('centers task title and accepts a voice control on the left', () => {
    render(
      <SkTopBar
        mode="task"
        title="Catat Stok"
        leading={<button type="button">Voice</button>}
        trailing={<button type="button">Mode</button>}
      />,
    );

    expect(screen.getByRole('button', { name: 'Voice' })).toBeInTheDocument();
    expect(screen.getByText('Catat Stok')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mode' })).toBeInTheDocument();
  });
});
