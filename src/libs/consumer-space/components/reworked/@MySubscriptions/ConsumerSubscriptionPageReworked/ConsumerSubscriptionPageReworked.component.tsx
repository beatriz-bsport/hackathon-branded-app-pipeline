import React from 'react';
import MarketplacePageContent from '#csscomponents/MarketplacePageContent';
import ConsumerSubscriptionHeader from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionHeader';
import ConsumerSubscriptionsTabs from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionTabs';
import ConsumerSubscriptionsListContainer from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionsListContainer';

import type { SubscriptionREST } from '#libs/subscription/types';
import type { OptionCallback } from '../../../../../../state/types';
import type { ConsumerSubscriptionReworked } from '#libs/consumer-space/types';
import type { PaymentMethod } from '#libs/payment/types';

import useConsumerSubscriptionsDataManager from '#libs/consumer-space/components/reworked/@MySubscriptions/hooks/useConsumerSubscriptionsDataManager';

import './styles.css';

type Props = {
  activeSubscriptionsState: ConsumerSubscriptionReworked;
  activeSubscriptionsList: SubscriptionREST[];
  futureSubscriptionsState: ConsumerSubscriptionReworked;
  expiredSubscriptionsList: SubscriptionREST[];
  expiredSubscriptionsState: ConsumerSubscriptionReworked;
  futureSubscriptionsList: SubscriptionREST[];
  paymentMethodList: PaymentMethod[];
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
  resetConsumerSubscriptionsState: () => void;
  onBookSessionClick: () => void;
  onGetASubscriptionClick: () => void;
};

const ConsumerSubscriptionPageReworked: React.FC<Props> = ({
  activeSubscriptionsState,
  activeSubscriptionsList,
  futureSubscriptionsState,
  futureSubscriptionsList,
  expiredSubscriptionsState,
  expiredSubscriptionsList,
  paymentMethodList,
  onBookSessionClick,
  onGetASubscriptionClick,
  fetchActiveSubscriptionsList,
  fetchFutureSubscriptionsList,
  fetchExpiredSubscriptionsList,
  resetConsumerSubscriptionsState,
}) => {
  const {
    selectedTab,
    selectedSubscription,
    subscriptionsList,
    isLoading,
    nextPage,
    handlePaginationFetchMore,
    handleSetSelectedTab,
    handleSetSelectedSubscriptions,
    isMobile,
  } = useConsumerSubscriptionsDataManager({
    activeSubscriptionsState,
    activeSubscriptionsList,
    futureSubscriptionsState,
    futureSubscriptionsList,
    expiredSubscriptionsState,
    expiredSubscriptionsList,
    fetchActiveSubscriptionsList,
    fetchFutureSubscriptionsList,
    fetchExpiredSubscriptionsList,
    resetConsumerSubscriptionsState,
  });

  return (
    <MarketplacePageContent
      classes={{ children: 'bs-consumer__subscription-page__root' }}
    >
      <ConsumerSubscriptionHeader
        onBookSessionClick={onBookSessionClick}
        onGetASubscriptionClick={onGetASubscriptionClick}
      />
      <ConsumerSubscriptionsTabs
        activeBookingsCount={activeSubscriptionsState.count}
        futureBookingsCount={futureSubscriptionsState.count}
        onChangeSubscriptionTab={handleSetSelectedTab}
        selectedTab={selectedTab}
      />
      <ConsumerSubscriptionsListContainer
        handlePaginationFetchMore={handlePaginationFetchMore}
        handleSetSelectedSubscriptions={handleSetSelectedSubscriptions}
        hasNextPage={!!nextPage}
        isLoading={isLoading}
        // TODO
        isMobile={isMobile}
        onSeeTermsClick={() => {}}
        paymentMethodList={paymentMethodList}
        selectedSubscription={selectedSubscription}
        selectedTab={selectedTab}
        subscriptionsList={subscriptionsList}
      />
    </MarketplacePageContent>
  );
};
export default React.memo(ConsumerSubscriptionPageReworked);
