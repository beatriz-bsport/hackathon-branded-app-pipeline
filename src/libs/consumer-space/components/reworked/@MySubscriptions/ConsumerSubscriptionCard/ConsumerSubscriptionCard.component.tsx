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
  addPaymentMethodDisabled: boolean;
  hasFailedPayments: boolean;
  hasMissingPaymentMethod: boolean;
  isDetailsDisabled: boolean;
  isLoading: boolean;
  isPaused: boolean;
  isSelected: boolean;
  onAddPaymentMethodClick: () => void;
  onDetailsClick: () => void;
  price: string;
  recurrence: number;
  subscriptionDate: string;
  subscriptionInterval: SubscriptionInterval;
  subscriptionName: string;
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
  recurrence,
  subscriptionDate,
  subscriptionInterval,
  subscriptionName,
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
        recurrence={recurrence}
        subscriptionInterval={subscriptionInterval}
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
