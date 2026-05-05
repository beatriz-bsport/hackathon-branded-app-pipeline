// ── Query Options Factories ──
import { queryOptions } from "@tanstack/react-query";

import { Fetch, PaginatedResponse } from "@bsport/store-base";

import {
  automatedCampaignKeys,
  fetchAutomatedCampaignDetailAPI,
  fetchAutomatedCampaignsAPI,
} from "./api";
import { AutomatedCampaign } from "./types";

export const automatedCampaignsQueryOptions = (
  fetch: Fetch<PaginatedResponse<AutomatedCampaign>>,
  smartlistId: string,
) =>
  queryOptions({
    queryKey: automatedCampaignKeys.list(smartlistId),
    queryFn: () =>
      fetchAutomatedCampaignsAPI(fetch, {
        smartlist_id: smartlistId,
        exclude_disabled: true,
      }),
  });

export const automatedCampaignDetailQueryOptions = (
  fetch: Fetch<AutomatedCampaign>,
  messageId: string,
) =>
  queryOptions({
    queryKey: automatedCampaignKeys.detail(messageId),
    queryFn: () => fetchAutomatedCampaignDetailAPI(fetch, messageId),
  });
