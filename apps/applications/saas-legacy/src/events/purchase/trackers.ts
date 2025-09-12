import { generateEvent } from '@bsport/analytics';

import {
  addToCartEventSchema,
  cartViewedEventSchema,
  purchaseConfirmationEventSchema,
  purchaseItemEventSchema,
} from './schemas';

export const trackCartViewed = generateEvent(cartViewedEventSchema);

export const trackAddToCart = generateEvent(addToCartEventSchema);

export const trackPurchaseConfirmation = generateEvent(
  purchaseConfirmationEventSchema,
);

export const trackPurchaseItem = generateEvent(purchaseItemEventSchema);
