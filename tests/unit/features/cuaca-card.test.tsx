import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CuacaCard } from '@/components/features/cuaca/CuacaCard';

describe('CuacaCard', () => {
  it('renders compact weather signal without repeated time/date copy', () => {
    render(<CuacaCard serviceDate="2026-05-20" />);

    expect(screen.getByRole('heading', { name: /cerah|mendung|hujan deras/i })).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
    expect(screen.queryByText(/besok/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/catatan:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pagi\s*·/i)).not.toBeInTheDocument();
  });
});
