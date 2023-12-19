import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Skeleton from '#csscomponents/Skeleton';
import Card from '#Fabrique/Card';

const ConsumerBookingCardSkeleton: React.FC = () => (
  <Card
    className={classNames(
      'bs-consumer-booking-card__root',
      'bs-consumer-page-root__bookings__list__item',
    )}
  >
    <Skeleton
      className="bs-consumer__booking-card__title--loading"
      variant="rectangle"
    />
    <Skeleton
      className="bs-consumer__booking-card__subtitle--loading"
      variant="rectangle"
    />

    <Skeleton
      className="bs-consumer-booking-card__body__container--loading"
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

export const ConsumerBookingCardSkeletonStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerBookingCardSkeleton>
>()(ConsumerBookingCardSkeleton);

export default React.memo(ConsumerBookingCardSkeleton);
