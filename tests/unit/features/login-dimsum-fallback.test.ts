import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/app/login/actions.ts'), 'utf8');

describe('login Dimsum fallback contract', () => {
  it('allows the seed Dimsum phone to continue when Supabase phone provider is disabled', () => {
    expect(source).toContain('phone_provider_disabled');
    expect(source).toContain('isSeedDimsumLogin(trimmed)');
    expect(source).toContain('return ok(null)');
  });

  it('uses a fixed demo code to create a real Supabase session for the seed user', () => {
    expect(source).toContain('SEED_DIMSUM_OTP');
    expect(source).toContain('signInWithPassword');
    expect(source).toContain('email: SEED_DIMSUM_EMAIL');
    expect(source).toContain('password: SEED_DIMSUM_PASSWORD');
    expect(source).toContain('Kode demo Dimsum salah');
  });
});
