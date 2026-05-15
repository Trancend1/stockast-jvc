import 'server-only';
import { adminDb } from '../admin';
import type { AIAuditLogInsert } from '../types';

/**
 * Append-only AI audit log. Best-effort: failure to log does not break the
 * primary flow. Caller catches and ignores.
 */
export async function insertAIAuditLog(row: AIAuditLogInsert): Promise<void> {
  const { error } = await adminDb().from('ai_audit_logs').insert(row);
  if (error) {
    throw new Error(`insertAIAuditLog failed: ${error.message}`);
  }
}
