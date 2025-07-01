import {
  type Smartlist,
  createSmartlistAction,
} from "@bsport/store-cdp-smartlist";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseCreateSmartlistParams = {
  onSuccess?: (smartlist: Smartlist) => void;
  onFailure?: (error: Error) => void;
};

export const createSmartlist = createSmartlistAction.bind(null, fetch);

/**
 * Hook for creating a smartlist
 * @param params - Parameters for creating the smartlist
 * @param params.onSuccess - Callback function to be called when the smartlist is created successfully
 * @param params.onFailure - Callback function to be called when the smartlist creation fails
 * @returns Object containing the loading state and the create function
 */
export function useCreateSmartlist({
  onSuccess,
  onFailure,
}: UseCreateSmartlistParams = {}) {
  const [{ isLoading }, triggerCreateSmartlist] = useAsync<
    typeof createSmartlist
  >({
    asyncFn: createSmartlist,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    createSmartlist: triggerCreateSmartlist,
  };
}
