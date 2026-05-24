import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'scripts/seed-dimsum.ts'), 'utf8');

describe('seed-dimsum auth contract', () => {
  it('creates or reuses a confirmed phone auth user for OTP login', () => {
    expect(source).toContain('phone: SEED_PHONE');
    expect(source).toContain('email: SEED_EMAIL');
    expect(source).toContain('password: SEED_PASSWORD');
    expect(source).toContain('phone_confirm: true');
    expect(source).toContain('email_confirm: true');
    expect(source).toContain('auth.admin.createUser');
    expect(source).toContain('auth.admin.listUsers');
    expect(source).toContain('normalizePhone(candidate.phone) === normalizedPhone');
  });

  it('binds the dimsum public user and membership to the auth user id', () => {
    expect(source).toContain('const authUserId = await ensureAuthUser()');
    expect(source).toContain("await upsert('users', { id: authUserId, phone: SEED_PHONE }, 'id')");
    expect(source).toContain('owner_id: authUserId');
    expect(source).toContain('user_id:         authUserId');
  });
});
