import React, { useMemo } from 'react';
import clsx from 'clsx';

import { DateTime, Interval } from 'luxon';
import { useTranslation } from 'react-i18next';
import ConsumerSubscriptionCard from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionCard';
import ConsumerSubscriptionDetailsCard from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionDetailsCard';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';
import ConsumerSpaceList from '#src/libs/consumer-space/components/reworked/@Layout/ConsumerSpaceList';

import { formatAsDate } from '#src/utils/datetime';

import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#src/libs/subscription/types';
import type { SubscriptionFilter } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
import {
  SubscriptionFilterEnum,
  SubscriptionStatusEnum,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';
import type { PaymentMethod } from '#src/libs/payment/types';

import {
  getCommitmentPeriodDisplay,
  isPaused,
} from '#src/libs/subscription/utils';
import {
  getSubtitleCardDate,
  getSubtitleCardDetailsDate,
  informationBasedOnCouponApplied,
} from '#src/libs/consumer-space/components/reworked/@MySubscriptions/utils';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

import './styles.css';
import { TFunction } from 'i18next';

type Props = {
  areDetailsLoading: boolean;
  displayStopSubscriptionFromMemberSide?: boolean;
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
  selectedFilter: SubscriptionFilter;
  subscriptionsList: SubscriptionREST[];
  currentCount: number;
  currentPage: number;
  onUnSubscribeClick: () => void;
};

type ConsumerSubscriptionsListContainerRowProps = {
  displayStopSubscriptionFromMemberSide?: boolean;
  selectedSubscriptionId?: number;
  item: SubscriptionREST;
  onAddPaymentMethodClick: (id: number) => () => void;
  onCardDetailsClick: (id: number) => () => void;
  t: TFunction;
} & Pick<Props, 'isLoading' | 'isMobile' | 'selectedFilter'>;

const ConsumerSubscriptionsListContainerRow: React.FC<
  ConsumerSubscriptionsListContainerRowProps
> = ({
  displayStopSubscriptionFromMemberSide,
  isMobile,
  selectedSubscriptionId,
  isLoading,
  selectedFilter,
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
      hasUnsubscribed={
        item?.status === SubscriptionStatusEnum.STOPPED &&
        !!displayStopSubscriptionFromMemberSide
      }
      isDetailsDisabled={isLoading}
      isLoading={isLoading}
      isPaused={isPaused(item?.pauses)}
      isSelected={!isMobile && item.id === selectedSubscriptionId}
      onAddPaymentMethodClick={onAddPaymentMethodClick(item.id)}
      onDetailsClick={onCardDetailsClick(item.id)}
      price={(item?.price_to_display_cts / 100).toFixed(2)}
      recurrenceBasis={item?.recurrence_basis}
      subscriptionDate={getSubtitleCardDate(selectedFilter, item, t)}
      subscriptionInterval={item?.interval}
      subscriptionName={item?.name_without_member_name}
      subscriptionNextPaymentDate={
        selectedFilter !== SubscriptionFilterEnum.EXPIRED &&
        item?.next_billing_date &&
        formatAsDate(item?.next_billing_date)
      }
    />
  );
};

export const ConsumerSubscriptionsListContainer: React.FC<Props> = ({
  areDetailsLoading,
  displayStopSubscriptionFromMemberSide,
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
  selectedFilter,
  subscriptionsList,
  currentPage,
  currentCount,
  onUnSubscribeClick,
}) => {
  const { t } = useTranslation('consumerSpace');

  const isStopSubscriptionFromMemberSideFeatureEnabled = useSafeFlag(
    FeatureFlags.STOP_SUBSCRIPTION_FROM_MEMBER_SIDE,
  );

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

  const commitmentPeriodDisplay = useMemo(
    () =>
      getCommitmentPeriodDisplay(
        selectedSubscription,
        !!displayStopSubscriptionFromMemberSide &&
          isStopSubscriptionFromMemberSideFeatureEnabled,
      ),
    [
      displayStopSubscriptionFromMemberSide,
      selectedSubscription,
      isStopSubscriptionFromMemberSideFeatureEnabled,
    ],
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
          className={clsx({
            'bs-consumer__subscription-details-card__root--hidden': isMobile,
          })}
          commitmentPeriod={selectedSubscription?.commitment_period_unit}
          commitmentValue={selectedSubscription?.commitment_period_value}
          description={selectedSubscription?.description}
          displayStopSubscriptionFromMemberSide={
            displayStopSubscriptionFromMemberSide
          }
          expirationDate={selectedSubscription?.expiration_date}
          failedInvoices={selectedSubscription?.failed_payments_invoices}
          handleInvoiceDetailsPaginationFetchMore={
            handleInvoiceDetailsPaginationFetchMore
          }
          hasAutoRenewal={
            selectedFilter !== SubscriptionFilterEnum.EXPIRED &&
            selectedSubscription?.auto_renewal
          }
          hasDetailsNextPage={hasDetailsNextPage}
          hasMissingPaymentMethod={
            !selectedSubscription?.stripe_payment_method_id
          }
          invoiceRetryNumber={invoiceRetryNumber}
          isCommitmentPeriodSectionHidden={
            selectedFilter == SubscriptionFilterEnum.EXPIRED ||
            !!commitmentPeriodDisplay?.isCommitmentPeriodSectionHidden
          }
          isLoading={isLoading}
          isMemberCancellationAllowed={
            !!commitmentPeriodDisplay?.isMemberCancellationAllowed
          }
          isMobile={isMobile}
          isPaused={isPaused(selectedSubscription?.pauses)}
          isPaymentMethodSectionHidden={
            selectedFilter === SubscriptionFilterEnum.EXPIRED
          }
          isSubscriptionStopped={
            selectedSubscription?.status === SubscriptionStatusEnum.STOPPED
          }
          joiningFee={selectedSubscription?.flat_fee}
          lastInvoiceDateBeforeRenewal={informationBasedOnCouponApplied(
            selectedSubscription,
            formatAsDate(selectedSubscription?.last_billing_date),
          )}
          onPaymentMethodActionClick={handlePaymentModalOpen}
          onSeeClick={onSeeTermsClick}
          onUnSubscribeClick={onUnSubscribeClick}
          pauseEndDate={selectedSubscriptionPauseEndDate}
          paymentMethodType={paymentMethodUsed?.type}
          price={(selectedSubscription?.price_to_display_cts / 100).toFixed(2)}
          readableIdentifier={paymentMethodUsed?.readable_identifier}
          recurrenceBasis={selectedSubscription?.recurrence_basis}
          recurrentPrice={informationBasedOnCouponApplied(
            selectedSubscription,
            selectedSubscription?.recurrent_price,
          )}
          selectedSubscriptionInvoiceDetails={
            selectedSubscriptionInvoiceDetails
          }
          selectedSubscriptionsFuturePauses={selectedSubscriptionsFuturePauses}
          shouldDisplayCommitmentPeriodAlert={
            !!commitmentPeriodDisplay?.shouldDisplayCommitmentPeriodAlert
          }
          shouldDisplayCommitmentPeriodSubtitle={
            !!commitmentPeriodDisplay?.shouldDisplayCommitmentPeriodSubtitle
          }
          shouldDisplayUnsubscribeCaptionText={
            selectedFilter !== SubscriptionFilterEnum.EXPIRED &&
            !!displayStopSubscriptionFromMemberSide
          }
          showPlaceholder={!selectedSubscription && !!subscriptionsList?.length}
          subscriptionInterval={selectedSubscription?.interval}
          subscriptionName={selectedSubscription?.name_without_member_name}
          subscriptionNextPaymentDate={
            selectedFilter !== SubscriptionFilterEnum.EXPIRED &&
            selectedSubscription?.next_billing_date &&
            formatAsDate(selectedSubscription?.next_billing_date)
          }
          subtitleDate={getSubtitleCardDetailsDate(
            selectedFilter,
            selectedSubscription,
            t,
          )}
          termsDate={formatAsDate(
            selectedSubscription?.contract_terms_date_accepted,
          )}
        />
      }
      emptyPlaceholder={
        selectedFilter === SubscriptionFilterEnum.EXPIRED
          ? t('reworked.mySubscriptions.placeholder.expired')
          : t('reworked.mySubscriptions.placeholder.nonExpired')
      }
      isEmpty={isCurrentTabContentEmpty}
      isLoading={isLoading}
      onPageChange={handleChangePage}
      page={currentPage}
      VirtualizedListComponent={
        <ConsumerSpaceList<SubscriptionREST>
          data={subscriptionsList}
          isLoading={isLoading}
          rowRenderer={({ item }) => (
            <ConsumerSubscriptionsListContainerRow
              displayStopSubscriptionFromMemberSide={
                displayStopSubscriptionFromMemberSide
              }
              isLoading={isLoading}
              isMobile={isMobile}
              item={item}
              onAddPaymentMethodClick={onAddPaymentMethodClick}
              onCardDetailsClick={onCardDetailsClick}
              selectedFilter={selectedFilter}
              t={t}
            />
          )}
        />
      }
    />
  );
};

export default React.memo(ConsumerSubscriptionsListContainer);
