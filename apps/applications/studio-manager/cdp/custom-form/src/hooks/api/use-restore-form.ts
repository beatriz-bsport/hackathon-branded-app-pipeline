import { restoreCustomFormAction } from "@bsport/store-cdp-custom-form";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseRestoreCustomFormParams = {
  onSuccess?: (formId: number) => void;
  onFailure?: (error: Error) => void;
};

const restoreCustomForm = restoreCustomFormAction.bind(null, fetch);

/**
 * Hook for restoring a custom form
 * @param params - Parameters for restoring the custom form
 * @param params.onSuccess - Callback function to be called when the custom form is restored successfully
 * @param params.onFailure - Callback function to be called when the custom form restoring fails
 * @returns Object containing the loading state and the restore function
 */
export function useRestoreCustomForm({
  onSuccess,
  onFailure,
}: UseRestoreCustomFormParams = {}) {
  const [{ isLoading }, triggerRestoreCustomForm] = useAsync<
    typeof restoreCustomForm
  >({
    asyncFn: restoreCustomForm,
    onSuccess,
    onFailure,
  });

  return {
    isLoading,
    restoreCustomForm: triggerRestoreCustomForm,
  };
}
