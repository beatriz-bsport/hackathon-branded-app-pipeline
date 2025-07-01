import {
  type EmailTemplateCategory,
  createEmailTemplateCategoryAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseCreateCategoryParams = {
  onSuccess?: (createdCategory: EmailTemplateCategory) => void;
  onFailure?: (error: Error) => void;
};

const createCategory = createEmailTemplateCategoryAction.bind(null, fetch);

/**
 * Hook for creating an email template category
 * @param params - Parameters for duplicating the email template category
 * @param params.onSuccess - Callback function to be called when the email template category is created successfully
 * @param params.onFailure - Callback function to be called when the email template category creation fails
 * @returns Object containing the loading state and the create category function
 */
export function useCreateCategory({
  onSuccess,
  onFailure,
}: UseCreateCategoryParams = {}) {
  const [{ isLoading }, triggerCreateCategory] = useAsync<
    typeof createCategory
  >({
    asyncFn: createCategory,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    createCategory: triggerCreateCategory,
  };
}
