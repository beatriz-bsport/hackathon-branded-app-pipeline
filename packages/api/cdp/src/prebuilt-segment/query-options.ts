import { queryOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import {
  fetchPrebuiltSegmentDefinitionAPI,
  fetchPrebuiltSegmentMembersAPI,
  prebuiltSegmentKeys,
} from "./api";
import type {
  PrebuiltSegmentDefinition,
  PrebuiltSegmentDefinitionParams,
  PrebuiltSegmentMembersPage,
  PrebuiltSegmentMembersParams,
} from "./types";

export const prebuiltSegmentDefinitionQueryOptions = (
  fetch: Fetch<PrebuiltSegmentDefinition>,
  params: PrebuiltSegmentDefinitionParams,
) =>
  queryOptions({
    queryKey: prebuiltSegmentKeys.detail(params.segment_identifier),
    queryFn: () => fetchPrebuiltSegmentDefinitionAPI(fetch, params),
  });

export const prebuiltSegmentMembersQueryOptions = (
  fetch: Fetch<PrebuiltSegmentMembersPage>,
  params: PrebuiltSegmentMembersParams,
) =>
  queryOptions({
    queryKey: prebuiltSegmentKeys.membersList(params),
    queryFn: () => fetchPrebuiltSegmentMembersAPI(fetch, params),
  });
