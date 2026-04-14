import type { Tag } from "@bsport/api-cdp/tags";

import { useFetchTagGroups } from "./use-fetch-tag-groups";
import { useFetchTags } from "./use-fetch-tags";

export const useGroupedTags = () => {
  const { data: tagGroups } = useFetchTagGroups();
  const { data: tags } = useFetchTags();

  return (
    tagGroups?.map((group) => {
      return {
        ...group,
        tags: group.tags.map((tagId) => tags?.[tagId]).filter(Boolean) as Tag[],
      };
    }) || []
  );
};
