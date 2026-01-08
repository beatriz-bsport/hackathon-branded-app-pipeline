import { queryOptions, useQuery } from "@tanstack/react-query";
import pick from "lodash/pick";

import { FetchSessionsParams, fetchSessionsAPI } from "@bsport/api-book";

import { SESSIONS_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";

const fetchSessions = fetchSessionsAPI.bind(null, fetch);

const sessionsInGroupQueryOptions = (
  groupId: number | null,
  params: FetchSessionsParams,
  enabled: boolean,
) => {
  return queryOptions({
    queryKey: [`${SESSIONS_QUERY_KEY}_in_group`, groupId, params],
    queryFn: () =>
      fetchSessions({
        group_id__in: [groupId!],
        ...params,
      }),
    enabled: enabled && groupId !== null,
  });
};

export const useFetchSessionsInGroup = (
  groupId: number | null,
  params: FetchSessionsParams,
  enabled: boolean,
) => {
  return useQuery({
    ...sessionsInGroupQueryOptions(groupId, params, enabled),
    enabled: enabled,
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
};
