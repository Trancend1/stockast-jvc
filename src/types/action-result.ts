/**
 * Unified return shape for every Server Action.
 * Server Actions never throw to the client (ENGINEERING_STANDARDS.md §5);
 * they return one of the two branches below.
 */
export type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: ActionError };

export type ActionErrorCode =
  | 'AUTH_REQUIRED'
  | 'AUTH_FORBIDDEN'
  | 'INPUT_INVALID'
  | 'QUOTA_EXCEEDED'
  | 'AI_PARSE_FAILED'
  | 'AI_VALIDATION_FAILED'
  | 'WEATHER_FETCH_FAILED'
  | 'CONFLICT_STATE'
  | 'NOT_FOUND'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL';

export type ActionError = {
  code: ActionErrorCode;
  message: string;
  details?: Record<string, unknown>;
};

export function ok<T>(data: T): ActionResult<T> {
  return { data, error: null };
}

export function fail(code: ActionErrorCode, message: string, details?: Record<string, unknown>): ActionResult<never> {
  return { data: null, error: { code, message, details } };
}
