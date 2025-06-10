import {
  type CustomForm,
  duplicateCustomFormAction,
} from "@bsport/store-cdp-custom-form";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseDuplicateCustomFormParams = {
  onSuccess?: (duplicatedForm: CustomForm) => void;
  onFailure?: (error: Error) => void;
};

const duplicateCustomForm = duplicateCustomFormAction.bind(null, fetch);

/**
 * Hook for duplicating a custom form
 * @param params - Parameters for duplicating the custom form
 * @param params.onSuccess - Callback function to be called when the custom form is duplicated successfully
 * @param params.onFailure - Callback function to be called when the custom form duplication fails
 * @returns Object containing the loading state and the duplicate function
 */
export function useDuplicateCustomForm({
  onSuccess,
  onFailure,
}: UseDuplicateCustomFormParams = {}) {
  const [{ isLoading }, triggerDuplicateCustomForm] = useAsync<
    typeof duplicateCustomForm
  >({
    asyncFn: duplicateCustomForm,
    onSuccess,
    onFailure,
  });

  return {
    isLoading,
    duplicateCustomForm: triggerDuplicateCustomForm,
  };
}
