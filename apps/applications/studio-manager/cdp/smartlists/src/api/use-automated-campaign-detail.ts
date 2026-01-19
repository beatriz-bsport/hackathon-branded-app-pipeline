import { useSuspenseQuery } from "@tanstack/react-query";

import { automatedCampaignDetailQueryOptions } from "./api";

export const useAutomatedCampaignDetailSuspenseQuery = (messageId: string) => {
  return useSuspenseQuery(automatedCampaignDetailQueryOptions(messageId));
};
