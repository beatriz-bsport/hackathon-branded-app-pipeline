import React, { useEffect, useState } from 'react';

import subscriptionApi from '#src/libs/subscription/api';

/**
 * Returns whether the current company has at least one active subscription contract.
 *
 * Conservative gating: until the contract list has been fetched (or if the request
 * fails), we return `false`.
 */
export const useHasSubscriptions = (enabled: boolean = true) => {
  const [hasSubscriptions, setHasSubscriptions] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setHasSubscriptions(false);
      return;
    }

    let isCancelled = false;

    void subscriptionApi
      .fetchContractList({
        disabled: false,
        page: 1,
        page_size: 1,
      })
      .then(({ data }) => {
        const paginatedData = data as { results?: unknown };
        const contracts = Array.isArray(data)
          ? data
          : Array.isArray(paginatedData.results)
          ? paginatedData.results
          : [];

        if (!isCancelled) {
          setHasSubscriptions(contracts.length > 0);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHasSubscriptions(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [enabled]);

  return { hasSubscriptions };
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
