import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignSentQueryOptions } from "./api";

export const useFetchCampaignSent = ({
  smartlistId,
  page,
  pageSize,
}: {
  smartlistId: string;
  page: number;
  pageSize: number;
}) => {
  return useSuspenseQuery(
    campaignSentQueryOptions({
      smartlist: Number(smartlistId),
      page,
      page_size: pageSize,
      no_automated_campaign: true,
      without_member_info: true,
    }),
  );
};
