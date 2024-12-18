import React from 'react';

import ConsumerPassCard, {
  ConsumerPassCardStorybook,
} from './ConsumerPassCard.component';
import {
  CONSUMER_PASS_CARD_PREVIEW,
  CONSUMER_PASS_CARD_CONFIGURATION,
} from './custom_css_variants';

export {
  ConsumerPassCardStorybook,
  CONSUMER_PASS_CARD_PREVIEW,
  CONSUMER_PASS_CARD_CONFIGURATION,
};
export type ConsumerPassCardProps = React.ComponentProps<
  typeof ConsumerPassCard
>;

export default ConsumerPassCard;
