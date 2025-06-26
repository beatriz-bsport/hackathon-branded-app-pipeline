import {
  type EmailTemplateDetail,
  updateEmailTemplateAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseUpdateTemplateParams = {
  onSuccess?: (updatedTemplate: EmailTemplateDetail) => void;
  onFailure?: (error: Error) => void;
};

const updateTemplate = updateEmailTemplateAction.bind(null, fetch);

/**
 * Hook for updating an email template
 * @param params - Parameters for updating an email template
 * @param params.onSuccess - Callback function to be called when an email template is updated successfully
 * @param params.onFailure - Callback function to be called when an email template update fails
 * @returns Object containing the loading state and the update template function
 */
export function useUpdateTemplate({
  onSuccess,
  onFailure,
}: UseUpdateTemplateParams = {}) {
  const [{ isLoading }, triggerUpdateTemplate] = useAsync<
    typeof updateTemplate
  >({
    asyncFn: updateTemplate,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    updateTemplate: triggerUpdateTemplate,
  };
}
