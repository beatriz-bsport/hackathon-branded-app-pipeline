import {
  tagAllMembersAction,
  untagAllMembersAction,
} from "@bsport/store-core-data-member";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseBatchUpdateMemberTagParams = {
  onTagSuccess?: () => void;
  onTagFailure?: (error: Error) => void;
  onUntagSuccess?: () => void;
  onUntagFailure?: (error: Error) => void;
};

const tagAllMember = tagAllMembersAction.bind(null, fetch);
const untagAllMember = untagAllMembersAction.bind(null, fetch);

/**
 * Hook for batch updating member tags (adding or removing tags from all members)
 * @param params - Parameters for batch updating member tags
 * @param params.onTagSuccess - Callback function to be called when all members are tagged successfully
 * @param params.onTagFailure - Callback function to be called when batch tagging fails
 * @param params.onUntagSuccess - Callback function to be called when all members are untagged successfully
 * @param params.onUntagFailure - Callback function to be called when batch untagging fails
 * @returns Object containing loading states and functions to tag/untag all members
 */
export function useBatchUpdateMemberTag({
  onTagSuccess,
  onTagFailure,
  onUntagSuccess,
  onUntagFailure,
}: UseBatchUpdateMemberTagParams = {}) {
  const [{ isLoading: isTaggingAll }, triggerTagAllMember] = useAsync<
    typeof tagAllMember
  >({
    asyncFn: tagAllMember,
    onSuccess: () => onTagSuccess?.(),
    onFailure: ({ error }) => onTagFailure?.(error),
  });

  const [{ isLoading: isUntaggingAll }, triggerUntagAllMember] = useAsync<
    typeof untagAllMember
  >({
    asyncFn: untagAllMember,
    onSuccess: () => onUntagSuccess?.(),
    onFailure: ({ error }) => onUntagFailure?.(error),
  });

  return {
    isTaggingAll,
    isUntaggingAll,
    isLoading: isTaggingAll || isUntaggingAll,
    tagAllMember: triggerTagAllMember,
    untagAllMember: triggerUntagAllMember,
  };
}
