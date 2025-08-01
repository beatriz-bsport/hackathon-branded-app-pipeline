import {
  type MemberDetails,
  tagMemberAction,
  untagMemberAction,
} from "@bsport/store-core-data-member";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseUpdateMemberTagParams = {
  onTagSuccess?: (memberDetails: MemberDetails) => void;
  onTagFailure?: (error: Error) => void;
  onUntagSuccess?: (memberDetails: MemberDetails) => void;
  onUntagFailure?: (error: Error) => void;
};

type TagMemberParams = {
  memberId: number;
  tagId: number;
};

type UntagMemberParams = {
  memberId: number;
  tagId: number;
};

const tagMember = tagMemberAction.bind(null, fetch);
const untagMember = untagMemberAction.bind(null, fetch);

/**
 * Hook for updating member tags (adding or removing tags from specific members)
 * @param params - Parameters for updating member tags
 * @param params.onTagSuccess - Callback function to be called when a member is tagged successfully
 * @param params.onTagFailure - Callback function to be called when tagging a member fails
 * @param params.onUntagSuccess - Callback function to be called when a member is untagged successfully
 * @param params.onUntagFailure - Callback function to be called when untagging a member fails
 * @returns Object containing loading states and functions to tag/untag members
 */
export function useUpdateMemberTag({
  onTagSuccess,
  onTagFailure,
  onUntagSuccess,
  onUntagFailure,
}: UseUpdateMemberTagParams = {}) {
  const [{ isLoading: isTagging }, triggerTagMember] = useAsync<
    typeof tagMember
  >({
    asyncFn: tagMember,
    onSuccess: ({ value }) => onTagSuccess?.(value),
    onFailure: ({ error }) => onTagFailure?.(error),
  });

  const [{ isLoading: isUntagging }, triggerUntagMember] = useAsync<
    typeof untagMember
  >({
    asyncFn: untagMember,
    onSuccess: ({ value }) => onUntagSuccess?.(value),
    onFailure: ({ error }) => onUntagFailure?.(error),
  });

  return {
    isTagging,
    isUntagging,
    isLoading: isTagging || isUntagging,
    tagMember: triggerTagMember,
    untagMember: triggerUntagMember,
  };
}

export type { TagMemberParams, UntagMemberParams };
