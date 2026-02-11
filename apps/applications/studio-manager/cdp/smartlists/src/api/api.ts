import { queryOptions } from "@tanstack/react-query";

import { type PaginatedResponse, buildUrlParams } from "@bsport/store-base";

import { fetch } from "#src/utils/fetch";

import type {
  AutomatedCampaign,
  CampaignScheduled,
  CampaignSent,
  FetchAutomatedCampaignsParams,
  FetchCampaignScheduledParams,
  FetchCampaignSentParams,
  Smartlist,
  Tag,
  TagGroup,
  TagRule,
} from "./types";

const SMARTLIST_API_V1 = "customer-data-platform/v1/smartlist";
const COMMUNICATION_API_V1 = "communicate/v1";
const CDP_API_V0 = "customer-data-platform/v0";

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

  automatedCampaignDetail: (messageId: string) =>
    [...smartlistKeys.all, "automated-campaign", messageId] as const,

  campaignSent: (id: string) =>
    [...smartlistKeys.detail(id), "campaign-sent"] as const,

  tagRules: (id: string) => [...smartlistKeys.all, "tag-rules", id] as const,

  tags: () => [...smartlistKeys.all, "tags"] as const,

  tagGroups: () => [...smartlistKeys.all, "tagGroups"] as const,

  campaignScheduled: (id: string) =>
    [...smartlistKeys.detail(id), "scheduled-campaigns"] as const,
} as const;

/**
 * Fetch functions
 */
const fetchSmartlistDetail = async (id: string): Promise<Smartlist> => {
  const { data } = await fetch<Smartlist>(`${SMARTLIST_API_V1}/group/${id}`);

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
    `${SMARTLIST_API_V1}/automated_campaign/${urlParams}`,
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
    `${COMMUNICATION_API_V1}/communication/communication_sent/${urlParams}`,
  );

  return data.results;
};

const fetchAutomatedCampaignDetail = async (
  messageId: string,
): Promise<AutomatedCampaign> => {
  const { data } = await fetch<AutomatedCampaign>(
    `${SMARTLIST_API_V1}/automated_campaign/${messageId}/`,
  );

  return data;
};

const fetchTagRules = async (smartlistId: string): Promise<TagRule[]> => {
  const urlParams = buildUrlParams({ smartlist_id: smartlistId });
  const { data } = await fetch<TagRule[]>(
    `${SMARTLIST_API_V1}/tagrules/${urlParams}`,
  );

  return data;
};

const fetchTags = async (): Promise<Tag[]> => {
  const { data } = await fetch<Tag[]>(`${CDP_API_V0}/tagging/tag/`);

  return data;
};

const fetchTagGroups = async (): Promise<TagGroup[]> => {
  const { data } = await fetch<TagGroup[]>(`${CDP_API_V0}/tagging/tag-group/`);

  return data;
};

const fetchCampaignScheduled = async (
  params: FetchCampaignScheduledParams,
): Promise<CampaignScheduled[]> => {
  const urlParams = buildUrlParams({
    page_size: params.page_size ?? 50,
    page: params.page ?? 1,
    smartlist_id__in: params.smartlist_id__in ?? [],
    id__in: params.id__in ?? [],
  });
  const { data } = await fetch<PaginatedResponse<CampaignScheduled>>(
    `${COMMUNICATION_API_V1}/communication/communication_scheduled/${urlParams}`,
  );

  return data.results;
};

/**
 * Deletes an automated campaign
 * @param id - ID of the automated campaign to delete
 */
export const deleteAutomatedCampaign = async (id: number): Promise<void> => {
  await fetch(`${SMARTLIST_API_V1}/automated_campaign/${id}/`, {
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

export const automatedCampaignDetailQueryOptions = (messageId: string) =>
  queryOptions({
    queryKey: smartlistKeys.automatedCampaignDetail(messageId),
    queryFn: () => fetchAutomatedCampaignDetail(messageId),
  });

export const tagRulesQueryOptions = (smartlistId: string) =>
  queryOptions({
    queryKey: smartlistKeys.tagRules(smartlistId),
    queryFn: () => fetchTagRules(smartlistId),
  });

export const tagsQueryOptions = () =>
  queryOptions({
    queryKey: smartlistKeys.tags(),
    queryFn: () => fetchTags(),
  });

export const tagGroupsQueryOptions = () =>
  queryOptions({
    queryKey: smartlistKeys.tagGroups(),
    queryFn: () => fetchTagGroups(),
  });

/**
 * Query Options for fetching campaign scheduled list
 * @param smartlistId - ID of the smartlist
 * @returns Query Options for fetching campaign scheduled list
 * @productDecision we deliberately don't use the page_size and page parameters even if the API supports them.
 * Its because we don't want to paginate the campaign scheduled list. We want to display the full list of campaign scheduled.
 * And our investigations showed that most of the studios do not have near 10 camapign scheduled per smartlists so with 50 we are safe.
 * This can be easily updated tho if needed.
 */
export const campaignScheduledQueryOptions = (smartlistId: string) =>
  queryOptions({
    queryKey: smartlistKeys.campaignScheduled(smartlistId),
    queryFn: () =>
      fetchCampaignScheduled({
        smartlist_id__in: [Number(smartlistId)],
        page_size: 50,
        page: 1,
      }),
  });
