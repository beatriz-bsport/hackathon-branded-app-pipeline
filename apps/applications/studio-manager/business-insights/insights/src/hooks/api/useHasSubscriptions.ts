import { useEffect } from "react";

import {
  fetchSubscriptionsAction,
  selectSubscriptionsCount,
  useSubscriptionStore,
} from "@bsport/store-buyables-subscription";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchSubscriptionsBound = fetchSubscriptionsAction.bind(null, fetch);

/**
 * Returns whether the current company has at least one subscription contract.
 *
 * We intentionally fetch only 1 item to keep the request light.
 * This hook is intentionally conservative: until the request has populated the
 * store (or if the request fails), the store count stays at its default (0),
 * so `hasSubscriptions` is `false`. We do not expose loading/error state.
 */
export const useHasSubscriptions = () => {
  const subscriptionsCount = useSubscriptionStore(selectSubscriptionsCount);
  const [, fetchSubscriptions] = useAsync<typeof fetchSubscriptionsBound>({
    asyncFn: fetchSubscriptionsBound,
  });

  useEffect(() => {
    void fetchSubscriptions({ page: 1, page_size: 1 });
  }, [fetchSubscriptions]);

  return {
    hasSubscriptions: subscriptionsCount > 0,
  };
};
