import React, { useMemo } from 'react';

import { DateTime, Interval, DateTime, Interval } from 'luxon';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import ConsumerSubscriptionCard from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionCard';
import ConsumerSubscriptionDetailsCard from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionDetailsCard';
import Typography from '#Fabrique/Typography';

import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import { formatAsDate } from '#utils/datetime';

import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#libs/subscription/types';
import type { SubscriptionTab } from '#libs/consumer-space/components/reworked/@MySubscriptions/types';
import {
  MY_SUBSCRIPTIONS_LIST_CONTAINER_HEIGHT_MOBILE,
  MY_SUBSCRIPTIONS_LIST_CONTAINER_HEIGHT_DESKTOP,
  SubscriptionTabEnum,
} from '#libs/consumer-space/components/reworked/@MySubscriptions/constants';
import type { PaymentMethod } from '#libs/payment/types';

import { isPaused } from '#libs/subscription/utils';
import {
  getSubtitleCardDate,
  getSubtitleCardDetailsDate,
  informationBasedOnCouponApplied,
  mobileDetailsDisplay,
} from '#libs/consumer-space/components/reworked/@MySubscriptions/utils';

import './styles.css';

type Props = {
  areDetailsLoading: boolean;
  handleInvoiceDetailsPaginationFetchMore: () => void;
  handlePaginationFetchMore: () => void;
  handlePaymentModalOpen: () => void;
  handleSetSelectedSubscriptions: (subscriptionId: number) => void;
  hasDetailsNextPage: boolean;
  hasNextPage: boolean;
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
};

export const ConsumerSubscriptionsListContainer: React.FC<Props> = ({
  areDetailsLoading,
  handleInvoiceDetailsPaginationFetchMore,
  handlePaginationFetchMore,
  handlePaymentModalOpen,
  handleSetSelectedSubscriptions,
  hasDetailsNextPage,
  hasNextPage,
  invoiceRetryNumber,
  isLoading,
  isMobile,
  onSeeTermsClick,
  paymentMethodUsed,
  selectedSubscription,
  selectedSubscriptionInvoiceDetails,
  selectedTab,
  subscriptionsList,
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

  const showEmptyPlaceholder = !isLoading && subscriptionsList?.length === 0;

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
    <div
      className={classNames('bs-consumer-page-root__subscription', {
        'bs-consumer-page-root__subscription--mobile':
          isMobile && !!selectedSubscription?.id,
      })}
    >
      {showEmptyPlaceholder && (
        <Typography align="center" variant="body-lg">
          {selectedTab === SubscriptionTabEnum.EXPIRED
            ? t('reworked.mySubscriptions.placeholder.expired')
            : t('reworked.mySubscriptions.placeholder.nonExpired')}
        </Typography>
      )}

      {mobileDetailsDisplay(
        isMobile,
        selectedSubscription,
        null,
        <ul
          className={classNames('bs-consumer-page-root__subscriptions_list', {
            'bs-consumer-page-root__subscriptions_list--hidden':
              showEmptyPlaceholder,
          })}
        >
          <GenericInfiniteScrollEnhancedCssOnly<SubscriptionREST>
            fetchMoreData={handlePaginationFetchMore}
            hasMore={hasNextPage}
            height={
              isMobile
                ? MY_SUBSCRIPTIONS_LIST_CONTAINER_HEIGHT_MOBILE
                : MY_SUBSCRIPTIONS_LIST_CONTAINER_HEIGHT_DESKTOP
            }
            items={subscriptionsList}
            // @ts-expect-error
            loader={<ConsumerSubscriptionCard isLoading />}
            renderItem={({ item }) => (
              <ConsumerSubscriptionCard
                key={item.id}
                addPaymentMethodDisabled={isLoading}
                hasFailedPayments={!!item?.failed_payments_invoices?.length}
                hasMissingPaymentMethod={!item?.stripe_payment_method_id}
                isDetailsDisabled={isLoading}
                isLoading={isLoading}
                isPaused={isPaused(item?.pauses)}
                isSelected={item.id === selectedSubscription?.id}
                onAddPaymentMethodClick={onAddPaymentMethodClick(item.id)}
                onDetailsClick={onCardDetailsClick(item.id)}
                price={(item?.price_to_display_cts / 100).toFixed(2)}
                recurrence={item?.recurrence_basis}
                subscriptionDate={getSubtitleCardDate(selectedTab, item, t)}
                subscriptionInterval={item?.interval}
                subscriptionName={item?.name_without_member_name}
                subscriptionNextPaymentDate={
                  selectedTab !== SubscriptionTabEnum.EXPIRED &&
                  item?.next_billing_date &&
                  formatAsDate(item?.next_billing_date)
                }
              />
            )}
          />
        </ul>,
      )}
      <ConsumerSubscriptionDetailsCard
        areDetailsLoading={areDetailsLoading}
        autoRenewalDate={formatAsDate(selectedSubscription?.last_billing_date)}
        className={
          showEmptyPlaceholder &&
          'bs-consumer__subscription-details-card__root--hidden'
        }
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
        recurrence={selectedSubscription?.recurrence_basis}
        recurrentPrice={informationBasedOnCouponApplied(
          selectedSubscription,
          selectedSubscription?.recurrent_price,
        )}
        selected={!!selectedSubscription}
        selectedSubscriptionInvoiceDetails={selectedSubscriptionInvoiceDetails}
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
    </div>
  );
};

export default React.memo(ConsumerSubscriptionsListContainer);
