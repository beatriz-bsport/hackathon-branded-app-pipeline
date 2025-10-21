import { useEffect } from "react";

import {
  fetchCommunicationSentCampaignSummaryAction,
  selectCommunicationSentCampaignSummaryById,
  useCommunicationStore,
} from "@bsport/store-communicate-communication";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchCommunicationCampaignSummaryActionBinded =
  fetchCommunicationSentCampaignSummaryAction.bind(null, fetch);

/**
 * Hook for fetching communication campaign summaries.
 *
 * This hook provides functionality to fetch campaign summary data for communications.
 * It handles the API call and manages the loading state for the fetch operation.
 * The hook accepts a communication context identifier and object ID to retrieve
 * the corresponding campaign summary statistics.
 *
 * @returns Object containing the fetch function for communication campaign summaries
 */
export function useFetchCommunicationCampaignSummary({
  communicationObjectId,
}: {
  communicationObjectId?: number;
}) {
  const [, fetchCommunicationCampaignSummary] = useAsync<
    typeof fetchCommunicationCampaignSummaryActionBinded
  >({
    asyncFn: fetchCommunicationCampaignSummaryActionBinded,
  });

  const communicationCampaignSummary = useCommunicationStore((state) =>
    selectCommunicationSentCampaignSummaryById({
      state,
      objectType: "marketing_notification_id",
      objectId: communicationObjectId ?? 0,
    }),
  );

  useEffect(() => {
    if (communicationObjectId) {
      fetchCommunicationCampaignSummary({
        key: "marketing_notification_id",
        value: communicationObjectId,
      });
    }
  }, [communicationObjectId, fetchCommunicationCampaignSummary]);

  return { communicationCampaignSummary };
}
