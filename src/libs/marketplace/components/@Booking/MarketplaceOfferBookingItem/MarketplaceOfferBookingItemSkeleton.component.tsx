import React from 'react';
import Skeleton, { SkeletonVariant } from '#components/css-only/Skeleton';

import './styles-skeleton.css';

const MarketplaceOfferBookingItemSkeleton: React.FC = () => (
  <Skeleton
    className="bs-offer-booking-item__skeleton__icon"
    variant={SkeletonVariant.RECTANGLE}
  />
);
export default MarketplaceOfferBookingItemSkeleton;
