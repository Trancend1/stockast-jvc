'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/db/supabase-client';

export async function signOutCurrentDevice(): Promise<void> {
  const db = await createServerClient();
  await db.auth.signOut({ scope: 'local' });
  redirect('/login');
}
