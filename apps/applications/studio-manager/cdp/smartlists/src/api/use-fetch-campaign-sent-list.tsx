import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignSentListQueryOptions } from "./api";

export const useFetchCampaignSentList = ({
  smartlistId,
  page,
  pageSize,
}: {
  smartlistId: string;
  page: number;
  pageSize: number;
}) => {
  return useSuspenseQuery(
    campaignSentListQueryOptions({
      smartlist: Number(smartlistId),
      page,
      page_size: pageSize,
      no_automated_campaign: true,
      without_member_info: true,
    }),
  );
};
