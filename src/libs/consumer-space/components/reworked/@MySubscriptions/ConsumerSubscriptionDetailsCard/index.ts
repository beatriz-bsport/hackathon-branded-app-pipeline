import React from 'react';
import ConsumerSubscriptionDetailsCard, {
  ConsumerSubscriptionDetailsCardStorybook,
} from './ConsumerSubscriptionDetailsCard.component';

import {
  CONSUMER_SUBSCRIPTION_DETAILS_CARD_PREVIEW,
  CONSUMER_SUBSCRIPTION_DETAILS_CARD_CONFIGURATION,
} from './custom_css_variant';

export type ConsumerSubscriptionDetailsCardProps = React.ComponentProps<
  typeof ConsumerSubscriptionDetailsCard
>;

export {
  ConsumerSubscriptionDetailsCardStorybook,
  CONSUMER_SUBSCRIPTION_DETAILS_CARD_PREVIEW,
  CONSUMER_SUBSCRIPTION_DETAILS_CARD_CONFIGURATION,
};
export default ConsumerSubscriptionDetailsCard;
