import { queryOptions } from "@tanstack/react-query";

import { type PaginatedResponse, buildUrlParams } from "@bsport/store-base";

import { fetch } from "#src/utils/fetch";

import type {
  AutomatedCampaign,
  CampaignSent,
  FetchAutomatedCampaignsParams,
  FetchCampaignSentParams,
  Smartlist,
} from "./types";

const API_URL = "api/v1/smartlist";
const COMMUNICATE_API_URL = "api/v1/communication";

/**
 * Query Key Factory
 *
 * Key taxonomy:
 * ['@sm-smartlist', 'detail', id]                        - smartlist detail
 * ['@sm-smartlist', 'detail', id, 'automated-campaigns'] - automated campaigns for a smartlist
 * ['@sm-smartlist', 'detail', id, 'campaign-sent']       - campaign sent data (with analytics)
 */
export const smartlistKeys = {
  all: ["@sm-smartlist"] as const,

  details: () => [...smartlistKeys.all, "detail"] as const,
  detail: (id: string) => [...smartlistKeys.details(), id] as const,

  automatedCampaigns: (id: string) =>
    [...smartlistKeys.detail(id), "automated-campaigns"] as const,

  campaignSent: (id: string) =>
    [...smartlistKeys.detail(id), "campaign-sent"] as const,
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
  const { data } = await fetch<PaginatedResponse<AutomatedCampaign>>(
    `${API_URL}/automated_campaign/${urlParams}`,
  );

  return data.results;
};

const fetchCampaignSent = async (
  params: FetchCampaignSentParams,
): Promise<CampaignSent[]> => {
  const urlParams = buildUrlParams({
    smartlist: params.smartlist,
    only_automated_campaign: params.only_automated_campaign,
    page_size: params.page_size ?? 100,
    page: params.page ?? 1,
  });
  const { data } = await fetch<PaginatedResponse<CampaignSent>>(
    `${COMMUNICATE_API_URL}/communication_sent/${urlParams}`,
  );

  return data.results;
};

/**
 * Deletes an automated campaign
 * @param id - ID of the automated campaign to delete
 */
export const deleteAutomatedCampaign = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/automated_campaign/${id}/`, {
    method: "DELETE",
  });
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

export const campaignSentQueryOptions = (smartlistId: string) =>
  queryOptions({
    queryKey: smartlistKeys.campaignSent(smartlistId),
    queryFn: () =>
      fetchCampaignSent({
        smartlist: Number(smartlistId),
        only_automated_campaign: true,
        page_size: 100,
        page: 1,
      }),
  });
