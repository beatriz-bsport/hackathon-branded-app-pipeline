import {
  type EmailTemplateCategory,
  updateEmailTemplateCategoryAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseUpdateCategoryParams = {
  onSuccess?: (createdCategory: EmailTemplateCategory) => void;
  onFailure?: (error: Error) => void;
};

const updateCategory = updateEmailTemplateCategoryAction.bind(null, fetch);

/**
 * Hook for updating an email template category
 * @param params - Parameters for updating the email template category
 * @param params.onSuccess - Callback function to be called when the email template category is updated successfully
 * @param params.onFailure - Callback function to be called when the email template category update fails
 * @returns Object containing the loading state and the update category function
 */
export function useUpdateCategory({
  onSuccess,
  onFailure,
}: UseUpdateCategoryParams = {}) {
  const [{ isLoading }, triggerUpdateCategory] = useAsync<
    typeof updateCategory
  >({
    asyncFn: updateCategory,
    onSuccess,
    onFailure,
  });

  return {
    isLoading,
    updateCategory: triggerUpdateCategory,
  };
}
