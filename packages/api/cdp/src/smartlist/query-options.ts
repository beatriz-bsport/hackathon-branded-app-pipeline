import { queryOptions } from "@tanstack/react-query";

import { Fetch } from "@bsport/store-base";

import {
  fetchSmartlistDetailAPI,
  fetchTagRuleDetailAPI,
  fetchTagRulesAPI,
  smartlistKeys,
} from "./api";
import { Smartlist, TagRule } from "./types";

export const smartlistDetailQueryOptions = (
  fetch: Fetch<Smartlist>,
  id: string,
) =>
  queryOptions({
    queryKey: smartlistKeys.detail(id),
    queryFn: () => fetchSmartlistDetailAPI(fetch, id),
  });

export const tagRulesQueryOptions = (
  fetch: Fetch<TagRule[]>,
  smartlistId: string,
) =>
  queryOptions({
    queryKey: smartlistKeys.tagRules(smartlistId),
    queryFn: () => fetchTagRulesAPI(fetch, smartlistId),
  });

export const tagRuleDetailQueryOptions = (fetch: Fetch<TagRule>, id: string) =>
  queryOptions({
    queryKey: smartlistKeys.tagRuleDetail(id),
    queryFn: () => fetchTagRuleDetailAPI(fetch, id),
  });
