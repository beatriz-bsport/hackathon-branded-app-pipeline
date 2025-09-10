import { buildById } from "@bsport/store-base";

import { subscriptionStore } from "#src/store";
import type { Subscription } from "#src/types";

/**
 * Sets the complete list of subscriptions (non-paginated response).
 * Used when fetching all subscriptions without pagination.
 */
export const setSubscriptions = (subscriptions: Subscription[]) => {
  subscriptionStore.setState((state) => {
    if (!subscriptions) return state;

    const sanitizedSubscriptions = subscriptions.filter(Boolean);

    // Create normalized structure with by-ID mapping
    const byId = sanitizedSubscriptions.reduce(
      (acc, subscription) => {
        acc[subscription.id] = subscription;
        return acc;
      },
      {} as { [key: number]: Subscription },
    );

    const flatIds = sanitizedSubscriptions.map(
      (subscription) => subscription.id,
    );

    return {
      ...state,
      subscriptions: {
        ...state.subscriptions,
        byId,
        flatIds,
        count: sanitizedSubscriptions.length,
      },
    };
  });
};

/**
 * Sets paginated subscription search results with normalization.
 * Creates both array and by-ID access patterns for efficient lookups.
 */
export const setFuzzySearchedSubscriptions = ({
  subscriptions,
  count,
  page,
}: {
  subscriptions: Subscription[];
  count: number;
  page: number;
}) => {
  subscriptionStore.setState((state) => {
    if (!subscriptions) return state;

    const sanitizedSubscriptions = subscriptions.filter(Boolean);

    const fuzzySearchIds = sanitizedSubscriptions.map(
      (subscription) => subscription.id,
    );

    return {
      ...state,
      subscriptions: {
        ...state.subscriptions,
        byId: buildById<Subscription>({
          initial: state.subscriptions.byId,
          newItems: sanitizedSubscriptions,
        }),
        fuzzySearchIds,
        count,
        page,
      },
    };
  });
};
