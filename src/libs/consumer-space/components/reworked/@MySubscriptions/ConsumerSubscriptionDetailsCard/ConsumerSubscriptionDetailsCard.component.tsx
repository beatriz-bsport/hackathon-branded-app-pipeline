import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerCardPlaceholder from '#libs/consumer-space/components/reworked/common/ConsumerCardPlaceholder';
import ConsumerDetailsCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton';

import {
  ConsumerSubscriptionDetailsCardDescription,
  ConsumerSubscriptionDetailsCardPaymentMethod,
  ConsumerSubscriptionDetailsCardHeader,
  ConsumerSubscriptionDetailsCardTerms,
  ConsumerSubscriptionDetailsCardFailedPayments,
} from './sections';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';

import type {
  SubscriptionInterval,
  SubscriptionsInvoicesDetailsREST,
} from '#libs/subscription/types';
import type { MarketplacePaymentMethodsType } from '#libs/marketplace/types';

import './styles.css';

type Props = {
  autoRenewalDate: string;
  description: string;
  failedInvoices: SubscriptionsInvoicesDetailsREST[];
  hasAutoRenewal: boolean;
  hasMissingPaymentMethod: boolean;
  isLoading: boolean;
  isPaused: boolean;
  isPaymentMethodSectionHidden: boolean;
  onPaymentMethodActionClick: () => void;
  onSeeClick: () => void;
  pauseEndDate: string;
  paymentMethodType: MarketplacePaymentMethodsType;
  price: string;
  readableIdentifier: string;
  recurrence: number;
  showPlaceholder: boolean;
  subscriptionInterval: SubscriptionInterval;
  subscriptionName: string;
  subscriptionNextPaymentDate: string;
  subtitleDate: string;
  termsDate: string;
};

const ConsumerSubscriptionDetailsCard: React.FC<Props> = ({
  autoRenewalDate,
  description,
  failedInvoices,
  hasAutoRenewal,
  hasMissingPaymentMethod,
  isLoading,
  isPaused,
  isPaymentMethodSectionHidden,
  onPaymentMethodActionClick,
  onSeeClick,
  pauseEndDate,
  paymentMethodType,
  price,
  readableIdentifier,
  recurrence,
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
        pauseEndDate={pauseEndDate}
        price={price}
        recurrence={recurrence}
        subscriptionInterval={subscriptionInterval}
        subscriptionName={subscriptionName}
        subscriptionNextPaymentDate={subscriptionNextPaymentDate}
        subtitleDate={subtitleDate}
      />
      <ConsumerSubscriptionDetailsCardFailedPayments
        failedInvoices={failedInvoices}
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
    </Card>
  );
};

export const ConsumerSubscriptionDetailsCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerSubscriptionDetailsCard>
>()(ConsumerSubscriptionDetailsCard);

export default React.memo(ConsumerSubscriptionDetailsCard);
