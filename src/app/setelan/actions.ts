'use server';

import { createServerClient } from '@/lib/db/supabase-client';
import { type ActionResult, fail } from '@/types/action-result';
import { redirect } from 'next/navigation';

export async function signOutCurrentDevice(): Promise<ActionResult<null>> {
  try {
    const db = await createServerClient();
    await db.auth.signOut({ scope: 'local' });
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'Gagal keluar.');
  }
  redirect('/login');
}
