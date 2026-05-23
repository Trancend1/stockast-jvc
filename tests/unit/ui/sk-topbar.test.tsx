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
});
