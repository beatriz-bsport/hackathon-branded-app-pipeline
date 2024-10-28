import React, { useCallback, useMemo } from 'react';
import type { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { CellMeasurerCache } from 'react-virtualized';

import ConsumerPageHeader from '#src/libs/consumer-space/components/reworked/@Layout/PageHeader';
import ConsumerSubscriptionsListContainer from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionsListContainer';
import PageContentContainer from '#src/libs/consumer-space/components/reworked/@Layout/PageContentContainer';
import ConsumerSubscriptionModals from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionModals';

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
import type { SubscriptionFilter } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

import useConsumerSubscriptionsDataManager from '#src/libs/consumer-space/components/reworked/@MySubscriptions/hooks/useConsumerSubscriptionsDataManager';
import { SubscriptionFilterEnum } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';

import type { OptionCallback, PaginatedResponse } from '#src/state/types';

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
    page?: number,
    page_size?: number,
    options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
  ) => void;
  fetchExpiredSubscriptionsList: (
    page?: number,
    page_size?: number,
    options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
  ) => void;
  fetchFutureSubscriptionsList: (
    page?: number,
    page_size?: number,
    options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
  ) => void;
  onBookSessionClick: () => void;
  onGetASubscriptionClick: () => void;
  fetchConsumerSubscriptionInvoicesDetails: (
    params: { id: number; page_size?: number },
    options?: OptionCallback<{
      billing_plan_id: number;
      data: PaginatedResponse<SubscriptionsInvoicesDetailsREST>;
    }>,
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
    status: SubscriptionFilter,
    options?: OptionCallback,
  ) => void;
  memberMail: string;
  memberName: string;
};

const cache = new CellMeasurerCache({
  defaultHeight: 300,
  fixedWidth: true,
});

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
  const resetVirtualizedListCache = useCallback(() => cache.clearAll(), []);

  const {
    areDetailsLoading,
    detailsNextPage,
    handleInvoiceDetailsPaginationFetchMore,
    handleChangePage,
    handleSetSelectedSubscriptions,
    handleSetSelectedFilter,
    isLoading,
    isMobile,
    selectedSubscription,
    selectedSubscriptionInvoiceDetails,
    selectedFilter,
    subscriptionsList,
    isPaymentModalOpen,
    isTermsModalOpen,
    isSubscriptionDetailsDrawerOpen,
    currentCount,
    currentPage,
    handleTermsModalOpen,
    handleTermsModalClose,
    handlePaymentModalOpen,
    handlePaymentModalClose,
    handleCloseSubscriptionDetailsDrawer,
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
    resetVirtualizedListCache,
  });

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
        selectedFilter,
        options,
      );
    },
    [selectedFilter, switchPaymentMethod],
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
  const handleSetActiveFilter = React.useCallback(
    () => handleSetSelectedFilter?.(SubscriptionFilterEnum.ACTIVE),
    [handleSetSelectedFilter],
  );

  const handleSetFutureFilter = React.useCallback(
    () => handleSetSelectedFilter?.(SubscriptionFilterEnum.FUTURE),
    [handleSetSelectedFilter],
  );

  const handleSetExpiredFilter = React.useCallback(
    () => handleSetSelectedFilter?.(SubscriptionFilterEnum.EXPIRED),
    [handleSetSelectedFilter],
  );

  const filters = useMemo(
    () => [
      {
        hidden: false,
        hasBadge: activeSubscriptionsState.count > 0,
        type: SubscriptionFilterEnum.ACTIVE,
        label: t('reworked.mySubscriptions.tab.active'),
        onClick: handleSetActiveFilter,
        value: activeSubscriptionsState.count,
      },
      {
        hidden: false,
        hasBadge: futureSubscriptionsState.count > 0,
        type: SubscriptionFilterEnum.FUTURE,
        label: t('reworked.mySubscriptions.tab.future'),
        onClick: handleSetFutureFilter,
        value: futureSubscriptionsState.count,
      },
      {
        hidden: false,
        hasBadge: false,
        type: SubscriptionFilterEnum.EXPIRED,
        label: t('reworked.mySubscriptions.tab.expired'),
        onClick: handleSetExpiredFilter,
        value: expiredSubscriptionsState.count,
      },
    ],
    [
      expiredSubscriptionsState.count,
      futureSubscriptionsState.count,
      activeSubscriptionsState.count,
      handleSetActiveFilter,
      handleSetFutureFilter,
      handleSetExpiredFilter,
      t,
    ],
  );
  return (
    <PageContentContainer
      contentClassName={classNames('bs-consumer__subscription-page__root', {
        'bs-consumer__subscription-page__root--mobile':
          isMobile && !!selectedSubscription?.id,
      })}
    >
      <ConsumerSubscriptionModals
        areDetailsLoading={areDetailsLoading}
        handleCloseSubscriptionDetailsDrawer={
          handleCloseSubscriptionDetailsDrawer
        }
        handleInvoiceDetailsPaginationFetchMore={
          handleInvoiceDetailsPaginationFetchMore
        }
        handlePaymentModalOpen={handlePaymentModalOpen}
        hasDetailsNextPage={!!detailsNextPage}
        invoiceRetryNumber={invoiceRetryNumber}
        isLoading={isLoading}
        isMobile={isMobile}
        isSubscriptionDetailsDrawerOpen={isSubscriptionDetailsDrawerOpen}
        onSeeTermsClick={handleTermsModalOpen}
        paymentMethodUsed={paymentMethodUsed}
        selectedFilter={selectedFilter}
        selectedSubscription={selectedSubscription}
        selectedSubscriptionInvoiceDetails={selectedSubscriptionInvoiceDetails}
      />

      <ConsumerPageHeader
        FilterProps={{
          filters,
          selectedFilter,
        }}
        isMobile={isMobile}
        TitleProps={{
          buttons: buttonsData,
          title: t('reworked.mySubscriptions.title'),
        }}
      />

      <ConsumerSubscriptionsListContainer
        areDetailsLoading={areDetailsLoading}
        cache={cache}
        currentCount={currentCount}
        currentPage={currentPage}
        handleChangePage={handleChangePage}
        handleInvoiceDetailsPaginationFetchMore={
          handleInvoiceDetailsPaginationFetchMore
        }
        handlePaymentModalOpen={handlePaymentModalOpen}
        handleSetSelectedSubscriptions={handleSetSelectedSubscriptions}
        hasDetailsNextPage={!!detailsNextPage}
        invoiceRetryNumber={invoiceRetryNumber}
        isLoading={isLoading}
        isMobile={isMobile}
        onSeeTermsClick={handleTermsModalOpen}
        paymentMethodUsed={paymentMethodUsed}
        selectedFilter={selectedFilter}
        selectedSubscription={selectedSubscription}
        selectedSubscriptionInvoiceDetails={selectedSubscriptionInvoiceDetails}
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
    </PageContentContainer>
  );
};

export default React.memo(ConsumerSubscriptionPageReworked);
