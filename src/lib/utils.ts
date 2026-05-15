/**
 * Minimal class concatenation. Filters out falsy values.
 * No clsx/tailwind-merge yet — add when conditional classes proliferate.
 */
export function cn(
  ...inputs: Array<string | false | null | undefined>
): string {
  return inputs.filter(Boolean).join(' ');
}
