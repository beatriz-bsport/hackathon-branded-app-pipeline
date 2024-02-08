import React from 'react';
import MarketplacePageContent from '#csscomponents/MarketplacePageContent';
import ConsumerSubscriptionHeader from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionHeader';
import ConsumerSubscriptionsTabs from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionTabs';
import ConsumerSubscriptionsListContainer from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionsListContainer';
import { ConsumerSubscriptionTermsModal } from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionModals';

import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#libs/subscription/types';
import type { OptionCallback } from '../../../../../../state/types';
import type {
  ConsumerSubscriptionInvoiceDetails,
  ConsumerSubscriptionReworked,
} from '#libs/consumer-space/types';
import type { PaymentMethod } from '#libs/payment/types';

import useConsumerSubscriptionsModalManager from '#libs/consumer-space/components/reworked/@MySubscriptions/hooks/useConsumerSubscriptionsModalManager';
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
  resetConsumerState: () => void;
  onBookSessionClick: () => void;
  onGetASubscriptionClick: () => void;
  fetchConsumerSubscriptionInvoicesDetails: (
    params: { id: number; page_size?: number },
    options?: OptionCallback<SubscriptionsInvoicesDetailsREST[]>,
  ) => void;
  subscriptionsInvoicesDetailsState: ConsumerSubscriptionInvoiceDetails;
  invoiceRetryNumber: number;
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
  resetConsumerState,
  fetchConsumerSubscriptionInvoicesDetails,
  subscriptionsInvoicesDetailsState,
  invoiceRetryNumber,
  downloadBillingPlanTermsAction,
}) => {
  const {
    areDetailsLoading,
    detailsNextPage,
    handleInvoiceDetailsPaginationFetchMore,
    handlePaginationFetchMore,
    handleSetSelectedSubscriptions,
    handleSetSelectedTab,
    isLoading,
    isMobile,
    nextPage,
    selectedSubscription,
    selectedSubscriptionInvoiceDetails,
    selectedTab,
    subscriptionsList,
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
    resetConsumerState,
    fetchConsumerSubscriptionInvoicesDetails,
    subscriptionsInvoicesDetailsState,
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
        areDetailsLoading={areDetailsLoading}
        handleInvoiceDetailsPaginationFetchMore={
          handleInvoiceDetailsPaginationFetchMore
        }
        handlePaginationFetchMore={handlePaginationFetchMore}
        handleSetSelectedSubscriptions={handleSetSelectedSubscriptions}
        hasDetailsNextPage={!!detailsNextPage}
        hasNextPage={!!nextPage}
        invoiceRetryNumber={invoiceRetryNumber}
        isLoading={isLoading}
        isMobile={isMobile}
        onSeeTermsClick={handleTermsModalOpen}
        paymentMethodList={paymentMethodList}
        selectedSubscription={selectedSubscription}
        selectedSubscriptionInvoiceDetails={selectedSubscriptionInvoiceDetails}
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
