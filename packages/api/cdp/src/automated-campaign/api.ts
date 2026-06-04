import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import type {
  AutomatedCampaign,
  CreateAutomatedCampaignParams,
  FetchAutomatedCampaignsParams,
  UpdateAutomatedCampaignParams,
} from "./types";

const SMARTLIST_API_V1 = "customer-data-platform/v1/smartlist";

// ── Query Key Factory ──

export const automatedCampaignKeys = {
  all: [QUERY_KEY_MAIN, "automated-campaign"] as const,

  list: (smartlistId: string) =>
    [...automatedCampaignKeys.all, "list", smartlistId] as const,

  detail: (messageId: string) =>
    [...automatedCampaignKeys.all, "detail", messageId] as const,
} as const;

// ── GET Configs ──

const getFetchAutomatedCampaignsConfig = (
  params: FetchAutomatedCampaignsParams,
): ApiConfig => {
  const urlParams = buildUrlParams({
    smartlist_id: params.smartlist_id,
    exclude_disabled: params.exclude_disabled ?? true,
  });
  return [`${SMARTLIST_API_V1}/automated_campaign/${urlParams}`];
};

const getFetchAutomatedCampaignDetailConfig = (
  messageId: string,
): ApiConfig => {
  return [`${SMARTLIST_API_V1}/automated_campaign/${messageId}/`];
};

// ── API Functions ──

export const fetchAutomatedCampaignsAPI = async (
  fetch: Fetch<PaginatedResponse<AutomatedCampaign>>,
  params: FetchAutomatedCampaignsParams,
): Promise<AutomatedCampaign[]> => {
  const [uri, init] = getFetchAutomatedCampaignsConfig(params);
  const { data } = await fetch(uri, init);
  return data.results;
};

export const fetchAutomatedCampaignDetailAPI = async (
  fetch: Fetch<AutomatedCampaign>,
  messageId: string,
): Promise<AutomatedCampaign> => {
  const [uri, init] = getFetchAutomatedCampaignDetailConfig(messageId);
  const { data } = await fetch(uri, init);
  return data;
};

export const createAutomatedCampaignAPI = async (
  fetch: Fetch<AutomatedCampaign>,
  params: CreateAutomatedCampaignParams,
): Promise<AutomatedCampaign> => {
  const [uri, init] = [
    `${SMARTLIST_API_V1}/automated_campaign/`,
    { method: "POST", body: JSON.stringify(params) },
  ];
  const { data } = await fetch(uri, init);
  return data;
};

export const updateAutomatedCampaignAPI = async (
  fetch: Fetch<AutomatedCampaign>,
  params: UpdateAutomatedCampaignParams,
): Promise<AutomatedCampaign> => {
  const { id, ...body } = params;
  const [uri, init] = [
    `${SMARTLIST_API_V1}/automated_campaign/${id}/`,
    { method: "PATCH", body: JSON.stringify(body) },
  ];
  const { data } = await fetch(uri, init);
  return data;
};

export const deleteAutomatedCampaignAPI = async (
  fetch: Fetch<void>,
  id: number,
): Promise<void> => {
  const [uri, init] = [
    `${SMARTLIST_API_V1}/automated_campaign/${id}/`,
    { method: "DELETE" },
  ];
  await fetch(uri, init);
};
