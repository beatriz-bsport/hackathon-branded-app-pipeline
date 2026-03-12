import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignSentRecipientsWithMemberDataQueryOptions } from "./api";
import { FetchCampaignRecipientParams } from "./types";

export const useFetchCampaignSentRecipientsWithMemberData = ({
  campaign,
  page,
  page_size,
}: FetchCampaignRecipientParams) => {
  return useSuspenseQuery(
    campaignSentRecipientsWithMemberDataQueryOptions({
      campaign,
      page,
      page_size,
    }),
  );
};
