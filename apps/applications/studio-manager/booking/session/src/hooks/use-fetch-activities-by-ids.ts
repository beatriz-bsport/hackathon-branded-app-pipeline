import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchGroupActivities } from "@bsport/api-book";

import { fetch } from "../utils/fetch";

const ACTIVITIES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchActivitiesByIds = fetchGroupActivities.bind(null, fetch);

const activitiesByIdsQueryOptions = (ids: number[]) => {
  return queryOptions({
    queryKey: ["activities", "byIds", ids],
    queryFn: () => fetchActivitiesByIds({ inIdList: ids }),
    staleTime: ACTIVITIES_STALE_TIME,
    enabled: ids.length > 0,
  });
};

export const useFetchActivitiesByIds = (ids: number[]) => {
  return useQuery({
    ...activitiesByIdsQueryOptions(ids),
    select: (activities) =>
      activities?.results.map((activity) => ({
        id: `${activity.id}`,
        label: activity.name,
      })) || [],
  });
};
