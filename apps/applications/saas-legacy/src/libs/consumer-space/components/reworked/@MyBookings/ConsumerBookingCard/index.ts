import React from 'react';

import ConsumerBookingCard, {
  ConsumerBookingCardStorybook,
} from './ConsumerBookingCard.component';
import {
  CONSUMER_BOOKING_CARD_PREVIEW,
  CONSUMER_BOOKING_CARD_CONFIGURATION,
} from './custom_css_variants';

export {
  ConsumerBookingCardStorybook,
  CONSUMER_BOOKING_CARD_PREVIEW,
  CONSUMER_BOOKING_CARD_CONFIGURATION,
};
export type ConsumerBookingCardProps = React.ComponentProps<
  typeof ConsumerBookingCard
>;

export default ConsumerBookingCard;
