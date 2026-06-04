import {
  type UseQueryResult,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { useCallback } from "react";

import {
  type PrebuiltSegmentDefinition,
  type PrebuiltSegmentMembersPage,
  prebuiltSegmentDefinitionQueryOptions,
  prebuiltSegmentMembersQueryOptions,
} from "@bsport/api-cdp/prebuilt-segment";

import type { PrebuiltSegmentId } from "#src/pages/prebuilt-segment-detail/constants";
import {
  type PrebuiltSegmentDefinitionResponse,
  type PrebuiltSegmentMembersResponse,
  parsePrebuiltSegmentDefinitionResponse,
  parsePrebuiltSegmentMembersResponse,
} from "#src/pages/prebuilt-segment-detail/prebuilt-segment-contract";
import { fetch } from "#src/utils/fetch";

type PrebuiltSegmentDetailQueryResults = [
  UseQueryResult<PrebuiltSegmentDefinitionResponse>,
  UseQueryResult<PrebuiltSegmentMembersResponse>,
];
type PrebuiltSegmentDetailQueryResult = {
  definition: PrebuiltSegmentDefinitionResponse | undefined;
  membersPage: PrebuiltSegmentMembersResponse | undefined;
  isLoading: boolean;
};

const combinePrebuiltSegmentDetailQueries = ([
  definitionResult,
  membersResult,
]: PrebuiltSegmentDetailQueryResults): PrebuiltSegmentDetailQueryResult => ({
  definition: definitionResult.data,
  membersPage: membersResult.data,
  isLoading: definitionResult.isFetching || membersResult.isFetching,
});

export function usePrebuiltSegmentDefinition(
  prebuiltSegmentId: PrebuiltSegmentId,
) {
  const params = { segment_identifier: prebuiltSegmentId };
  const selectPrebuiltSegmentDefinition = useCallback(
    (response: PrebuiltSegmentDefinition): PrebuiltSegmentDefinitionResponse =>
      parsePrebuiltSegmentDefinitionResponse(response, {
        requestedPrebuiltSegmentId: prebuiltSegmentId,
      }),
    [prebuiltSegmentId],
  );

  return useQuery({
    ...prebuiltSegmentDefinitionQueryOptions(fetch, params),
    select: selectPrebuiltSegmentDefinition,
  });
}

export function usePrebuiltSegmentDetail(
  prebuiltSegmentId: PrebuiltSegmentId,
  page: number,
  pageSize: number,
) {
  const definitionParams = { segment_identifier: prebuiltSegmentId };
  const membersParams = {
    segment_identifier: prebuiltSegmentId,
    page,
    page_size: pageSize,
  };
  const selectPrebuiltSegmentDefinition = useCallback(
    (response: PrebuiltSegmentDefinition): PrebuiltSegmentDefinitionResponse =>
      parsePrebuiltSegmentDefinitionResponse(response, {
        requestedPrebuiltSegmentId: prebuiltSegmentId,
      }),
    [prebuiltSegmentId],
  );
  const selectPrebuiltSegmentMembers = useCallback(
    (response: PrebuiltSegmentMembersPage): PrebuiltSegmentMembersResponse =>
      parsePrebuiltSegmentMembersResponse(response, {
        requestedPrebuiltSegmentId: prebuiltSegmentId,
      }),
    [prebuiltSegmentId],
  );
  const definitionQuery = {
    ...prebuiltSegmentDefinitionQueryOptions(fetch, definitionParams),
    select: selectPrebuiltSegmentDefinition,
    throwOnError: true,
  };
  const membersQuery = {
    ...prebuiltSegmentMembersQueryOptions(fetch, membersParams),
    select: selectPrebuiltSegmentMembers,
    throwOnError: true,
  };

  return useQueries<
    [typeof definitionQuery, typeof membersQuery],
    PrebuiltSegmentDetailQueryResult
  >({
    queries: [definitionQuery, membersQuery],
    combine: combinePrebuiltSegmentDetailQueries,
  });
}
