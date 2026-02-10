import { useSuspenseQueries } from "@tanstack/react-query";

import { PaginatedResponse } from "@bsport/store-base";

import {
  automatedCampaignsQueryOptions,
  campaignSentQueryOptions,
} from "./api";
import type {
  AutomatedCampaign,
  AutomatedCampaignWithAnalytics,
  CampaignSent,
} from "./types";

/**
 * Combine function extracted for referential stability.
 * Joins automated campaigns with their analytics data from campaign_sent.
 */
const combineAutomatedCampaignAnalytics = (
  results: [
    { data: AutomatedCampaign[] },
    { data: PaginatedResponse<CampaignSent> },
  ],
): AutomatedCampaignWithAnalytics[] => {
  const [automatedCampaigns, campaignSent] = results;

  const analyticsMap = new Map(
    campaignSent.data.results
      .filter((campaign) => campaign.metadata?.automated_campaign_id)
      .map((campaign) => [
        campaign.metadata.automated_campaign_id,
        {
          total_recipients: campaign.total_recipients,
          total_read: campaign.total_read,
          total_click: campaign.total_click,
        },
      ]),
  );

  return automatedCampaigns.data.map(
    ({
      id,
      event_kind,
      communication_kind,
      date_created,
      title,
    }): AutomatedCampaignWithAnalytics => {
      const analytics = analyticsMap.get(id) ?? {
        total_recipients: 0,
        total_read: 0,
        total_click: 0,
      };

      return {
        id: id,
        event_kind,
        communication_kind,
        date_created,
        title,
        ...analytics,
      };
    },
  );
};

/**
 * Hook that combines automated campaigns with their analytics data
 * using useSuspenseQueries for parallel fetching with Suspense support.
 *
 * Joins the data by matching metadata.automated_campaign_id from campaign_sent
 * with the automated campaign id.
 */
export const useAutomatedCampaignAnalytics = (smartlistId: string) => {
  return useSuspenseQueries({
    queries: [
      automatedCampaignsQueryOptions(smartlistId),
      campaignSentQueryOptions({
        smartlist: Number(smartlistId),
        only_automated_campaign: true,
        page: 1,
        page_size: 100,
      }),
    ],
    combine: combineAutomatedCampaignAnalytics,
  });
};

export type { AutomatedCampaignWithAnalytics } from "./types";
