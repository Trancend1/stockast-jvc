import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RiwayatList } from '@/components/features/riwayat/RiwayatList';
import {
  deleteRiwayatDay,
  getRiwayat7d,
  getRiwayatEditorData,
  updateRiwayatDay,
} from '@/app/actions/riwayat';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/app/actions/riwayat', () => ({
  deleteRiwayatDay: vi.fn(),
  getRiwayat7d: vi.fn(),
  getRiwayatEditorData: vi.fn(),
  updateRiwayatDay: vi.fn(),
}));

vi.mock('@/components/layout/AppLayout', () => ({
  AppLayout: ({ children, contentWidth }: { children: React.ReactNode; contentWidth?: string }) => (
    <main data-testid="riwayat-layout" data-content-width={contentWidth}>
      {children}
    </main>
  ),
}));

vi.mock('@/components/ui-kit/illustrations/empty-states', () => ({
  EmptyPanel: ({ title, body, cta }: { title: string; body: string; cta?: React.ReactNode }) => (
    <section>
      <h2>{title}</h2>
      <p>{body}</p>
      {cta}
    </section>
  ),
  IllustError: () => null,
  IllustNoData: () => null,
  IllustNoHistory: () => null,
}));

vi.mock('@/components/ui-kit/primitives/sk-card', () => ({
  SkCard: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
}));

vi.mock('@/components/ui-kit/primitives/sk-pill', () => ({
  SkPill: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('@/components/ui-kit/primitives/sk-button', () => ({
  SkButton: ({
    children,
    onClick,
    disabled,
    type = 'button',
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }) => (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui-kit/primitives/sk-sheet', () => ({
  SkSheet: ({
    children,
    title,
    onClose,
  }: {
    children: React.ReactNode;
    title?: React.ReactNode;
    onClose?: () => void;
  }) => (
    <section data-testid="riwayat-sheet">
      <div>{title}</div>
      {onClose ? <button onClick={onClose}>Tutup</button> : null}
      {children}
    </section>
  ),
}));

vi.mock('@/components/ui-kit/primitives/sk-select', () => ({
  SkSelect: ({
    children,
    value,
    onChange,
    ...rest
  }: {
    children: React.ReactNode;
    value?: string;
    onChange?: (value: string) => void;
  }) => (
    <select value={value} onChange={(e) => onChange?.(e.target.value)} {...rest}>
      {children}
    </select>
  ),
}));

vi.mock('@/components/ui-kit/primitives/sk-input', () => ({
  SkInput: ({
    value,
    onChange,
    ...rest
  }: {
    value?: string;
    onChange?: (value: string) => void;
  }) => <input value={value} onChange={(e) => onChange?.(e.target.value)} {...rest} />,
}));

vi.mock('@/components/ui-kit/notifications', () => ({
  Toast: ({ title, message }: { title?: React.ReactNode; message?: React.ReactNode }) => (
    <section>
      {title ? <div>{title}</div> : null}
      {message ? <div>{message}</div> : null}
    </section>
  ),
}));

const DAY = {
  stockLogId: 'log-1',
  serviceDate: '2026-05-23',
  totalSold: 9,
  totalLeftover: 0,
  items: [{ menuItemId: 'menu-1', menuName: 'Siomay Ayam', sold: 9, leftover: 0, unit: 'porsi' }],
};

const MENU = [
  { menuItemId: 'menu-1', menuName: 'Siomay Ayam', unit: 'porsi' },
  { menuItemId: 'menu-2', menuName: 'Pao Ayam', unit: 'porsi' },
];

describe('RiwayatList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
    vi.mocked(getRiwayat7d).mockResolvedValue({
      data: {
        days: [DAY],
      },
      error: null,
    });
    vi.mocked(getRiwayatEditorData).mockResolvedValue({
      data: {
        day: DAY,
        menuItems: MENU,
      },
      error: null,
    });
  });

  it('uses the wide shell and renders sold and leftover in aligned metric columns', async () => {
    render(<RiwayatList />);

    expect(await screen.findByTestId('riwayat-shell')).toBeInTheDocument();
    expect(screen.getByTestId('riwayat-layout')).toHaveAttribute('data-content-width', 'wide');
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getAllByText('Laku').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sisa').length).toBeGreaterThan(0);
    expect(screen.getByTestId('riwayat-sold-menu-1')).toHaveTextContent('9');
    expect(screen.getByTestId('riwayat-leftover-menu-1')).toHaveTextContent('-');
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hapus' })).toBeInTheDocument();
  });

  it('opens the sheet, lets users add an item, and updates the day card after save', async () => {
    vi.mocked(updateRiwayatDay).mockResolvedValue({
      data: {
        day: {
          ...DAY,
          totalSold: 13,
          totalLeftover: 1,
          items: [
            DAY.items[0]!,
            { menuItemId: 'menu-2', menuName: 'Pao Ayam', sold: 4, leftover: 1, unit: 'porsi' },
          ],
        },
      },
      error: null,
    });

    render(<RiwayatList />);

    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }));

    expect(await screen.findByTestId('riwayat-sheet')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tambah item' }));

    fireEvent.change(screen.getByTestId('riwayat-item-menu-row-1'), {
      target: { value: 'menu-2' },
    });
    fireEvent.change(screen.getByTestId('riwayat-item-sold-row-1'), {
      target: { value: '4' },
    });
    fireEvent.change(screen.getByTestId('riwayat-item-leftover-row-1'), {
      target: { value: '1' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }));

    await waitFor(() =>
      expect(updateRiwayatDay).toHaveBeenCalledWith({
        stockLogId: 'log-1',
        items: [
          { menuItemId: 'menu-1', sold: 9, leftover: 0 },
          { menuItemId: 'menu-2', sold: 4, leftover: 1 },
        ],
      }),
    );
    await waitFor(() => expect(screen.queryByTestId('riwayat-sheet')).not.toBeInTheDocument());
    expect(screen.getByText('laku 13')).toBeInTheDocument();
    expect(screen.getByTestId('riwayat-sold-menu-2')).toHaveTextContent('4');
  });

  it('deletes one day and falls back to the empty state when it was the last card', async () => {
    vi.mocked(deleteRiwayatDay).mockResolvedValue({
      data: { stockLogId: 'log-1' },
      error: null,
    });

    render(<RiwayatList />);

    fireEvent.click(await screen.findByRole('button', { name: 'Hapus' }));

    await waitFor(() => expect(deleteRiwayatDay).toHaveBeenCalledWith('log-1'));
    expect(await screen.findByText('Belum ada catatan')).toBeInTheDocument();
  });
});
