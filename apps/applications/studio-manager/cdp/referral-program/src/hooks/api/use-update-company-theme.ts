import {
  type CompanyTheme,
  updateCompanyThemeAction,
} from "@bsport/store-core-data-company-theme";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseUpdateCompanyThemeParams = {
  onSuccess?: (createdCategory: Partial<CompanyTheme>) => void;
  onFailure?: (error: Error) => void;
};

const _updateCompanyTheme = updateCompanyThemeAction.bind(null, fetch);

/**
 * Hook for updating the company theme
 * @param params - Parameters for updating the company theme
 * @param params.onSuccess - Callback function to be called when the company theme is updated successfully
 * @param params.onFailure - Callback function to be called when the company theme update fails
 * @returns Object containing the loading state and the update company theme function
 */
export function useUpdateCompanyTheme({
  onSuccess,
  onFailure,
}: UseUpdateCompanyThemeParams = {}) {
  const [{ isLoading }, triggerUpdateCompanyTheme] = useAsync<
    typeof _updateCompanyTheme
  >({
    asyncFn: _updateCompanyTheme,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    updateCompanyTheme: triggerUpdateCompanyTheme,
  };
}
