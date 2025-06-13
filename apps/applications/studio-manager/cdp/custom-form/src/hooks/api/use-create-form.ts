import {
  type CustomForm,
  createCustomFormAction,
} from "@bsport/store-cdp-custom-form";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseCreateCustomFormParams = {
  onSuccess?: (customForm: CustomForm) => void;
  onFailure?: (error: Error) => void;
};

const createCustomForm = createCustomFormAction.bind(null, fetch);

/**
 * Hook for creating a custom form
 * @param params - Parameters for creating the custom form
 * @param params.onSuccess - Callback function to be called when the custom form is created successfully
 * @param params.onFailure - Callback function to be called when the custom form creation fails
 * @returns Object containing the loading state and the create function
 */
export function useCreateCustomForm({
  onSuccess,
  onFailure,
}: UseCreateCustomFormParams = {}) {
  const [{ isLoading }, triggerCreateCustomForm] = useAsync<
    typeof createCustomForm
  >({
    asyncFn: createCustomForm,
    onSuccess,
    onFailure,
  });

  return {
    isLoading,
    createCustomForm: triggerCreateCustomForm,
  };
}
