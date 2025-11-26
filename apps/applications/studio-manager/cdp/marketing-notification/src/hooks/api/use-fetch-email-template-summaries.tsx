import { useCallback } from "react";

import {
  type FetchEmailTemplateSummaryParams,
  fetchAllEmailTemplateSummariesAction,
  fuzzySearchEmailTemplateAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchEmailTemplateSummariesBound =
  fetchAllEmailTemplateSummariesAction.bind(null, fetch);

export type EmailTemplateSearchParams = {
  page?: number;
  page_size?: number;
  id__in?: string;
};

/**
 * Hook for fetching email template summaries.
 *
 * This hook provides functionality to fetch email template summary data by their IDs.
 * It handles the API call and manages the loading state for the fetch operation.
 * The hook accepts an array of email template IDs and retrieves their corresponding summaries.
 *
 * @returns Object containing the fetch function for email template summaries
 */
export function useFetchEmailTemplateSummaries() {
  const [{ isLoading }, fetchEmailTemplateSummaries] = useAsync<
    typeof fetchEmailTemplateSummariesBound
  >({
    asyncFn: fetchEmailTemplateSummariesBound,
  });

  /**
   * Fetches email template summaries by their IDs.
   *
   * @param emailTemplateIds - Array of email template IDs to fetch summaries for
   */
  const handleFetchEmailTemplateSummaries = useCallback(
    ({ emailTemplateIds }: { emailTemplateIds: number[] }) => {
      const emailTemplateIdsAsString = emailTemplateIds.join(",");
      fetchEmailTemplateSummaries({ id__in: emailTemplateIdsAsString });
    },
    [fetchEmailTemplateSummaries],
  );

  const handleSearchEmailTemplates = useCallback(
    async (query: string, params?: FetchEmailTemplateSummaryParams) => {
      return await fuzzySearchEmailTemplateAction(fetch, {
        queryString: query,
        ...params,
        is_default_bsport_template: false,
        is_franchise: false,
        page_size: 10,
        page: 1,
      });
    },
    [],
  );

  return {
    handleFetchEmailTemplateSummaries,
    handleSearchEmailTemplates,
    isEmailTemplateSummariesLoading: isLoading,
  };
}
