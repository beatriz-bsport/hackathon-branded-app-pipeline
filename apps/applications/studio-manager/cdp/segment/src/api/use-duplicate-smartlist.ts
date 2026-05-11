import {
  type Smartlist,
  duplicateSmartlistAction,
} from "@bsport/store-cdp-smartlist";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseDuplicateSmartlistParams = {
  onSuccess?: (smartlist: Smartlist) => void;
  onFailure?: (error: Error) => void;
};

/**
 * Hook for duplicating a smartlist
 * @param params - Parameters for duplicating the smartlist
 * @param params.onSuccess - Callback function to be called when the smartlist is duplicated successfully
 * @param params.onFailure - Callback function to be called when the smartlist duplication fails
 * @returns Object containing the loading state and the duplicate function
 */
export function useDuplicateSmartlist({
  onSuccess,
  onFailure,
}: UseDuplicateSmartlistParams = {}) {
  const duplicateSmartlist = duplicateSmartlistAction.bind(null, fetch);

  const [{ isLoading }, triggerDuplicateSmartlist] = useAsync<
    typeof duplicateSmartlist
  >({
    asyncFn: duplicateSmartlist,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    duplicateSmartlist: triggerDuplicateSmartlist,
  };
}
