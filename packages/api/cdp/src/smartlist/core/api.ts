import { type Fetch, buildUrlParams } from "@bsport/store-base";

import {
  BackgroundTaskStatusResponse,
  GenerateReportParams,
  GenerateReportResult,
} from "#src/communicate";
import { QUERY_KEY_MAIN } from "#src/constants";

import { SMARTLIST_API_V1 } from "../constants";
import type { SmartlistGetFiltersResponse } from "../shared/types";
import type {
  CreateTagRuleParams,
  Smartlist,
  TagRule,
  UpdateTagRuleParams,
} from "./types";

export const smartlistKeys = {
  all: [QUERY_KEY_MAIN, "smartlist"] as const,
  details: () => [...smartlistKeys.all, "detail"] as const,
  detail: (id: string) => [...smartlistKeys.details(), id] as const,
  tagRulesLists: () => [...smartlistKeys.all, "tag-rules"] as const,
  tagRules: (id: string) => [...smartlistKeys.tagRulesLists(), id] as const,
  tagRuleDetails: () => [...smartlistKeys.all, "tag-rule-detail"] as const,
  tagRuleDetail: (id: string) =>
    [...smartlistKeys.tagRuleDetails(), id] as const,
  filtersLists: () => [...smartlistKeys.all, "filters"] as const,
  filters: (smartlistId: string) =>
    [...smartlistKeys.filtersLists(), smartlistId] as const,
} as const;

export const fetchSmartlistDetailAPI = async (
  fetch: Fetch<Smartlist>,
  id: string,
): Promise<Smartlist> => {
  const { data } = await fetch(`${SMARTLIST_API_V1}/group/${id}`);
  return data;
};

export const fetchTagRulesAPI = async (
  fetch: Fetch<TagRule[]>,
  smartlistId: string,
): Promise<TagRule[]> => {
  const urlParams = buildUrlParams({ smartlist_id: smartlistId });
  const { data } = await fetch(`${SMARTLIST_API_V1}/tagrules/${urlParams}`);
  return data;
};

/**
 * Deletes a tag rule
 * @param id - ID of the tag rule to delete
 */
export const deleteTagRuleAPI = async (
  fetch: Fetch<void>,
  id: number,
): Promise<void> => {
  await fetch(`${SMARTLIST_API_V1}/tagrules/${id}/`, {
    method: "DELETE",
  });
};

export async function generateCampaignReportAPI(
  fetch: Fetch<BackgroundTaskStatusResponse>,
  params: GenerateReportParams,
): Promise<GenerateReportResult> {
  const searchParams = new URLSearchParams({
    start_date: params.startDate,
    end_date: params.endDate,
  });

  const { backgroundTaskUuid } = await fetch(
    `${SMARTLIST_API_V1}/group/${params.smartlistId}/export-campaigns-background/?${searchParams.toString()}`,
    {
      method: "POST",
    },
  );

  if (!backgroundTaskUuid) {
    throw new Error("Missing background task id in response header");
  }

  return { backgroundTaskUuid };
}

export async function getBackgroundTaskStatusAPI(
  fetch: Fetch<BackgroundTaskStatusResponse>,
  taskUuid: string,
): Promise<BackgroundTaskStatusResponse> {
  const { data } = await fetch(`platform/v1/background_task/${taskUuid}`, {
    method: "GET",
  });

  if (!data) {
    throw new Error("Failed to fetch background task status");
  }

  return data;
}

export const createTagRuleAPI = async (
  fetch: Fetch<TagRule>,
  params: CreateTagRuleParams,
): Promise<TagRule> => {
  const { data } = await fetch(`${SMARTLIST_API_V1}/tagrules/`, {
    method: "POST",
    body: JSON.stringify(params),
  });

  return data;
};

export const fetchTagRuleDetailAPI = async (
  fetch: Fetch<TagRule>,
  id: string,
): Promise<TagRule> => {
  const { data } = await fetch(`${SMARTLIST_API_V1}/tagrules/${id}/`);

  return data;
};

export const updateTagRuleAPI = async (
  fetch: Fetch<TagRule>,
  params: UpdateTagRuleParams,
): Promise<TagRule> => {
  const { id, ...body } = params;
  const { data } = await fetch(`${SMARTLIST_API_V1}/tagrules/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  return data;
};

export const fetchSmartlistFiltersAPI = async (
  fetch: Fetch<SmartlistGetFiltersResponse>,
  smartlistId: string,
): Promise<SmartlistGetFiltersResponse> => {
  const { data } = await fetch(
    `${SMARTLIST_API_V1}/group/${smartlistId}/get_filters/`,
  );

  return data;
};
