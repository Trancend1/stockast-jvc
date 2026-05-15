import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Stockast — Catat singkat, belanja tepat',
    template: '%s · Stockast',
  },
  description:
    'Asisten belanja harian untuk pedagang makanan kecil Indonesia. Catat stok 30 detik, tahu belanja besok.',
  applicationName: 'Stockast',
  authors: [{ name: 'Stockast' }],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Stockast',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f26f1b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
