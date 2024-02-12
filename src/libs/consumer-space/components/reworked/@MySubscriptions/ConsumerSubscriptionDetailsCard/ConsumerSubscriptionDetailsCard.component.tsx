import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerCardPlaceholder from '#libs/consumer-space/components/reworked/common/ConsumerCardPlaceholder';
import ConsumerDetailsCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton';

import {
  ConsumerSubscriptionDetailsCardBillingHistory,
  ConsumerSubscriptionDetailsCardDescription,
  ConsumerSubscriptionDetailsCardFailedPayments,
  ConsumerSubscriptionDetailsCardHeader,
  ConsumerSubscriptionDetailsCardPaymentMethod,
  ConsumerSubscriptionDetailsCardTerms,
} from './sections';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';

import type {
  SubscriptionInterval,
  SubscriptionPause,
  SubscriptionsFailedInvoicesREST,
  SubscriptionsInvoicesDetailsREST,
} from '#libs/subscription/types';
import type { MarketplacePaymentMethodsType } from '#libs/marketplace/types';

import './styles.css';

type Props = {
  /** Indicates if new invoices are being fetched */
  areDetailsLoading: boolean;
  /** Auto renewal date */
  autoRenewalDate: string;
  /** Description of subscription */
  description: string;
  /** List of failed invoices */
  failedInvoices: SubscriptionsFailedInvoicesREST[];
  /** Handler that fetches invoices of a subscription */
  handleInvoiceDetailsPaginationFetchMore: () => void;
  /** If subscription has auto renewal */
  hasAutoRenewal: boolean;
  /** If there are more invoices available */
  hasDetailsNextPage: boolean;
  /** If subscription has missing payment method */
  hasMissingPaymentMethod: boolean;
  /** Number of retry after failed payment based on InvoiceConfiguration */
  invoiceRetryNumber: number;
  /** Loading indicator */
  isLoading: boolean;
  /** Subscription is currently paused */
  isPaused: boolean;
  /** Should payment method section be hidden */
  isPaymentMethodSectionHidden: boolean;
  /** Fees when joining the subscription */
  joiningFee: string;
  /** If payment method section is displayed,add/change a payment method */
  onPaymentMethodActionClick: () => void;
  /** Action when clicking on See Terms */
  onSeeClick: () => void;
  /** Pause end date */
  pauseEndDate: string;
  /** Payment method related to a subscription */
  paymentMethodType: MarketplacePaymentMethodsType;
  /** Price to display and can depend on coupons applied */
  price: string;
  /** Readable identifier of the payment method */
  readableIdentifier: string;
  /** Number of payment per subscription interval */
  recurrence: number;
  /** List of invoices related to a subscription */
  selectedSubscriptionInvoiceDetails: Omit<
    SubscriptionsInvoicesDetailsREST,
    'billing_plan_id'
  >[];
  /** List of future pauses related to a subscription */
  selectedSubscriptionsFuturePauses: SubscriptionPause[];
  /** Condition to display empty/placeholder state */
  showPlaceholder: boolean;
  /** Interval of the subscription */
  subscriptionInterval: SubscriptionInterval;
  /** Name of the subscription */
  subscriptionName: string;
  /** Next payment date of the subscription */
  subscriptionNextPaymentDate: string;
  /** Date of the subscription displayed as the main subtitle */
  subtitleDate: string;
  /** Date when terms have been accepted for the subscription */
  termsDate: string;
};

const ConsumerSubscriptionDetailsCard: React.FC<Props> = ({
  areDetailsLoading,
  autoRenewalDate,
  description,
  failedInvoices,
  handleInvoiceDetailsPaginationFetchMore,
  hasAutoRenewal,
  hasDetailsNextPage,
  hasMissingPaymentMethod,
  invoiceRetryNumber,
  isLoading,
  isPaused,
  isPaymentMethodSectionHidden,
  joiningFee,
  onPaymentMethodActionClick,
  onSeeClick,
  pauseEndDate,
  paymentMethodType,
  price,
  readableIdentifier,
  recurrence,
  selectedSubscriptionInvoiceDetails,
  selectedSubscriptionsFuturePauses,
  showPlaceholder,
  subscriptionInterval,
  subscriptionName,
  subscriptionNextPaymentDate,
  subtitleDate,
  termsDate,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (isLoading) {
    return <ConsumerDetailsCardSkeleton />;
  }

  if (showPlaceholder) {
    return (
      <ConsumerCardPlaceholder
        message={t('consumerSpace:reworked.placeholderCard.mySubscriptions')}
      />
    );
  }

  return (
    <Card className="bs-consumer__subscription-details-card__root">
      <ConsumerSubscriptionDetailsCardHeader
        autoRenewalDate={autoRenewalDate}
        hasAutoRenewal={hasAutoRenewal}
        isPaused={isPaused}
        joiningFee={joiningFee}
        pauseEndDate={pauseEndDate}
        price={price}
        recurrence={recurrence}
        selectedSubscriptionsFuturePauses={selectedSubscriptionsFuturePauses}
        subscriptionInterval={subscriptionInterval}
        subscriptionName={subscriptionName}
        subscriptionNextPaymentDate={subscriptionNextPaymentDate}
        subtitleDate={subtitleDate}
      />
      <ConsumerSubscriptionDetailsCardFailedPayments
        failedInvoices={failedInvoices}
        invoiceRetryNumber={invoiceRetryNumber}
      />
      <ConsumerSubscriptionDetailsCardDescription description={description} />
      <ConsumerSubscriptionDetailsCardPaymentMethod
        hasMissingPaymentMethod={hasMissingPaymentMethod}
        isPaymentMethodSectionHidden={isPaymentMethodSectionHidden}
        onPaymentMethodActionClick={onPaymentMethodActionClick}
        paymentMethodType={paymentMethodType}
        readableIdentifier={readableIdentifier}
      />
      <ConsumerSubscriptionDetailsCardTerms
        onSeeClick={onSeeClick}
        termsDate={termsDate}
      />
      <ConsumerSubscriptionDetailsCardBillingHistory
        areDetailsLoading={areDetailsLoading}
        handleInvoiceDetailsPaginationFetchMore={
          handleInvoiceDetailsPaginationFetchMore
        }
        hasDetailsNextPage={hasDetailsNextPage}
        selectedSubscriptionInvoiceDetails={selectedSubscriptionInvoiceDetails}
      />
    </Card>
  );
};

export const ConsumerSubscriptionDetailsCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerSubscriptionDetailsCard>
>()(ConsumerSubscriptionDetailsCard);

export default React.memo(ConsumerSubscriptionDetailsCard);
