import {
  type FetchGroupActivitiesParams,
  fetchGroupActivitiesAndWorkshopsAction,
  searchGroupActivitiesAction,
} from "@bsport/store-booking-group-activity";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchGroupActivitiesBinded = fetchGroupActivitiesAndWorkshopsAction.bind(
  null,
  fetch,
);

export const useFetchGroupActivities = () => {
  const [{ isLoading: isGroupActivitiesLoading }, fetchGroupActivities] =
    useAsync<typeof fetchGroupActivitiesBinded>({
      asyncFn: fetchGroupActivitiesBinded,
    });

  const handleFetchGroupActivities = (params: FetchGroupActivitiesParams) => {
    fetchGroupActivities(params);
  };

  const handleSearchGroupActivities = async (
    query: string,
    params?: FetchGroupActivitiesParams,
  ) => {
    return await searchGroupActivitiesAction(fetch, {
      searchQuery: query,
      ...params,
    });
  };

  return {
    handleFetchGroupActivities,
    handleSearchGroupActivities,
    isGroupActivitiesLoading,
  };
};
