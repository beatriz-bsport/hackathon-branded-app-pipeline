import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchCampaignRecipientParams,
  campaignSentRecipientsWithMemberDataQueryOptions,
} from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

export const useFetchCampaignSentRecipientsWithMemberData = ({
  campaign,
  page,
  page_size,
}: FetchCampaignRecipientParams) => {
  return useSuspenseQuery(
    campaignSentRecipientsWithMemberDataQueryOptions(fetch, {
      campaign,
      page,
      page_size,
    }),
  );
};
