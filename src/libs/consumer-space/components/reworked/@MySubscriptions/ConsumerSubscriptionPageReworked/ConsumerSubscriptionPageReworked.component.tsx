import React, { useMemo } from 'react';
import type { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import ConsumerSubscriptionHeader from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionHeader';
import ConsumerSubscriptionsTabs from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionTabs';
import ConsumerSubscriptionsListContainer from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionsListContainer';
import {
  ConsumerSubscriptionTermsPortal,
  ConsumerSubscriptionPaymentPortal,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionPortals';
import { Calendar, ChevronRight } from '#src/components/untitledui';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

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
import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

import useConsumerSubscriptionsModalManager from '#src/libs/consumer-space/components/reworked/@MySubscriptions/hooks/useConsumerSubscriptionsModalManager';
import useConsumerSubscriptionsDataManager from '#src/libs/consumer-space/components/reworked/@MySubscriptions/hooks/useConsumerSubscriptionsDataManager';
import { mobileDetailsDisplay } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/utils';
import type { OptionCallback } from '../../../../../../state/types';

import './styles.css';
import {
  ButtonColor,
  ButtonVariant,
} from '#src/components/css-only/Fabrique/ButtonV2/types';

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

  const { t } = useTranslation('consumerSpace');

  const isWidget = WidgetUtils.isWidget();

  const buttonsData: HeaderButton[] = useMemo(
    () =>
      isWidget
        ? []
        : [
            {
              label: t(
                'reworked.mySubscriptions.headerButtonsLabel.bookASession',
              ),
              onClick: onBookSessionClick,
              leftIcon: <Calendar stroke="currentColor" />,
              variant: 'outlined' as ButtonVariant,
              color: 'grey' as ButtonColor,
            },

            {
              label: t(
                'reworked.mySubscriptions.headerButtonsLabel.getSubscription',
              ),
              onClick: onGetASubscriptionClick,
              rightIcon: <ChevronRight stroke="currentColor" />,
              variant: 'contained' as ButtonVariant,
              color: 'primary' as ButtonColor,
            },
          ],
    [isWidget, onGetASubscriptionClick, onBookSessionClick, t],
  );

  return (
    <div
      className={classNames('bs-consumer__subscription-page__root', {
        'bs-consumer__subscription-page__root--mobile':
          isMobile && !!selectedSubscription?.id,
      })}
    >
      <ConsumerSubscriptionHeader
        buttonsData={buttonsData}
        handleGoBack={handleGoBack}
        isMobile={isMobile}
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
    </div>
  );
};
export default React.memo(ConsumerSubscriptionPageReworked);
