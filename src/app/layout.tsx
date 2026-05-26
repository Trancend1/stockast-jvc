import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Newsreader, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import { SubuhModeProvider } from '@/components/features/subuh/SubuhModeProvider';
import { RegisterServiceWorker } from '@/components/pwa/RegisterServiceWorker';
import { ONBOARDING_STORAGE_KEY } from '@/lib/onboarding-state';
import {
  SUBUH_CLASS_NAME,
  SUBUH_DATA_ATTR,
  SUBUH_END_MINUTES,
  SUBUH_START_MINUTES,
  SUBUH_STORAGE_KEY,
} from '@/lib/subuh-mode';
import './globals.css';
import '@/styles/ui-kit-tokens.css';
import '@/styles/ui-kit-utilities.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-serif',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-mono',
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
    icon: [{ url: '/icons/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icons/icon.svg', type: 'image/svg+xml' }],
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
  const fontVariables = [
    plusJakartaSans.variable,
    newsreader.variable,
    jetbrainsMono.variable,
  ].join(' ');
  return (
    <html lang="id" className={fontVariables} suppressHydrationWarning>
      <body>
        <SubuhBootstrapScript />
        <SubuhModeProvider>
          <RegisterServiceWorker />
          {children}
        </SubuhModeProvider>
      </body>
    </html>
  );
}

function SubuhBootstrapScript() {
  const code = `
(function () {
  try {
    var onb = window.localStorage.getItem(${JSON.stringify(ONBOARDING_STORAGE_KEY)});
    var hasUser = onb ? !!JSON.parse(onb).completedAt : false;
    if (!hasUser) return;
    var raw = window.localStorage.getItem(${JSON.stringify(SUBUH_STORAGE_KEY)});
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(new Date());
    var hour = Number((parts.find(function (p) { return p.type === 'hour'; }) || {}).value || 0);
    var minute = Number((parts.find(function (p) { return p.type === 'minute'; }) || {}).value || 0);
    var minutes = hour * 60 + minute;
    var active = raw === 'on' || (raw !== 'off' && minutes >= ${SUBUH_START_MINUTES} && minutes < ${SUBUH_END_MINUTES});
    document.documentElement.classList.toggle(${JSON.stringify(SUBUH_CLASS_NAME)}, active);
    document.documentElement.setAttribute(${JSON.stringify(SUBUH_DATA_ATTR)}, active ? 'on' : 'off');
  } catch (error) {}
})();`;

  return (
    <Script id="subuh-mode-bootstrap" strategy="beforeInteractive">
      {code}
    </Script>
  );
}
