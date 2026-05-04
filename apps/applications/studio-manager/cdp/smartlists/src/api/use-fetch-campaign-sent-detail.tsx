import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type CampaignSent,
  campaignSentDetailQueryOptions,
} from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

export const useFetchCampaignSentDetail = ({
  campaignUuid,
  onSuccess,
}: {
  campaignUuid: string;
  onSuccess?: (data: CampaignSent) => void;
}) => {
  return useSuspenseQuery(
    campaignSentDetailQueryOptions(fetch, { campaignUuid, onSuccess }),
  );
};
