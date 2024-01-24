import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerCardPlaceholder from '#libs/consumer-space/components/reworked/common/ConsumerCardPlaceholder';
import ConsumerDetailsCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton';

import {
  ConsumerSubscriptionDetailsCardDescription,
  ConsumerSubscriptionDetailsCardHeader,
  ConsumerSubscriptionDetailsCardTerms,
} from './sections';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';

import type { SubscriptionInterval } from '#libs/subscription/types';

import './styles.css';

type Props = {
  subscriptionName: string;
  subtitleDate: string;
  description: string;
  onSeeClick: () => void;
  termsDate: string;
  subscriptionNextPaymentDate: string;
  price: string;
  recurrence: number;
  subscriptionInterval: SubscriptionInterval;
  showPlaceholder: boolean;
  isLoading: boolean;
};

const ConsumerSubscriptionDetailsCard: React.FC<Props> = ({
  subscriptionName,
  description,
  onSeeClick,
  termsDate,
  subscriptionNextPaymentDate,
  subtitleDate,
  price,
  recurrence,
  subscriptionInterval,
  showPlaceholder,
  isLoading,
}) => {
  const { t } = useTranslation('consumerSpace');
  if (showPlaceholder) {
    return (
      <ConsumerCardPlaceholder
        message={t('consumerSpace:reworked.placeholderCard.mySubscriptions')}
      />
    );
  }

  if (isLoading) {
    return <ConsumerDetailsCardSkeleton />;
  }

  return (
    <Card className="bs-consumer__subscription-details-card__root">
      <ConsumerSubscriptionDetailsCardHeader
        price={price}
        recurrence={recurrence}
        subscriptionInterval={subscriptionInterval}
        subscriptionName={subscriptionName}
        subscriptionNextPaymentDate={subscriptionNextPaymentDate}
        subtitleDate={subtitleDate}
      />
      <ConsumerSubscriptionDetailsCardDescription description={description} />
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
