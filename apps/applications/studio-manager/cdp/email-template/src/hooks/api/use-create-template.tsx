import {
  type EmailTemplateDetail,
  createEmailTemplateAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseCreateTemplateParams = {
  onSuccess?: (createdTemplate: EmailTemplateDetail) => void;
  onFailure?: (error: Error) => void;
};

const createTemplate = createEmailTemplateAction.bind(null, fetch);

/**
 * Hook for creating an email template
 * @param params - Parameters for creating an email template
 * @param params.onSuccess - Callback function to be called when an email template is created successfully
 * @param params.onFailure - Callback function to be called when an email template creation fails
 * @returns Object containing the loading state and the create template function
 */
export function useCreateTemplate({
  onSuccess,
  onFailure,
}: UseCreateTemplateParams = {}) {
  const [{ isLoading }, triggerCreateTemplate] = useAsync<
    typeof createTemplate
  >({
    asyncFn: createTemplate,
    onSuccess,
    onFailure,
  });

  return {
    isLoading,
    createTemplate: triggerCreateTemplate,
  };
}
