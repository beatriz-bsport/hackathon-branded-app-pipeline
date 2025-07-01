import {
  type EmailTemplateDetail,
  createEmailTemplateAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseDuplicateTemplateParams = {
  onSuccess?: (duplicatedTemplate: EmailTemplateDetail) => void;
  onFailure?: (error: Error) => void;
};

const duplicateTemplate = createEmailTemplateAction.bind(null, fetch);

/**
 * Hook for duplicating an email template
 * @param params - Parameters for duplicating the email template
 * @param params.onSuccess - Callback function to be called when the email template is duplicated successfully
 * @param params.onFailure - Callback function to be called when the email template duplication fails
 * @returns Object containing the loading state and the duplicate function
 */
export function useDuplicateTemplate({
  onSuccess,
  onFailure,
}: UseDuplicateTemplateParams = {}) {
  const [{ isLoading }, triggerDuplicateTemplate] = useAsync<
    typeof duplicateTemplate
  >({
    asyncFn: duplicateTemplate,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    duplicateTemplate: triggerDuplicateTemplate,
  };
}
