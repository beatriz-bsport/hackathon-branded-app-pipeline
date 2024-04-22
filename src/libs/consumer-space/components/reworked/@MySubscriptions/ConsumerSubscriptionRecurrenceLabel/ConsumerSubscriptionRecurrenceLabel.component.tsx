import React from 'react';
import Typography from '#components/css-only/Fabrique/Typography';
import useConsumerSubscriptionRecurrenceLabel from '../hooks/useConsumerSubscriptionRecurrenceLabel';
import type { SubscriptionInterval } from '#libs/subscription/types';
import './styles.css';

type Props = {
  recurrence: number;
  price: string;
  subscriptionInterval: SubscriptionInterval;
};

const ConsumerSubscriptionRecurrenceLabel: React.FC<Props> = ({
  recurrence,
  price,
  subscriptionInterval,
}) => {
  const subscriptionRecurrenceLabel = useConsumerSubscriptionRecurrenceLabel(
    recurrence,
    price,
    subscriptionInterval,
  );
  return (
    <div className="bs-consumer__subscription-card__recurrence-label">
      <Typography
        className="bs-consumer__subscription-card__recurrence-label__price"
        variant="title-sm"
      >
        {subscriptionRecurrenceLabel.price}
      </Typography>
      <Typography
        className="bs-consumer__subscription-card__recurrence-label__recurrence"
        variant="body-md"
      >
        {subscriptionRecurrenceLabel.interval}
      </Typography>
    </div>
  );
};

export default React.memo(ConsumerSubscriptionRecurrenceLabel);
