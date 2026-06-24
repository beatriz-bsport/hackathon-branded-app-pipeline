import { useQueries, useQuery } from "@tanstack/react-query";

import {
  retrieveGroupActivityQueryOptions,
  retrieveGroupSessionQueryOption,
} from "@bsport/api-book";
import { fetchLevelQueryOptions } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch.js";

const DEFAULT_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useRetrieveRefinedGroupSession = (
  groupSessionId?: number | null,
) => {
  const {
    data: groupSession,
    isLoading: isGroupSessionLoading,
    error: groupSessionError,
  } = useQuery({
    ...retrieveGroupSessionQueryOption(fetch, groupSessionId!),
    enabled: groupSessionId != null,
    staleTime: DEFAULT_STALE_TIME,
  });

  const metaActivityId = groupSession?.meta_activity;

  const levelId = groupSession?.level;

  const [metaActivityQuery, levelQuery] = useQueries({
    queries: [
      {
        ...retrieveGroupActivityQueryOptions(fetch, metaActivityId!),
        enabled: !!metaActivityId,
      },
      {
        ...fetchLevelQueryOptions(fetch, levelId!),
        enabled: !!groupSession?.level,
      },
    ],
  });

  return {
    groupSession: groupSession,
    metaActivity: metaActivityQuery.data,
    level: levelQuery.data,
    isLoading:
      isGroupSessionLoading ||
      metaActivityQuery.isLoading ||
      levelQuery.isLoading,
    error: {
      groupSession: groupSession ? null : groupSessionError,
      metaActivity: metaActivityQuery.error,
      level: levelQuery.error,
    },
  };
};
