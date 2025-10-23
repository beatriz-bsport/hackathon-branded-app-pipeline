import { analyticsClientB2C } from '#src/components/analytics/mixpanel';
import { getCheckoutItemType } from '#src/events/purchase/utils';
import { trackPaymentViewedEvent } from './trackers';
import type { Basket } from '#src/libs/checkout/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Offer } from '#src/libs/offer/types';

export const trackPaymentViewedInBasket = ({
  basket,
  basketOffers,
  onTrackingSuccess,
}: {
  basket: Basket;
  basketOffers: Offer<number, Establishment, MetaActivity>[];
  onTrackingSuccess?: () => void;
}) => {
  basketOffers.forEach((offer) => {
    const correspondingCheckoutItem = basket.checkout_items.find((item) =>
      item.extra_data?.offers_data?.some(
        (offerData) => offerData.offer_id === offer.id,
      ),
    );

    if (!correspondingCheckoutItem) {
      console.warn(
        `No checkout item found for offer ${offer.id}, skipping payment viewed event tracking`,
      );
      return;
    }

    analyticsClientB2C.track(
      trackPaymentViewedEvent({
        activity_id: offer.activity,
        activity_name: offer.meta_activity?.name || '',
        offer_id: offer.id,
        session_type: offer.meta_activity?.is_workshop
          ? 'workshop'
          : 'group-activity',
        product_type: getCheckoutItemType(correspondingCheckoutItem) as
          | 'pass'
          | 'pack'
          | 'subscription',
      }),
    );
  });
  onTrackingSuccess?.();
};
