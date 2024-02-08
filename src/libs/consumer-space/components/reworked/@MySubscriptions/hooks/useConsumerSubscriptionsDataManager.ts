import { useCallback, useMemo, useState } from 'react';
import { SubscriptionTabEnum } from '#libs/consumer-space/components/reworked/@MySubscriptions/constants';
import useViewport from '#Fabrique/hooks/useViewport';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#libs/consumer-space/constants';

import type { SubscriptionTab } from '#libs/consumer-space/components/reworked/@MySubscriptions/types';
import type { SubscriptionREST } from '#libs/subscription/types';
import type { OptionCallback } from '../../../../../../state/types';
import type { ConsumerSubscriptionReworked } from '#libs/consumer-space/types';

type Data = {
  activeSubscriptionsState: ConsumerSubscriptionReworked;
  activeSubscriptionsList: SubscriptionREST[];
  futureSubscriptionsState: ConsumerSubscriptionReworked;
  expiredSubscriptionsList: SubscriptionREST[];
  expiredSubscriptionsState: ConsumerSubscriptionReworked;
  futureSubscriptionsList: SubscriptionREST[];
  fetchActiveSubscriptionsList: (
    page_size?: number,
    options?: OptionCallback<SubscriptionREST[]>,
  ) => void;
  fetchExpiredSubscriptionsList: (
    page_size?: number,
    options?: OptionCallback<SubscriptionREST[]>,
  ) => void;
  fetchFutureSubscriptionsList: (
    page_size?: number,
    options?: OptionCallback<SubscriptionREST[]>,
  ) => void;
  resetConsumerState: () => void;
};

const useConsumerSubscriptionsDataManager = ({
  activeSubscriptionsState,
  activeSubscriptionsList,
  futureSubscriptionsState,
  futureSubscriptionsList,
  expiredSubscriptionsState,
  expiredSubscriptionsList,
  fetchActiveSubscriptionsList,
  fetchFutureSubscriptionsList,
  fetchExpiredSubscriptionsList,
  resetConsumerState,
}: Data) => {
  const [selectedTab, setSelectedTab] = useState<SubscriptionTab>(
    SubscriptionTabEnum.ACTIVE,
  );

  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionREST | null>(null);

  const { width } = useViewport();

  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const fetchDataHandlerMap = useMemo(
    () => ({
      [SubscriptionTabEnum.ACTIVE]: fetchActiveSubscriptionsList,
      [SubscriptionTabEnum.FUTURE]: fetchFutureSubscriptionsList,
      [SubscriptionTabEnum.EXPIRED]: fetchExpiredSubscriptionsList,
    }),
    [
      fetchActiveSubscriptionsList,
      fetchFutureSubscriptionsList,
      fetchExpiredSubscriptionsList,
    ],
  );

  const currentSubscriptionsStateMap = {
    [SubscriptionTabEnum.ACTIVE]: activeSubscriptionsState,
    [SubscriptionTabEnum.FUTURE]: futureSubscriptionsState,
    [SubscriptionTabEnum.EXPIRED]: expiredSubscriptionsState,
  };

  const subscriptionsListMap = useMemo(
    () => ({
      [SubscriptionTabEnum.ACTIVE]: activeSubscriptionsList,
      [SubscriptionTabEnum.FUTURE]: futureSubscriptionsList,
      [SubscriptionTabEnum.EXPIRED]: expiredSubscriptionsList,
    }),
    [
      activeSubscriptionsList,
      futureSubscriptionsList,
      expiredSubscriptionsList,
    ],
  );

  const subscriptionsList = useMemo(
    () => subscriptionsListMap[`${selectedTab}`],
    [selectedTab, subscriptionsListMap],
  );

  const isLoading =
    activeSubscriptionsState.loading ||
    futureSubscriptionsState.loading ||
    expiredSubscriptionsState.loading;

  const nextPage = currentSubscriptionsStateMap[`${selectedTab}`].next_page;

  const handlePaginationFetchMore = useCallback(
    () => fetchDataHandlerMap[`${selectedTab}`](),
    [fetchDataHandlerMap, selectedTab],
  );

  const handleSetSelectedTab = useCallback(
    (tab: SubscriptionTab) => {
      resetConsumerState();
      fetchDataHandlerMap[`${tab}`]();
      setSelectedTab(tab);
      setSelectedSubscription(null);
    },
    [resetConsumerState, fetchDataHandlerMap],
  );

  const handleSetSelectedSubscriptions = useCallback(
    (subscriptionId: number) => {
      const subscription =
        subscriptionsList.find((item) => item.id === subscriptionId) || null;
      setSelectedSubscription(subscription);
    },
    [subscriptionsList],
  );

  return {
    selectedTab,
    selectedSubscription,
    subscriptionsList,
    isLoading,
    nextPage,
    handlePaginationFetchMore,
    handleSetSelectedTab,
    handleSetSelectedSubscriptions,
    isMobile,
  };
};

export default useConsumerSubscriptionsDataManager;
