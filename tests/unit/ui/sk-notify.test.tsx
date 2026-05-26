import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Banner, Toast } from '@/components/ui-kit/notifications';

describe('notifications density', () => {
  it('keeps toast compact while preserving hierarchy', () => {
    const { container, getByLabelText } = render(
      <Toast
        kind="success"
        title="Sudah disalin!"
        message="Tinggal paste ke WhatsApp langganan."
        onClose={() => undefined}
      />,
    );

    const root = container.firstElementChild as HTMLElement;
    const iconBox = root.firstElementChild as HTMLElement;
    const closeButton = getByLabelText('Tutup');

    expect(root).toHaveStyle({
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '11px',
      maxWidth: '320px',
    });
    expect(iconBox).toHaveStyle({
      width: '24px',
      height: '24px',
      borderRadius: '7px',
    });
    expect(closeButton).toHaveStyle({
      width: '24px',
      height: '24px',
    });
  });

  it('keeps info banner compact and action-friendly', () => {
    const { container } = render(
      <Banner
        kind="info"
        title="pakai data tersimpan"
        message="Kartu ini dari cache terakhir. Refresh kalau stok sudah berubah."
        action={<button type="button">Hitung ulang</button>}
      />,
    );

    const root = container.firstElementChild as HTMLElement;
    const iconBox = root.firstElementChild as HTMLElement;

    expect(root).toHaveStyle({
      gap: '12px',
      padding: '10px 12px',
      borderRadius: '9px',
    });
    expect(iconBox).toHaveStyle({
      width: '28px',
      height: '28px',
      borderRadius: '7px',
    });
  });
});
