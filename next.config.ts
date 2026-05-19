import type { NextConfig } from 'next';

// Voice input opens the microphone. Permissions-Policy must be relaxed for
// it to work — read the env directly here (env.ts can't run at config-load
// time without dragging Zod into the build graph).
const voiceInputEnabled = process.env.FEATURE_VOICE_INPUT === 'true';
const microphonePolicy = voiceInputEnabled ? 'microphone=(self)' : 'microphone=()';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: `camera=(), ${microphonePolicy}, geolocation=()`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
