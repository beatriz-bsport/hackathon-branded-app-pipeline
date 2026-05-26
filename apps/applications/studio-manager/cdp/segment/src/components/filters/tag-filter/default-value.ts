import type { TagFilterFormValue } from "./types";

/**
 * Default form state for a new tag filter draft.
 */
export const createDefaultTagFilterFormValue = (
  smartlistId: number,
): TagFilterFormValue => ({
  smartlist: smartlistId,
  includeSectionEnabled: true,
  excludeSectionEnabled: false,
  tagsIncluded: [],
  tagsExcluded: [],
});
