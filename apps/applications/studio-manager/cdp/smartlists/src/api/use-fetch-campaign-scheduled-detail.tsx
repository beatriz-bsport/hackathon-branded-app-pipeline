import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignScheduledDetailQueryOptions } from "./api";

export const useFetchCampaignScheduledDetail = (
  campaignScheduledId: string,
) => {
  return useSuspenseQuery(
    campaignScheduledDetailQueryOptions(campaignScheduledId),
  );
};
