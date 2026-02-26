import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignSentDetailQueryOptions } from "./api";
import { CampaignSent } from "./types";

export const useFetchCampaignSentDetail = ({
  campaignUuid,
  onSuccess,
}: {
  campaignUuid: string;
  onSuccess?: (data: CampaignSent) => void;
}) => {
  return useSuspenseQuery(
    campaignSentDetailQueryOptions({ campaignUuid, onSuccess }),
  );
};
