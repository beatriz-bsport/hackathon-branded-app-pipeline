import React from 'react';
import { StatusMessageWithIconSkeleton } from '#components/css-only/StatusMessageWithIcon';
import Skeleton, { SkeletonVariant } from '#components/css-only/Skeleton';
import { MarketplaceOfferBookingItemSkeleton } from '#marketplacecomponents/@Booking/MarketplaceOfferBookingItem';
import MinimalCardSkeleton from '#marketplacecomponents/MinimalCardSkeleton';

import './styles-skeleton.css';

const ConfirmationCheckoutSkeleton: React.FC = () => {
  return (
    <div className="bs-confirmation-checkout-skeleton-container">
      <div className="bs-confirmation-checkout-skeleton__section--message">
        <StatusMessageWithIconSkeleton />
      </div>
      <div className="bs-confirmation-checkout-skeleton__section">
        <Skeleton variant={SkeletonVariant.RECTANGLE} />
        <MarketplaceOfferBookingItemSkeleton />
      </div>
      <div className="bs-confirmation-checkout-skeleton__section">
        <Skeleton variant={SkeletonVariant.RECTANGLE} />
        <MarketplaceOfferBookingItemSkeleton />
      </div>
      <div className="bs-confirmation-checkout-skeleton__section">
        <Skeleton variant={SkeletonVariant.RECTANGLE} />
        <MinimalCardSkeleton />
      </div>
      <div className="bs-confirmation-checkout-skeleton__section">
        <Skeleton variant={SkeletonVariant.RECTANGLE} />
        <MinimalCardSkeleton />
      </div>
      <div className="bs-confirmation-checkout-skeleton__section">
        <Skeleton variant={SkeletonVariant.RECTANGLE} />
        <MinimalCardSkeleton />
      </div>
    </div>
  );
};

export default React.memo(ConfirmationCheckoutSkeleton);
