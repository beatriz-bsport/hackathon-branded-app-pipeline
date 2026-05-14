/**
 * Returns whether a React Hook Form dirty-field entry should be treated as
 * changed when building partial PATCH payloads.
 */
export const isDirtyFieldEntry = (entry: unknown): boolean => {
  if (entry === undefined || entry === null || entry === false) {
    return false;
  }
  if (Array.isArray(entry)) {
    return entry.length > 0;
  }
  return true;
};
