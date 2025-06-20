import type { SearchResponse } from "@bsport/store-base";
import {
  type CustomForm,
  fuzzySearchCustomFormsAction,
} from "@bsport/store-cdp-custom-form";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseSearchCustomFormsParams = {
  onSuccess?: (forms: SearchResponse<CustomForm>) => void;
  onFailure?: (error: Error) => void;
};

const searchForms = fuzzySearchCustomFormsAction.bind(null, fetch);

/**
 * Hook for searching custom forms.
 * @param params - Parameters for searching the custom forms
 * @param params.onSuccess - Callback function to be called when the custom forms are searched successfully
 * @param params.onFailure - Callback function to be called when the custom forms searching fails
 * @returns Object containing the loading state and the search function
 */
export function useSearchCustomForms({
  onSuccess,
  onFailure,
}: UseSearchCustomFormsParams = {}) {
  const [{ isLoading }, triggerSearchForms] = useAsync<typeof searchForms>({
    asyncFn: searchForms,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    searchForms: triggerSearchForms,
  };
}
