import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkSelect } from '@/components/ui-kit/primitives/sk-select';

describe('SkSelect', () => {
  it('renders a styled select primitive with the shared select class', () => {
    render(
      <SkSelect aria-label="Kota" value="" onChange={() => undefined}>
        <option value="">Pilih kota/kabupaten</option>
      </SkSelect>,
    );

    expect(screen.getByRole('combobox', { name: 'Kota' })).toHaveClass('sk-input', 'sk-select');
  });
});
