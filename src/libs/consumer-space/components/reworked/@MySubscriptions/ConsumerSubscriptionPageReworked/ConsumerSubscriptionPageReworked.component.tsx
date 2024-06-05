import React from 'react';
import type { AxiosResponse } from 'axios';

import classNames from 'classnames';
import MarketplacePageContent from '#src/components/css-only/MarketplacePageContent';
import ConsumerSubscriptionHeader from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionHeader';
import ConsumerSubscriptionsTabs from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionTabs';
import ConsumerSubscriptionsListContainer from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionsListContainer';
import {
  ConsumerSubscriptionTermsPortal,
  ConsumerSubscriptionPaymentPortal,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionPortals';

import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#src/libs/subscription/types';
import type {
  ConsumerSubscriptionInvoiceDetails,
  ConsumerSubscriptionReworked,
} from '#src/libs/consumer-space/types';
import type { PaymentMethod } from '#src/libs/payment/types';
import type { SubscriptionTab } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';

import useConsumerSubscriptionsModalManager from '#src/libs/consumer-space/components/reworked/@MySubscriptions/hooks/useConsumerSubscriptionsModalManager';
import useConsumerSubscriptionsDataManager from '#src/libs/consumer-space/components/reworked/@MySubscriptions/hooks/useConsumerSubscriptionsDataManager';
import { mobileDetailsDisplay } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/utils';
import type { OptionCallback } from '../../../../../../state/types';

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
  requestSetupIntentSecret: () => Promise<
    AxiosResponse<{
      client_secret: string;
    }>
  >;
  detachPaymentMethod: (pm_id: string, options?: OptionCallback) => void;
  enabledPaymentGroupMethodIdentifierIds: number[];
  paymentMethodLoading: boolean;
  refreshSavedPaymentMethodList: () => void;
  switchPaymentMethod: (
    subscriptionId: number,
    payment_method_id: string,
    status: SubscriptionTab,
    options?: OptionCallback,
  ) => void;
  memberMail: string;
  memberName: string;
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
  fetchConsumerSubscriptionInvoicesDetails,
  subscriptionsInvoicesDetailsState,
  invoiceRetryNumber,
  downloadBillingPlanTermsAction,
  detachPaymentMethod,
  enabledPaymentGroupMethodIdentifierIds,
  paymentMethodLoading,
  refreshSavedPaymentMethodList,
  requestSetupIntentSecret,
  switchPaymentMethod,
  memberMail,
  memberName,
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
    fetchConsumerSubscriptionInvoicesDetails,
    subscriptionsInvoicesDetailsState,
  });

  const {
    isPaymentModalOpen,
    isTermsModalOpen,
    handleTermsModalOpen,
    handleTermsModalClose,
    handlePaymentModalOpen,
    handlePaymentModalClose,
  } = useConsumerSubscriptionsModalManager();

  const downloadBillingPlanTerms = React.useCallback(
    (options: OptionCallback) =>
      downloadBillingPlanTermsAction(selectedSubscription.id, options),
    [selectedSubscription, downloadBillingPlanTermsAction],
  );

  const paymentMethodUsed = React.useMemo(
    () =>
      paymentMethodList.find(
        (paymentMethod) =>
          paymentMethod.id === selectedSubscription?.stripe_payment_method_id,
      ),
    [paymentMethodList, selectedSubscription],
  );

  const handleSwitchPaymentMethod = React.useCallback(
    (subscriptionId, payment_method_id, options) => {
      switchPaymentMethod(
        subscriptionId,
        payment_method_id,
        selectedTab,
        options,
      );
    },
    [selectedTab, switchPaymentMethod],
  );

  const handleGoBack = React.useCallback(
    () => handleSetSelectedSubscriptions(null),
    [handleSetSelectedSubscriptions],
  );

  return (
    <MarketplacePageContent
      classes={{
        children: classNames('bs-consumer__subscription-page__root', {
          'bs-consumer__subscription-page__root--mobile':
            isMobile && !!selectedSubscription?.id,
        }),
      }}
    >
      <ConsumerSubscriptionHeader
        handleGoBack={handleGoBack}
        isMobile={isMobile}
        onBookSessionClick={onBookSessionClick}
        onGetASubscriptionClick={onGetASubscriptionClick}
        selectedSubscription={selectedSubscription}
      />
      {mobileDetailsDisplay(
        isMobile,
        selectedSubscription,
        null,
        <ConsumerSubscriptionsTabs
          activeSubscriptionsCount={activeSubscriptionsState.count}
          expiredSubscriptionsCount={expiredSubscriptionsState.count}
          futureSubscriptionsCount={futureSubscriptionsState.count}
          onChangeSubscriptionTab={handleSetSelectedTab}
          selectedTab={selectedTab}
        />,
      )}
      <ConsumerSubscriptionsListContainer
        areDetailsLoading={areDetailsLoading}
        handleInvoiceDetailsPaginationFetchMore={
          handleInvoiceDetailsPaginationFetchMore
        }
        handlePaginationFetchMore={handlePaginationFetchMore}
        handlePaymentModalOpen={handlePaymentModalOpen}
        handleSetSelectedSubscriptions={handleSetSelectedSubscriptions}
        hasDetailsNextPage={!!detailsNextPage}
        hasNextPage={!!nextPage}
        invoiceRetryNumber={invoiceRetryNumber}
        isLoading={isLoading}
        isMobile={isMobile}
        onSeeTermsClick={handleTermsModalOpen}
        paymentMethodUsed={paymentMethodUsed}
        selectedSubscription={selectedSubscription}
        selectedSubscriptionInvoiceDetails={selectedSubscriptionInvoiceDetails}
        selectedTab={selectedTab}
        subscriptionsList={subscriptionsList}
      />
      {selectedSubscription && (
        <ConsumerSubscriptionTermsPortal
          contractTermsLink={selectedSubscription.contract_terms_pdf_link}
          displayBottomDrawer={isMobile}
          downloadContractTerms={downloadBillingPlanTerms}
          isOpen={isTermsModalOpen}
          onClose={handleTermsModalClose}
          termsContent={selectedSubscription.contract_terms}
        />
      )}
      <ConsumerSubscriptionPaymentPortal
        detachPaymentMethod={detachPaymentMethod}
        displayBottomDrawer={isMobile}
        enabledPaymentGroupMethodIdentifierIds={
          enabledPaymentGroupMethodIdentifierIds
        }
        isOpen={isPaymentModalOpen}
        memberMail={memberMail}
        memberName={memberName}
        onClose={handlePaymentModalClose}
        paymentMethodList={paymentMethodList}
        paymentMethodLoading={paymentMethodLoading}
        paymentMethodUsed={paymentMethodUsed}
        refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
        requestSetupIntentSecret={requestSetupIntentSecret}
        selectedSubscription={selectedSubscription}
        switchPaymentMethod={handleSwitchPaymentMethod}
      />
    </MarketplacePageContent>
  );
};
export default React.memo(ConsumerSubscriptionPageReworked);
