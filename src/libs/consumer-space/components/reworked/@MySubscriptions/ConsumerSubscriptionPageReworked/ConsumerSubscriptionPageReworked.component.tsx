import React, { useMemo } from 'react';
import type { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import ConsumerPageHeader from '#src/libs/consumer-space/components/reworked/@Layout/PageHeader';
import ConsumerSubscriptionsListContainer from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionsListContainer';
import PageContentContainer from '#src/libs/consumer-space/components/reworked/@Layout/PageContentContainer';

import {
  ConsumerSubscriptionTermsPortal,
  ConsumerSubscriptionPaymentPortal,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionPortals';
import {
  Calendar,
  ChevronRight,
  ChevronLeft,
} from '#src/components/untitledui';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
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
import { SubscriptionTabEnum } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';

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
  const handleSetActiveTab = React.useCallback(
    () => handleSetSelectedTab?.(SubscriptionTabEnum.ACTIVE),
    [handleSetSelectedTab],
  );

  const handleSetFutureTab = React.useCallback(
    () => handleSetSelectedTab?.(SubscriptionTabEnum.FUTURE),
    [handleSetSelectedTab],
  );

  const handleSetExpiredTab = React.useCallback(
    () => handleSetSelectedTab?.(SubscriptionTabEnum.EXPIRED),
    [handleSetSelectedTab],
  );

  const tabs = useMemo(
    () => [
      {
        hidden: false,
        hasBadge: activeSubscriptionsState.count > 0,
        type: SubscriptionTabEnum.ACTIVE,
        label: t('reworked.mySubscriptions.tab.active'),
        onClick: handleSetActiveTab,
        value: activeSubscriptionsState.count,
      },
      {
        hidden: false,
        hasBadge: futureSubscriptionsState.count > 0,
        type: SubscriptionTabEnum.FUTURE,
        label: t('reworked.mySubscriptions.tab.future'),
        onClick: handleSetFutureTab,
        value: futureSubscriptionsState.count,
      },
      {
        hidden: false,
        type: SubscriptionTabEnum.EXPIRED,
        label: t('reworked.mySubscriptions.tab.expired'),
        onClick: handleSetExpiredTab,
        value: expiredSubscriptionsState.count,
      },
    ],
    [
      expiredSubscriptionsState.count,
      futureSubscriptionsState.count,
      activeSubscriptionsState.count,
      handleSetActiveTab,
      handleSetFutureTab,
      handleSetExpiredTab,
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
      {isMobile && !!selectedSubscription?.id ? (
        <Button
          className="bs-consumer__subscription-header__button--mobile"
          color="grey"
          leftIcon={<ChevronLeft />}
          onClick={handleGoBack}
          variant="text"
        >
          {t('reworked.mySubscriptions.headerButtonsLabel.backToSubscriptions')}
        </Button>
      ) : (
        <ConsumerPageHeader
          isMobile={isMobile}
          TabsProps={{
            tabs,
            selectedTab,
          }}
          TitleProps={{
            buttons: buttonsData,
            title: t('reworked.mySubscriptions.title'),
          }}
        />
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
    </PageContentContainer>
  );
};

export default React.memo(ConsumerSubscriptionPageReworked);
