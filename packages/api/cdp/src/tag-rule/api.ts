import { queryOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { API_V1, QUERY_KEY_MAIN } from "#src/constants";

import type {
  CreateTagRuleParams,
  TagRule,
  UpdateTagRuleParams,
} from "./types";

const SMARTLIST_API_V1 = `${API_V1}/smartlist`;

export const tagRuleKeys = {
  all: [QUERY_KEY_MAIN, "tag-rule"] as const,

  detail: (id: string) => [...tagRuleKeys.all, "detail", id] as const,
} as const;

export const createTagRule = async (
  fetch: Fetch<TagRule>,
  params: CreateTagRuleParams,
): Promise<TagRule> => {
  const { data } = await fetch(`${SMARTLIST_API_V1}/tagrules/`, {
    method: "POST",
    body: JSON.stringify(params),
  });

  return data;
};

export const fetchTagRuleDetail = async (
  fetch: Fetch<TagRule>,
  id: string,
): Promise<TagRule> => {
  const { data } = await fetch(`${SMARTLIST_API_V1}/tagrules/${id}/`);

  return data;
};

export const updateTagRule = async (
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

export const tagRuleDetailQueryOptions = (fetch: Fetch<TagRule>, id: string) =>
  queryOptions({
    queryKey: tagRuleKeys.detail(id),
    queryFn: () => fetchTagRuleDetail(fetch, id),
  });
