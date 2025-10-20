import { useCallback } from "react";

import { fetchAllEmailTemplateSummariesAction } from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchEmailTemplateSummariesBound =
  fetchAllEmailTemplateSummariesAction.bind(null, fetch);

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
  const [, fetchEmailTemplateSummaries] = useAsync<
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

  return {
    handleFetchEmailTemplateSummaries,
  };
}
