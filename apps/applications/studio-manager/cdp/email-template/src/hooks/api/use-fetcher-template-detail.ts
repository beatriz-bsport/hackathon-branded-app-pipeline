import {
  type EmailTemplateDetail,
  fetchEmailTemplateDetailAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseFetchEmailTemplateDetailParams = {
  onSuccess?: (templateDetails: EmailTemplateDetail) => void;
  onFailure?: (error: Error) => void;
};

const fetchEmailTemplateDetailBinded = fetchEmailTemplateDetailAction.bind(
  null,
  fetch,
);

/**
 * Hook for fetching all the details of a precise email template.
 * @param params - Parameters for fetching the template details
 * @param params.onSuccess - Callback function to be called when the template details are fetched successfully
 * @param params.onFailure - Callback function to be called when the template details fetching failed
 * @returns Object containing the loading state and the template details fetching function
 */
export function useFetcherEmailTemplateDetail({
  onSuccess,
  onFailure,
}: UseFetchEmailTemplateDetailParams = {}) {
  const [{ isLoading, error }, triggerFetchEmailTemplateDetail] = useAsync<
    typeof fetchEmailTemplateDetailBinded
  >({
    asyncFn: fetchEmailTemplateDetailBinded,
    onSuccess,
    onFailure,
  });

  return {
    isLoading,
    error,
    fetchEmailTemplateDetail: triggerFetchEmailTemplateDetail,
  };
}
