import { queryOptions } from "@tanstack/react-query";

import { buildUrlParams } from "@bsport/store-base";

import { fetch } from "#src/utils/fetch";

import type {
  AutomatedCampaign,
  FetchAutomatedCampaignsParams,
  Smartlist,
} from "./types";

const API_URL = "api/v1/smartlist";

/**
 * Query Key Factory
 *
 * Key taxonomy:
 * ['@sm-smartlist', 'detail', id]                        - smartlist detail
 * ['@sm-smartlist', 'detail', id, 'automated-campaigns'] - automated campaigns for a smartlist
 */
export const smartlistKeys = {
  all: ["@sm-smartlist"] as const,

  details: () => [...smartlistKeys.all, "detail"] as const,
  detail: (id: string) => [...smartlistKeys.details(), id] as const,

  automatedCampaigns: (id: string) =>
    [...smartlistKeys.detail(id), "automated-campaigns"] as const,
} as const;

/**
 * Fetch functions
 */
const fetchSmartlistDetail = async (id: string): Promise<Smartlist> => {
  const { data } = await fetch<Smartlist>(`${API_URL}/group/${id}`);

  return data;
};

const fetchAutomatedCampaigns = async (
  params: FetchAutomatedCampaignsParams,
): Promise<AutomatedCampaign[]> => {
  const urlParams = buildUrlParams({
    smartlist_id: params.smartlist_id,
    exclude_disabled: params.exclude_disabled ?? true,
  });
  const { data } = await fetch<AutomatedCampaign[]>(
    `${API_URL}/automated_campaign/${urlParams}`,
  );

  return data;
};

/**
 * Query Options
 */
export const smartlistDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: smartlistKeys.detail(id),
    queryFn: () => fetchSmartlistDetail(id),
  });

export const automatedCampaignsQueryOptions = (smartlistId: string) =>
  queryOptions({
    queryKey: smartlistKeys.automatedCampaigns(smartlistId),
    queryFn: () =>
      fetchAutomatedCampaigns({
        smartlist_id: smartlistId,
        exclude_disabled: true,
      }),
  });
