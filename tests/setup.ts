import '@testing-library/jest-dom/vitest';

const testEnvDefaults: Record<string, string> = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-anon-key-for-tests',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  SUPABASE_SERVICE_ROLE_KEY: 'placeholder-service-role-key-for-tests',
  GROQ_API_KEY: 'placeholder-groq-key-for-tests',
};

for (const [key, value] of Object.entries(testEnvDefaults)) {
  process.env[key] ??= value;
}
