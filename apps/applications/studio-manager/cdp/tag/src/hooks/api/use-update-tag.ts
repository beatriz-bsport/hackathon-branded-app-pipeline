import { Tag, updateTagAction } from "@bsport/store-cdp-tag";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseUpdateTagParams = {
  onSuccess?: (updatedTag: Tag) => void;
  onFailure?: (error: Error) => void;
};

const updateTag = updateTagAction.bind(null, fetch);

/**
 * Hook for updating a tag
 * @param params - Parameters for updating a tag
 * @param params.onSuccess - Callback function to be called when a tag is updated successfully
 * @param params.onFailure - Callback function to be called when a tag update fails
 * @returns Object containing the loading state and the update tag  function
 */
export function useUpdateTag({
  onSuccess,
  onFailure,
}: UseUpdateTagParams = {}) {
  const [{ isLoading }, triggerUpdateTag] = useAsync<typeof updateTag>({
    asyncFn: updateTag,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    updateTag: triggerUpdateTag,
  };
}
