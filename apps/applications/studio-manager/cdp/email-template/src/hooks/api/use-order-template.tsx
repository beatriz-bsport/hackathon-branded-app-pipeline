import {
  type TemplateOrderingData,
  updateEmailTemplateOrderingAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseOrderTemplateParams = {
  onSuccess?: (reorderedTemplates: TemplateOrderingData[]) => void;
  onFailure?: (error: Error) => void;
};

const orderTemplate = updateEmailTemplateOrderingAction.bind(null, fetch);

/**
 * Hook for ordering a list of email templates
 * @param params - Parameters for ordering the email templates
 * @param params.onSuccess - Callback function to be called when the email templates ordering is updated successfully
 * @param params.onFailure - Callback function to be called when the email templates ordering update failed
 * @returns Object containing the loading state and the ordering update function
 */
export function useOrderTemplate({
  onSuccess,
  onFailure,
}: UseOrderTemplateParams = {}) {
  const [{ isLoading }, triggerOrderTemplate] = useAsync<typeof orderTemplate>({
    asyncFn: orderTemplate,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    orderTemplate: triggerOrderTemplate,
  };
}
