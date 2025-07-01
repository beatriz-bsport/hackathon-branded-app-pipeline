import { deleteEmailTemplateCategoryAction } from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseDeleteCategoryParams = {
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
};

const deleteCategory = deleteEmailTemplateCategoryAction.bind(null, fetch);

/**
 * Hook for deleting an email template category
 * @param params - Parameters for deleting the email template category
 * @param params.onSuccess - Callback function to be called when the email template category is deleted successfully
 * @param params.onFailure - Callback function to be called when the email template category deletion fails
 * @returns Object containing the loading state and the delete function
 */
export function useDeleteCategory({
  onSuccess,
  onFailure,
}: UseDeleteCategoryParams = {}) {
  const [{ isLoading }, triggerDeleteCategory] = useAsync<
    typeof deleteCategory
  >({
    asyncFn: deleteCategory,
    onSuccess,
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    deleteCategory: triggerDeleteCategory,
  };
}
