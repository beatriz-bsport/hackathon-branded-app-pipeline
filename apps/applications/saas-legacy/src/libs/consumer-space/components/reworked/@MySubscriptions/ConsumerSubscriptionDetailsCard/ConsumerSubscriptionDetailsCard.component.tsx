import React from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import ConsumerCardPlaceholder from '#src/libs/consumer-space/components/reworked/common/ConsumerCardPlaceholder';
import ConsumerDetailsCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton';

import Card from '#Fabrique/Card';

import type {
  SubscriptionInterval,
  SubscriptionPause,
  SubscriptionsFailedInvoicesREST,
  SubscriptionsInvoicesDetailsREST,
} from '#src/libs/subscription/types';
import type { MarketplacePaymentMethodsType } from '#src/libs/marketplace/types';
import {
  ConsumerSubscriptionDetailsCardBillingHistory,
  ConsumerSubscriptionDetailsCardCommitmentPeriod,
  ConsumerSubscriptionDetailsCardDescription,
  ConsumerSubscriptionDetailsCardFailedPayments,
  ConsumerSubscriptionDetailsCardHeader,
  ConsumerSubscriptionDetailsCardPaymentMethod,
  ConsumerSubscriptionDetailsCardTerms,
} from './sections';

import './styles.css';

type Props = {
  /** Indicates if new invoices are being fetched */
  areDetailsLoading: boolean;
  /** Auto renewal date */
  autoRenewalDate: string;
  /** Class given by parent element */
  className?: string;
  /** Description of subscription */
  description: string;
  /** Subscription expiration date */
  expirationDate: string | null;
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
  /** If subscription has been stopped */
  isSubscriptionStopped: boolean;
  /** Number of retry after failed payment based on InvoiceConfiguration */
  invoiceRetryNumber: number;
  /** Loading indicator */
  isLoading: boolean;
  /** Mobile version of details cards */
  isMobile: boolean;
  /** Subscription is currently paused */
  isPaused: boolean;
  /** Should payment method section be hidden */
  isPaymentMethodSectionHidden: boolean;
  /** Fees when joining the subscription */
  joiningFee: string;
  /** Indicates invoice date before renewal if it has not been renewed yet and if a coupon has been applied for all billings before first renewal */
  lastInvoiceDateBeforeRenewal: string | null;
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
  recurrenceBasis: number;
  /** Recurrent price to be displayed if it has not been renewed yet and a coupon has been applied for all billings before first renewal */
  recurrentPrice: string | null;
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
  /** Commitment period interval type: days, weeks, months or years */
  commitmentPeriod: string | null;
  /** Commitment period value, the number of intervals */
  commitmentValue: number | null;
  /** If the commitment period section should be hidden */
  isCommitmentPeriodSectionHidden: boolean;
  /** If the member can stop the subscription from their member side */
  isMemberCancellationAllowed: boolean;
  /** Action when clicking on Unsubscribe */
  onUnSubscribeClick: () => void;
  /** If commitment period alert should be displayed */
  shouldDisplayCommitmentPeriodAlert: boolean;
  /** If commitment period subtitle should be displayed */
  shouldDisplayCommitmentPeriodSubtitle: boolean;
  /** If unsubscribe caption text should be displayed */
  shouldDisplayUnsubscribeCaptionText: boolean;
  /** If the stop subscription feature should be displayed from the member side */
  displayStopSubscriptionFromMemberSide?: boolean;
};

const ConsumerSubscriptionDetailsCard: React.FC<Props> = ({
  areDetailsLoading,
  autoRenewalDate,
  displayStopSubscriptionFromMemberSide,
  className,
  description,
  expirationDate,
  failedInvoices,
  handleInvoiceDetailsPaginationFetchMore,
  hasAutoRenewal,
  hasDetailsNextPage,
  hasMissingPaymentMethod,
  invoiceRetryNumber,
  isLoading,
  isMobile,
  isPaused,
  isPaymentMethodSectionHidden,
  isSubscriptionStopped,
  joiningFee,
  lastInvoiceDateBeforeRenewal,
  onPaymentMethodActionClick,
  onSeeClick,
  pauseEndDate,
  paymentMethodType,
  price,
  readableIdentifier,
  recurrenceBasis,
  recurrentPrice,
  selectedSubscriptionInvoiceDetails,
  selectedSubscriptionsFuturePauses,
  showPlaceholder,
  subscriptionInterval,
  subscriptionName,
  subscriptionNextPaymentDate,
  subtitleDate,
  termsDate,
  commitmentPeriod,
  commitmentValue,
  isCommitmentPeriodSectionHidden,
  isMemberCancellationAllowed,
  onUnSubscribeClick,
  shouldDisplayCommitmentPeriodAlert,
  shouldDisplayCommitmentPeriodSubtitle,
  shouldDisplayUnsubscribeCaptionText,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (isLoading) {
    return <ConsumerDetailsCardSkeleton />;
  }

  if (showPlaceholder && !isLoading) {
    return (
      <ConsumerCardPlaceholder
        className={className}
        message={t('consumerSpace:reworked.placeholderCard.mySubscriptions')}
      />
    );
  }

  return (
    <Card
      className={clsx(
        className,
        'bs-consumer__subscription-details-card__root',
        {
          'bs-consumer__subscription-details-card__root--mobile': isMobile,
        },
      )}
    >
      <ConsumerSubscriptionDetailsCardHeader
        autoRenewalDate={autoRenewalDate}
        displayStopSubscriptionFromMemberSide={
          displayStopSubscriptionFromMemberSide
        }
        expirationDate={expirationDate}
        hasAutoRenewal={hasAutoRenewal}
        isPaused={isPaused}
        isSubscriptionStopped={isSubscriptionStopped}
        joiningFee={joiningFee}
        lastInvoiceDateBeforeRenewal={lastInvoiceDateBeforeRenewal}
        pauseEndDate={pauseEndDate}
        price={price}
        recurrenceBasis={recurrenceBasis}
        recurrentPrice={recurrentPrice}
        selectedSubscriptionsFuturePauses={selectedSubscriptionsFuturePauses}
        shouldDisplayUnsubscribeCaptionText={
          shouldDisplayUnsubscribeCaptionText
        }
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
      <ConsumerSubscriptionDetailsCardCommitmentPeriod
        commitmentPeriod={commitmentPeriod}
        commitmentValue={commitmentValue}
        isCommitmentPeriodSectionHidden={isCommitmentPeriodSectionHidden}
        isMemberCancellationAllowed={isMemberCancellationAllowed}
        onUnSubscribeClick={onUnSubscribeClick}
        shouldDisplayCommitmentPeriodAlert={shouldDisplayCommitmentPeriodAlert}
        shouldDisplayCommitmentPeriodSubtitle={
          shouldDisplayCommitmentPeriodSubtitle
        }
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
