import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignSentListQueryOptions } from "./api";

export const useFetchCampaignSentList = ({
  smartlistId,
  page,
  pageSize,
  automatedCampaignId,
  onlyAutomatedCampaign,
}: {
  smartlistId: string;
  page: number;
  pageSize: number;
  automatedCampaignId?: number;
  onlyAutomatedCampaign?: boolean;
}) => {
  return useSuspenseQuery(
    campaignSentListQueryOptions({
      smartlist: Number(smartlistId),
      page,
      page_size: pageSize,
      automated_campaign_id: automatedCampaignId,
      no_automated_campaign: onlyAutomatedCampaign ? undefined : true,
      only_automated_campaign: onlyAutomatedCampaign,
      without_member_info: true,
    }),
  );
};
