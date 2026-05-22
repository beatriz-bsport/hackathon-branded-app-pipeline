import type { TagFilter } from "@bsport/api-cdp/smartlist";

import type { TagFilterFormValue } from "../types";

/**
 * Maps a `TagFilter` row from `get_filters` into editor form state.
 */
export const mapTagFilterToFormValue = (
  filter: TagFilter,
): TagFilterFormValue => {
  const hasIncluded = filter.tags_included.length > 0;
  const hasExcluded = filter.tags_excluded.length > 0;

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    includeSectionEnabled: hasIncluded || (!hasIncluded && !hasExcluded),
    excludeSectionEnabled: hasExcluded,
    tagsIncluded: [...filter.tags_included],
    tagsExcluded: [...filter.tags_excluded],
  };
};
