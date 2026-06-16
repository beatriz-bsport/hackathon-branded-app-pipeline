/**
 * Extracts a user-facing message from a backend error by matching the first
 * known error code found in `customErrorCodes` against `codeMap`.
 * Uses duck-typing instead of `instanceof` to avoid issues with duplicate
 * class instances across bundled modules.
 * Returns `fallback` if the error has no `customErrorCodes` or no code matches.
 */
export function getErrorMessageFromCodes(
  error: unknown,
  codeMap: Partial<Record<number, string>>,
  fallback: string,
): string {
  const codes = (error as { customErrorCodes?: number[] })?.customErrorCodes;
  if (!Array.isArray(codes)) return fallback;

  for (const code of codes) {
    const message = codeMap[code];
    if (message !== undefined) return message;
  }

  return fallback;
}
