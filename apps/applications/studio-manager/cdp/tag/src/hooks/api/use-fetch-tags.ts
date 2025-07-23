import { useCallback, useEffect } from "react";

import {
  type Tag,
  type TagGroup,
  TagUsage,
  fetchTagGroupsAction,
  fetchTagUsagesAction,
  fetchTagsAction,
  selectTagGroups,
  selectTagMappedByTagId,
  selectTagUsageMap,
  selectTags,
  useTagStore,
} from "@bsport/store-cdp-tag";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseFetchTagParams = {
  onFetchTagSuccess?: (tagList: Tag[]) => void;
  onFetchTagFailure?: (error: Error) => void;
  onFetchTagGroupSuccess?: (tagGroupList: TagGroup[]) => void;
  onFetchTagGroupFailure?: (error: Error) => void;
  onFetchTagUsagesSuccess?: (tagUsageList: TagUsage[]) => void;
  onFetchTagUsagesFailure?: (error: Error) => void;
};

const _fetchTags = fetchTagsAction.bind(null, fetch);
const _fetchTagGroups = fetchTagGroupsAction.bind(null, fetch);
const _fetchTagUsages = fetchTagUsagesAction.bind(null, fetch);

/**
 * Hook for fetching tags, tag groups, and tag usages.
 *
 * @param params - Optional callbacks for handling fetch success and failure for tags, tag groups, and tag usages.
 * @param params.onFetchTagSuccess - Called with the list of tags when fetching tags succeeds.
 * @param params.onFetchTagFailure - Called with an error when fetching tags fails.
 * @param params.onFetchTagGroupSuccess - Called with the list of tag groups when fetching tag groups succeeds.
 * @param params.onFetchTagGroupFailure - Called with an error when fetching tag groups fails.
 * @param params.onFetchTagUsagesSuccess - Called with the list of tag usages when fetching tag usages succeeds.
 * @param params.onFetchTagUsagesFailure - Called with an error when fetching tag usages fails.
 * @returns Object containing loading states, fetch functions, and tag data from the store.
 */
export function useFetchTag({
  onFetchTagSuccess,
  onFetchTagFailure,
  onFetchTagGroupSuccess,
  onFetchTagGroupFailure,
  onFetchTagUsagesSuccess,
  onFetchTagUsagesFailure,
}: UseFetchTagParams = {}) {
  const [{ isLoading: isLoadingTags }, triggerFetchTags] = useAsync<
    typeof _fetchTags
  >({
    asyncFn: _fetchTags,
    onSuccess: ({ value }) => onFetchTagSuccess?.(value),
    onFailure: ({ error }) => onFetchTagFailure?.(error),
  });

  const [{ isLoading: isLoadingTagGroups }, triggerFetchTagGroups] = useAsync<
    typeof _fetchTagGroups
  >({
    asyncFn: _fetchTagGroups,
    onSuccess: ({ value }) => onFetchTagGroupSuccess?.(value),
    onFailure: ({ error }) => onFetchTagGroupFailure?.(error),
  });

  const [{ isLoading: isLoadingTagUsages }, triggerFetchTagUsages] = useAsync<
    typeof _fetchTagUsages
  >({
    asyncFn: _fetchTagUsages,
    onSuccess: ({ value }) => onFetchTagUsagesSuccess?.(value),
    onFailure: ({ error }) => onFetchTagUsagesFailure?.(error),
  });

  const tags = useTagStore((state) => selectTags(state));

  const tagsMappedByTagId = useTagStore((state) =>
    selectTagMappedByTagId(state),
  );

  const tagGroups = useTagStore((state) => selectTagGroups(state));

  const tagUsagesMap = useTagStore((state) => selectTagUsageMap(state));

  const fetchAllTagsInformation = useCallback(() => {
    Promise.allSettled([
      triggerFetchTags(),
      triggerFetchTagGroups(),
      triggerFetchTagUsages(),
    ]);
  }, [triggerFetchTags, triggerFetchTagGroups, triggerFetchTagUsages]);

  useEffect(() => {
    fetchAllTagsInformation();
  }, [fetchAllTagsInformation]);

  return {
    isLoadingTags,
    isLoadingTagGroups,
    isLoadingTagUsages,
    fetchTags: triggerFetchTags,
    fetchTagGroups: triggerFetchTagGroups,
    fetchTagUsages: triggerFetchTagUsages,
    fetchAllTagsInformation,
    tags,
    tagGroups,
    tagsMappedByTagId,
    tagUsagesMap,
  };
}
