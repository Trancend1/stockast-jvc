import { describe, expect, it } from 'vitest';
import { upsertDemoOutletProfile } from '@/lib/db/queries/outlets';

function okResult(data: unknown = null) {
  return { data, error: null };
}

describe('upsertDemoOutletProfile', () => {
  it('recreates the demo identity and outlet profile when the seeded outlet is missing', async () => {
    const calls: Array<{ table: string; payload: unknown; options?: unknown }> = [];
    const db = {
      from(table: string) {
        return {
          upsert(payload: unknown, options?: unknown) {
            calls.push({ table, payload, options });
            return {
              select() {
                return {
                  single: async () =>
                    okResult({
                      id: 'outlet-1',
                      organization_id: 'org-1',
                      name: 'Warung Test',
                      location_label: 'Salatiga, Jawa Tengah',
                      adm4_code: '33.73.01.1001',
                    }),
                };
              },
              then(resolve: (value: unknown) => void) {
                resolve(okResult());
              },
            };
          },
        };
      },
    };

    const outlet = await upsertDemoOutletProfile(db as never, {
      userId: 'user-1',
      outletId: 'outlet-1',
      name: 'Warung Test',
      locationLabel: 'Salatiga, Jawa Tengah',
      adm4Code: '33.73.01.1001',
    });

    expect(outlet.id).toBe('outlet-1');
    expect(calls.map((call) => call.table)).toEqual([
      'users',
      'organizations',
      'memberships',
      'outlets',
    ]);
  });
});
