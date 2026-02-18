import { useEffect } from "react";

import { fetchTagGroupsAction, fetchTagsAction } from "@bsport/store-cdp-tag";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchTagsBinded = fetchTagsAction.bind(null, fetch);
const fetchTagGroupsBinded = fetchTagGroupsAction.bind(null, fetch);

export function useFetchTags() {
  const [{ isLoading: isLoadingTags }, fetchTags] = useAsync<
    typeof fetchTagsBinded
  >({
    asyncFn: fetchTagsBinded,
    onFailure: console.error,
  });

  const [{ isLoading: isLoadingTagGroups }, fetchTagGroups] = useAsync<
    typeof fetchTagGroupsBinded
  >({
    asyncFn: fetchTagGroupsBinded,
    onFailure: console.error,
  });

  useEffect(() => {
    Promise.allSettled([fetchTagGroups(), fetchTags()]);
  }, [fetchTags, fetchTagGroups]);

  return {
    isLoadingTags,
    isLoadingTagGroups,
  };
}
