import React from 'react';

import PrivateConsumerPassDetailsCard, {
  PrivateConsumerPassDetailsCardStorybook,
} from './PrivateConsumerPassDetailsCard.component';
import {
  PRIVATE_CONSUMER_PASS_DETAILS_CARD_PREVIEW,
  PRIVATE_CONSUMER_PASS_DETAILS_CARD_CONFIGURATION,
} from './custom_css_variants';

export {
  PrivateConsumerPassDetailsCardStorybook,
  PRIVATE_CONSUMER_PASS_DETAILS_CARD_PREVIEW,
  PRIVATE_CONSUMER_PASS_DETAILS_CARD_CONFIGURATION,
};
export type PrivateConsumerPassDetailsCardProps = React.ComponentProps<
  typeof PrivateConsumerPassDetailsCard
>;

export default PrivateConsumerPassDetailsCard;
