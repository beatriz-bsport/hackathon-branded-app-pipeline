import { queryOptions } from "@tanstack/react-query";

import { Fetch, type PaginatedResponse } from "@bsport/store-base";

import { SMARTLIST_MEMBERS_DEFAULT_PAGE_SIZE } from "./constants";
import {
  fetchSmartlistDetailAPI,
  fetchSmartlistFiltersAPI,
  fetchTagRuleDetailAPI,
  fetchTagRulesAPI,
  smartlistKeys,
} from "./core/api";
import type { Smartlist, TagRule } from "./core/types";
import { fetchSmartlistMembersAPI } from "./members/api";
import type {
  FetchSmartlistMembersParams,
  SmartlistMember,
} from "./members/types";
import type { SmartlistGetFiltersResponse } from "./shared/types";

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

export const smartlistFiltersQueryOptions = (
  fetch: Fetch<SmartlistGetFiltersResponse>,
  id: string,
) =>
  queryOptions({
    queryKey: smartlistKeys.filters(id),
    queryFn: () => fetchSmartlistFiltersAPI(fetch, id),
  });

export const smartlistMembersQueryOptions = (
  fetch: Fetch<PaginatedResponse<SmartlistMember>>,
  params: FetchSmartlistMembersParams,
) => {
  const page = params.page ?? 1;
  const page_size = params.page_size ?? SMARTLIST_MEMBERS_DEFAULT_PAGE_SIZE;

  return queryOptions({
    queryKey: smartlistKeys.members(params.smartlistId, page, page_size),
    queryFn: () =>
      fetchSmartlistMembersAPI(fetch, {
        ...params,
        page,
        page_size,
      }),
  });
};
