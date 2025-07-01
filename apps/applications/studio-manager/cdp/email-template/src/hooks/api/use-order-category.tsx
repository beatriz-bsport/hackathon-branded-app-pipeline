import {
  type CategoryOrderingData,
  updateCategoryOrderingAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseOrderCategoryParams = {
  onSuccess?: (reorderedCategories: CategoryOrderingData[]) => void;
  onFailure?: (error: Error) => void;
};

const orderCategory = updateCategoryOrderingAction.bind(null, fetch);

/**
 * Hook for ordering a list of template categories
 * @param params - Parameters for ordering the template categories
 * @param params.onSuccess - Callback function to be called when the template categories ordering is updated successfully
 * @param params.onFailure - Callback function to be called when the template categories ordering update failed
 * @returns Object containing the loading state and the ordering update function
 */
export function useOrderCategory({
  onSuccess,
  onFailure,
}: UseOrderCategoryParams = {}) {
  const [{ isLoading }, triggerOrderCategory] = useAsync<typeof orderCategory>({
    asyncFn: orderCategory,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    orderCategory: triggerOrderCategory,
  };
}
