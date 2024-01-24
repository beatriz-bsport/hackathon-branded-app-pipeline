import React from 'react';

import {
  ConsumerSubscriptionCardBody,
  ConsumerSubscriptionCardHeader,
} from './sections';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';
import ConsumerCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';
import type { SubscriptionInterval } from '#libs/subscription/types';

import './styles.css';

type Props = {
  isSelected: boolean;
  subscriptionDate: string;
  subscriptionName: string;
  price: string;
  recurrence: number;
  isDetailsDisabled: boolean;
  onDetailsClick: () => void;
  subscriptionInterval: SubscriptionInterval;
  isLoading: boolean;
};

const ConsumerSubscriptionCard: React.FC<Props> = ({
  isSelected,
  subscriptionDate,
  subscriptionName,
  price,
  recurrence,
  isDetailsDisabled,
  onDetailsClick,
  isLoading,
  subscriptionInterval,
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
    </Card>
  );
};

export const ConsumerSubscriptionCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerSubscriptionCard>
>()(ConsumerSubscriptionCard);

export default React.memo(ConsumerSubscriptionCard);
