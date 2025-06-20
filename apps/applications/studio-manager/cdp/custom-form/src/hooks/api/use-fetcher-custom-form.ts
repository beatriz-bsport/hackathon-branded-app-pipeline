import type { PaginatedResponse } from "@bsport/store-base";
import {
  type CustomForm,
  fetchCustomFormsAction,
} from "@bsport/store-cdp-custom-form";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseFetchCustomFormsParams = {
  onSuccess?: (forms: PaginatedResponse<CustomForm>) => void;
  onFailure?: (error: Error) => void;
};

const fetchForms = fetchCustomFormsAction.bind(null, fetch);

/**
 * Hook for fetching custom forms.
 * @param params - Parameters for fetching the custom forms
 * @param params.onSuccess - Callback function to be called when the custom forms are fetched successfully
 * @param params.onFailure - Callback function to be called when the custom forms fetching fails
 * @returns Object containing the loading state and the fetch function
 */
export function useFetcherCustomForms({
  onSuccess,
  onFailure,
}: UseFetchCustomFormsParams = {}) {
  const [{ isLoading }, triggerFetchForms] = useAsync<typeof fetchForms>({
    asyncFn: fetchForms,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    fetchForms: triggerFetchForms,
  };
}
