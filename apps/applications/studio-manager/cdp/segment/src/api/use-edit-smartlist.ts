import {
  type Smartlist,
  editSmartlistAction,
} from "@bsport/store-cdp-smartlist";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseEditSmartlistParams = {
  onSuccess?: (smartlist: Smartlist) => void;
  onFailure?: (error: Error) => void;
};

export const editSmartlist = editSmartlistAction.bind(null, fetch);

/**
 * Hook for editing a smartlist
 * @param params - Parameters for editing the smartlist
 * @param params.onSuccess - Callback function to be called when the smartlist is edited successfully
 * @param params.onFailure - Callback function to be called when the smartlist edit fails
 * @returns Object containing the loading state and the edit function
 */
export function useEditSmartlist({
  onSuccess,
  onFailure,
}: UseEditSmartlistParams = {}) {
  const [{ isLoading }, triggerEditSmartlist] = useAsync<typeof editSmartlist>({
    asyncFn: editSmartlist,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    editSmartlist: triggerEditSmartlist,
  };
}
