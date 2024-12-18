import React from 'react';
import ConsumerSubscriptionCard, {
  ConsumerSubscriptionCardStorybook,
} from './ConsumerSubscriptionCard.component';

import {
  CONSUMER_SUBSCRIPTION_CARD_PREVIEW,
  CONSUMER_SUBSCRIPTION_CARD_CONFIGURATION,
} from './custom_css_variant';

export type ConsumerSubscriptionCardProps = React.ComponentProps<
  typeof ConsumerSubscriptionCard
>;

export {
  ConsumerSubscriptionCardStorybook,
  CONSUMER_SUBSCRIPTION_CARD_PREVIEW,
  CONSUMER_SUBSCRIPTION_CARD_CONFIGURATION,
};
export default ConsumerSubscriptionCard;
