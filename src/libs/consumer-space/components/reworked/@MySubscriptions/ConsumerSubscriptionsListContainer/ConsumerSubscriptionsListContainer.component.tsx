import React, { useMemo } from 'react';

import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import ConsumerSubscriptionCard from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionCard';
import ConsumerSubscriptionDetailsCard from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionDetailsCard';
import Typography from '#Fabrique/Typography';

import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import { formatAsDatetimeAdapted } from '../../../../../../utils/datetime';

import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from '#libs/subscription/types';
import type { SubscriptionTab } from '#libs/consumer-space/components/reworked/@MySubscriptions/types';
import {
  MY_BOOKINGS_LIST_CONTAINER_HEIGHT,
  MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT,
} from '#libs/consumer-space/components/reworked/@MyBookings/constants';
import type { PaymentMethod } from '#libs/payment/types';

import { SubscriptionTabEnum } from '#libs/consumer-space/components/reworked/@MySubscriptions/constants';

import { isPaused } from '#libs/subscription/utils';
import {
  getSubtitleCardDate,
  getSubtitleCardDetailsDate,
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
      formatAsDatetimeAdapted(
        selectedSubscription?.pauses?.find((pause) =>
          moment().isBetween(
            pause.from_date,
            pause.date_ended,
            undefined,
            '[]',
          ),
        )?.date_ended,
        'L',
      ),
    [selectedSubscription?.pauses],
  );

  const showEmptyPlaceholder = !isLoading && subscriptionsList?.length === 0;

  const selectedSubscriptionsFuturePauses = useMemo(
    () =>
      selectedSubscription?.pauses?.filter((pause) =>
        moment().isBefore(pause.from_date),
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
    <div className="bs-consumer-page-root__subscription">
      {showEmptyPlaceholder && (
        <Typography variant="body-lg">{selectedTab}</Typography>
      )}

      <ul className="bs-consumer-page-root__subscriptions_list">
        <GenericInfiniteScrollEnhancedCssOnly<SubscriptionREST>
          fetchMoreData={handlePaginationFetchMore}
          hasMore={hasNextPage}
          // TODO: height needs to be set to trigger fetchMoreData..
          // @ts-expect-error
          height={
            isMobile
              ? MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT
              : MY_BOOKINGS_LIST_CONTAINER_HEIGHT
          }
          items={subscriptionsList}
          // TODO: see if i need to add a ConsumerSubscriptionCardListItem with integration
          // @ts-expect-error
          loader={<ConsumerSubscriptionCard isLoading />}
          renderItem={({ item }) => (
            <ConsumerSubscriptionCard
              key={item.id}
              // TODO
              addPaymentMethodDisabled={false}
              hasFailedPayments={!!item?.failed_payments_invoices?.length}
              hasMissingPaymentMethod={!item?.stripe_payment_method_id}
              // TODO
              isDetailsDisabled={false}
              isLoading={isLoading}
              isPaused={isPaused(item?.pauses)}
              isSelected={item.id === selectedSubscription?.id}
              // TODO
              onAddPaymentMethodClick={onAddPaymentMethodClick(item.id)}
              onDetailsClick={onCardDetailsClick(item.id)}
              price={(parseFloat(item?.price_to_display_cts) / 100).toFixed(2)}
              recurrence={item?.recurrence_basis}
              subscriptionDate={getSubtitleCardDate(selectedTab, item, t)}
              subscriptionInterval={item?.interval}
              subscriptionName={item?.name_without_member_name}
              subscriptionNextPaymentDate={
                selectedTab !== SubscriptionTabEnum.EXPIRED &&
                item?.next_billing_date &&
                formatAsDatetimeAdapted(item?.next_billing_date, 'L')
              }
            />
          )}
        />
      </ul>
      <ConsumerSubscriptionDetailsCard
        areDetailsLoading={areDetailsLoading}
        autoRenewalDate={formatAsDatetimeAdapted(
          selectedSubscription?.last_billing_date,
          'L',
        )}
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
        isPaused={isPaused(selectedSubscription?.pauses)}
        isPaymentMethodSectionHidden={
          selectedTab === SubscriptionTabEnum.EXPIRED
        }
        joiningFee={selectedSubscription?.flat_fee}
        onPaymentMethodActionClick={handlePaymentModalOpen}
        onSeeClick={onSeeTermsClick}
        pauseEndDate={selectedSubscriptionPauseEndDate}
        paymentMethodType={paymentMethodUsed?.type}
        price={(
          parseFloat(selectedSubscription?.price_to_display_cts) / 100
        ).toFixed(2)}
        readableIdentifier={paymentMethodUsed?.readable_identifier}
        recurrence={selectedSubscription?.recurrence_basis}
        selectedSubscriptionInvoiceDetails={selectedSubscriptionInvoiceDetails}
        selectedSubscriptionsFuturePauses={selectedSubscriptionsFuturePauses}
        showPlaceholder={!selectedSubscription}
        subscriptionInterval={selectedSubscription?.interval}
        subscriptionName={selectedSubscription?.name_without_member_name}
        subscriptionNextPaymentDate={
          selectedTab !== SubscriptionTabEnum.EXPIRED &&
          selectedSubscription?.next_billing_date &&
          formatAsDatetimeAdapted(selectedSubscription?.next_billing_date, 'L')
        }
        subtitleDate={getSubtitleCardDetailsDate(
          selectedTab,
          selectedSubscription,
          t,
        )}
        termsDate={formatAsDatetimeAdapted(
          selectedSubscription?.contract_terms_date_accepted,
          'L',
        )}
      />
    </div>
  );
};

export default React.memo(ConsumerSubscriptionsListContainer);
