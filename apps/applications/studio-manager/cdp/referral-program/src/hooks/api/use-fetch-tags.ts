import {
  type Tag,
  type TagGroup,
  fetchTagGroupsAction,
  fetchTagsAction,
  selectTagGroups,
  selectTagMappedByTagId,
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
};

const _fetchTags = fetchTagsAction.bind(null, fetch);
const _fetchTagGroups = fetchTagGroupsAction.bind(null, fetch);

/**
 * Hook for fetching tags and tags groups
 * @param params - Parameters for fetching tags and tags groups
 * @param params.onSuccess - Callback function to be called when the tags and tags groups are fetched successfully
 * @param params.onFailure - Callback function to be called when the tags and tags groups fetching fails
 * @returns Object containing the loading state and the fetch tags and tags groups function
 */
export function useFetchTag({
  onFetchTagSuccess,
  onFetchTagFailure,
  onFetchTagGroupSuccess,
  onFetchTagGroupFailure,
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

  const tags = useTagStore((state) => selectTags(state));

  const tagsMappedByTagId = useTagStore((state) =>
    selectTagMappedByTagId(state),
  );

  const tagGroups = useTagStore((state) => selectTagGroups(state));

  return {
    isLoadingTags,
    isLoadingTagGroups,
    fetchTags: triggerFetchTags,
    fetchTagGroups: triggerFetchTagGroups,
    tags,
    tagGroups,
    tagsMappedByTagId,
  };
}
