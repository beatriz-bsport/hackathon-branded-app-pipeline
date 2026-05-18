import { queryOptions, useQuery } from "@tanstack/react-query";
import pick from "lodash/pick";

import {
  FetchSessionsParams,
  fetchSessionsAPI,
  sessionKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const fetchSessions = fetchSessionsAPI.bind(null, fetch);

const sessionsInGroupQueryOptions = (
  groupId: number | null,
  params: FetchSessionsParams,
  enabled: boolean,
) => {
  return queryOptions({
    queryKey: sessionKeys.inGroup(groupId, params),
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
