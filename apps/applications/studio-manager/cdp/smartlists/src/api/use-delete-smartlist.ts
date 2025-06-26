import { deleteSmartlistAction } from "@bsport/store-cdp-smartlist";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseDeleteSmartlistParams = {
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
};

export const deleteSmartlist = deleteSmartlistAction.bind(null, fetch);

/**
 * Hook for deleting a smartlist
 * @param params - Parameters for deleting the smartlist
 * @param params.onSuccess - Callback function to be called when the smartlist is deleted successfully
 * @param params.onFailure - Callback function to be called when the smartlist deletion fails
 * @returns Object containing the loading state and the delete function
 */
export function useDeleteSmartlist({
  onSuccess,
  onFailure,
}: UseDeleteSmartlistParams = {}) {
  const [{ isLoading }, triggerDeleteSmartlist] = useAsync<
    typeof deleteSmartlist
  >({
    asyncFn: deleteSmartlist,
    onSuccess,
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    deleteSmartlist: triggerDeleteSmartlist,
  };
}
