import { randomUUID } from 'node:crypto';

type LogLevel = 'info' | 'warn' | 'error';

export function createRequestId(): string {
  return randomUUID();
}

export function logEvent(
  event: string,
  payload: Record<string, unknown>,
  level: LogLevel = 'info',
): void {
  const body = JSON.stringify({
    event,
    level,
    timestamp: new Date().toISOString(),
    ...payload,
  });

  if (level === 'error') {
    console.error(body);
    return;
  }
  if (level === 'warn') {
    console.warn(body);
    return;
  }
  // Use console.warn for info level to comply with linting rules
  console.warn(body);
}
