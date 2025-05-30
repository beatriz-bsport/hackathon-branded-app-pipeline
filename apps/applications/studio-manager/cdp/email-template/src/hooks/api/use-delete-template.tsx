import {
  EmailTemplateDetail,
  deleteEmailTemplateAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseDeleteTemplateParams = {
  onSuccess?: (deletedTemplate: EmailTemplateDetail) => void;
  onFailure?: (error: Error) => void;
};

const deleteTemplate = deleteEmailTemplateAction.bind(null, fetch);

/**
 * Hook for deleting an email template
 * @param params - Parameters for deleting the email template
 * @param params.onSuccess - Callback function to be called when the email template is deleted successfully
 * @param params.onFailure - Callback function to be called when the email template deletion fails
 * @returns Object containing the loading state and the delete function
 */
export function useDeleteTemplate({
  onSuccess,
  onFailure,
}: UseDeleteTemplateParams = {}) {
  const [{ isLoading }, triggerDeleteTemplate] = useAsync<
    typeof deleteTemplate
  >({
    asyncFn: deleteTemplate,
    onSuccess,
    onFailure,
  });

  return {
    isLoading,
    deleteTemplate: triggerDeleteTemplate,
  };
}
