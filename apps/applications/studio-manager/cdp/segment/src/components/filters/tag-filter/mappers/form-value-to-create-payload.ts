import type { CreateTagFilterPayload } from "@bsport/api-cdp/smartlist";

import type { TagFilterFormValue } from "../types";
import { effectiveExcludedTagIds, effectiveIncludedTagIds } from "./tag-ids";

/**
 * Builds the `POST /tag_filter/` body from the current form state.
 */
export const toCreatePayload = (
  value: TagFilterFormValue,
): CreateTagFilterPayload => ({
  smartlist: value.smartlist,
  tags_included: effectiveIncludedTagIds(value),
  tags_excluded: effectiveExcludedTagIds(value),
});
