import { useSuspenseQuery } from "@tanstack/react-query";

import { automatedCampaignDetailQueryOptions } from "@bsport/api-cdp/automated-campaign";

import { fetch } from "#src/utils/fetch";

export const useAutomatedCampaignDetailSuspenseQuery = (messageId: string) => {
  return useSuspenseQuery(
    automatedCampaignDetailQueryOptions(fetch, messageId),
  );
};
