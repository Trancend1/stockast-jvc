import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/lib/auth/session.ts'), 'utf8');

describe('local-first authenticated session contract', () => {
  it('does not ignore a real Supabase session when auth is not required', () => {
    expect(source).not.toContain('if (!flags.authRequired) return null');
    expect(source).not.toContain('if (!flags.authRequired) {');
    expect(source).toContain('const db = await createServerClient()');
    expect(source).toContain('await db.auth.getUser()');
  });

  it('still falls back to demo context only when no authenticated user exists', () => {
    expect(source).toContain('if (!user) {');
    expect(source).toContain('const { userId, outletId } = getDemoContext()');
    expect(source).toContain('return { userId, outletId, db: adminDb() }');
  });
});
