import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignSummaryByAutomatedCampaignIdQueryOptions } from "@bsport/api-cdp/communication-sent";

import { fetch } from "#src/utils/fetch";

export const useAutomatedCampaignSummarySuspenseQuery = (
  automatedCampaignId: number,
) => {
  return useSuspenseQuery(
    campaignSummaryByAutomatedCampaignIdQueryOptions(
      fetch,
      automatedCampaignId,
    ),
  );
};
