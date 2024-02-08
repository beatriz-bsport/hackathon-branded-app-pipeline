import React from 'react';
import MarketplacePageContent from '#csscomponents/MarketplacePageContent';
import ConsumerSubscriptionHeader from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionHeader';
import ConsumerSubscriptionsTabs from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionTabs';
import ConsumerSubscriptionsListContainer from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionsListContainer';
import { ConsumerSubscriptionTermsModal } from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionModals';

import type { SubscriptionREST } from '#libs/subscription/types';
import type { OptionCallback } from '../../../../../../state/types';
import type { ConsumerSubscriptionReworked } from '#libs/consumer-space/types';
import type { PaymentMethod } from '#libs/payment/types';

import useConsumerSubscriptionsDataManager from '#libs/consumer-space/components/reworked/@MySubscriptions/hooks/useConsumerSubscriptionsDataManager';
import useConsumerSubscriptionsModalManager from '#libs/consumer-space/components/reworked/@MySubscriptions/hooks/useConsumerSubscriptionsModalManager';

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
  downloadBillingPlanTermsAction: (
    billingPanId: number,
    options?: OptionCallback,
  ) => Promise<void>;
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
  downloadBillingPlanTermsAction,
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
  const { isTermsModalOpen, handleTermsModalOpen, handleTermsModalClose } =
    useConsumerSubscriptionsModalManager();

  const downloadBillingPlanTerms = React.useCallback(
    (options: OptionCallback) =>
      downloadBillingPlanTermsAction(selectedSubscription.id, options),
    [selectedSubscription, downloadBillingPlanTermsAction],
  );

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
        onSeeTermsClick={handleTermsModalOpen}
        paymentMethodList={paymentMethodList}
        selectedSubscription={selectedSubscription}
        selectedTab={selectedTab}
        subscriptionsList={subscriptionsList}
      />
      {selectedSubscription && (
        <ConsumerSubscriptionTermsModal
          contractTermsLink={selectedSubscription.contract_terms_pdf_link}
          downloadContractTerms={downloadBillingPlanTerms}
          isOpen={isTermsModalOpen}
          onClose={handleTermsModalClose}
          termsContent={selectedSubscription.contract_terms}
        />
      )}
    </MarketplacePageContent>
  );
};
export default React.memo(ConsumerSubscriptionPageReworked);
