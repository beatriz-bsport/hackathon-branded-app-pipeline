import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignScheduledDetailQueryOptions } from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

export const useFetchCampaignScheduledDetail = (
  campaignScheduledId: string,
) => {
  return useSuspenseQuery(
    campaignScheduledDetailQueryOptions(fetch, campaignScheduledId),
  );
};
