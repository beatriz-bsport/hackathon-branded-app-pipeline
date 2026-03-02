import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignSentRecipientsQueryOptions } from "./api";
import { FetchCampaignRecipientParams } from "./types";

export const useFetchCampaignSentRecipients = ({
  campaign,
  page,
  page_size,
}: FetchCampaignRecipientParams) => {
  return useSuspenseQuery(
    campaignSentRecipientsQueryOptions({
      campaign,
      page,
      page_size,
    }),
  );
};
