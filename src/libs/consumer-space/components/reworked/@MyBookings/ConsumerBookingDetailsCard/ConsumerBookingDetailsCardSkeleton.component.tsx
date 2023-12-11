import React from 'react';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Skeleton from '#csscomponents/Skeleton';
import Card from '#Fabrique/Card';

const ConsumerBookingDetailsCardSkeleton: React.FC = () => (
  <Card className="bs-consumer-booking-details-card">
    <Skeleton
      className="bs-consumer-booking-details-card__header-section--loading"
      variant="rectangle"
    />

    <Skeleton
      className="bs-consumer-booking-details-card__section__title--loading"
      variant="rectangle"
    />
    <Skeleton
      className="bs-consumer-booking-details-card__location-section__list--loading"
      variant="rectangle"
    />
    <Skeleton
      className="bs-consumer-booking-details-card__description-section--loading"
      variant="rectangle"
    />

    <Skeleton
      className="bs-consumer-booking-details-card__cancelled-section--loading"
      variant="rectangle"
    />

    <div className="bs-consumer-booking-details-card__teacher-section__avatar--loading">
      <Skeleton
        className="bs-consumer-booking-details-card__teacher-section__avatar__icon--loading"
        variant="circle"
      />
      <Skeleton
        className="bs-consumer-booking-details-card__teacher-section__avatar__label--loading"
        variant="rectangle"
      />
    </div>
  </Card>
);

export const ConsumerBookingDetailsCardSkeletonStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerBookingDetailsCardSkeleton>
>()(ConsumerBookingDetailsCardSkeleton);

export default React.memo(ConsumerBookingDetailsCardSkeleton);
