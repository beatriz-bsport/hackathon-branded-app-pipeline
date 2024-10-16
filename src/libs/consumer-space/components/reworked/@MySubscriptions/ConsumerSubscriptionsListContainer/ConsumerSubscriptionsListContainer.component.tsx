import React, { useMemo } from 'react';
import classNames from 'classnames';
import { CellMeasurerCache } from 'react-virtualized';

import { DateTime, Interval } from 'luxon';
import { useTranslation } from 'react-i18next';
import ConsumerSubscriptionCard from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionCard';
import ConsumerSubscriptionDetailsCard from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionDetailsCard';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';
import ConsumerSpaceVirtualizedList from '#src/libs/consumer-space/components/reworked/@Layout/ConsumerSpaceVirtualizedList';

import { formatAsDate } from '#src/utils/datetime';

import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#src/libs/subscription/types';
import type { SubscriptionTab } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
import { SubscriptionTabEnum } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';
import type { PaymentMethod } from '#src/libs/payment/types';

import { isPaused } from '#src/libs/subscription/utils';
import {
  getSubtitleCardDate,
  getSubtitleCardDetailsDate,
  informationBasedOnCouponApplied,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/utils';

import './styles.css';
import { TFunction } from 'i18next';

type Props = {
  areDetailsLoading: boolean;
  handleInvoiceDetailsPaginationFetchMore: () => void;
  handleChangePage: (page: number) => void;
  handlePaymentModalOpen: () => void;
  handleSetSelectedSubscriptions: (subscriptionId: number) => void;
  hasDetailsNextPage: boolean;
  invoiceRetryNumber: number;
  isLoading: boolean;
  isMobile: boolean;
  onSeeTermsClick: () => void;
  paymentMethodUsed: PaymentMethod;
  selectedSubscription: SubscriptionREST;
  selectedSubscriptionInvoiceDetails: Omit<
    SubscriptionsInvoicesDetailsREST,
    'billing_plan_id'
  >[];
  selectedTab: SubscriptionTab;
  subscriptionsList: SubscriptionREST[];
  cache: CellMeasurerCache;
  currentCount: number;
  currentPage: number;
};

type ConsumerSubscriptionsListContainerRowProps = {
  selectedSubscriptionId?: number;
  item: SubscriptionREST;
  onAddPaymentMethodClick: (id: number) => () => void;
  onCardDetailsClick: (id: number) => () => void;
  t: TFunction;
} & Pick<Props, 'isLoading' | 'isMobile' | 'selectedTab'>;

const ConsumerSubscriptionsListContainerRow: React.FC<
  ConsumerSubscriptionsListContainerRowProps
> = ({
  isMobile,
  selectedSubscriptionId,
  isLoading,
  selectedTab,
  item,
  onAddPaymentMethodClick,
  onCardDetailsClick,
  t,
}) => {
  return (
    <ConsumerSubscriptionCard
      key={item.id}
      addPaymentMethodDisabled={isLoading}
      hasFailedPayments={!!item?.failed_payments_invoices?.length}
      hasMissingPaymentMethod={!item?.stripe_payment_method_id}
      isDetailsDisabled={isLoading}
      isLoading={isLoading}
      isPaused={isPaused(item?.pauses)}
      isSelected={!isMobile && item.id === selectedSubscriptionId}
      onAddPaymentMethodClick={onAddPaymentMethodClick(item.id)}
      onDetailsClick={onCardDetailsClick(item.id)}
      price={(item?.price_to_display_cts / 100).toFixed(2)}
      recurrenceBasis={item?.recurrence_basis}
      subscriptionDate={getSubtitleCardDate(selectedTab, item, t)}
      subscriptionInterval={item?.interval}
      subscriptionName={item?.name_without_member_name}
      subscriptionNextPaymentDate={
        selectedTab !== SubscriptionTabEnum.EXPIRED &&
        item?.next_billing_date &&
        formatAsDate(item?.next_billing_date)
      }
    />
  );
};

export const ConsumerSubscriptionsListContainer: React.FC<Props> = ({
  areDetailsLoading,
  handleInvoiceDetailsPaginationFetchMore,
  handleChangePage,
  handlePaymentModalOpen,
  handleSetSelectedSubscriptions,
  hasDetailsNextPage,
  invoiceRetryNumber,
  isLoading,
  isMobile,
  onSeeTermsClick,
  paymentMethodUsed,
  selectedSubscription,
  selectedSubscriptionInvoiceDetails,
  selectedTab,
  subscriptionsList,
  cache,
  currentPage,
  currentCount,
}) => {
  const { t } = useTranslation('consumerSpace');

  const selectedSubscriptionPauseEndDate = useMemo(
    () =>
      formatAsDate(
        selectedSubscription?.pauses?.find((pause) =>
          Interval.fromDateTimes(
            DateTime.fromISO(pause.from_date),
            DateTime.fromISO(pause.date_ended),
          ).contains(DateTime.now()),
        )?.date_ended,
      ),
    [selectedSubscription?.pauses],
  );

  const isCurrentTabContentEmpty =
    !isLoading && subscriptionsList?.length === 0;

  const selectedSubscriptionsFuturePauses = useMemo(
    () =>
      selectedSubscription?.pauses?.filter(
        (pause) => DateTime.now() < DateTime.fromISO(pause.from_date),
      ),
    [selectedSubscription?.pauses],
  );

  const onCardDetailsClick = React.useCallback(
    (id: number) => () => handleSetSelectedSubscriptions(id),
    [handleSetSelectedSubscriptions],
  );

  const onAddPaymentMethodClick = React.useCallback(
    (id: number) => () => {
      handlePaymentModalOpen();
      handleSetSelectedSubscriptions(id);
    },
    [handlePaymentModalOpen, handleSetSelectedSubscriptions],
  );

  return (
    <PageInnerContentLayout
      count={currentCount}
      DetailComponent={
        <ConsumerSubscriptionDetailsCard
          areDetailsLoading={areDetailsLoading}
          autoRenewalDate={formatAsDate(
            selectedSubscription?.last_billing_date,
          )}
          className={classNames({
            'bs-consumer__subscription-details-card__root--hidden': isMobile,
          })}
          description={selectedSubscription?.description}
          failedInvoices={selectedSubscription?.failed_payments_invoices}
          handleInvoiceDetailsPaginationFetchMore={
            handleInvoiceDetailsPaginationFetchMore
          }
          hasAutoRenewal={
            selectedTab !== SubscriptionTabEnum.EXPIRED &&
            selectedSubscription?.auto_renewal
          }
          hasDetailsNextPage={hasDetailsNextPage}
          hasMissingPaymentMethod={
            !selectedSubscription?.stripe_payment_method_id
          }
          invoiceRetryNumber={invoiceRetryNumber}
          isLoading={isLoading}
          isMobile={isMobile}
          isPaused={isPaused(selectedSubscription?.pauses)}
          isPaymentMethodSectionHidden={
            selectedTab === SubscriptionTabEnum.EXPIRED
          }
          joiningFee={selectedSubscription?.flat_fee}
          lastInvoiceDateBeforeRenewal={informationBasedOnCouponApplied(
            selectedSubscription,
            formatAsDate(selectedSubscription?.last_billing_date),
          )}
          onPaymentMethodActionClick={handlePaymentModalOpen}
          onSeeClick={onSeeTermsClick}
          pauseEndDate={selectedSubscriptionPauseEndDate}
          paymentMethodType={paymentMethodUsed?.type}
          price={(selectedSubscription?.price_to_display_cts / 100).toFixed(2)}
          readableIdentifier={paymentMethodUsed?.readable_identifier}
          recurrenceBasis={selectedSubscription?.recurrence_basis}
          recurrentPrice={informationBasedOnCouponApplied(
            selectedSubscription,
            selectedSubscription?.recurrent_price,
          )}
          selected={!!selectedSubscription}
          selectedSubscriptionInvoiceDetails={
            selectedSubscriptionInvoiceDetails
          }
          selectedSubscriptionsFuturePauses={selectedSubscriptionsFuturePauses}
          showPlaceholder={!selectedSubscription && !!subscriptionsList?.length}
          subscriptionInterval={selectedSubscription?.interval}
          subscriptionName={selectedSubscription?.name_without_member_name}
          subscriptionNextPaymentDate={
            selectedTab !== SubscriptionTabEnum.EXPIRED &&
            selectedSubscription?.next_billing_date &&
            formatAsDate(selectedSubscription?.next_billing_date)
          }
          subtitleDate={getSubtitleCardDetailsDate(
            selectedTab,
            selectedSubscription,
            t,
          )}
          termsDate={formatAsDate(
            selectedSubscription?.contract_terms_date_accepted,
          )}
        />
      }
      emptyPlaceholder={
        selectedTab === SubscriptionTabEnum.EXPIRED
          ? t('reworked.mySubscriptions.placeholder.expired')
          : t('reworked.mySubscriptions.placeholder.nonExpired')
      }
      isEmpty={isCurrentTabContentEmpty}
      isLoading={isLoading}
      onPageChange={handleChangePage}
      page={currentPage}
      VirtualizedListComponent={
        <ConsumerSpaceVirtualizedList<SubscriptionREST>
          cache={cache}
          data={subscriptionsList}
          isLoading={isLoading}
          rowCount={subscriptionsList?.length ?? 0}
          rowRenderer={({ item }) => (
            <ConsumerSubscriptionsListContainerRow
              isLoading={isLoading}
              isMobile={isMobile}
              item={item}
              onAddPaymentMethodClick={onAddPaymentMethodClick}
              onCardDetailsClick={onCardDetailsClick}
              selectedTab={selectedTab}
              t={t}
            />
          )}
        />
      }
    />
  );
};

export default React.memo(ConsumerSubscriptionsListContainer);
