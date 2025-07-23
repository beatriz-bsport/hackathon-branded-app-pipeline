import { TagGroup, updateTagGroupAction } from "@bsport/store-cdp-tag";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseUpdateTagGroupParams = {
  onSuccess?: (updatedTagGroup: TagGroup) => void;
  onFailure?: (error: Error) => void;
};

const updateTagGroup = updateTagGroupAction.bind(null, fetch);

/**
 * Hook for updating a tag group
 * @param params - Parameters for updating a tag group
 * @param params.onSuccess - Callback function to be called when a tag group is updated successfully
 * @param params.onFailure - Callback function to be called when a tag group update fails
 * @returns Object containing the loading state and the update tag group function
 */
export function useUpdateTagGroup({
  onSuccess,
  onFailure,
}: UseUpdateTagGroupParams = {}) {
  const [{ isLoading }, triggerUpdateTagGroup] = useAsync<
    typeof updateTagGroup
  >({
    asyncFn: updateTagGroup,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    updateTagGroup: triggerUpdateTagGroup,
  };
}
