import { useQueries } from "@tanstack/react-query";

import {
  type Tag,
  type TagGroup,
  fetchTagGroupsQueryOptions,
  fetchTagsQueryOptions,
} from "@bsport/api-cdp/tags";
import type { Fetch } from "@bsport/fetch";

import {
  getTagIdToTagGroupRecord,
  getTagIdToTagRecord,
} from "./use-tags-aggregations";

const combineTagsAndGroups = (
  data: [
    { data?: Tag[]; isLoading: boolean },
    { data?: TagGroup[]; isLoading: boolean },
  ],
) => {
  const [tagsResult, tagGroupsResult] = data;
  const { data: tags, isLoading: isLoadingTags } = tagsResult;
  const { data: tagGroups, isLoading: isLoadingTagGroups } = tagGroupsResult;

  return {
    tags,
    tagGroups,
    tagIdToTagRecord: getTagIdToTagRecord({ tags }),
    tagIdToTagGroupRecord: getTagIdToTagGroupRecord({ tags, tagGroups }),
    isLoading: isLoadingTagGroups || isLoadingTags,
  };
};

const DEFAULT_STALE_TIME = 5 * 60 * 1000;

/**
 * Fetch tags and tags groups, and group them in a convenient manner for Selectors
 */
export const useGroupedTagsQuery = (fetch: Fetch, staleTime?: number) => {
  const finalStaleTime = staleTime != null ? staleTime : DEFAULT_STALE_TIME;

  const tagsQueryOptions = {
    ...fetchTagsQueryOptions(fetch),
    staleTime: finalStaleTime,
  };

  const tagGroupsQueryOptions = {
    ...fetchTagGroupsQueryOptions(fetch),
    staleTime: finalStaleTime,
  };

  return useQueries({
    queries: [tagsQueryOptions, tagGroupsQueryOptions],
    combine: combineTagsAndGroups,
  });
};
