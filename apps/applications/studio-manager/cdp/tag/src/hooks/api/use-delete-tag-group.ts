import { deleteTagGroupAction } from "@bsport/store-cdp-tag";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseDeleteTagGroupParams = {
  onSuccess?: (deletedTagGroupId: number) => void;
  onFailure?: (error: Error) => void;
};

const deleteTagGroup = deleteTagGroupAction.bind(null, fetch);

/**
 * Hook for deleting a tag group
 * @param params - Parameters for deleting a tag group
 * @param params.onSuccess - Callback function to be called when a tag group is deleted successfully
 * @param params.onFailure - Callback function to be called when a tag group delete fails
 * @returns Object containing the loading state and the delete tag group function
 */
export function useDeleteTagGroup({
  onSuccess,
  onFailure,
}: UseDeleteTagGroupParams = {}) {
  const [{ isLoading }, triggerDeleteTagGroup] = useAsync<
    typeof deleteTagGroup
  >({
    asyncFn: deleteTagGroup,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    deleteTagGroup: triggerDeleteTagGroup,
  };
}
