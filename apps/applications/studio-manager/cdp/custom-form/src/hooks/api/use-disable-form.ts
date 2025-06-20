import { disableCustomFormAction } from "@bsport/store-cdp-custom-form";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseDisableCustomFormParams = {
  onSuccess?: (formId: number) => void;
  onFailure?: (error: Error) => void;
};

const disableCustomForm = disableCustomFormAction.bind(null, fetch);

/**
 * Hook for disabling a custom form
 * @param params - Parameters for disabling the custom form
 * @param params.onSuccess - Callback function to be called when the custom form is disabled successfully
 * @param params.onFailure - Callback function to be called when the custom form disabling fails
 * @returns Object containing the loading state and the disable function
 */
export function useDisableCustomForm({
  onSuccess,
  onFailure,
}: UseDisableCustomFormParams = {}) {
  const [{ isLoading }, triggerDisableCustomForm] = useAsync<
    typeof disableCustomForm
  >({
    asyncFn: disableCustomForm,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    disableCustomForm: triggerDisableCustomForm,
  };
}
