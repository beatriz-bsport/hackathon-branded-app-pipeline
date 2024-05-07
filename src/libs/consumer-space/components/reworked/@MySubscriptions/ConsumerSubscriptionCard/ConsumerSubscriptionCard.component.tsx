import React from 'react';

import {
  ConsumerSubscriptionCardBody,
  ConsumerSubscriptionCardHeader,
  ConsumerSubscriptionCardFooter,
} from './sections';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';
import ConsumerCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';
import type { SubscriptionInterval } from '#libs/subscription/types';

import './styles.css';

type Props = {
  /** Indicates if add payment method button is disabled */
  addPaymentMethodDisabled: boolean;
  /** Indicates if a subscription has failed payments */
  hasFailedPayments: boolean;
  /** Indicates if a subscription has missing payment method */
  hasMissingPaymentMethod: boolean;
  /** Indicates if see details button is disabled */
  isDetailsDisabled: boolean;
  /** Indicates if subscriptions are being fetched */
  isLoading: boolean;
  /** Indicates if subscriptions is paused */
  isPaused: boolean;
  /** Indicates if subscriptions is selected */
  isSelected: boolean;
  /** Action when clicking on add payment */
  onAddPaymentMethodClick: () => void;
  /** Action when clicking on see details */
  onDetailsClick: () => void;
  /** Price to display and can depend on coupons applied */
  price: string;
  /** Number of payment per subscription interval */
  recurrenceBasis: number;
  /** Date of the subscription displayed as the main subtitle */
  subscriptionDate: string;
  /** Interval of the subscription */
  subscriptionInterval: SubscriptionInterval;
  /** Name of the subscription */
  subscriptionName: string;
  /** Next payment date of the subscription */
  subscriptionNextPaymentDate: string;
};

const ConsumerSubscriptionCard: React.FC<Props> = ({
  addPaymentMethodDisabled,
  hasFailedPayments,
  hasMissingPaymentMethod,
  isDetailsDisabled,
  isLoading,
  isPaused,
  isSelected,
  onAddPaymentMethodClick,
  onDetailsClick,
  price,
  recurrenceBasis,
  subscriptionDate,
  subscriptionInterval,
  subscriptionName,
  subscriptionNextPaymentDate,
}) => {
  if (isLoading) {
    return <ConsumerCardSkeleton />;
  }
  return (
    <Card
      className="bs-consumer__subscription-card__root"
      variant={isSelected ? 'elevated' : 'rest'}
    >
      <ConsumerSubscriptionCardHeader
        hasFailedPayments={hasFailedPayments}
        hasMissingPaymentMethod={hasMissingPaymentMethod}
        isPaused={isPaused}
        subscriptionDate={subscriptionDate}
        subscriptionName={subscriptionName}
      />
      <ConsumerSubscriptionCardBody
        isDetailsDisabled={isDetailsDisabled}
        onDetailsClick={onDetailsClick}
        price={price}
        recurrenceBasis={recurrenceBasis}
        subscriptionInterval={subscriptionInterval}
        subscriptionNextPaymentDate={
          !hasFailedPayments && subscriptionNextPaymentDate
        }
      />
      <ConsumerSubscriptionCardFooter
        addPaymentMethodDisabled={addPaymentMethodDisabled}
        hasMissingPaymentMethod={hasMissingPaymentMethod}
        onAddPaymentMethodClick={onAddPaymentMethodClick}
      />
    </Card>
  );
};

export const ConsumerSubscriptionCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerSubscriptionCard>
>()(ConsumerSubscriptionCard);

export default React.memo(ConsumerSubscriptionCard);
