type ErrorLike = {
  code?: unknown;
  message?: unknown;
};

/**
 * Thrown when a query targets a table that does not exist in the Supabase
 * schema cache (PostgREST PGRST205). Callers can either swallow it for
 * graceful degradation on reads, or surface it as SERVICE_UNAVAILABLE on
 * writes so the UI can prompt running `pnpm db:reset`.
 */
export class MissingTableError extends Error {
  readonly code = 'MISSING_TABLE' as const;
  constructor(public readonly table: string, public override readonly cause?: unknown) {
    super(
      `Tabel '${table}' belum ada di Supabase. Jalankan 'pnpm db:reset' atau apply migrations.`,
    );
    this.name = 'MissingTableError';
  }
}

export function isMissingTableError(error: unknown, tableName: string): boolean {
  if (error instanceof MissingTableError) return error.table === tableName;
  const message = getErrorMessage(error);
  if (!message) return false;

  const tableMarkers = [`'public.${tableName}'`, `"public.${tableName}"`, tableName];
  const mentionsTable = tableMarkers.some((marker) => message.includes(marker));
  const mentionsSchemaCache = message.toLowerCase().includes('schema cache');
  const code = getErrorCode(error);

  return mentionsTable && (mentionsSchemaCache || code === 'PGRST205');
}

/**
 * Throws MissingTableError if the Supabase error is a missing-table error
 * for the given table. Otherwise returns false. Read-side callers can use
 * `isMissingTableError` directly to swallow.
 */
export function throwIfMissingTable(error: unknown, tableName: string): void {
  if (isMissingTableError(error, tableName)) {
    throw new MissingTableError(tableName, error);
  }
}

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const maybe = (error as ErrorLike).message;
    return typeof maybe === 'string' ? maybe : null;
  }
  return null;
}

function getErrorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null) {
    const maybe = (error as ErrorLike).code;
    return typeof maybe === 'string' ? maybe : null;
  }
  return null;
}
