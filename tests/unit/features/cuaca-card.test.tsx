import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CuacaCard } from '@/components/features/cuaca/CuacaCard';

describe('CuacaCard', () => {
  it('renders compact weather signal without repeated time/date copy', () => {
    render(
      <CuacaCard
        weather={{
          serviceDate: '2026-05-20',
          adm4Code: '33.73.01.1001',
          category: 'mendung',
          label: 'Mendung',
          hint: 'Pagi mendung, stok normal',
          source: 'bmkg',
          fetchedAt: '2026-05-19T00:00:00.000Z',
          cacheHit: false,
          cacheLayer: 'none',
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: /cerah|mendung|hujan deras/i })).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
    expect(screen.queryByText(/besok/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/catatan:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pagi\s*·/i)).not.toBeInTheDocument();
  });
});
