import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignScheduledQueryOptions } from "./api";

/**
 * Hook that combines automated campaigns with their analytics data
 * using useSuspenseQueries for parallel fetching with Suspense support.
 *
 * Joins the data by matching metadata.automated_campaign_id from campaign_sent
 * with the automated campaign id.
 */
export const useFetchCampaignScheduled = (smartlistId: string) => {
  return useSuspenseQuery(campaignScheduledQueryOptions(smartlistId));
};
