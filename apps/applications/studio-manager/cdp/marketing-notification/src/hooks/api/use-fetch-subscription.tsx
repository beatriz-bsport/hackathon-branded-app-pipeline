import {
  type FetchSubscriptionQueryParams,
  fetchSubscriptionsAction,
  searchSubscriptionsAction,
} from "@bsport/store-buyables-subscription";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchSubscriptionsBound = fetchSubscriptionsAction.bind(null, fetch);

export const useFetchSubscriptions = () => {
  const [{ isLoading: isSubscriptionsLoading }, fetchSubscriptions] = useAsync<
    typeof fetchSubscriptionsBound
  >({
    asyncFn: fetchSubscriptionsBound,
  });

  const handleSearchSubscriptions = async (
    query: string,
    params?: FetchSubscriptionQueryParams,
  ) => {
    return await searchSubscriptionsAction(fetch, {
      q: query,
      ...params,
    });
  };

  return {
    handleFetchSubscriptions: fetchSubscriptions,
    handleSearchSubscriptions,
    isSubscriptionsLoading,
  };
};
