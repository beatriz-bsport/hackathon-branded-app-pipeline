import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type MetaActivity,
  fetchGroupActivitiesAndWorkshops,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";
import { invariant } from "#src/utils/invariant";

import { smartlistQueryKeys } from "./api";

const GROUP_ACTIVITIES_PAGE_SIZE = 100;
const MAX_LOOP_COUNT = 20;

/** Shared with consumers that `fetchQuery` the same list (e.g. coach options). */
export const GROUP_ACTIVITIES_STALE_TIME_MS = 2 * 60 * 1000;

/**
 * Loads every group activity (including workshop) for the current studio via paginated meta-activity requests.
 */
export const fetchAllStudioGroupActivities = async (): Promise<
  MetaActivity[]
> => {
  const activities: MetaActivity[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    // Security matters, to prevent potential infinite loop if API mis behave, no studio have over 2000 group activities so for now we can limit the loop to 20 pages of 100 items, check made through metabase on 14/05/2026
    invariant(
      page <= MAX_LOOP_COUNT,
      "Arbitrary loop limit reached : more than 20 calls where made, we stopped the loop to prevent potential infinite loop if API miss behave, if the studio appear to have more than 2000 items, you can increase the MAX_LOOP_COUNT to prevent this error",
    );
    const response = await fetchGroupActivitiesAndWorkshops(fetch, {
      customerEnabled: true,
      page,
      pageSize: GROUP_ACTIVITIES_PAGE_SIZE,
    });
    activities.push(...response.results);
    hasNextPage = Boolean(response.next_page);
    page += 1;
  }

  return activities;
};

/**
 * Full studio group meta-activities (paginated fetch). Cached under
 * `groupActivitiesKeys.all` so other hooks (e.g. coach options) reuse the same
 * request instead of duplicating it.
 */
export const useGroupActivitiesQuery = () => {
  const { data: metaActivities } = useSuspenseQuery({
    queryKey: smartlistQueryKeys.groupActivitiesKeys.all,
    queryFn: fetchAllStudioGroupActivities,
    staleTime: GROUP_ACTIVITIES_STALE_TIME_MS,
  });
  const data = metaActivities
    .map((activity) => ({ id: activity.id, name: activity.name }))
    .sort((leftActivity, rightActivity) =>
      leftActivity.name.localeCompare(rightActivity.name),
    );
  return { data };
};
