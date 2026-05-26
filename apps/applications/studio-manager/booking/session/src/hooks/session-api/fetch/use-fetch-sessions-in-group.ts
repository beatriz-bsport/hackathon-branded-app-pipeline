import { queryOptions, useQuery } from "@tanstack/react-query";
import pick from "lodash/pick";

import {
  type PaginatedFetchSessionsParams,
  type Session,
  fetchSessionsAPI,
  sessionKeys,
} from "@bsport/api-book";
import type { PaginatedResponse } from "@bsport/store-base";

import { fetch } from "#src/utils/fetch";

const fetchSessions = fetchSessionsAPI.bind(null, fetch);

export const sessionsInGroupQueryOptions = (
  groupId: number | null,
  params: PaginatedFetchSessionsParams,
  enabled: boolean,
) =>
  queryOptions<PaginatedResponse<Session>>({
    queryKey: sessionKeys.inGroup(groupId, params),
    queryFn: () =>
      fetchSessions({
        group_id__in: [groupId!],
        ...params,
      }),
    enabled: enabled && groupId !== null,
  });

export const useFetchSessionsInGroup = (
  groupId: number | null,
  params: PaginatedFetchSessionsParams,
  enabled: boolean,
) =>
  useQuery({
    ...sessionsInGroupQueryOptions(groupId, params, enabled),
    select: (data) =>
      data.results.map((session) =>
        pick(session, [
          "id",
          "date_start",
          "effectif",
          "validated_booking_count",
          "timezone_name",
        ]),
      ),
  });
