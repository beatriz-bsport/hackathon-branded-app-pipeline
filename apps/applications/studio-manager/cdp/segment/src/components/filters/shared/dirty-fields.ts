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

/**
 * Returns whether a React Hook Form `dirtyFields` subtree contains any dirty
 * leaf (`true`), including nested objects and arrays.
 *
 * @param node - A branch from `formState.dirtyFields` (or the whole object).
 */
export const hasNestedDirty = (node: unknown): boolean => {
  if (node === true) {
    return true;
  }
  if (node === undefined || node === null || node === false) {
    return false;
  }
  if (Array.isArray(node)) {
    return node.some((item) => hasNestedDirty(item));
  }
  if (typeof node === "object") {
    return Object.values(node as Record<string, unknown>).some((value) =>
      hasNestedDirty(value),
    );
  }
  return false;
};
