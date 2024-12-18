import React from 'react';

import ConsumerPaymentPackDetailsCard, {
  ConsumerPaymentPackDetailsCardStorybook,
} from './ConsumerPaymentPackDetailsCard.component';
import {
  CONSUMER_PAYMENT_PACK_DETAILS_CARD_PREVIEW,
  CONSUMER_PAYMENT_PACK_DETAILS_CARD_CONFIGURATION,
} from './custom_css_variants';

export {
  ConsumerPaymentPackDetailsCardStorybook,
  CONSUMER_PAYMENT_PACK_DETAILS_CARD_PREVIEW,
  CONSUMER_PAYMENT_PACK_DETAILS_CARD_CONFIGURATION,
};
export type ConsumerPaymentPackDetailsCardProps = React.ComponentProps<
  typeof ConsumerPaymentPackDetailsCard
>;

export default ConsumerPaymentPackDetailsCard;
