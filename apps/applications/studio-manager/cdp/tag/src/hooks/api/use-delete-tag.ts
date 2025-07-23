import { deleteTagAction } from "@bsport/store-cdp-tag";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseDeleteTagParams = {
  onSuccess?: (deletedTagId: number) => void;
  onFailure?: (error: Error) => void;
};

const deleteTag = deleteTagAction.bind(null, fetch);

/**
 * Hook for deleting a tag
 * @param params - Parameters for deleting a tag
 * @param params.onSuccess - Callback function to be called when a tag is deleted successfully
 * @param params.onFailure - Callback function to be called when a tag delete fails
 * @returns Object containing the loading state and the delete tag function
 */
export function useDeleteTag({
  onSuccess,
  onFailure,
}: UseDeleteTagParams = {}) {
  const [{ isLoading }, triggerDeleteTag] = useAsync<typeof deleteTag>({
    asyncFn: deleteTag,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    deleteTag: triggerDeleteTag,
  };
}
