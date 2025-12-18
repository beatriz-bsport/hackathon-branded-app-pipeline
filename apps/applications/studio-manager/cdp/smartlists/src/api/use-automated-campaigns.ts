import { useQuery } from "@tanstack/react-query";

import { automatedCampaignsQueryOptions } from "./api";

export const useAutomatedCampaigns = (smartlistId: string) => {
  return useQuery(automatedCampaignsQueryOptions(smartlistId));
};
