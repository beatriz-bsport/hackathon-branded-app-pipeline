import type { UpdateTagFilterPayload } from "@bsport/api-cdp/smartlist";

import type { TagFilterFormValue } from "../types";
import {
  effectiveExcludedTagIds,
  effectiveIncludedTagIds,
  haveSameTagIdMembers,
} from "./tag-ids";

/**
 * Builds a partial `PATCH /tag_filter/{id}/` body by comparing the submitted form
 * with the last-known server snapshot (`baseline`).
 */
export const buildTagFilterDirtyPatch = (
  value: TagFilterFormValue,
  baseline: TagFilterFormValue,
): UpdateTagFilterPayload => {
  const patch: UpdateTagFilterPayload = {};
  const nextIncluded = effectiveIncludedTagIds(value);
  const baselineIncluded = effectiveIncludedTagIds(baseline);
  if (!haveSameTagIdMembers(nextIncluded, baselineIncluded)) {
    patch.tags_included = nextIncluded;
  }

  const nextExcluded = effectiveExcludedTagIds(value);
  const baselineExcluded = effectiveExcludedTagIds(baseline);
  if (!haveSameTagIdMembers(nextExcluded, baselineExcluded)) {
    patch.tags_excluded = nextExcluded;
  }

  return patch;
};
