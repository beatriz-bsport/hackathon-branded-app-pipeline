import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { fetchSubscriptionList } from '#src/libs/subscription/actions';
import type { RootState } from '#src/reducers';

/**
 * Returns whether the current company has at least one subscription billing plan.
 *
 * Conservative gating: until the list has been fetched (or if the request fails),
 * the count stays unset/0 and we return `false`.
 */
export const useHasSubscriptions = (enabled: boolean = true) => {
  const dispatch = useDispatch();

  const subscriptionsCount = useSelector(
    // @ts-expect-error
    (state: RootState) => state.subscription.list.count,
  );
  const isLoading = useSelector(
    (state: RootState) => state.subscription.list.loading,
  );

  useEffect(() => {
    if (!enabled) return;

    // Avoid repeated requests: only fetch if we haven't fetched yet.
    if (subscriptionsCount == null && !isLoading) {
      dispatch(
        fetchSubscriptionList({
          page: 1,
          page_size: 1,
        }),
      );
    }
  }, [dispatch, enabled, isLoading, subscriptionsCount]);

  return { hasSubscriptions: (subscriptionsCount ?? 0) > 0 };
};

type HasSubscriptionsProviderProps = {
  enabled?: boolean;
  children: (args: { hasSubscriptions: boolean }) => React.ReactNode;
};

/**
 * Render-prop provider to expose `hasSubscriptions`.
 *
 * Use this when you're already in a render-prop callback (e.g. permission providers)
 * and can't call hooks directly without violating react-hooks/rules-of-hooks.
 */
export const HasSubscriptionsProvider = ({
  enabled = true,
  children,
}: HasSubscriptionsProviderProps): React.ReactElement | null => {
  const { hasSubscriptions } = useHasSubscriptions(enabled);
  return React.createElement(
    React.Fragment,
    null,
    children({ hasSubscriptions }),
  );
};
